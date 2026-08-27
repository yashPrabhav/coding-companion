const crypto = require("crypto");

const {
    createLearningEvent
} = require("./learningEventService");

const {
    updateLearner
} = require("./updateService");

const SPECIFICATION_VERSION = "1.0";

const persistTeachingBrainOutput = async ({
    learnerId,
    conversationId,
    teachingBrainOutput
}) => {

    if (!learnerId) {
        throw new Error("learnerId is required.");
    }

    if (!conversationId) {
        throw new Error("conversationId is required.");
    }

    if (!teachingBrainOutput) {
        throw new Error(
            "Teaching Brain output is required."
        );
    }

    const {
        teachingResponse,
        learningEvents = [],
        updates = {}
    } = teachingBrainOutput;

    const {
        learnerStateUpdates = [],
        profileUpdates = []
    } = updates;


    // ==================================================
    // 1. LEARNING EVENTS
    // ==================================================

    const persistedLearningEvents = [];

    for (const generatedEvent of learningEvents) {

        const now = new Date();

        const learningEvent = {

            retrievalTags:
                generatedEvent.retrievalTags || [],

            event: {
                type: generatedEvent.type,

                // Backend owns the timestamp.
                timestamp: now,

                data: generatedEvent.data
            },

            metadata: {
                // Backend owns the event ID.
                eventId: crypto.randomUUID(),

                learnerId,

                conversationId,

                generatedBy: "Teaching Brain",

                createdAt: now,

                specificationVersion:
                    SPECIFICATION_VERSION
            }
        };

        const savedEvent =
            await createLearningEvent(
                learningEvent
            );

        persistedLearningEvents.push(
            savedEvent
        );
    }


    // ==================================================
    // 2. LEARNER STATE UPDATES
    // ==================================================

    const learnerStateResults = [];

    for (const update of learnerStateUpdates) {

        const result =
            await updateLearner(
                learnerId,
                update
            );

        learnerStateResults.push({
            update,
            result
        });
    }


    // ==================================================
    // 3. PROFILE UPDATES
    // ==================================================

    const profileResults = [];

    for (const update of profileUpdates) {

        const result =
            await updateLearner(
                learnerId,
                update
            );

        profileResults.push({
            update,
            result
        });
    }


    // ==================================================
    // 4. RETURN
    // ==================================================

    return {

        teachingResponse,

        persistence: {

            learningEvents: {
                generated:
                    learningEvents.length,

                persisted:
                    persistedLearningEvents.length
            },

            learnerStateUpdates: {
                generated:
                    learnerStateUpdates.length,

                processed:
                    learnerStateResults.length,

                results:
                    learnerStateResults
            },

            profileUpdates: {
                generated:
                    profileUpdates.length,

                processed:
                    profileResults.length,

                results:
                    profileResults
            }
        }
    };
};


module.exports = {
    persistTeachingBrainOutput
};