const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/VerifyToken');

// Protect all user routes
router.use(verifyToken);

// User routes
router.get('/', userController.getAllUsers);
router.get('/me', userController.getUserProfile);
router.patch('/me/password', userController.updatePassword);
router.get('/overview', userController.getUsersOverview);

module.exports = router;
