const LearnerState = require("../models/LearnerState");

const createLearnerState = async (learnerId) => {
    const learnerState = new LearnerState({
        learnerId,
    });

    return await learnerState.save();
};

const getLearnerState = async (learnerId) => {
    return await LearnerState.findOne({ learnerId });
};

module.exports = {
    createLearnerState,
    getLearnerState,
};