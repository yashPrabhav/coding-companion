const authService = require("../services/authService");

const sessionCookieOptions = {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const signup = async (req, res) => {
    try {
        const result = await authService.signup(req.body);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.cookie("cc_session", result.token, sessionCookieOptions);

        const { token, ...safeResult } = result;

        return res.status(201).json(safeResult);

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during signup."
        });
    }
};


const login = async (req, res) => {

    try {
        const result = await authService.login(req.body);


        if (!result.success) {
            return res.status(401).json(result);
        }

        res.cookie("cc_session", result.token, sessionCookieOptions);

        const { token, ...safeResult } = result;

        return res.status(200).json(safeResult);

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during login."
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const result = await authService.forgotPassword(req.body);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while processing the password reset request."
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const result = await authService.resetPassword(req.body);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password."
        });
    }
};


module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword
};