import express, { Response, Request } from 'express';
import { upload } from '../../utils/firebase/upload-file.controller';
var router = express.Router();

const CategoriesController = require('../../controllers/CategoriesController');

// Danh sách sản phẩm
router.get('/', CategoriesController.index);
// Thêm sản phẩm
router.put('/', upload.single('categoryImage'), CategoriesController.createCategories);

module.exports = router;
