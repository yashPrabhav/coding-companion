const LearningEvent = require("../models/LearningEvent");
const LearningEventEmbedding = require("../models/LearningEventEmbedding");
const {
    generateObservationEmbedding,
    generateQueryEmbedding,
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

const retrieveRelevantLearningEvents = async (
    learnerId,
    currentMessage,
    limit = 5
) => {
    if (!learnerId || !currentMessage) {
        throw new Error("learnerId and currentMessage are required.");
    }

    // 1. Turn the current message into a query vector.
    const queryVector = await generateQueryEmbedding(currentMessage);

    // 2. Search for similar stored event embeddings.
    const matchingEmbeddings = await LearningEventEmbedding.aggregate([
        {
            $vectorSearch: {
                index: "learning_event_vector_index",
                path: "embedding",
                queryVector,
                numCandidates: 100,
                limit,
                filter: {
                    learnerId: { $eq: learnerId },
                },
            },
        },
        {
            $project: {
                _id: 0,
                eventId: 1,
            },
        },
    ]);

    // 3. Stop if no relevant events were found.
    if (matchingEmbeddings.length === 0) {
        return [];
    }

    // 4. Fetch the original events for this learner.
    const eventIds = matchingEmbeddings.map(
        (item) => item.eventId
    );

    const events = await LearningEvent.find({
        "metadata.eventId": { $in: eventIds },
        "metadata.learnerId": learnerId,
    }).lean();

    // 5. Preserve the similarity ranking from Vector Search.
    const eventsById = new Map(
        events.map((event) => [
            event.metadata.eventId,
            event,
        ])
    );

    return eventIds
        .map((eventId) => eventsById.get(eventId))
        .filter(Boolean);
};

module.exports = {
    createLearningEvent,
    getLearningEventById,
    getLearningEventsByTags,
    getLearningEventsByLearner,
    getLearningContext,
    retrieveRelevantLearningEvents,
};
