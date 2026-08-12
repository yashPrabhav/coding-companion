const authService = require("../services/authService");

const signup = async (req, res) => {
    try {
        const result = await authService.signup(req.body);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);

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

        return res.status(200).json(result);

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during login."
        });
    }
};


module.exports = {
    signup,
    login
};