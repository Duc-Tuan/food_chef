import express from 'express';
import { upload } from '../../utils/firebase/upload-file.controller';
var router = express.Router();

const BannerController = require('../../controllers/BannerController');

// Danh sách sản phẩm
router.get('/', BannerController.index);
// Thêm sản phẩm
router.put('/', upload.single('bannerImage'), BannerController.createBanners);

module.exports = router;
