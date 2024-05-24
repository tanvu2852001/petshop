const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const { ROLE_ADMIN, ROLE_CUSTOMER } = require('../../config/constants')
const md5 = require('md5');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        username: { type: String },
        password: { type: String },
        role: { type: String, enum: [ROLE_ADMIN, ROLE_CUSTOMER], default: ROLE_CUSTOMER },
    },
    {
        timestamps: true,
    },
);

//Add plugins
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

User.statics = {
    async login(username, password) {
        try {
            const hashedPassword = md5(password)

            const user = await this.findOne({ username, password: hashedPassword });

            if (!user) {
                throw new Error('Invalid username or password');
            }

            return user;
        } catch (error) {
            throw error;
        }
    },
    async register(username, password, role) {
        try {
            const hashedPassword = md5(password)

            concreatedUser = await this.findOne({ username });

            if (concreatedUser) {
                throw new Error('Username already exists');
            }

            return await this.create({ username, password: hashedPassword, role: role });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = mongoose.model('User', User);
