const express = require("express");

const {
    signup,
    login,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/test", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Authentication successful.",
        user: req.user
    });
});

module.exports = router;