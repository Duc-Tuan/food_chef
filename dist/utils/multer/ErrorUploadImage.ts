import { Response, Request } from 'express';
import { maxSize } from '../../styles';

function ErrorUploadImage(err: any, req: Request, res: Response, next: any) {
  const { errorImage } = req.body;
  if (err) {
    if (errorImage && (errorImage !== 'image/jpeg' || errorImage !== 'image/png')) {
      return res.status(400).json({ mess: 'Ảnh upload sai định dạng. Định dạng ảnh phải là "*.png" hoặc "*.jpeg"' });
    }
    return res.status(400).json({ mess: `Ảnh không được vượt quá ${maxSize}MB` });
  } else {
    next();
  }
}

module.exports = ErrorUploadImage;
