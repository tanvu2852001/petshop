const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb+srv://dinovu285:zxcvbnm1@cluster0.aao9q92.mongodb.net/petshop');
    } catch (error) {
        console.error('Connect failure');
        process.exit(1);
    }
}

module.exports = { connect };
