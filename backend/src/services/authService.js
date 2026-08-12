const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userService = require("./userService");
const learnerService = require("./learnerService");


const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            learnerId: user.learnerId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


const signup = async ({ name, email, password }) => {

    // 1. Validate required fields

    if (!name || !email || !password) {
        return {
            success: false,
            message: "Name, email and password are required."
        };
    }

    // 2. Normalize email

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check whether the email already exists

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        return {
            success: false,
            message: "An account with this email already exists."
        };
    }

    // 4. Hash the password

    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Generate learner ID

    const learnerId = `learner_${Date.now()}`;

    // 6. Create authentication account

    const user = await User.create({
        learnerId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
    });

    // 7. Create initial User Profile

    await userService.createUser({
        learnerId,
        goals: [],
        experienceLevel: "Beginner",
        preferredLearningStyle: [],
        preferredLanguage: "English"
    });

    // 8. Create initial Learner State

    await learnerService.createLearnerState(learnerId);

    // 9. Generate authentication token

    const token = generateToken(user);

    return {
        success: true,
        token,
        user: {
            learnerId: user.learnerId,
            name: user.name,
            email: user.email
        }
    };
};


const login = async ({ email, password }) => {

    // 1. Validate required fields

    if (!email || !password) {
        return {
            success: false,
            message: "Email and password are required."
        };
    }

    // 2. Normalize email

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find the account

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        return {
            success: false,
            message: "Invalid email or password."
        };
    }

    // 4. Verify password

    const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        return {
            success: false,
            message: "Invalid email or password."
        };
    }

    // 5. Generate authentication token

    const token = generateToken(user);

    return {
        success: true,
        token,
        user: {
            learnerId: user.learnerId,
            name: user.name,
            email: user.email
        }
    };
};


module.exports = {
    signup,
    login
};