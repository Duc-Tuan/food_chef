import express from 'express';
var router = express.Router();

const HeartsContronller = require('../../controllers/HeartsContronller');

// Thêm sản phẩm ưa thích
router.post('/', HeartsContronller.createHeart);
// Danh sách sản phẩm ưa thích
router.get('/', HeartsContronller.index);

module.exports = router;
