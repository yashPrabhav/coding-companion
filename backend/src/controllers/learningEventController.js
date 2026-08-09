const learningEventService = require("../services/learningEventService");

const createLearningEvent = async (req, res) => {
    try {
        const learningEvent = await learningEventService.createLearningEvent(
            req.body
        );

        return res.status(201).json(learningEvent);
    } catch (error) {
        console.error("Error creating learning event:", error);

        return res.status(500).json({
            message: "Failed to create learning event",
        });
    }
};

const getLearningEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

        const learningEvent =
            await learningEventService.getLearningEventById(eventId);

        if (!learningEvent) {
            return res.status(404).json({
                message: "Learning event not found",
            });
        }

        return res.status(200).json(learningEvent);
    } catch (error) {
        console.error("Error fetching learning event:", error);

        return res.status(500).json({
            message: "Failed to fetch learning event",
        });
    }
};

const getLearningEventsByTags = async (req, res) => {
    try {
        const { tags } = req.query;

        if (!tags) {
            return res.status(400).json({
                message: "tags are required",
            });
        }

        const tagList = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        if (tagList.length === 0) {
            return res.status(400).json({
                message: "At least one valid tag is required",
            });
        }

        const learningEvents =
            await learningEventService.getLearningEventsByTags(tagList);

        return res.status(200).json(learningEvents);
    } catch (error) {
        console.error("Error fetching learning events by tags:", error);

        return res.status(500).json({
            message: "Failed to fetch learning events",
        });
    }
};

const getLearningEventsByLearner = async (req, res) => {
    try {
        const { learnerId } = req.params;

        const learningEvents =
            await learningEventService.getLearningEventsByLearner(learnerId);

        return res.status(200).json(learningEvents);
    } catch (error) {
        console.error("Error fetching learner events:", error);

        return res.status(500).json({
            message: "Failed to fetch learner events",
        });
    }
};

const getLearningContext = async (req, res) => {
    try {
        const { learnerId } = req.params;
        const { tags } = req.query;

        const tagList = tags
            ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
            : [];

        const learningContext =
            await learningEventService.getLearningContext(
                learnerId,
                tagList
            );

        return res.status(200).json({
            learnerId,
            eventCount: learningContext.length,
            events: learningContext,
        });
    } catch (error) {
        console.error("Error retrieving learning context:", error);

        return res.status(500).json({
            message: "Failed to retrieve learning context",
        });
    }
};



module.exports = {
    createLearningEvent,
    getLearningEventById,
    getLearningEventsByTags,
    getLearningEventsByLearner,
    getLearningContext,
};