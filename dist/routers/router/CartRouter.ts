import express from 'express';
var router = express.Router();

const CartsContronller = require('../../controllers/CartsContronller');

// Giỏ hàng
router.get('/', CartsContronller.index);
// Thêm sản phẩm vào giỏ hàng
router.post('/', CartsContronller.postCart);
// Thêm sản phẩm vào giỏ hàng
router.delete('/:productId', CartsContronller.deleteCart);

module.exports = router;
