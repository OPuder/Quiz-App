const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require("../middleware/authenticateToken");

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post("/create", authMiddleware, authController.createUserByAdmin);

module.exports = router;