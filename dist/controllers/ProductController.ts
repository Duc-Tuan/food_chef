/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { nameFile } from '../styles';
import { uploadImages } from '../utils/firebase/funcFireBase';
import { deleteImage, mapIndex } from './Type';
import { historyActions } from '../utils/others/historyActions';
const products = require('../models/ProductModel');
const CommentsModel = require('../models/CommentsModel');

const getProducts = (res: Response,
  next: any,
  page: number,
  pageSize: number,
  queryData: any) => {
  var skipNumber: number = 0;

  if (page || pageSize) {
    const pageSizeNew = Number(pageSize);
    let pageNew = Number(page);
    if (pageNew <= 1) pageNew = 1;
    skipNumber = (pageNew - 1) * pageSizeNew;

    return products
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
    return products
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
};

class ProductController {
  //[GET] /like-products
  async getLikeProducts(req: Request, res: Response, next: any) {
    try {
      const { body, params } = req.body;
      var { page, pageSize, query, status } = params;
      const { ids } = body;

      console.log(req.body);

      let dataSearch: any = undefined;
      let queryData: any = undefined;

      if (ids && Array.isArray(ids) && query) {
        dataSearch = { $regex: query, $options: 'im' };
        queryData = {
          _id: { $in: ids },
          $or: [
            { productName: dataSearch },
            { productPrice: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
            { productQty: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
          ],
        };
      } else if (ids && Array.isArray(ids) && status && query) {
        dataSearch = { $regex: query, $options: 'i' };
        queryData = {
          _id: { $in: ids },
          productStatus: status,
          $or: [
            { productName: dataSearch },
            { productPrice: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
            { productQty: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
          ],
        };
      } else if (ids && Array.isArray(ids)) {
        queryData = {
          _id: { $in: ids },
        };
      }

      if (ids && !Array.isArray(ids)) return res.status(400).json({ status: false, mess: 'Truyền ids như lol bố đéo tìm. Cút!!!' });

      return getProducts(res, next, Number(page), Number(pageSize), queryData);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  //[GET] danh sách sản phẩm tất cả hoặc theo phân trang page&pageSize hoặc tìm kiếm theo query&status
  async index(req: Request, res: Response, next: any) {
    try {
      var { page, pageSize, query, status, categoryId } = req.query;

      let dataSearch: any = undefined;
      let queryData: any = undefined;
      // query data search
      if (status && query) {
        dataSearch = { $regex: query, $options: 'i' };
        queryData = {
          productStatus: status,
          $or: [
            { productName: dataSearch },
            { code: dataSearch },
            { productPrice: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
            { productQty: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
          ],
        };
      } else if (query && categoryId) {
        dataSearch = { $regex: query, $options: 'im' };
        queryData = {
          productCategory: categoryId,
          $or: [
            { productName: dataSearch },
            { code: dataSearch },
            { productPrice: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
            { productQty: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
          ],
        };
      } else if (query) {
        dataSearch = { $regex: query, $options: 'im' };
        queryData = {
          $or: [
            { productName: dataSearch },
            { code: dataSearch },
            { productPrice: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
            { productQty: typeof Number(query) === typeof 1 && !Number.isNaN(Number(query)) ? query : null },
          ],
        };
      } else if (status) {
        queryData = { productStatus: status };
      } else if (categoryId) {
        queryData = {
          productCategory: categoryId
        };
      }

      return getProducts(res, next, Number(page), Number(pageSize), queryData);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  //[GET] chi tiết sản phẩm
  getProduct(req: Request, res: Response, next: any) {
    try {
      const { id } = req.params;
      products
        .findOne({ _id: id }, { productImageMulter: 0 })
        .populate('productCategory')
        .then((data: any) => {
          const category = data?.productCategory?.categoryName;
          const { productCategory, ...orther } = data;
          const { _doc } = orther
          _doc.productCategory = category;
          return res.status(200).json(_doc)
        })
        .catch((err: any) => next(err));
    } catch (error) {
      next(error);
    }
  }

  //[PUT] Thêm mới sản phẩm
  async createProduct(req: Request, res: Response, next: any) {
    try {
      const dataArrayImageMulter: string[] = [];
      const dataFile = await uploadImages(req?.file, `images/${nameFile.products}`);
      dataArrayImageMulter.push(dataFile.nameFile);

      req.body.productImage = dataFile.downloadURL;
      req.body.productImageMulter = dataArrayImageMulter;
      req.body.productStatus = 'STOCKING';

      await mapIndex('SP', products, req);
      const dataProducts = new products(req.body);
      dataProducts
        .save()
        .then(async (data: any) => {
          await historyActions(req, 'Đã thêm mới sản phẩm', 'Products', data.code, data._id);
          return data;
        })
        .then(() => {
          return res.status(200).json({ status: true, mess: 'Thêm sản phẩm thành công.' });
        })
        .catch((err: any) => next(err));
    } catch (error: any) {
      return res.status(400).send(error?.message);
    }
  }

  //[DELETE] Xóa một sản phẩm theo id
  async deleteProduct(req: Request, res: Response, next: any) {
    const { id } = req.params;
    products
      .findById(id)
      .then(async (data: any) => {
        if (data.productImageMulter?.length !== 0) {
          try {
            data.productImageMulter?.map((i: string) => {
              deleteImage(nameFile.products, i);
            });
          } catch (e) {
            console.error('Lỗi !!! Không tìm thấy đường dẫn để xóa ảnh');
          }
        }
        const dataComments = await CommentsModel.find({ commentProductId: data?._id });
        const comments = dataComments?.map((i: any) => i?._id);
        await CommentsModel.deleteMany({ _id: comments });
        await historyActions(req, 'Đã xóa sản phẩm', 'Products', data.code, undefined);
        return products.findByIdAndDelete({ _id: data?._id });
      })
      .then(() => {
        return res.status(200).json({ status: true, mess: 'Xóa sản phẩm thành công.' });
      })
      .catch((err: any) => {
        next(err);
        return res.status(400).json({ status: false, mess: 'Không tìm thấy id của sản phẩm.' });
      });
  }

  //[DELETE] Xóa nhiều sản phẩm cùng lúc theo id
  async deleteProducts(req: Request, res: Response, next: any) {
    try {
      const { ids }: { ids: string[] } = req.body;
      const dataDelete: string[] = [];
      for (var iCount = 0; iCount < ids.length; iCount++) {
        const checkData = await products.findOne({ _id: ids[iCount] });
        if (checkData === null) {
          return res.status(400).json({
            mess: 'Trong danh sách xóa có một số sản phẩm không tồn tại. Vui lòng kiểm tra lại.',
            id: ids[iCount],
          });
        }
        dataDelete.push(checkData?.code);
      }
      return products.deleteMany({ _id: ids }).then(() => {
        dataDelete?.map((i: any) => historyActions(req, 'Đã xóa sản phẩm', 'Products', i, undefined));
        return res.status(200).json({ mess: 'Xóa danh sách sản phẩm thành công.', status: true });
      });
    } catch (error) {
      return next(error);
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
