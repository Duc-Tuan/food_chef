import express from 'express';
var router = express.Router();

const userController = require('../../controllers/UserControllers');

// Tạo tài khoản
router.put('/register', userController.createUser);
// Đăng nhập
router.post('/login', userController.login);
// Cập nhật tài khoản
router.patch('/:id', userController.updateUser);
// Xóa tài khoản theo id
router.delete('/:id', userController.deleteUser);
// danh sách tài khoản
router.get('/', userController.index);

module.exports = router;
