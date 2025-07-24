const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controller/userController");
const authMiddleWare = require("../middleWare/authMiddleWare");


router.post("/register",[
    body("username").isLength({min: 3}).withMessage("Username muse be at least 3 characters long"),
    body("email").isEmail().withMessage("Please Provide a valid email"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long")
], userController.registerUser);


router.post("/login", [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long")
], userController.loginUser);

router.get("/profile", authMiddleWare.authUser, userController.getUserProfile);
router.get("/logout", authMiddleWare.authUser, userController.logoutUser);
router.get('/all-users', authMiddleWare.authUser, userController.getAllUsers);
router.delete('/delete/:id', authMiddleWare.authUser, userController.deleteUser);


module.exports = router;