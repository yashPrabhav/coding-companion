const learnerService = require("../services/learnerService");

const createLearnerState = async (req, res) => {
    try {
        const { learnerId } = req.body;

        if (!learnerId) {
            return res.status(400).json({
                message: "learnerId is required",
            });
        }

        const existingState = await learnerService.getLearnerState(learnerId);

        if (existingState) {
            return res.status(409).json({
                message: "Learner state already exists",
            });
        }

        const learnerState = await learnerService.createLearnerState(learnerId);

        return res.status(201).json(learnerState);
    } catch (error) {
        console.error("Error creating learner state:", error);

        return res.status(500).json({
            message: "Failed to create learner state",
        });
    }
};

const getLearnerState = async (req, res) => {
    try {
        const { learnerId } = req.params;

        const learnerState = await learnerService.getLearnerState(learnerId);

        if (!learnerState) {
            return res.status(404).json({
                message: "Learner state not found",
            });
        }

        return res.status(200).json(learnerState);
    } catch (error) {
        console.error("Error fetching learner state:", error);

        return res.status(500).json({
            message: "Failed to fetch learner state",
        });
    }
};

module.exports = {
    createLearnerState,
    getLearnerState,
};