import express, { Response, Request } from 'express';
import UploadDiver from '../../utils/multer/UploadUser';
import { storateProduct } from '../../utils/multer/Type';
import { upload } from '../../utils/firebase/upload-file.controller';
var router = express.Router();

const productController = require('../../controllers/ProductController');
const ErrorUploadImage = require('../../utils/multer/ErrorUploadImage');

const cpUpload = UploadDiver(storateProduct).fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'productImageDetail', maxCount: 4 },
]);

// Danh sách sản phẩm user thích
router.post('/user-like', productController.getLikeProducts);
// Xóa 1 sản phẩm id lấy trên param
router.delete('/:id', productController.deleteProduct);
// Sửa 1 sản phẩm id lấy trên param
router.patch('/:id', cpUpload, ErrorUploadImage, productController.EditProduct);
// Sửa 1 sản phẩm id lấy trên param
router.get('/:id', productController.getProduct);
// Xóa nhiều sản phẩm id lấy qua req.body ids: ["123112dsfsdf", ...]
router.delete('/', productController.deleteProducts);
// Danh sách sản phẩm
router.get('/', productController.index);
// Thêm sản phẩm
router.put('/', upload.single('productImage'), productController.createProduct);

module.exports = router;
