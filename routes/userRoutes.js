const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignUp, validateLogIn, validateResult} = require('../middlewares/validator');

const router = express.Router();

router.get('/signup', isGuest, controller.getSignupForm);
router.post('/signup', isGuest, validateSignUp, validateResult, controller.signup);
router.get('/login', isGuest, controller.getLoginForm);
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, controller.login);
router.get('/profile', isLoggedIn, controller.getProfile);
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;
