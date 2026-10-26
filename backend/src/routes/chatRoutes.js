const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const { buildContext } = require("../services/contextBuilderService");
const { generateTeachingResponse } = require("../services/teachingBrainService");
const { persistTeachingBrainOutput } = require("../services/teachingBrainPersistenceService");
const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { message, conversation = [], conversationId } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A non-empty message is required."
      });
    }

    if (!Array.isArray(conversation)) {
      return res.status(400).json({
        success: false,
        message: "Conversation must be an array."
      });
    }

    if (
      typeof conversationId !== "string" ||
      !conversationId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid conversationId is required."
      });
    }

    const learnerId = req.user.learnerId;
    const cleanMessage = message.trim();

    const context = await buildContext({
      learnerId,
      conversation,
      currentMessage: cleanMessage
    });

    const result = await generateTeachingResponse(context);

    // An explicit request to set the current topic should be handled
    // even if the Teaching Brain forgets to recommend the update.
    const topicRequest = cleanMessage.match(
      /^set\s+(.+?)\s+as\s+my\s+current\s+topic[.! ]*$/i
    );

    const learnerUpdates = [
      ...(result.updates?.learnerStateUpdates || [])
    ];
    const profileUpdates = [
      ...(result.updates?.profileUpdates || [])
    ];

    if (topicRequest) {
      const requestedTopic = topicRequest[1].trim();

      const alreadyRecommended = learnerUpdates.some(
        (update) =>
          update.action === "change_current_topic" &&
          update.target.toLowerCase() === requestedTopic.toLowerCase()
      );

      if (!alreadyRecommended) {
        learnerUpdates.push({
          action: "change_current_topic",
          target: requestedTopic,
          updates: {},
          reason: "The learner explicitly requested this current-topic change."
        });
      }
    }

    result.updates = {
      ...result.updates,
      learnerStateUpdates: learnerUpdates,
      profileUpdates
    };

    const persistenceResult = await persistTeachingBrainOutput({
      learnerId,
      conversationId,
      teachingBrainOutput: result
    });


    // Never claim the requested topic changed unless the service
    // confirms that the database update was applied.
    let reply = result.teachingResponse;

    if (topicRequest) {
      const requestedTopic = topicRequest[1].trim();

      const topicUpdate = [
        ...(persistenceResult.persistence.learnerStateUpdates.results || []),
        ...(persistenceResult.persistence.profileUpdates.results || [])
      ].find(
        ({ update, result }) =>
          update.action === "change_current_topic" &&
          update.target.toLowerCase() === requestedTopic.toLowerCase() &&
          result?.applied
      );

      if (topicUpdate) {
        reply = `Your current topic has been updated to ${topicUpdate.update.target}.`;
      } else {
        reply = `I couldn't save your current topic as ${requestedTopic}. The database update was not confirmed, so I won't claim it changed. Please try again shortly.`;
      }
    }


    return res.status(200).json({
      success: true,
      reply,
      persistence: persistenceResult.persistence
    });
  } catch (error) {
    const providerStatus = Number(error.status || error.statusCode || 0);
    const errorText = String(error.message || "").toLowerCase();
    let status = 500;
    let code = "INTERNAL_ERROR";
    let message = "Something went wrong while preparing your response. Please try again.";
    let retryable = true;
    let retryAfterSeconds;

    if (
      providerStatus === 429 ||
      /rate.?limit|quota exceeded|resource exhausted|too many requests/.test(errorText)
    ) {
      status = 429;
      code = "RATE_LIMITED";
      message = "The chat service has reached its current limit. Please wait a little before trying again.";
      const retryDelay = Number(error.retryAfter || error.retry_after || 0);
      if (Number.isFinite(retryDelay) && retryDelay > 0) {
        retryAfterSeconds = Math.ceil(retryDelay);
      }
    } else if (
      providerStatus === 408 ||
      providerStatus === 504 ||
      error.name === "AbortError" ||
      /timed out|timeout|deadline exceeded/.test(errorText)
    ) {
      status = 504;
      code = "REQUEST_TIMEOUT";
      message = "The response took too long. Please try again.";
    } else if (
      providerStatus === 503 ||
      providerStatus === 502 ||
      providerStatus === 500 ||
      /service unavailable|temporarily unavailable|overloaded|internal server error/.test(errorText)
    ) {
      status = 503;
      code = "AI_UNAVAILABLE";
      message = "The AI service is temporarily unavailable. Please try again shortly.";
    } else if (
      error.name === "SyntaxError" ||
      /invalid json/.test(errorText)
    ) {
      status = 400;
      code = "BAD_REQUEST";
      message = "The request could not be processed. Please check your message and try again.";
      retryable = false;
    }

    // Keep provider internals in server logs; never send stack traces or keys to the browser.
    console.error("Chat request failed:", {
      code,
      status,
      name: error.name,
      message: error.message
    });

    if (retryAfterSeconds) {
      res.set("Retry-After", String(retryAfterSeconds));
    }

    return res.status(status).json({
      success: false,
      code,
      message,
      retryable,
      ...(retryAfterSeconds ? { retryAfterSeconds } : {})
    });
  }
});

module.exports = router;
