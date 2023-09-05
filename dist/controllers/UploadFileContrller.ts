import { Response, Request } from 'express';
import { deleteFile, uploadImages } from '../utils/firebase/funcFireBase';
class UploadFileController {
  //[GET] danh sách tài khoản tất cả hoặc theo phân trang page&pageSize hoặc tìm kiếm theo query&status
  async index(req: Request, res: Response, next: any) {
    // const { fileUpload, fileUploads }: any = req.files;
    // try {
    //   let urlFiles: string = '';
    //   const listNameFiles: string[] = [];
    //   const listUriFiles: string[] = [];
    //   if (fileUploads || fileUpload) {
    //     urlFiles = 'http://' + process.env.URL + `/${nameFile.products}/` + fileUpload[0]?.filename;
    //     listNameFiles.push(fileUpload[0]?.filename);

    //     fileUploads?.map((i: any) => {
    //       listNameFiles.push(i?.filename);
    //       listUriFiles.push('http://' + process.env.URL + `/${nameFile.products}/` + i?.filename);
    //     });
    //   }
    //   return res.status(200).json({ listNameFiles, listUriFiles, urlFiles });
    // } catch (error) {
    //   next(error);
    // }
    try {
      const dataFile = await uploadImages(req?.file, 'images/productDetails');
      return res.status(200).json(dataFile);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async detele(req: Request, res: Response, next: any) {
    try {
      const dataFile = await deleteFile(req?.body?.fileName);
      return res.status(200).json(dataFile);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

module.exports = new UploadFileController();
