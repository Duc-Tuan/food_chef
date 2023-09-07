import express from 'express';
import { upload } from '../../utils/firebase/upload-file.controller';
var router = express.Router();

const MerchantController = require('../../controllers/MerchantController');

// Thêm tài khoản
router.put('/', upload.single('merchantImage'), MerchantController.createMerchant);

// danh sách tài khoản
router.get('/', MerchantController.index);

module.exports = router;
