/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { mapIndex } from './Type';
const AddressModel = require('../models/AddressModel');

class AddressOrderController {
    //GET /addressOrder
    async index(req: Request, res: Response, next: any) {
        try {
            AddressModel
                .find()
                .sort({ index: -1 })
                .then((data: any) => {
                    return res.status(200).json(data);
                })
                .catch((err: any) => {
                    return next(err);
                });
        } catch (error) {
            return res.status(400).json(error);
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
