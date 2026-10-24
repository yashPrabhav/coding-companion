const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { buildContext } = require("../services/contextBuilderService");
const { generateTeachingResponse } = require("../services/teachingBrainService");

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { message, conversation = [] } = req.body || {};

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

    const context = await buildContext({
      learnerId: req.user.learnerId,
      conversation,
      currentMessage: message.trim()
    });

    const result = await generateTeachingResponse(context);

    return res.status(200).json({
      success: true,
      reply: result.teachingResponse
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
