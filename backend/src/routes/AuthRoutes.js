const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const AuthController = require('../controllers/AuthController');

// Register route
router.post('/register', AuthController.registerUser);

// Login route
router.post('/login', AuthController.loginUser);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173';
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
      { expiresIn: '1h' }
    );

    const user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    };
    res.redirect(
      `${frontend_url}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  }
);

module.exports = router;