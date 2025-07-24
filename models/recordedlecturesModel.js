const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    videoUrl: String,
    createdAt: { type: Date, default: Date.now }
});
const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;