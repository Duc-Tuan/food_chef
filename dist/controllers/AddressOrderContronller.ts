/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { mapIndex } from './Type';
const AddressModel = require('../models/AddressModel');

class AddressOrderController {
    //GET /addressOrder
    async index(req: Request, res: Response, next: any) {
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

                AddressModel
                    .find()
                    .skip(skipNumber)
                    .sort({ index: -1 })
                    .limit(pageSize)
                    .then((data: any) => {
                        AddressModel
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
                AddressModel
                    .find()
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

    //GET /addressOrder detail
    async getDetail(req: Request, res: Response, next: any) {
        const { id } = req.params;
        try {
            AddressModel
                .findById(id)
                .then((data: any) => {
                    return res.status(200).json(data);
                })
                .catch((err: any) => {
                    return next(err);
                });
        } catch (error) {
            next(error);
        }
    }

    //PUT /addressOrder
    async createAddressOrder(req: Request, res: Response, next: any) {
        try {
            if (req.body?.addressDefault === true) {
                await AddressModel.findOneAndUpdate({ addressDefault: true }, { addressDefault: false });
            }
            await mapIndex('ADR', AddressModel, req);
            const dataAddressOrder = new AddressModel(req.body);
            dataAddressOrder
                .save()
                .then(() => {
                    return res.status(200).json({ mess: 'Thêm địa chỉ thành công.' });
                })
                .catch((err: any) => next(err));
        } catch (error: any) {
            return res.status(400).send(error?.message);
        }
    }

    // PATCH /addressOrder
    async editAddressOrder(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const check = await AddressModel.findById(id);
            if (check) {
                if (req.body?.addressDefault === true) {
                    await AddressModel.findOneAndUpdate({ addressDefault: true }, { addressDefault: false });
                }
                AddressModel.findByIdAndUpdate({ _id: id }, req.body).then(() => {
                    return res.status(200).json({ status: true, mess: 'Cập nhật địa chỉ thành công.' });
                });
            } else {
                return res.status(404).json({ status: false, mess: 'Không thể tìm thấy id của địa chỉ.' });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AddressOrderController();
