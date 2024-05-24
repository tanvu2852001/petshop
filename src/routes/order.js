const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/orderController');

router.get('/checkout', controller.getCheckoutPage);
router.post('/checkout', controller.checkout);
router.get('/pay', controller.getPayPage);
router.post('/pay', controller.pay);
router.get('/history', controller.getOrderHistory);
router.get('/:id', controller.getOrderDetail);

module.exports = router;
