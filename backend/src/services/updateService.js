const UserProfile = require("../models/UserProfile");
const LearnerState = require("../models/LearnerState");

const ALLOWED_ACTIONS = new Set([
    // User Profile
    "add_goal",
    "remove_goal",
    "change_experience_level",
    "add_learning_style",
    "remove_learning_style",
    "change_preferred_language",

    // Learner State
    "increase_mastery",
    "decrease_mastery",
    "change_topic_status",
    "add_learning_preference",
    "remove_learning_preference",
    "add_recommendation",
    "remove_recommendation",
    "update_recommendation",
    "change_current_topic",
    "change_current_module",
    "change_current_track"
]);

const updateLearner = async (learnerId, update) => {

    // ------------------------------------------
    // 1. Basic validation
    // ------------------------------------------

    if (!update) {
        return {
            applied: false,
            reason: "Update is required."
        };
    }

    const { action, target, reason } = update;

    if (!action || !target || !reason) {
        return {
            applied: false,
            reason: "Every update requires action, target and reason."
        };
    }

    // ------------------------------------------
    // 2. Validate action
    // ------------------------------------------

    if (!ALLOWED_ACTIONS.has(action)) {
        return {
            applied: false,
            reason: `Unknown or unsupported action: ${action}`
        };
    }

    // ------------------------------------------
    // 3. Route to correct system
    // ------------------------------------------

    if (isProfileAction(action)) {
        return await applyProfileUpdate(learnerId, update);
    }

    return await applyLearnerStateUpdate(learnerId, update);
};


// ======================================================
// USER PROFILE
// ======================================================

const isProfileAction = (action) => {

    return [
        "add_goal",
        "remove_goal",
        "change_experience_level",
        "add_learning_style",
        "remove_learning_style",
        "change_preferred_language"
    ].includes(action);

};


const applyProfileUpdate = async (learnerId, update) => {

    const profile = await UserProfile.findOne({ learnerId });

    if (!profile) {
        return {
            applied: false,
            reason: "User profile not found."
        };
    }

    switch (update.action) {

        case "add_goal":
            return await addGoal(profile, update);

        case "remove_goal":
            return await removeGoal(profile, update);

        case "change_experience_level":
            return await changeExperienceLevel(profile, update);

        case "add_learning_style":
            return await addLearningStyle(profile, update);

        case "remove_learning_style":
            return await removeLearningStyle(profile, update);

        case "change_preferred_language":
            return await changePreferredLanguage(profile, update);

        default:
            return {
                applied: false,
                reason: "Unsupported profile action."
            };
    }
};


// ---------- Goals ----------

const addGoal = async (profile, update) => {

    const goal = update.updates?.goal;

    if (!goal || typeof goal !== "string") {
        return {
            applied: false,
            reason: "Goal is required."
        };
    }

    const cleanGoal = goal.trim();

    if (!cleanGoal) {
        return {
            applied: false,
            reason: "Goal cannot be empty."
        };
    }

    if (!profile.goals.includes(cleanGoal)) {
        profile.goals.push(cleanGoal);
    }

    await profile.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


const removeGoal = async (profile, update) => {

    const goal = update.updates?.goal;

    if (!goal || typeof goal !== "string") {
        return {
            applied: false,
            reason: "Goal is required."
        };
    }

    const originalLength = profile.goals.length;

    profile.goals = profile.goals.filter(
        item => item !== goal
    );

    if (profile.goals.length === originalLength) {
        return {
            applied: false,
            reason: "Goal not found."
        };
    }

    await profile.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


// ---------- Experience Level ----------

const changeExperienceLevel = async (profile, update) => {

    const level = update.updates?.level;

    const allowedLevels = [
        "Beginner",
        "Intermediate",
        "Advanced"
    ];

    if (!allowedLevels.includes(level)) {
        return {
            applied: false,
            reason: "Invalid experience level."
        };
    }

    profile.experienceLevel = level;

    await profile.save();

    return {
        applied: true,
        action: update.action,
        target: update.target,
        value: level
    };
};


// ---------- Learning Style ----------

const addLearningStyle = async (profile, update) => {

    const style = update.updates?.learningStyle;

    if (!style || typeof style !== "string") {
        return {
            applied: false,
            reason: "Learning style is required."
        };
    }

    const cleanStyle = style.trim();

    if (!cleanStyle) {
        return {
            applied: false,
            reason: "Learning style cannot be empty."
        };
    }

    if (!profile.preferredLearningStyle.includes(cleanStyle)) {
        profile.preferredLearningStyle.push(cleanStyle);
    }

    await profile.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


const removeLearningStyle = async (profile, update) => {

    const style = update.updates?.learningStyle;

    if (!style || typeof style !== "string") {
        return {
            applied: false,
            reason: "Learning style is required."
        };
    }

    const originalLength =
        profile.preferredLearningStyle.length;

    profile.preferredLearningStyle =
        profile.preferredLearningStyle.filter(
            item => item !== style
        );

    if (
        profile.preferredLearningStyle.length ===
        originalLength
    ) {
        return {
            applied: false,
            reason: "Learning style not found."
        };
    }

    await profile.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


// ---------- Preferred Language ----------

const changePreferredLanguage = async (profile, update) => {

    const language = update.updates?.language;

    if (!language || typeof language !== "string") {
        return {
            applied: false,
            reason: "Language is required."
        };
    }

    profile.preferredLanguage = language.trim();

    await profile.save();

    return {
        applied: true,
        action: update.action,
        target: update.target,
        value: profile.preferredLanguage
    };
};


// ======================================================
// CURRENT LEARNER STATE
// ======================================================

const applyLearnerStateUpdate = async (learnerId, update) => {

    const learnerState =
        await LearnerState.findOne({ learnerId });

    if (!learnerState) {
        return {
            applied: false,
            reason: "Learner state not found."
        };
    }

    switch (update.action) {

        case "increase_mastery":
            return await increaseMastery(
                learnerState,
                update
            );

        case "decrease_mastery":
            return await decreaseMastery(
                learnerState,
                update
            );

        case "change_topic_status":
            return await changeTopicStatus(
                learnerState,
                update
            );

        case "add_learning_preference":
            return await addStateLearningPreference(
                learnerState,
                update
            );

        case "remove_learning_preference":
            return await removeStateLearningPreference(
                learnerState,
                update
            );

        case "add_recommendation":
            return await addRecommendation(
                learnerState,
                update
            );

        case "remove_recommendation":
            return await removeRecommendation(
                learnerState,
                update
            );

        case "update_recommendation":
            return await updateRecommendation(
                learnerState,
                update
            );

        case "change_current_topic":
            learnerState.currentTopic = update.target;
            break;

        case "change_current_module":
            learnerState.currentModule = update.target;
            break;

        case "change_current_track":
            learnerState.currentTrack = update.target;
            break;

        default:
            return {
                applied: false,
                reason: "Unsupported learner state action."
            };
    }

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


// ======================================================
// TOPIC PROGRESS
// ======================================================

const getTopic = (learnerState, topicName) => {

    return learnerState.topics.get(topicName);

};


const increaseMastery = async (learnerState, update) => {

    const topic = getTopic(
        learnerState,
        update.target
    );

    if (!topic) {
        return {
            applied: false,
            reason: "Topic not found."
        };
    }

    const amount = Number(update.updates?.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return {
            applied: false,
            reason: "Mastery increase must be positive."
        };
    }

    topic.masteryScore = Math.min(
        100,
        topic.masteryScore + amount
    );

    topic.evidenceCount += 1;
    topic.lastUpdated = new Date();

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target,
        masteryScore: topic.masteryScore
    };
};


const decreaseMastery = async (learnerState, update) => {

    const topic = getTopic(
        learnerState,
        update.target
    );

    if (!topic) {
        return {
            applied: false,
            reason: "Topic not found."
        };
    }

    const amount = Number(update.updates?.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return {
            applied: false,
            reason: "Mastery decrease must be positive."
        };
    }

    topic.masteryScore = Math.max(
        0,
        topic.masteryScore - amount
    );

    topic.evidenceCount += 1;
    topic.lastUpdated = new Date();

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target,
        masteryScore: topic.masteryScore
    };
};


const changeTopicStatus = async (learnerState, update) => {

    const topic = getTopic(
        learnerState,
        update.target
    );

    if (!topic) {
        return {
            applied: false,
            reason: "Topic not found."
        };
    }

    const status = update.updates?.status;

    const allowedStatuses = [
        "Not Started",
        "Learning",
        "Practicing",
        "Mastered",
        "Needs Revision"
    ];

    if (!allowedStatuses.includes(status)) {
        return {
            applied: false,
            reason: "Invalid topic status."
        };
    }

    topic.status = status;
    topic.lastUpdated = new Date();

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target,
        status
    };
};


// ======================================================
// LEARNING PREFERENCES
// ======================================================

const addStateLearningPreference = async (
    learnerState,
    update
) => {

    const preference = update.updates?.teachingStyle;

    if (!preference || typeof preference !== "string") {
        return {
            applied: false,
            reason: "Learning preference is required."
        };
    }

    if (
        !learnerState.learningPreferences.teachingStyle.includes(
            preference
        )
    ) {
        learnerState.learningPreferences.teachingStyle.push(
            preference
        );
    }

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


const removeStateLearningPreference = async (
    learnerState,
    update
) => {

    const preference = update.updates?.teachingStyle;

    const originalLength =
        learnerState.learningPreferences.teachingStyle.length;

    learnerState.learningPreferences.teachingStyle =
        learnerState.learningPreferences.teachingStyle.filter(
            item => item !== preference
        );

    if (
        learnerState.learningPreferences.teachingStyle.length ===
        originalLength
    ) {
        return {
            applied: false,
            reason: "Learning preference not found."
        };
    }

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


// ======================================================
// RECOMMENDATIONS
// ======================================================

const addRecommendation = async (
    learnerState,
    update
) => {

    const data = update.updates || {};

    const status = data.status;

    if (!["Ready", "Blocked"].includes(status)) {
        return {
            applied: false,
            reason: "Recommendation status must be Ready or Blocked."
        };
    }

    if (
        status === "Blocked" &&
        (!Array.isArray(data.missingPrerequisites) ||
            data.missingPrerequisites.length === 0)
    ) {
        return {
            applied: false,
            reason:
                "Blocked recommendations require missingPrerequisites."
        };
    }

    const existing =
        learnerState.recommendations.find(
            recommendation =>
                recommendation.topic === update.target
        );

    if (existing) {
        return {
            applied: false,
            reason: "Recommendation already exists."
        };
    }

    learnerState.recommendations.push({
        topic: update.target,
        status,
        reason: update.reason,
        ...(data.missingPrerequisites && {
            missingPrerequisites:
                data.missingPrerequisites
        }),
        recommendedBy: "Teaching Brain",
        createdAt: new Date()
    });

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


const removeRecommendation = async (
    learnerState,
    update
) => {

    const originalLength =
        learnerState.recommendations.length;

    learnerState.recommendations =
        learnerState.recommendations.filter(
            recommendation =>
                recommendation.topic !== update.target
        );

    if (
        learnerState.recommendations.length ===
        originalLength
    ) {
        return {
            applied: false,
            reason: "Recommendation not found."
        };
    }

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


const updateRecommendation = async (
    learnerState,
    update
) => {

    const recommendation =
        learnerState.recommendations.find(
            item => item.topic === update.target
        );

    if (!recommendation) {
        return {
            applied: false,
            reason: "Recommendation not found."
        };
    }

    const changes = update.updates || {};

    if (
        changes.status !== undefined &&
        !["Ready", "Blocked"].includes(changes.status)
    ) {
        return {
            applied: false,
            reason: "Invalid recommendation status."
        };
    }

    if (
        changes.status === "Blocked" &&
        (!Array.isArray(changes.missingPrerequisites) ||
            changes.missingPrerequisites.length === 0)
    ) {
        return {
            applied: false,
            reason:
                "Blocked recommendations require missingPrerequisites."
        };
    }

    if (changes.status !== undefined) {
        recommendation.status = changes.status;
    }

    if (changes.missingPrerequisites !== undefined) {
        recommendation.missingPrerequisites =
            changes.missingPrerequisites;
    }

    if (changes.reason !== undefined) {
        recommendation.reason = changes.reason;
    }

    await learnerState.save();

    return {
        applied: true,
        action: update.action,
        target: update.target
    };
};


module.exports = {
    updateLearner
};