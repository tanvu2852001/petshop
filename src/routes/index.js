const productRouter = require('./products');
const adRouter = require('./ad');
const authRouter = require('./auth');
const cartRouter = require('./cart');
const homeController = require('../app/controllers/homeController');
const orderRoute = require('./order');
const authMiddleware = require('../app/middlewares/auth');

function routes(app) {
    app.get('/', authMiddleware.attachUser, homeController.home);
    app.use('/cart', authMiddleware.attachUser, authMiddleware.authenticate, cartRouter);
    app.use('/product', authMiddleware.attachUser, productRouter);
    app.use('/ad', authMiddleware.attachUser, authMiddleware.adminAuthenticate, adRouter);
    app.use('/auth', authMiddleware.attachUser, authRouter);
    app.use('/order', authMiddleware.attachUser, authMiddleware.authenticate, orderRoute);
}

module.exports = routes;
