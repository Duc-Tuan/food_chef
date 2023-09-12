import express, { Response, Request } from 'express';
var router = express.Router();

const CommentsController = require('../../controllers/CommentsController');

// Danh sách comments
router.get('/', CommentsController.index);
// thêm comments
router.put('/', CommentsController.createComment);
// Cập nhật comments
router.patch('/:id', CommentsController.patchComment);
// Xóa comments
router.delete('/:id', CommentsController.deleteComment);

module.exports = router;
