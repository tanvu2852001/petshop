const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/productController');

router.get('/:slug', productController.productdetail);

module.exports = router;
