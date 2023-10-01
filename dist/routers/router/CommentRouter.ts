import express, { Response, Request } from 'express';
var router = express.Router();

const CommentsController = require('../../controllers/CommentsController');

// thêm comments
router.post('/', CommentsController.createComment);
// Danh sách comments
router.get('/', CommentsController.index);
// Cập nhật comments
router.patch('/:id', CommentsController.patchComment);
// Xóa comments
router.delete('/:id', CommentsController.deleteComment);

module.exports = router;
