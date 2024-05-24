const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Order = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['open', 'completed'],
        },
        total: { type: Number },
        shippingAddress: { type: String },
        phone: { type: String },
        email: { type: String },
        note: { type: String },
        items: [
            {
                productId: { type: String },
                name: { type: String },
                price: { type: String },
                category: { type: String },
                quantity: { type: String },
                des: { type: String },
                thumbnail: { type: String },
                slug: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    },
);

//Add plugins
Order.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Order', Order);
