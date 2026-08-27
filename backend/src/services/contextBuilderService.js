const teachingBrainPrompt = require("../prompt/teachingBrainV2");

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

    const tagsQuery =
        learningEventTags.length > 0
            ? `?tags=${encodeURIComponent(
                learningEventTags.join(",")
            )}`
            : "";

    const [
        userProfileResponse,
        learnerStateResponse,
        learningEventsResponse,
    ] = await Promise.all([
        getJson(
            `${BASE_URL}/users/${encodedLearnerId}`
        ),

        getJson(
            `${BASE_URL}/learner-state/${encodedLearnerId}`
        ),

        getJson(
            `${BASE_URL}/learning-events/context/${encodedLearnerId}${tagsQuery}`
        ),
    ]);

    return {
        systemPrompt: teachingBrainPrompt.trim(),

        userProfile: userProfileResponse.data,

        learnerState: learnerStateResponse,

        learningEvents: learningEventsResponse.events || [],

        conversation,

        currentMessage,
    };
}

module.exports = {
    buildContext,
};