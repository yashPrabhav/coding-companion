const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL =
    process.env.TEACHING_BRAIN_MODEL || "gemini-3.7-flash";

/*
 * This is the machine-readable contract between
 * the Teaching Brain and the backend.
 *
 * The LLM does NOT get to invent the top-level structure.
 */
const teachingBrainSchema = {
    type: "object",
    properties: {
        teachingResponse: {
            type: "string",
            description:
                "The natural-language teaching response shown directly to the learner.",
        },

        learningEvents: {
            type: "array",
            description:
                "Zero or more meaningful learning observations. Do not create trivial events.",
            items: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        description:
                            "The type of meaningful learning observation."
                    },

                    data: {
                        type: "object",
                        description:
                            "Meaningful evidence directly supported by the conversation.",

                        properties: {
                            observation: {
                                type: "string",
                                description:
                                    "Specific evidence directly observed from the learner interaction."
                            }
                        },

                        required: ["observation"],
                        additionalProperties: false
                    },

                    retrievalTags: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },

                required: [
                    "type",
                    "data",
                    "retrievalTags"
                ],

                additionalProperties: false,
            },
        },

        updates: {
            type: "object",
            properties: {
                learnerStateUpdates: {
                    type: "array",
                    description:
                        "Evidence-based recommendations for Current Learner State.",
                    items: {
                        type: "object",
                        properties: {
                            action: {
                                type: "string",
                            },

                            target: {
                                type: "string",
                            },

                            updates: {
                                type: "object",
                                additionalProperties: true,
                            },

                            reason: {
                                type: "string",
                            },
                        },
                        required: [
                            "action",
                            "target",
                            "updates",
                            "reason",
                        ],
                        additionalProperties: false,
                    },
                },

                profileUpdates: {
                    type: "array",
                    description:
                        "Rare, evidence-based recommendations for the User Profile.",
                    items: {
                        type: "object",
                        properties: {
                            action: {
                                type: "string",
                            },

                            target: {
                                type: "string",
                            },

                            updates: {
                                type: "object",
                                additionalProperties: true,
                            },

                            reason: {
                                type: "string",
                            },
                        },
                        required: [
                            "action",
                            "target",
                            "updates",
                            "reason",
                        ],
                        additionalProperties: false,
                    },
                },
            },
            required: [
                "learnerStateUpdates",
                "profileUpdates",
            ],
            additionalProperties: false,
        },
    },

    required: [
        "teachingResponse",
        "learningEvents",
        "updates",
    ],

    additionalProperties: false,
};

function buildLLMInput(context) {
    return `
USER PROFILE
============
${JSON.stringify(context.userProfile, null, 2)}

CURRENT LEARNER STATE
=====================
${JSON.stringify(context.learnerState, null, 2)}

RELEVANT LEARNING EVENTS
========================
${JSON.stringify(context.learningEvents, null, 2)}

CONVERSATION
============
${JSON.stringify(context.conversation, null, 2)}

CURRENT LEARNER MESSAGE
=======================
${context.currentMessage}

KNOWLEDGE GRAPH CONTEXT
=======================
${JSON.stringify(
        context.knowledgeGraph || null,
        null,
        2
    )}

Now perform the Teaching Brain responsibilities defined
by the system prompt.

Return ONLY the required structured output.
`;
}

async function generateTeachingResponse(context) {
    if (!context) {
        throw new Error("Teaching Brain context is required.");
    }

    if (!context.systemPrompt) {
        throw new Error("Teaching Brain system prompt is required.");
    }

    if (!context.currentMessage) {
        throw new Error("Current learner message is required.");
    }

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const input = buildLLMInput(context);

    const response = await ai.models.generateContent({
        model: MODEL,

        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: input,
                    },
                ],
            },
        ],

        config: {
            systemInstruction: context.systemPrompt,

            responseMimeType: "application/json",

            responseSchema: teachingBrainSchema,
        },
    });

    const outputText = response.text;

    if (!outputText) {
        throw new Error(
            "Teaching Brain returned an empty response."
        );
    }

    let result;

    try {
        result = JSON.parse(outputText);
    } catch (error) {
        throw new Error(
            `Teaching Brain returned invalid JSON: ${error.message}`
        );
    }

    validateTeachingBrainOutput(result);

    return result;
}

function validateTeachingBrainOutput(result) {
    if (!result || typeof result !== "object") {
        throw new Error(
            "Teaching Brain output must be an object."
        );
    }

    if (
        typeof result.teachingResponse !== "string"
    ) {
        throw new Error(
            "Teaching Brain teachingResponse is invalid."
        );
    }

    if (!Array.isArray(result.learningEvents)) {
        throw new Error(
            "Teaching Brain learningEvents must be an array."
        );
    }

    if (!result.updates || typeof result.updates !== "object") {
        throw new Error(
            "Teaching Brain updates are invalid."
        );
    }

    if (
        !Array.isArray(
            result.updates.learnerStateUpdates
        )
    ) {
        throw new Error(
            "learnerStateUpdates must be an array."
        );
    }

    if (
        !Array.isArray(
            result.updates.profileUpdates
        )
    ) {
        throw new Error(
            "profileUpdates must be an array."
        );
    }

    for (const event of result.learningEvents) {
        if (!event.type) {
            throw new Error(
                "Learning Event type is required."
            );
        }


        if (!event.data) {
            throw new Error(
                "Learning Event data is required."
            );
        }

        if (!Array.isArray(event.retrievalTags)) {
            throw new Error(
                "Learning Event retrievalTags must be an array."
            );
        }
    }

    return true;
}

module.exports = {
    generateTeachingResponse,
    validateTeachingBrainOutput,
};