const Product = require('../models/Product');
const Category = require('../models/Category')
const Order = require('../models/Order')


class adController {
    //Product function
    storedProduct(req, res, next) {
        const user = req.user ? req.user.toJSON() : null;
        const cart = req.session.cart;
        Product.find({})
            .lean()
            .then((products) => res.render('ad/stored-products', { products, user, cart }))
            .catch(next);
    }

    createproduct(req, res, next) {
        const user = req.user ? req.user.toJSON() : null;
        const cart = req.session.cart;
        Category.find({})
            .lean()
            .then((category) => res.render('ad/create', { category, user, cart }))
            .catch(next);
    }

    async storeproduct(req, res, next) {
        const product = await Product.create(req.body);

        res.redirect('/');
    }

    editproduct(req, res, next) {
        const user = req.user ? req.user.toJSON() : null;
        const cart = req.session.cart;
        Product.findById(req.params.id)
            .lean()
            .then((products) => {
                res.render('ad/edit', { products, user, cart });
            })
            .catch(next);
    }

    updateproduct(req, res, next) {
        Product.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/ad/stored-products'))
            .catch(next);
    }

    destroyproduct(req, res, next) {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    trashproduct(req, res, next) {
        const user = req.user ? req.user.toJSON() : null;
        const cart = req.session.cart;
        Product.findDeleted({})
            .lean()
            .then((products) => res.render('ad/trash-products', { products, user, cart }))
            .catch(next);
    }

    restoreproduct(req, res, next) {
        Product.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    forceDestroyproduct(req, res, next) {
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //Category function
    createcategory(req, res, next) {
        const user = req.user ? req.user.toJSON() : null;
        const cart = req.session.cart;
        res.render('ad/createcategory', { user, cart });
    }

    storecategory(req, res, next) {
        const category = new Category(req.body);
        category
            .save()
            .then(() => res.redirect('/'))
            .catch(next);
    }

    storedcategory(req, res, next) {
        Category.find({})
            .lean()
            .then((category) => res.render('ad/stored-category', { category }))
            .catch(next);
    }

    editcategory(req, res, next) {
        Category.findById(req.params.id)
            .lean()
            .then((category) => {
                res.render('ad/editcategory', { category });
            })
            .catch(next);
    }

    updatecategory(req, res, next) {
        Category.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/ad/stored-category'))
            .catch(next);
    }

    destroycategory(req, res, next) {
        Category.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    trashcategory(req, res, next) {
        Category.findDeleted({})
            .lean()
            .then((category) => res.render('ad/trash-category', { category }))
            .catch(next);
    }

    restorecategory(req, res, next) {
        Category.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    forceDestroycategory(req, res, next) {
        Category.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    orders(req, res, next) {
        const user = req.user ? req.user.toJSON() : null;
        const cart = req.session.cart;
        Order.find({})
            .sort({ createdAt: -1 })
            .lean()
            .then((orders) => res.render('ad/stored-orders', { orders, user, cart }))
            .catch(next);
    }

    orderDetail(req, res, next) {
        const user = req.user ? req.user.toJSON() : null;
        const cart = req.session.cart;
        Order.findById(req.params.id)
            .lean()
            .then((order) => res.render('ad/stored-order-detail', { order, user, cart }))
            .catch(next);
    }

    updateOrderDetail(req, res, next) {
        Order.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    }

    deleteOrder(req, res, next) {
        Order.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    trashOrders(req, res, next) {
        const user = req.user ? req.user.toJSON() : null;
        const cart = req.session.cart;
        Order.findDeleted({})
            .lean()
            .then((orders) => {
                orders = orders.filter((order) => order.deleted);
                res.render('ad/trash-orders', { orders, user, cart })
            })
            .catch(next);
    }

    restoreOrder(req, res, next) {
        Order.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    forceDestroyOrder(req, res, next) {
        Order.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}
module.exports = new adController();
