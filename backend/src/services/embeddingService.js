const { GoogleGenAI } = require("@google/genai");

const MODEL = process.env.EMBEDDING_MODEL || "gemini-embedding-001";
const OUTPUT_DIMENSIONALITY = 768;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateObservationEmbedding(observation) {
    if (!observation || typeof observation !== "string") {
        throw new Error("A valid learning observation is required.");
    }

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const response = await ai.models.embedContent({
        model: MODEL,
        contents: observation,
        config: {
            taskType: "RETRIEVAL_DOCUMENT",
            outputDimensionality: OUTPUT_DIMENSIONALITY,
        },
    });

    const values = response.embeddings?.[0]?.values;

    if (!Array.isArray(values) || values.length === 0) {
        throw new Error("Embedding model returned no embedding values.");
    }

    return {
        model: MODEL,
        dimensions: values.length,
        embedding: values,
    };
}

async function generateQueryEmbedding(query) {
    if (!query || typeof query !== "string") {
        throw new Error("A valid search query is required.");
    }

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const response = await ai.models.embedContent({
        model: MODEL,
        contents: query,
        config: {
            taskType: "RETRIEVAL_QUERY",
            outputDimensionality: OUTPUT_DIMENSIONALITY,
        },
    });

    const values = response.embeddings?.[0]?.values;

    if (!Array.isArray(values) || values.length === 0) {
        throw new Error("Query embedding generation failed.");
    }

    return values;
}

module.exports = {
    generateObservationEmbedding,
    generateQueryEmbedding,
};
