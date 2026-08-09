const express = require("express");

const {
    createLearningEvent,
    getLearningEventById,
    getLearningEventsByTags,
    getLearningEventsByLearner,
    getLearningContext,
} = require("../controllers/learningEventController");

const router = express.Router();

// Create and store an immutable Learning Event
router.post("/", createLearningEvent);

// Main LLM retrieval endpoint
router.get("/context/:learnerId", getLearningContext);

// Occasional direct retrieval endpoints
router.get("/learner/:learnerId", getLearningEventsByLearner);

router.get("/tags", getLearningEventsByTags);

router.get("/:eventId", getLearningEventById);

module.exports = router;