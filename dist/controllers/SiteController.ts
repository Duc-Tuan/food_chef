import { Request, Response } from 'express';
const products = require('../models/ProductModel');

class SiteController {
  index(req: Request, res: Response, next: any) {
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
  }
}

module.exports = new SiteController();
