const liveClassModel = require('../models/liveClassesModel');
const { validationResult } = require('express-validator');

module.exports.createLiveClass = async (req, res) => {
    try {
        // 🟢 Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { meetLink } = req.body;
        if (!meetLink) {
            return res.status(400).json({ message: "Meet link is required" });
        }

        // 🟢 Validate Google Meet Link Before Saving
        const googleMeetRegex = /^https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+$/;
        if (!googleMeetRegex.test(meetLink)) {
            return res.status(400).json({ message: "Invalid Google Meet link. Use a valid format like 'https://meet.google.com/xyz-abc-def'" });
        }

        // 🟢 Save or Update the latest live class link
        let existingLiveClass = await liveClassModel.findOne();
        if (existingLiveClass) {
            existingLiveClass.meetLink = meetLink;
            await existingLiveClass.save();
        } else {
            const newLiveClass = new liveClassModel({ meetLink });
            await newLiveClass.save();
        }

        res.status(201).json({ message: "Live Class created successfully", meetLink });
    } catch (error) {
        console.error("❌ Error in createLiveClass:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 🟢 Fetch latest meet link
module.exports.getLatestLiveClass = async (req, res) => {
    try {
        const latestClass = await liveClassModel.findOne();
        if (!latestClass) {
            return res.status(404).json({ message: "No live class found" });
        }
        res.status(200).json({ meetLink: latestClass.meetLink });
    } catch (error) {
        console.error("❌ Error fetching live class:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports.endLiveClass = async (req, res) => {
    try {
        const deleteClass = await liveClassModel.deleteOne();
        if (!deleteClass) {
            return res.status(404).json({ message: "No live class found" });
        }
        res.status(200).json({ meetLink: deleteClass.meetLink });
    } catch (error) {
        console.error("❌ Error fetching live class:", error);
        res.status(500).json({ message: "Server Error" });
    }
};