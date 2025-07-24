const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    console.log("Cookies Received:", req.cookies); // ✅ Debugging line
    console.log("Authorization Header:", req.headers.authorization);

    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: "You need to be logged in first" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Fix: Check if the user is an admin (admin doesn't have _id in the token)
        if (decoded.role === 'admin') {
            req.user = { _id: "admin", role: "admin", email: decoded.email };
            return next();
        }

        // ✅ Find user only if it's not admin
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ message: "Invalid token or session expired" });
    }
};
