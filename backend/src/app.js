const express = require("express");

const app = express();

app.use(express.json());

const userRoutes = require("./routes/userRoutes");

app.get("/", (req, res) => {
    res.send("Coding Companion Backend is Running 🚀");
});

app.use("/users", userRoutes);

module.exports = app;