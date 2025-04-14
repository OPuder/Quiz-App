const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post("/create", authenticateToken, authController.createUserByAdmin);

module.exports = router;