require('dotenv').config();
const connectToBD = require("./dataBase/db");
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/userRoute");
const liveClassRoutes = require("./routes/liveClassRoute");
const recordedLectureRoutes = require("./routes/recordedLecturesRoute");
const sessionRoutes = require("./routes/sessionRoute")

connectToBD();
const app = express();
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // ✅ Replace with your frontend URL
    credentials: true  // ✅ Allow sending cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded videos
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to the backend!");
});

app.use("/users", userRoutes);
app.use("/liveClasses", liveClassRoutes);
app.use("/recordedLectures", recordedLectureRoutes);
app.use('/stats', sessionRoutes);

module.exports = app;