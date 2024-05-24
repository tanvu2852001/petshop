const Product = require('../models/Product');

module.exports = {
    productdetail: async (req, res, next) => {
        try {
            const user = req.user ? req.user.toJSON() : null;
            const cart = req.session.cart;
            const product = await Product.findOne({ slug: req.params.slug }).lean();
            return res.render('customer/detail', { product, user, cart});
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/');
        }
    }
};
