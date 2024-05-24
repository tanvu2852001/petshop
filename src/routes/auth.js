const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/authController');
const authMiddleware = require('../app/middlewares/auth');

router.get('/login', authMiddleware.redirectIfAuthenticated, controller.getLoginPage);
router.get('/register', authMiddleware.redirectIfAuthenticated, controller.getRegisterPage);
router.post('/login', authMiddleware.redirectIfAuthenticated, controller.login);
router.post('/register', authMiddleware.redirectIfAuthenticated, controller.register);
router.get('/logout', controller.logout);

module.exports = router;
