require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174"
    ]
}));

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const learningEventRoutes = require("./routes/learningEventRoutes");
const updateRoutes = require("./routes/updateRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.get("/", (req, res) => {
    res.send("Coding Companion Backend is Running 🚀");
});

app.use("/users", userRoutes);
app.use("/learner-state", learnerRoutes);
app.use("/learning-events", learningEventRoutes);
app.use("/updates", updateRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

// Keep malformed or oversized JSON requests from returning Express's HTML error page.
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            code: "BAD_REQUEST",
            message: "The request body contains invalid JSON.",
            retryable: false
        });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({
            success: false,
            code: "REQUEST_TOO_LARGE",
            message: "This request is too large. Please shorten your message or attached code.",
            retryable: false
        });
    }

    console.error("Unhandled API error:", {
        method: req.method,
        path: req.path,
        message: error.message
    });

    return res.status(500).json({
        success: false,
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
        retryable: true
    });
});

module.exports = app;