const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema({
    meetLink: { type: String }, // Google Meet link
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LiveClass", liveClassSchema);
