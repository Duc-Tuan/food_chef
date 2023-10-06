import express from 'express';
var router = express.Router();

const AdminController = require('../../controllers/AdminController');

// đăng nhập
router.post('/login', AdminController.login);

// đăng ký
router.put('/register', AdminController.createUser);

// danh sách phân quyền
router.get('/roles', AdminController.index);

// thêm quyền
router.put('/roles', AdminController.createRoles);

// sửa quyền
router.patch('/roles/:id', AdminController.updateRoles);

// xóa quyền
router.delete('/roles/:id', AdminController.deleteRoles);

// danh sách nhân viên
router.get('/', AdminController.getAll);

module.exports = router;
