/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { uploadImages } from '../utils/firebase/funcFireBase';
import { mapIndex } from './Type';
import { nameFile } from '../styles';
import { checkEmployeeRights } from '../utils/others/checkModels';
const BannrsModel = require('../models/BannrsModel');

class BannerController {
    //GET /banners
    async index(req: Request, res: Response, next: any) {
        try {
            BannrsModel
                .find(undefined, { categoryImageMulter: 0 })
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


    //PUT /banners
    async createBanners(req: Request, res: Response, next: any) {
        try {
            const isCheck: any = await checkEmployeeRights(req, "CreateBanners");
            const { roles, ...orther } = isCheck
            if (isCheck?.status) {
                const dataFile = await uploadImages(req?.file, `images/${nameFile.banners}`);
                req.body.bannerImageMulter = dataFile.nameFile;

                req.body.bannerImage = dataFile.downloadURL;

                await mapIndex('BN', BannrsModel, req);
                const dataCategories = new BannrsModel(req.body);
                return dataCategories
                    .save()
                    .then(() => {
                        return res.status(200).json({ status: true, mess: 'Thêm quảng cáo thành công.' });
                    })
                    .catch((err: any) => next(err));
            }
            return res.status(200).json(orther);
        } catch (error: any) {
            return res.status(400).send(error?.message);
        }
    }
}

module.exports = new BannerController();
