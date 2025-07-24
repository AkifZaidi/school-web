const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },  // ✅ Track active session
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);
