const jwt = require('../helpers/jwt');
const User = require('../models/User');
const { ROLE_ADMIN } = require('../../config/constants');

module.exports = {
    attachUser: async (req, res, next) => {
        const accessToken = req.cookies.access_token;

        if (accessToken) {
            try {
                const payload = jwt.verify(accessToken);
                const user = await User.findById(payload.id);
                req.user = user;
            } catch (error) {
                req.user = null;
            }
        } else {
            req.user = null;
        }

        next();
    },
    authenticate: async (req, res, next) => {
        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            req.flash('error', 'Please login to continue');
            return res.redirect('/auth/login');
        }

        try {
            const payload = jwt.verify(accessToken);
            const user = await User.findById(payload.id);
            req.user = user;
            next();
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/auth/login');
        }
    },
    adminAuthenticate: async (req, res, next) => {
        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            req.flash('error', 'Please login to continue');
            return res.redirect('/auth/login');
        }

        try {
            const payload = jwt.verify(accessToken);
            const user = await User.findById(payload.id);
            req.user = user;

            if (user.role !== ROLE_ADMIN) {
                req.flash('error', 'You are not authorized to access this page');
                return res.redirect('/');
            }

            next();
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/auth/login');
        }
    },
    redirectIfAuthenticated: async (req, res, next) => {
        if (req.user) {
            return res.redirect('/');
        }

        next();
    },
}