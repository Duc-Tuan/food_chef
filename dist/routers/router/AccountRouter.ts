import express, { Response, Request } from 'express';
import UploadDiver from '../../utils/multer/UploadUser';
import { storateUser } from '../../utils/multer/Type';
var router = express.Router();

const userController = require('../../controllers/UserControllers');
const ErrorUploadImage = require('../../utils/multer/ErrorUploadImage');

// Thêm tài khoản
router.put('/register', UploadDiver(storateUser).single('userImage'), ErrorUploadImage, userController.createUser);
// Xóa tài khoản theo id
router.post('/login', userController.login);
// Xóa tài khoản theo id
router.delete('/:id', userController.deleteUser);
// danh sách tài khoản
router.get('/', userController.index);

module.exports = router;
