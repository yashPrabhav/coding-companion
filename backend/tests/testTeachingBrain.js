require("dotenv").config();

const {
    buildContext,
} = require("../src/services/contextBuilderService");

const {
    generateTeachingResponse,
} = require("../src/services/teachingBrainService");

async function test() {
    try {
        const context = await buildContext({
            learnerId: "learner_1787493415632",

            conversation: [
                {
                    role: "user",
                    text: "I am learning binary search.",
                },
            ],

            currentMessage:
                "I don't understand the stopping condition.",
        });

        console.log("\n===== SENDING TO TEACHING BRAIN =====\n");

        const result =
            await generateTeachingResponse(context);

        console.log(
            JSON.stringify(result, null, 2)
        );

        console.log(
            "\n===== TEACHING BRAIN WORKING =====\n"
        );
    } catch (error) {
        console.error(
            "\n===== TEACHING BRAIN FAILED =====\n"
        );

        console.error(error);
    }
}

test();