import express from 'express';
var router = express.Router();

const uploadFileContrller = require('../../controllers/UploadFileContrller');

// upload File
router.post('/', uploadFileContrller.index);
router.post('/image', uploadFileContrller.imageUpload);
router.delete('/', uploadFileContrller.detele);

module.exports = router;
