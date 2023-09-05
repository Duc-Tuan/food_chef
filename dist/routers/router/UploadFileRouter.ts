import express from 'express';
import UploadDiver from '../../utils/multer/UploadUser';
import { storateProduct } from '../../utils/multer/Type';
var router = express.Router();

const uploadFIleController = require('../../controllers/UploadFileContrller');
const ErrorUploadImage = require('../../utils/multer/ErrorUploadImage');

router.put(
  '/products',
  UploadDiver(storateProduct).fields([
    { name: 'fileUpload', maxCount: 1 },
    { name: 'fileUploads', maxCount: 4 },
  ]),
  ErrorUploadImage,
  uploadFIleController.index,
);

module.exports = router;
