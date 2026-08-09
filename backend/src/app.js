const express = require("express");

const app = express();

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const learnerRoutes = require("./routes/learnerRoutes");

app.get("/", (req, res) => {
    res.send("Coding Companion Backend is Running 🚀");
});

app.use("/users", userRoutes);
app.use("/learner-state", learnerRoutes);

module.exports = app;