const Product = require('../models/Product');

module.exports = {
    addToCart: async (req, res, next) => {
        const { slug } = req.params;
        try {
            let cart = req.session.cart;
            if (!cart) {
                cart = {
                    items: {},
                    totalQty: 0,
                };
            }

            const product = await Product.findOne({ slug }).lean();

            if (!product) {
                throw new Error('Product not found');
            }

            if (product.quantity == 0) {
                throw new Error(`"${product.name}" out of stock`);
            }

            if (!cart.items[slug]) {
                cart.items[slug] = {
                    product: product,
                    quantity: 1,
                };
            } else if (product.quantity > cart.items[slug].quantity) {
                cart.items[slug].quantity += 1;
            } else {
                throw new Error(`"${product.name}" out of stock`);
            }

            cart.totalQty = Object.values(cart.items).reduce((acc, item) => acc + item.quantity, 0);
            cart.totalPrice = Object.values(cart.items).reduce((acc, item) => acc + item.product.price * item.quantity, 0);

            req.session.cart = cart;
            req.session.save();

            req.flash('success', `"${product.name}" added to cart`);

            return res.redirect('/');
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/');
        }
    },
    getCart: async (req, res, next) => {
        try {
            const cart = req.session.cart;

            const success = req.flash('success') ?? null;
            const error = req.flash('error') ?? null;
            const user = req.user ? req.user.toJSON() : null;

            return res.render(
                'cart/cart',
                {
                    success,
                    error,
                    user: user,
                    cart: cart,
                }
            );
        } catch (error) {
            return next(error);
        }
    },
    increaseCartItem: async (req, res, next) => {
        try {
            const { slug } = req.params;
            let cart = req.session.cart;
            if (!cart) {
                cart = {
                    items: {},
                    totalQty: 0,
                };
            }

            const product = await Product.findOne({ slug }).lean();

            if (!product) {
                throw new Error('Product not found');
            }

            if (product.quantity < cart.totalQty) {
                throw new Error(`"${product.name}" out of stock`);
            }

            if (!cart.items[slug]) {
                cart.items[slug] = {
                    product: product,
                    quantity: 1,
                };
            } else {
                cart.items[slug].quantity += 1;
            }

            cart.totalQty = Object.values(cart.items).reduce((acc, item) => acc + item.quantity, 0);
            cart.totalPrice = Object.values(cart.items).reduce((acc, item) => acc + item.product.price * item.quantity, 0);

            req.session.cart = cart;
            req.session.save();

            req.flash('success', `"${product.name}" added to cart`);

            return res.redirect('/cart');
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/cart');
        }
    },
    decreaseCartItem: async (req, res, next) => {
        try {
            const { slug } = req.params;
            let cart = req.session.cart;
            if (!cart) {
                cart = {
                    items: {},
                    totalQty: 0,
                };
            }

            if (!cart.items[slug]) {
                throw new Error('Product not found in cart');
            }

            const product = await Product.findOne({ slug }).lean();

            if (!product) {
                throw new Error('Product not found');
            }

            if (cart.items[slug].quantity === 1) {
                delete cart.items[slug];
            } else {
                cart.items[slug].quantity -= 1;
            }

            cart.totalQty = Object.values(cart.items).reduce((acc, item) => acc + item.quantity, 0);
            cart.totalPrice = Object.values(cart.items).reduce((acc, item) => acc + item.product.price * item.quantity, 0);

            req.session.cart = cart;
            req.session.save();

            req.flash('success', `Decrease one item "${product.name}" from cart`);

            return res.redirect('/cart');
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/cart');
        }
    }
};
