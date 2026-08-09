const express = require("express");

const {
    applyUpdate
} = require("../controllers/updateController");

const router = express.Router();

// Apply a Teaching Brain update recommendation
router.post("/:learnerId", applyUpdate);

module.exports = router;
