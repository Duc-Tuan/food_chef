import { Response, Request } from 'express';
import { deleteFile, uploadImages } from '../utils/firebase/funcFireBase';
import { nameFile } from '../styles';
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
      console.log(req?.file);
      const dataFile = await uploadImages(req?.file, `images/${nameFile.productDetails}`);
      return res.status(200).json(dataFile);
    } catch (error) {
      next(error);
    }
  }

  async detele(req: Request, res: Response, next: any) {
    try {
      const dataFile = await deleteFile(req?.body?.fileName);
      return res.status(200).json(dataFile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadFileController();
