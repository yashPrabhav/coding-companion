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

module.exports = {
    createUser
};