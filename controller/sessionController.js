const Session = require('../models/sessionModel'); // ✅ Import session model

// ✅ Get active session count
module.exports.getSession = async (req, res) => {
    try {
        const activeSessions = await Session.countDocuments({ isActive: true }); // ✅ Count active sessions
        res.json({ sessions: activeSessions });
    } catch (error) {
        console.error("Error fetching active sessions:", error);
        res.status(500).json({ message: "Error fetching active sessions" });
    }
}

