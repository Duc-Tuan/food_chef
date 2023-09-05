// eslint-disable-next-line import/no-extraneous-dependencies
import multer from 'multer';
import { Request } from 'express';
import { maxSizeImage } from '../../styles';

const UploadDiver = (storateCustom: multer.StorageEngine) => {
  var upload = multer({
    storage: storateCustom,
    limits: { fileSize: maxSizeImage },
    fileFilter: function (req: Request, file, callback) {
      if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        callback(null, true);
      } else {
        req.body.errorImage = file.mimetype;
        console.log('only jpg & png file supported!');
        callback(null, false);
      }
    },
  });

  return upload;
};

export default UploadDiver;
