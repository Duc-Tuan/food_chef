import express from 'express';
var router = express.Router();

const AddressOrderContronller = require('../../controllers/AddressOrderContronller');

// danh sách địa chỉ nhận hàng
router.get('/detail/:id', AddressOrderContronller.getDetail);
// thêm địa chỉ nhận hàng
router.put('/', AddressOrderContronller.createAddressOrder);
// chỉnh sửa địa chỉ nhận hàng
router.patch('/:id', AddressOrderContronller.editAddressOrder);
// danh sách địa chỉ nhận hàng
router.get('/', AddressOrderContronller.index);

module.exports = router;
