import express, { Response, Request } from 'express';
import { upload } from '../../utils/firebase/upload-file.controller';
var router = express.Router();

const ShippingController = require('../../controllers/ShippingController');

// thông tin chi tiết người giao hàng
router.put('/', upload.single('shiperImage'), ShippingController.createShipping);
// thông tin chi tiết người giao hàng
router.get('/:id', ShippingController.indexDetail);
// thông tin chi tiết người giao hàng
router.delete('/:id', ShippingController.deleteShipping);
// Danh sách người giao hàng
router.get('/', ShippingController.index);


module.exports = router;
