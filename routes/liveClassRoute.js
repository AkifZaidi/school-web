const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const liveClassController = require("../controller/liveClassController");
const authMiddleWare = require("../middleWare/authMiddleWare");

router.post("/class", authMiddleWare.authUser, [
    body("meetLink").isURL().withMessage("Please enter a valid Google Meet link")
], liveClassController.createLiveClass);

router.get("/latest", liveClassController.getLatestLiveClass);

router.delete("/deleteClass", liveClassController.endLiveClass);

module.exports = router;