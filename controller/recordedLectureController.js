const Video = require("../models/recordedlecturesModel");

// 🎥 Upload Video Controller
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const videoUrl = req.file.filename;
        const newVideo = new Video({ videoUrl });

        await newVideo.save();
        res.status(201).json({ message: "Video uploaded successfully", videoUrl });
    } catch (error) {
        res.status(500).json({ message: "Error uploading video", error });
    }
};

// // 📢 Get All Videos Controller
const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error });
    }
};

module.exports = { uploadVideo, getAllVideos };
