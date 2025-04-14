const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authenticateToken = require('../middlewares/authenticateToken');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post("/create", authenticateToken, authController.createUserByAdmin);
router.patch('/:id/soft-delete', authenticateToken, authController.softDeleteUser);
router.patch('/:id/ban', authenticateToken, authController.banUser);

module.exports = router; 