const LearningEvent = require("../models/LearningEvent");
const LearningEventEmbedding = require("../models/LearningEventEmbedding");
const {
    generateObservationEmbedding,
} = require("./embeddingService");

const createLearningEvent = async (data) => {
    if (!data?.event?.data?.observation) {
        throw new Error(
            "Learning event observation is required for embedding."
        );
    }

    const learningEvent = new LearningEvent(data);
    const savedEvent = await learningEvent.save();

    try {
        const embeddingResult =
            await generateObservationEmbedding(
                savedEvent.event.data.observation
            );

        await LearningEventEmbedding.create({
            eventId: savedEvent.metadata.eventId,
            learnerId: savedEvent.metadata.learnerId,
            model: embeddingResult.model,
            dimensions: embeddingResult.dimensions,
            embedding: embeddingResult.embedding,
            createdAt: savedEvent.metadata.createdAt,
        });
    } catch (error) {
        await LearningEvent.deleteOne({
            "metadata.eventId": savedEvent.metadata.eventId,
        });

        throw new Error(
            `Learning event embedding failed: ${error.message}`
        );
    }

    return savedEvent;
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
