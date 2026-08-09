const mongoose = require("mongoose");

const topicStateSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: [
                "Not Started",
                "Learning",
                "Practicing",
                "Mastered",
                "Needs Revision",
            ],
            default: "Not Started",
        },

        masteryScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        evidenceCount: {
            type: Number,
            min: 0,
            default: 0,
        },

        lastUpdated: {
            type: Date,
            default: Date.now,
        },

        lastReviewed: {
            type: Date,
            default: null,
        },
    },
    { _id: false }
);

const currentSessionSchema = new mongoose.Schema(
    {
        goal: {
            type: String,
            default: null,
            trim: true,
        },

        startedAt: {
            type: Date,
            default: null,
        },

        messageCount: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    { _id: false }
);

const learningPreferencesSchema = new mongoose.Schema(
    {
        teachingStyle: {
            type: [String],
            default: [],
        },

        difficulty: {
            type: String,
            default: "Normal",
        },

        pace: {
            type: String,
            default: "Normal",
        },
    },
    { _id: false }
);

const recommendationSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Ready", "Blocked"],
            required: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        missingPrerequisites: {
            type: [String],
            default: [],
        },

        recommendedBy: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const learnerStateSchema = new mongoose.Schema(
    {
        learnerId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        currentTrack: {
            type: String,
            default: null,
            trim: true,
        },

        currentModule: {
            type: String,
            default: null,
            trim: true,
        },

        currentTopic: {
            type: String,
            default: null,
            trim: true,
        },

        currentSession: {
            type: currentSessionSchema,
            default: () => ({}),
        },

        topics: {
            type: Map,
            of: topicStateSchema,
            default: () => new Map(),
        },

        learningPreferences: {
            type: learningPreferencesSchema,
            default: () => ({}),
        },

        recommendations: {
            type: [recommendationSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LearnerState", learnerStateSchema);