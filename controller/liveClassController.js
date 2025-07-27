const liveClassModel = require('../models/liveClassesModel');
const { validationResult } = require('express-validator');

module.exports.createLiveClass = async (req, res) => {
    try {
        // ✅ Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { meetLink } = req.body;

        if (!meetLink) {
            return res.status(400).json({ message: "Meet link is required" });
        }

        const cleanLink = meetLink.trim();

        // ✅ Validate Google Meet Link format
        const googleMeetRegex = /^https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+$/;
        if (!googleMeetRegex.test(cleanLink)) {
            return res.status(400).json({
                message: "Invalid Google Meet link. Use a valid format like 'https://meet.google.com/xyz-abc-def'"
            });
        }

        // ✅ Check if same link already exists
        const existingLiveClass = await liveClassModel.findOne();
        if (existingLiveClass && existingLiveClass.meetLink === cleanLink) {
            return res.status(400).json({
                message: "This Google Meet link is already active. Please end the current class before adding the same link again."
            });
        }

        // ✅ Update or create new record
        if (existingLiveClass) {
            existingLiveClass.meetLink = cleanLink;
            await existingLiveClass.save();
        } else {
            const newLiveClass = new liveClassModel({ meetLink: cleanLink });
            await newLiveClass.save();
        }

        res.status(201).json({ message: "Live Class created successfully", meetLink: cleanLink });
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