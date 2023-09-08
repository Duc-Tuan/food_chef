import express from 'express';
var router = express.Router();

const AddressOrderContronller = require('../../controllers/AddressOrderContronller');

// danh sách chi tiết địa chỉ nhận hàng
router.get('/:id', AddressOrderContronller.getDetail);
// Xóa địa chỉ nhận hàng
router.delete('/:id', AddressOrderContronller.deleteAddressOrder);
// thêm địa chỉ nhận hàng
router.put('/', AddressOrderContronller.createAddressOrder);
// chỉnh sửa địa chỉ nhận hàng
router.patch('/:id', AddressOrderContronller.editAddressOrder);
// danh sách địa chỉ nhận hàng
router.get('/', AddressOrderContronller.index);

module.exports = router;
