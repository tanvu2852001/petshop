const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/cartController');

router.get('/', cartController.getCart);
router.get('/add_to_cart/:slug', cartController.addToCart);
router.get('/increase/:slug', cartController.increaseCartItem);
router.get('/decrease/:slug', cartController.decreaseCartItem);

module.exports = router;
