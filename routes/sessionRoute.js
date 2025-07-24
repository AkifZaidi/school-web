const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleWare/authMiddleWare');
const sessionController = require('../controller/sessionController'); // ✅ Import session model

// ✅ Get active session count
router.get('/sessions', authMiddleware.authUser, sessionController.getSession);

module.exports = router;
