const Product = require('../models/Product');

module.exports = {
    home: async (req, res, next) => {
        try {
            const products = await Product.find({}).lean();

            const success = req.flash('success') ?? null;
            const error = req.flash('error') ?? null;
            const cart = req.session.cart;

            const user = req.user ? req.user.toJSON() : null;

            return res.render(
                'customer/home',
                {
                    products,
                    success,
                    error,
                    user: user,
                    cart: cart,
                }
            );
        } catch (error) {
            return next(error);
        }
    }
};
