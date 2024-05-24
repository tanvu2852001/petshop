const readline = require('readline');
const User = require('./app/models/User');
const { ROLE_ADMIN } = require('./config/constants');
const db = require('./config/db');

db.connect();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter super user username: ', async (username) => {
    try {
        const user = await User.findOne({ username });

        if (user) {
            throw new Error('User already exists');
        }

        rl.question('Enter super user password: ', async (password) => {
            try {
                await User.register(username, password, ROLE_ADMIN);
                console.log('Super user created successfully');
                process.exit(0);
            } catch (error) {
                console.error(error.message);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});
