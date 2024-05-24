const User = require('../models/User');
const { ROLE_CUSTOMER } = require('../../config/constants');
const jwt = require('../helpers/jwt');

module.exports = {
    getLoginPage: async (req, res) => {
        const success = req.flash('success');
        const error = req.flash('error');
        return res.render('auth/login', { success, error });
    },
    getRegisterPage: async (req, res) => {
        return res.render('auth/register');
    },
    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await User.login(username, password);

            const accessToken = jwt.generate({ id: user._id });

            res.cookie('access_token', accessToken, { httpOnly: true });
            req.flash('success', `Welcome back ${user.username}`);

            return res.redirect('/');
        } catch (error) {
            return res.render('auth/login', { error: error.message });
        }
    },
    register: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await User.register(username, password, ROLE_CUSTOMER);

            const accessToken = jwt.generate({ id: user._id });

            res.cookie('access_token', accessToken, { httpOnly: true });
            req.flash('success', `Register success! Welcome ${user.username}`);

            return res.redirect('/');
        } catch (error) {
            return res.render('auth/register', { error: error.message });
        }
    },
    logout: async (req, res) => {
        res.clearCookie('access_token');
        req.flash('success', 'Logout success');
        return res.redirect('/');
    }
}
