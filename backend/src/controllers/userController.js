const userService = require("../services/userService");

async function createUser(req, res) {
    try {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

const getUserProfile = async (req, res) => {
    try {
        const { learnerId } = req.params;

        const userProfile = await userService.getUserProfile(learnerId);

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: userProfile
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile."
        });
    }
};

module.exports = {
    createUser,
    getUserProfile
};