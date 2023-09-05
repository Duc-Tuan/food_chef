import multer from 'multer';
import { nameFile } from '../../styles';
const path = require('path');

export var storateProduct = multer.diskStorage({
  destination: function (req, res, cd) {
    cd(null, `dist/assets/others/${nameFile.products}`);
  },
  filename: function (req, file, cd) {
    let ext = path.extname(file.originalname);
    cd(null, Math.ceil(Math.random() * 10000) + '_' + Date.now() + ext);
  },
});

export var storateUser = multer.diskStorage({
  destination: function (req, res, cd) {
    cd(null, `dist/assets/others/${nameFile.users}`);
  },
  filename: function (req, file, cd) {
    let ext = path.extname(file.originalname);
    cd(null, Math.ceil(Math.random() * 10000) + '_' + Date.now() + ext);
  },
});
