const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({

    learnerId: {
        type: String,
        required: true,
        unique: true
    },

    goals: {
        type: [String],
        default: []
    },

    experienceLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true
    },

    preferredLearningStyle: {
        type: [String],
        default: []
    },

    preferredLanguage: {
        type: String,
        default: "English"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);