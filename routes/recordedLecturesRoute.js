const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadVideo, getAllVideos} = require("../controller/recordedLectureController");

// 📂 Multer Storage Setup
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// 🆕 Upload Video Route
router.post("/upload", upload.single("video"), uploadVideo);

// 📢 Get All Videos Route
router.get("/allVideos", getAllVideos);

module.exports = router;
