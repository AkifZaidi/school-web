const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const service = require('../service/userService');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sessionModel = require('../models/sessionModel');
const liveClassesModel = require('../models/liveClassesModel');

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const isExistingUser = await userModel.findOne({ email });

    if (isExistingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await service.createUser({
        username,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();
    res.cookie("token", token);
    // res.cookie("token", token, {
    //     httpOnly: true,    // ✅ Prevent client-side access
    //     secure: false,     // ✅ Set `true` in production (HTTPS)
    //     sameSite: "Lax",  // ✅ Prevent CSRF attacks
    //     maxAge: 24 * 60 * 60 * 1000 // ✅ 1 Day Expiry
    // });

    res.status(201).json({ token, user });
}

// const jwt = require('jsonwebtoken');
// const userModel = require('../models/userModel');

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if it's the admin login
        if (email === "admin@gmail.com" && password === "control") {
            const token = jwt.sign({ _id: "admin", email, role: 'admin' }, process.env.JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.status(200).json({ token, message: "Welcome to the admin panel", user: { role: 'admin' }, redirect: "/dashboard" });
        }

        // Find user in database
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Please🙏 Signup before login" });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token using user's method
        const token = user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        // const session = new sessionModel({ userId: user._id, isActive: true });
        // await session.save();

        return res.status(200).json({
            token,
            message: "Welcome to the home page",
            user,
            redirect: "/"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports.getUserProfile = async (req, res) => {
    console.log("User Profile:", req.user);

    res.status(200).json({ user: req.user });
}

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, '-password'); // ✅ Hide passwords for security
        const links = await liveClassesModel.find({});
        res.json({ users, links });
        console.log("Users:", users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};
module.exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await userModel.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

module.exports.logoutUser = async (req, res) => {
    // await sessionModel.updateOne({ userId: req.user._id, isActive: true }, { isActive: false });
    res.clearCookie("token");
    res.status(200).json({ message: "your are logged out" });
}
