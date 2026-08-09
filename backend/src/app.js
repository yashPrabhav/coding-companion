const express = require("express");

const app = express();

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const learningEventRoutes = require("./routes/learningEventRoutes");
const updateRoutes = require("./routes/updateRoutes");

app.get("/", (req, res) => {
    res.send("Coding Companion Backend is Running 🚀");
});

app.use("/users", userRoutes);
app.use("/learner-state", learnerRoutes);
app.use("/learning-events", learningEventRoutes);
app.use("/updates", updateRoutes);

module.exports = app;