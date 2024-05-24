const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/constants');

module.exports = {
    generate: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }),
    verify: (token) => jwt.verify(token, JWT_SECRET)
}