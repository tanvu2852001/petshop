const Product = require('../models/Product');
const Order = require('../models/Order');

ALLOW_CARD_INFO = [
    {
        card_number: '9999999999999999',
        name_on_card: 'Test name',
        expiry_date: '12/30',
        security_code: '123'
    },
    {
        card_number: '9999999999999990',
        name_on_card: 'Test name',
        expiry_date: '10/30',
        security_code: '999'
    }
]

module.exports = {
    getCheckoutPage: async (req, res) => {
        try {
            const cart = req.session.cart;

            if (!cart) {
                throw new Error('Cart is empty');
            }

            const success = req.flash('success') ?? null;
            const error = req.flash('error') ?? null;
            const user = req.user ? req.user.toJSON() : null;

            return res.render(
                'order/checkout',
                {
                    cart,
                    success,
                    error,
                    user,
                }
            );
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/');
        }
    },
    checkout: async (req, res) => {
        try {
            if (!req.session.cart) {
                throw new Error('Cart is empty');
            }

            req.session.cart.checkout = req.body;

            req.session.save();

            return res.redirect('/order/pay');
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/');
        }
    },
    getPayPage: async (req, res) => {
        try {
            const cart = req.session.cart;

            if (!cart) {
                throw new Error('Cart is empty');
            }

            const success = req.flash('success') ?? null;
            const error = req.flash('error') ?? null;
            const user = req.user ? req.user.toJSON() : null;

            return res.render(
                'order/pay',
                {
                    cart,
                    success,
                    error,
                    user,
                }
            );
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/');
        }
    },
    pay: async (req, res) => {
        try {
            if (!req.session.cart) {
                throw new Error('Cart is empty');
            }

            let matchedCard = false

            for (let card of ALLOW_CARD_INFO) {
                if (
                    card.card_number == req.body.card_number
                    && card.name_on_card == req.body.name_on_card
                    && card.expiry_date == req.body.expiry_date
                    && card.security_code == req.body.security_code
                ) {
                    matchedCard = true;
                    break;
                }
            }

            if (!matchedCard) {
                throw new Error('Card not allowed');
            }

            const items = req.session.cart.items;
            for (let slug in items) {
                const product = await Product.findOne({ slug }).lean();

                if (!product) {
                    delete req.session.cart.items[slug];
                    req.session.cart.totalQty -= items[slug].quantity;
                    req.session.cart.totalPrice -= items[slug].quantity * items[slug].product.price;
                    req.session.save();
                    throw new Error('Product not found');
                }

                if (product.quantity < items[slug].quantity) {
                    delete req.session.cart.items[slug];
                    req.session.cart.totalQty -= items[slug].quantity;
                    req.session.cart.totalPrice -= items[slug].quantity * items[slug].product.price;
                    req.session.save();
                    throw new Error(`"${product.name}" out of stock`);
                }

                product.quantity -= items[slug].quantity;
                await Product.findOneAndUpdate({ slug }, { quantity: product.quantity });
            }

            const orderItems = Object.values(items).map(item => ({
                product_id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                category: item.product.category,
                quantity: item.quantity,
                des: item.product.des,
                thumbnail: item.product.thumbnail,
                slug: item.product.slug,
            }));

            let order = {
                user: req.user._id,
                status: 'completed',
                total: req.session.cart.totalPrice,
                shippingAddress: req.session.cart.checkout.shipping_address,
                phone: req.session.cart.checkout.phone,
                email: req.session.cart.checkout.email,
                note: req.session.cart.checkout.note,
                items: orderItems,
            };

            order = await Order.create(order);

            delete req.session.cart;
            req.session.save();

            req.flash('success', 'Order success');

            return res.redirect(`/order/${order._id}`);
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/');
        }
    },
    getOrderDetail: async (req, res) => {
        try {
            const { id } = req.params;

            const cart = req.session.cart;
            const user = req.user ? req.user.toJSON() : null;
            const success = req.flash('success') ?? null;

            const order = await Order.findOne({ _id: id, user: user._id }).lean();

            if (!order) {
                throw new Error('Order not found');
            }

            return res.render(
                'order/detail',
                {
                    order,
                    cart,
                    user,
                    success,
                }
            );
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/');
        }
    },
    getOrderHistory: async (req, res) => {
        try {
            const cart = req.session.cart;
            const user = req.user ? req.user.toJSON() : null;

            const orders = await Order.find({ user: user._id, status: 'completed' }).sort({ createdAt: -1 }).lean();

            return res.render(
                'order/history',
                {
                    orders,
                    cart,
                    user,
                }
            );
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/');
        }
    }
};
