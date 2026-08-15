const crypto = require("crypto");
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

const forgotPassword = async ({ email }) => {

    // 1. Validate email

    if (!email) {
        return {
            success: false,
            message: "Email is required."
        };
    }

    // 2. Normalize email

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find the user

    const user = await User.findOne({
        email: normalizedEmail
    });

    // 4. Don't reveal whether the account exists

    if (!user) {
        return {
            success: true,
            message: "If an account with this email exists, a password reset link has been sent."
        };
    }

    // 5. Generate a secure random token

    const resetToken = crypto.randomBytes(32).toString("hex");

    // 6. Hash the token before storing it

    const resetTokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // 7. Set token expiry to 15 minutes

    const resetTokenExpires = new Date(
        Date.now() + 15 * 60 * 1000
    );

    // 8. Store the hashed token and expiry

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = resetTokenExpires;

    await user.save();

    // 9. Create the reset link

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    return {
        success: true,
        message: "If an account with this email exists, a password reset link has been sent.",
        resetLink
    };
};

const resetPassword = async ({ token, newPassword }) => {

    // 1. Validate required fields

    if (!token || !newPassword) {
        return {
            success: false,
            message: "Reset token and new password are required."
        };
    }

    // 2. Hash the token received from the reset link

    const resetTokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // 3. Find the user with this token

    const user = await User.findOne({
        passwordResetToken: resetTokenHash
    });

    if (!user) {
        return {
            success: false,
            message: "Invalid or expired password reset token."
        };
    }

    // 4. Check whether the token has expired

    if (
        !user.passwordResetExpires ||
        user.passwordResetExpires < new Date()
    ) {
        return {
            success: false,
            message: "Invalid or expired password reset token."
        };
    }

    // 5. Hash the new password

    const newPasswordHash = await bcrypt.hash(
        newPassword,
        10
    );

    // 6. Update the password

    user.passwordHash = newPasswordHash;

    // 7. Invalidate the reset token

    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    return {
        success: true,
        message: "Password reset successfully."
    };
};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword
};