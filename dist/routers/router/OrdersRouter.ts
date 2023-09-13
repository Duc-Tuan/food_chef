import express from 'express';
var router = express.Router();

const OrdersController = require('../../controllers/OrdersController');

// Thêm đơn hàng
router.put('/', OrdersController.createOrder);
// Cập nhật đơn hàng
router.patch('/:id', OrdersController.patchOrder);
// Xóa đơn hàng
router.delete('/:id', OrdersController.deleteOrder);
// danh sách đơn hàng
router.get('/', OrdersController.index);

module.exports = router;
