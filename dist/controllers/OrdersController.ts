/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { checkUser } from '../utils/others/checkModels';
import { historyActions } from '../utils/others/historyActions';
import { mapIndex } from './Type';
const OrderModel = require('../models/OrderModel');

class ShippingsController {
    //GET /orders
    async index(req: Request, res: Response, next: any) {
        try {
            var { page, pageSize, query } = req.query;
            let dataSearch: any = undefined;
            let queryData: any = undefined;
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);

            if (isUser?.status) {
                // query data search
                if (query) {
                    dataSearch = { $regex: query, $options: 'i' };
                    queryData = {
                        orderIdUser: isUser?.id,
                        $or: [
                            { code: dataSearch },
                        ],
                    };
                }

                var skipNumber: number = 0;
                // get page, pageSize, query and status data
                if (page || pageSize) {
                    const pageSizeNew = Number(pageSize);
                    let pageNew = Number(page);
                    if (pageNew <= 1) pageNew = 1;
                    skipNumber = (pageNew - 1) * pageSizeNew;

                    return OrderModel
                        .find(queryData, { orderIdShipping: 0, index: 0, orderIdUser: 0 })
                        .skip(skipNumber)
                        .sort({ index: -1 })
                        .limit(pageSize)
                        .then((data: any) => {
                            OrderModel
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
                    return OrderModel
                        .find({ orderIdUser: isUser?.id }, { orderIdShipping: 0, index: 0, orderIdUser: 0 })
                        .sort({ index: -1 })
                        .then((data: any) => {
                            return res.status(200).json(data);
                        })
                        .catch((err: any) => {
                            return next(err);
                        });
                }

            }
            return res.status(400).json(isUser);
        } catch (error) {
            next(error);
        }
    }

    //POST /orders
    async createOrder(req: Request, res: Response, next: any) {
        try {
            const { orderIdShipping, orderHistory, orderSatus, orderNotif, orderIdUser, orderPaymentMethods, ...other } = req.body;
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                await mapIndex('ORD', OrderModel, req);
                const data = {
                    index: req.body.index,
                    code: req.body.code,
                    orderIdUser: isUser?.id,
                    orderHistory: [
                        {
                            status: 'ORDER',
                            time: new Date().getTime(),
                        },
                    ],
                    ...other,
                };

                const orderNew = new OrderModel(data);
                await orderNew.save();
                const isAction = await historyActions(req, 'Đã đặt một đơn hàng', 'Orders', orderNew?.code, orderNew?._id);
                if (!isAction?.status) {
                    return res.status(400).json(isAction);
                }
                return res.status(200).json({ status: true, mess: 'Đặt đơn hàng thành công.' });
            }
            return res.status(400).json(isUser);
        } catch (error) {
            return next(error);
        }
    }

    //PATCH /orders
    async patchOrder(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                const dataUpdate = await OrderModel.findByIdAndUpdate({ _id: id }, { orderSatus: 'CANCELED' });
                const isAction = await historyActions(req, 'Đã hủy một đơn hàng', 'Orders', dataUpdate?.code, dataUpdate?._id);
                if (!isAction?.status) {
                    return res.status(400).json(isAction);
                }
                return res.status(200).json({ status: true, mess: 'Hủy đơn hàng thành công.' });
            }
            return res.status(400).json(isUser);
        } catch (error) {
            return next(error);
        }
    }

    //DELETE /orders
    async deleteOrder(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                const isOrder = await OrderModel.findOne({ _id: id, orderIdUser: isUser?.id });
                if (!isOrder) {
                    return res.status(400).json({ status: false, mess: 'Không tìm thấy id đơn hàng này.' });
                }
                if (isOrder?.orderSatus === 'CANCELED' || isOrder?.orderSatus === 'ITEM_RECEIVED') {
                    await OrderModel.findByIdAndDelete({ _id: isOrder?._id });
                    const isAction = await historyActions(req, 'Đã xóa một đơn hàng', 'Orders', isOrder?.code);
                    if (!isAction?.status) {
                        return res.status(400).json(isAction);
                    }
                    return res.status(200).json({ status: true, mess: 'Xóa đơn hàng thành công.' });
                } else {
                    return res.status(400).json({ status: false, mess: 'Xóa đơn hàng thất bại. Đơn hàng chỉ xóa được khi ở trạng thái "Đã hủy" hoặc "Hoàn thành"' });
                }
            }
            return res.status(400).json(isUser);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new ShippingsController();
