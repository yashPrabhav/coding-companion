const LearningEvent = require("../models/LearningEvent");

const createLearningEvent = async (data) => {
    const learningEvent = new LearningEvent(data);

    return await learningEvent.save();
};

const getLearningEventById = async (eventId) => {
    return await LearningEvent.findOne({
        "metadata.eventId": eventId,
    });
};

const getLearningEventsByTags = async (tags) => {
    return await LearningEvent.find({
        retrievalTags: { $all: tags },
    }).sort({
        "metadata.createdAt": -1,
    });
};

const getLearningEventsByLearner = async (learnerId) => {
    return await LearningEvent.find({
        "metadata.learnerId": learnerId,
    }).sort({
        "metadata.createdAt": -1,
    });
};

const getLearningContext = async (learnerId, tags = []) => {
    const learnerEvents = await LearningEvent.find({
        "metadata.learnerId": learnerId,
    })
        .sort({
            "metadata.createdAt": -1,
        })
        .lean();

    if (!tags || tags.length === 0) {
        return learnerEvents.map(({ retrievalTags, ...event }) => event);
    }

    const normalizedTags = tags
        .map((tag) => tag.trim())
        .filter(Boolean);

    const relevantEvents = learnerEvents.filter((event) =>
        normalizedTags.every((tag) => event.retrievalTags.includes(tag))
    );

    return relevantEvents.map(({ retrievalTags, ...event }) => event);
};

module.exports = {
    createLearningEvent,
    getLearningEventById,
    getLearningEventsByTags,
    getLearningEventsByLearner,
    getLearningContext,
};