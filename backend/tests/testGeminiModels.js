require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
    try {
        console.log("\n===== AVAILABLE GEMINI MODELS =====\n");

        const pager = await ai.models.list();

        for await (const model of pager) {
            const actions = model.supportedActions || [];

            if (actions.includes("generateContent")) {
                console.log(
                    `${model.name} | generateContent`
                );
            }
        }

        console.log(
            "\n===== MODEL LIST COMPLETE =====\n"
        );
    } catch (error) {
        console.error(
            "\n===== MODEL LIST FAILED =====\n"
        );

        console.error(error);
    }
}

test();