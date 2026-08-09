const express = require("express");

const {
    createLearnerState,
    getLearnerState,
} = require("../controllers/learnerController");

const router = express.Router();

router.post("/", createLearnerState);

router.get("/:learnerId", getLearnerState);

module.exports = router;