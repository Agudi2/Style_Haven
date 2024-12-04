const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');

const router = express.Router();

router.get('/signup', isGuest, controller.getSignupForm);
router.post('/signup', isGuest, controller.signup);
router.get('/login', isGuest, controller.getLoginForm);
router.post('/login', isGuest, controller.login);
router.get('/profile', isLoggedIn, controller.getProfile);
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;
