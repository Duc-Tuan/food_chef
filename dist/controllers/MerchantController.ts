/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { deleteFile, uploadImages } from '../utils/firebase/funcFireBase';
import { mapIndex } from './Type';
import { nameFile } from '../styles';
const MerchantModel = require('../models/MerchantModel');

class MerchantController {
    //GET /categories
    async index(req: Request, res: Response, next: any) {
        try {
            MerchantModel
                .find(undefined, { merchantImageMulter: 0 })
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


    //PUT /categories
    async createMerchant(req: Request, res: Response, next: any) {
        try {
            const dataFile = await uploadImages(req?.file, `images/${nameFile.merchant}`);
            req.body.merchantImageMulter = dataFile.nameFile;

            req.body.merchantImage = dataFile.downloadURL;

            await mapIndex('MRC', MerchantModel, req);
            const dataMerchant = new MerchantModel(req.body);
            dataMerchant
                .save()
                .then(() => {
                    return res.status(200).json({ mess: 'Thêm thông tin cửa hàng thành công.' });
                })
                .catch((err: any) => next(err));
        } catch (error: any) {
            return res.status(400).send(error?.message);
        }
    }

    async editMerchant(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const check = await MerchantModel.findById(id);
            if (check) {
                console.log(check?.merchantImageMulter);

                if (req?.file) {
                    await deleteFile(check?.merchantImageMulter);

                    const dataFile = await uploadImages(req?.file, `images/${nameFile.merchant}`);
                    req.body.merchantImageMulter = dataFile.nameFile;

                    req.body.merchantImage = dataFile.downloadURL;
                }
                MerchantModel.findByIdAndUpdate({ _id: id }, req.body).then(() => {
                    return res.status(200).json({ status: true, mess: 'Cập nhật thông tin cửa hàng thành công.' });
                });
            } else {
                return res.status(404).json({ status: false, mess: 'Không thể tìm thấy id của sản phẩm.' });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MerchantController();
