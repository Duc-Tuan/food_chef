import express from 'express';
import { upload } from '../../utils/firebase/upload-file.controller';
var router = express.Router();

const MerchantController = require('../../controllers/MerchantController');

// Thêm thông tin cửa hàng
router.put('/', upload.single('merchantImage'), MerchantController.createMerchant);
// sửa thông tin cửa hàng
router.patch('/:id', upload.single('merchantImage'), MerchantController.editMerchant);
// lấy thông tin cửa hàng
router.get('/', MerchantController.index);

module.exports = router;
