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
    console.error("Chat request failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate a teaching response. Check the backend logs."
    });
  }
});

module.exports = router;
