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

app.get("/", (req, res) => {
    res.send("Coding Companion Backend is Running 🚀");
});

app.use("/users", userRoutes);
app.use("/learner-state", learnerRoutes);
app.use("/learning-events", learningEventRoutes);
app.use("/updates", updateRoutes);
app.use("/auth", authRoutes);

module.exports = app;