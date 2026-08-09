const updateService = require("../services/updateService");

const applyUpdate = async (req, res) => {
    try {
        const { learnerId } = req.params;
        const update = req.body;

        if (!learnerId) {
            return res.status(400).json({
                message: "learnerId is required."
            });
        }

        const result = await updateService.updateLearner(
            learnerId,
            update
        );

        if (!result.applied) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error applying update:", error);

        return res.status(500).json({
            message: "Failed to apply update."
        });
    }
};

module.exports = {
    applyUpdate
};