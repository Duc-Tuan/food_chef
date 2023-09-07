/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { nameFile } from '../styles';
import { uploadImages } from '../utils/firebase/funcFireBase';
import { deleteImage, mapIndex } from './Type';
const products = require('../models/ProductModel');

class ProductController {
  //[GET] danh sách sản phẩm tất cả hoặc theo phân trang page&pageSize hoặc tìm kiếm theo query&status
  index(req: Request, res: Response, next: any) {
    try {
      var { page, pageSize, query, status } = req.query;
      let dataSearch: any = undefined;
      let queryData: any = undefined;

      // query data search
      if (status && query) {
        dataSearch = { $regex: query, $options: 'i' };
        queryData = {
          productStatus: status,
          $or: [
            { productName: dataSearch },
            { productPrice: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
            { productQty: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
          ],
        };
      } else if (query) {
        dataSearch = { $regex: query, $options: 'im' };
        queryData = {
          $or: [
            { productName: dataSearch },
            { productPrice: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
            { productQty: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
          ],
        };
      } else if (status) {
        queryData = { productStatus: status };
      }

      var skipNumber: number = 0;
      // get page, pageSize, query and status data
      if (page || pageSize) {
        const pageSizeNew = Number(pageSize);
        let pageNew = Number(page);
        if (pageNew <= 1) pageNew = 1;
        skipNumber = (pageNew - 1) * pageSizeNew;

        products
          .find(queryData, {
            productImageDetail: 0,
            productImageMulter: 0,
            productComment: 0,
            productDescribes: 0,
            productDesc: 0,
          })
          .skip(skipNumber)
          .sort({ index: -1 })
          .limit(pageSize)
          .then((data: any) => {
            products
              .countDocuments(queryData)
              .then((total: number) => {
                var totalPage: number = Math.ceil(total / pageSizeNew);
                return res.status(200).json({
                  paganition: {
                    totalPage: Number(totalPage),
                    currentPage: Number(page),
                    pageSize: Number(pageSize),
                    totalElement: Number(total),
                  },
                  data,
                });
              })
              .catch((error: any) => next(error));
          });
      } else {
        // get all
        products
          .find(queryData, {
            productImageDetail: 0,
            productImageMulter: 0,
            productComment: 0,
            productDescribes: 0,
            productDesc: 0,
          })
          .sort({ index: -1 })
          .then((data: any) => {
            return res.status(200).json(data);
          })
          .catch((err: any) => {
            return next(err);
          });
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  //[GET] chi tiết sản phẩm
  getProduct(req: Request, res: Response, next: any) {
    const { id } = req.params;
    products
      .findOne({ _id: id }, { productImageMulter: 0 })
      .then((data: any) => res.status(200).json(data))
      .catch((err: any) => next(err));
  }

  //[PUT] Thêm mới sản phẩm
  async createProduct(req: Request, res: Response, next: any) {

    try {
      const dataArrayImageMulter: string[] = [];
      const dataFile = await uploadImages(req?.file, `images/${nameFile.products}`);
      dataArrayImageMulter.push(dataFile.nameFile);

      req.body.productImage = dataFile.downloadURL;
      req.body.productImageMulter = dataArrayImageMulter;

      await mapIndex('SP', products, req);
      const dataProducts = new products(req.body);
      dataProducts
        .save()
        .then(() => {
          return res.status(200).json({ mess: 'Thêm sản phẩm thành công.' });
        })
        .catch((err: any) => next(err));
    } catch (error: any) {
      return res.status(400).send(error?.message);
    }
  }

  //[DELETE] Xóa một sản phẩm theo id
  deleteProduct(req: Request, res: Response, next: any) {
    const { id } = req.params;

    products
      .findById(id)
      .then((data: any) => {
        if (data.productImageMulter?.length !== 0) {
          try {
            data.productImageMulter?.map((i: string) => {
              deleteImage(nameFile.products, i);
            });
          } catch (e) {
            console.error('Lỗi !!! Không tìm thấy đường dẫn để xóa ảnh');
          }
        }
        return products.findByIdAndDelete({ _id: data?._id });
      })
      .then(() => {
        return res.status(200).json({ mess: 'Xóa sản phẩm thành công.' });
      })
      .catch((err: any) => {
        next(err);
        return res.status(400).json({ mess: 'Không tìm thấy id của sản phẩm.' });
      });
  }

  //[DELETE] Xóa nhiều sản phẩm cùng lúc theo id
  async deleteProducts(req: Request, res: Response, next: any) {
    const { ids }: { ids: any[] | string } = req.body;
    if (ids) {
      if (Array.isArray(ids)) {
        try {
          for (var iCount = 0; iCount < ids.length; iCount++) {
            const checkData = await products.findOne({ _id: ids[iCount] });
            if (checkData === null) {
              res.status(400).json({
                mess: 'Trong danh sách xóa có một số sản phẩm không tồn tại. Vui lòng kiểm tra lại.',
                id: ids[iCount],
              });
              continue;
            }
          }

          for (var iCount = 0; iCount < ids.length; iCount++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            await products.findByIdAndDelete({ _id: ids[iCount] }).then((data: any) => {
              data.productImageMulter?.map((i: string) => {
                deleteImage(nameFile.products, i);
              });
            });
          }
          return res.status(200).json({ mess: 'Xóa sản phẩm thành công.' });
        } catch (error) {
          return res
            .status(400)
            .json({ mess: 'Trong danh sách xóa có một số sản phẩm không tồn tại. Vui lòng kiểm tra lại.' });
        }
      } else {
        products
          .findById(ids)
          .then((data: any) => {
            if (data.productImageMulter?.length !== 0) {
              try {
                data.productImageMulter?.map((i: string) => {
                  deleteImage(nameFile.products, i);
                });
              } catch (e) {
                console.error('Lỗi !!! Không tìm thấy đường dẫn để xóa ảnh');
              }
            }
            return products.findByIdAndDelete({ _id: data?._id });
          })
          .then(() => {
            return res.status(200).json({ mess: 'Xóa sản phẩm thành công.' });
          })
          .catch((err: any) => {
            next(err);
            return res.status(400).json({ mess: 'Không tìm thấy id của sản phẩm.' });
          });
      }
    } else {
      return res.status(400).json({ mess: 'Không thể xóa danh sách sản phẩm khi không có id nào' });
    }
  }

  //[PATCH] Sửa sản phẩm theo id
  async EditProduct(req: Request, res: Response, next: any) {
    const { id } = req.params;
    const { productImage, productImageDetail }: any = req.files;

    const dataOld = await products.findOne({ _id: id });
    if (dataOld) {
      if (dataOld.productImageMulter?.length !== 0) {
        if (productImage && productImageDetail) {
          await dataOld.productImageMulter?.map((i: string) => {
            deleteImage(nameFile.products, i);
          });

          const dataArrayImageMulter: string[] = [];
          const dataArrayImage: string[] = [];
          req.body.productImage = 'http://' + process.env.URL + `/${nameFile.products}/` + productImage[0]?.filename;
          dataArrayImageMulter.push(productImage[0]?.filename);
          productImageDetail?.map((item: any) => {
            dataArrayImage.push('http://' + process.env.URL + `/${nameFile.products}/` + item?.filename);
            dataArrayImageMulter.push(item?.filename);
          });
          req.body.productImageDetail = dataArrayImage;
          req.body.productImageMulter = dataArrayImageMulter;
        } else if (productImage && productImageDetail === undefined) {
          deleteImage(nameFile.products, dataOld.productImageMulter[0]);
          req.body.productImage = 'http://' + process.env.URL + `/${nameFile.products}/` + productImage[0]?.filename;
          dataOld.productImageMulter[0] = productImage[0]?.filename;
          req.body.productImageMulter = [...dataOld.productImageMulter];
        } else if (productImageDetail && productImage === undefined) {
          const ImageOld = dataOld.productImageMulter[0];
          await dataOld.productImageMulter?.map((i: string) => {
            deleteImage(nameFile.products, i);
          });

          const dataArrayImage: string[] = [];
          const dataArrayImageMulter: string[] = [ImageOld];
          productImageDetail?.map((item: any) => {
            dataArrayImage.push('http://' + process.env.URL + `/${nameFile.products}/` + item?.filename);
            dataArrayImageMulter.push(item?.filename);
          });
          req.body.productImageMulter = dataArrayImageMulter;
        }
      } else {
        if (productImage || productImageDetail) {
          const dataArrayImageMulter: string[] = [];
          const dataArrayImage: string[] = [];
          req.body.productImage = 'http://' + process.env.URL + `/${nameFile.products}/` + productImage[0]?.filename;
          dataArrayImageMulter.push(productImage[0]?.filename);
          productImageDetail?.map((item: any) => {
            dataArrayImage.push('http://' + process.env.URL + `/${nameFile.products}/` + item?.filename);
            dataArrayImageMulter.push(item?.filename);
          });
          req.body.productImageDetail = dataArrayImage;
          req.body.productImageMulter = dataArrayImageMulter;
        }
      }
      products
        .findByIdAndUpdate({ _id: id }, req.body)
        .then((data: any) => {
          return res.status(200).json(data);
        })
        .catch((err: any) => {
          next(err);
        });
    } else {
      return res.status(200).json({ mess: 'Không tìm thấy id của sản phẩm cần sửa.', id: id });
    }
  }
}

module.exports = new ProductController();
