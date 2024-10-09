const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');

// Sign up route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route
router.get('/logout', logout);

module.exports = router;
