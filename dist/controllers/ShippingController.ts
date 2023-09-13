/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { uploadImages } from '../utils/firebase/funcFireBase';
import { nameFile } from '../styles';
import { mapIndex } from './Type';
import { historyActions } from '../utils/others/historyActions';
const ShipingModel = require('../models/ShipingModel');

class ShippingsController {
    //GET /shippings
    async index(req: Request, res: Response, next: any) {
        try {
            var { page, pageSize, query } = req.query;
            let dataSearch: any = undefined;
            let queryData: any = undefined;

            // query data search
            if (query) {
                dataSearch = { $regex: query, $options: 'i' };
                queryData = {
                    $or: [
                        { shippername: dataSearch },
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

                ShipingModel
                    .find(queryData, { shiperImageMulter: 0, index: 0 })
                    .skip(skipNumber)
                    .sort({ index: -1 })
                    .limit(pageSize)
                    .then((data: any) => {
                        ShipingModel
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
                ShipingModel
                    .find(undefined, { shiperImageMulter: 0, index: 0 })
                    .sort({ index: -1 })
                    .then((data: any) => {
                        return res.status(200).json(data);
                    })
                    .catch((err: any) => {
                        return next(err);
                    });
            }
        } catch (error) {
            next(error);
        }
    }

    //GET /shippings/:id
    async indexDetail(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const shippings = await ShipingModel
                .findOne({ _id: id }, { shiperImageMulter: 0, index: 0 })
                .sort({ index: -1 });
            if (shippings) {
                return res.status(200).json(shippings);
            }
            return res.status(200).json({ status: false, mess: 'Hiện không có thông tin của đối tác này.' });
        } catch (error) {
            return next(error);
        }
    }

    //PUT /shippings/:id
    async createShipping(req: Request, res: Response, next: any) {
        try {
            const dataFile = await uploadImages(req?.file, `images/${nameFile.shippers}`);
            req.body.shiperImage = dataFile.downloadURL;
            req.body.shiperImageMulter = dataFile.nameFile;
            await mapIndex('SPE', ShipingModel, req);
            const shipingNew = new ShipingModel(req.body);
            await shipingNew.save();
            const isAction = await historyActions(req, 'Đã thêm mới đối tác vận chuyển', 'shipers', shipingNew?.code, shipingNew?._id);
            if (!isAction?.status) {
                return res.status(400).json(isAction);
            }
            return res.status(200).json({ status: true, mess: 'Thêm đối tác vận chuyển thành công.' });
        } catch (error) {
            return next(error);
        }
    }

    //DELETE /shippings/:id
    async deleteShipping(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const isShipping = await ShipingModel.findById({ _id: id });
            if (isShipping) {
                await historyActions(req, 'Đã xóa đối tác vận chuyển', 'shipers', isShipping?.code);
                return ShipingModel.findByIdAndDelete({ _id: isShipping?._id }).then(() => {
                    return res.status(200).json({ status: true, mess: 'Xóa đối tác vận chuyển thành công.' });
                });

            } else {
                return res.status(400).json({ status: false, mess: 'Xóa đối tác vận chuyển thất bại.' });
            }
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new ShippingsController();
