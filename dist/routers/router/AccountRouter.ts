import express, { Response, Request } from 'express';
import UploadDiver from '../../utils/multer/UploadUser';
import { storateUser } from '../../utils/multer/Type';
var router = express.Router();

const userController = require('../../controllers/UserControllers');
const ErrorUploadImage = require('../../utils/multer/ErrorUploadImage');

// Tạo tài khoản
router.put('/register', UploadDiver(storateUser).single('userImage'), ErrorUploadImage, userController.createUser);
// Đăng nhập
router.post('/login', userController.login);
// Cập nhật tài khoản
router.patch('/:id', userController.updateUser);
// Xóa tài khoản theo id
router.delete('/:id', userController.deleteUser);
// danh sách tài khoản
router.get('/', userController.index);

module.exports = router;
