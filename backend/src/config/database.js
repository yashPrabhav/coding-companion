const mongoose = require("mongoose");

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB");
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDatabase;