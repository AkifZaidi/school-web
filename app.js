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
const cors = require("cors");

const allowedOrigins = [
    "http://localhost:3000",
    "https://school-web-client.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked CORS request from:", origin);
            callback(new Error("CORS not allowed for this origin"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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