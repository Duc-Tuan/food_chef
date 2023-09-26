/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { mapIndex } from './Type';
import { checkUser } from '../utils/others/checkModels';
const AddressModel = require('../models/AddressModel');
const UsersModel = require('../models/UsersModel');

class AddressOrderController {
    //GET /addressOrder
    async index(req: Request, res: Response, next: any) {
        try {
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                var { page, pageSize, addressDefault } = req.query;
                let queryData: any = undefined;

                // query data search
                if (addressDefault) {
                    queryData = {
                        addressDefault: true,
                    };
                }

                var skipNumber: number = 0;
                // get page, pageSize, query and status data
                if (page || pageSize) {
                    const pageSizeNew = Number(pageSize);
                    let pageNew = Number(page);
                    if (pageNew <= 1) pageNew = 1;
                    skipNumber = (pageNew - 1) * pageSizeNew;

                    AddressModel
                        .find({ address_useId: isUser?.id }, { address_useId: 0, index: 0 })
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
                        .find({ address_useId: isUser?.id, ...queryData }, { address_useId: 0, index: 0 })
                        .sort({ index: -1 })
                        .then((data: any) => {
                            return res.status(200).json(data);
                        })
                        .catch((err: any) => {
                            return next(err);
                        });
                }
            } else {
                return res.status(400).json(isUser);
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
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                const checkData = await UsersModel.findById(isUser?.id);
                if (checkData) {
                    if (req.body?.addressDefault === true) {
                        await AddressModel.findOneAndUpdate({ addressDefault: true }, { addressDefault: false });
                    }
                    await mapIndex('ADR', AddressModel, req);
                    req.body.address_useId = checkData?._id;
                    const dataAddressOrder = new AddressModel(req.body);
                    dataAddressOrder
                        .save()
                        .then(() => {
                            return res.status(200).json({ status: true, mess: 'Thêm địa chỉ thành công.' });
                        })
                        .catch((err: any) => next(err));
                } else {
                    return res.status(400).json({ status: false, mess: 'Không tồn tại người dùng này. Cút!!!' });
                }
            } else {
                return res.status(400).json({ status: false, mess: 'Đăng nhập hết hạn. Vui lòng đăng nhập lại' });
            }
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

    // DELTE /addressOrder
    async deleteAddressOrder(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const check = await AddressModel.findById(id);
            if (check) {
                await AddressModel.findByIdAndDelete({ _id: id }).then(() => {
                    return res.status(200).json({ status: true, mess: 'Xóa địa chỉ thành công.' });
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
