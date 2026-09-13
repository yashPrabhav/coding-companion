require("dotenv").config();

const connectDatabase = require("../src/config/database");

const {
    persistTeachingBrainOutput
} = require("../src/services/teachingBrainPersistenceService");

async function test() {
    try {
        await connectDatabase();

        console.log(
            "\n===== TESTING ALL TEACHING BRAIN PERSISTENCE =====\n"
        );

        const teachingBrainOutput = {

            teachingResponse:
                "Test response.",

            // ------------------------------------------
            // LEARNING EVENT
            // ------------------------------------------

            learningEvents: [
                {
                    type: "CONCEPTUAL_MISUNDERSTANDING",

                    data: {
                        observation:
                            "Learner expressed difficulty understanding the binary search stopping condition."
                    },

                    retrievalTags: [
                        "binary_search",
                        "stopping_condition",
                        "conceptual_misunderstanding"
                    ]
                }
            ],

            updates: {

                // --------------------------------------
                // LEARNER STATE
                // --------------------------------------

                learnerStateUpdates: [
                    {
                        action: "change_current_topic",

                        target: "binary_search",

                        updates: {},

                        reason:
                            "Testing Teaching Brain learner-state persistence."
                    }
                ],

                // --------------------------------------
                // PROFILE
                // --------------------------------------

                profileUpdates: [
                    {
                        action: "change_experience_level",

                        target: "learner",

                        updates: {
                            level: "Intermediate"
                        },

                        reason:
                            "Testing Teaching Brain profile persistence."
                    }
                ]
            }
        };

        const result =
            await persistTeachingBrainOutput({
                learnerId:
                    "test-learner",

                conversationId:
                    "test-conversation",

                teachingBrainOutput
            });

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

        console.log(
            "\n===== ALL PERSISTENCE TEST COMPLETE =====\n"
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "\n===== ALL PERSISTENCE TEST FAILED =====\n"
        );

        console.error(error);

        process.exit(1);
    }
}

test();