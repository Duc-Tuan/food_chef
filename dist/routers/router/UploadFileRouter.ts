import express from 'express';
import { upload } from '../../utils/firebase/upload-file.controller';
var router = express.Router();

const uploadFileContrller = require('../../controllers/UploadFileContrller');

// upload File
router.post('/', upload.single('fileName'), uploadFileContrller.index);
router.delete('/', uploadFileContrller.detele);

module.exports = router;
