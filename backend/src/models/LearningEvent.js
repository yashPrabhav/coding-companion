const mongoose = require("mongoose");

const metadataSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
        },

        learnerId: {
            type: String,
            required: true,
            index: true,
        },

        conversationId: {
            type: String,
            required: true,
        },

        generatedBy: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            required: true,
        },

        specificationVersion: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const eventSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
        },

        timestamp: {
            type: Date,
            required: true,
        },

        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { _id: false }
);

const learningEventSchema = new mongoose.Schema(
    {
        retrievalTags: {
            type: [String],
            required: true,
            index: true,
        },

        event: {
            type: eventSchema,
            required: true,
        },

        metadata: {
            type: metadataSchema,
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

learningEventSchema.index({
    learnerId: 1,
    "metadata.createdAt": -1,
});

module.exports = mongoose.model("LearningEvent", learningEventSchema);