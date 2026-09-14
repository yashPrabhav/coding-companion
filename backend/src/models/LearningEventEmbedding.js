const mongoose = require("mongoose");

const learningEventEmbeddingSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        learnerId: {
            type: String,
            required: true,
            index: true,
        },

        model: {
            type: String,
            required: true,
        },

        dimensions: {
            type: Number,
            required: true,
        },

        embedding: {
            type: [Number],
            required: true,
        },

        createdAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

learningEventEmbeddingSchema.index({
    learnerId: 1,
    createdAt: -1,
});

module.exports = mongoose.model(
    "LearningEventEmbedding",
    learningEventEmbeddingSchema
);
