const teachingBrainPrompt = require("../prompt/teachingBrainV2");
const {
    retrieveRelevantLearningEvents,
} = require("./learningEventService");

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

async function getJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Request failed (${response.status}): ${errorText}`
        );
    }

    return await response.json();
}

async function buildContext({
    learnerId,
    conversation = [],
    currentMessage,
    learningEventTags = [],
}) {
    if (!learnerId) {
        throw new Error("learnerId is required.");
    }

    if (!currentMessage) {
        throw new Error("currentMessage is required.");
    }

    const encodedLearnerId = encodeURIComponent(learnerId);

    const [
        userProfileResponse,
        learnerStateResponse,
        learningEvents,
    ] = await Promise.all([
        getJson(
            `${BASE_URL}/users/${encodedLearnerId}`
        ),

        getJson(
            `${BASE_URL}/learner-state/${encodedLearnerId}`
        ),

        retrieveRelevantLearningEvents(
            learnerId,
            currentMessage
        ),
    ]);

    return {
        systemPrompt: teachingBrainPrompt.trim(),

        userProfile: userProfileResponse.data,

        learnerState: learnerStateResponse,

        learningEvents,

        conversation,

        currentMessage,
    };
}

module.exports = {
    buildContext,
};