/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { uploadImages } from '../utils/firebase/funcFireBase';
import { mapIndex } from './Type';
const BannrsModel = require('../models/BannrsModel');

class BannerController {
    //GET /categories
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


    //PUT /categories
    async createBanners(req: Request, res: Response, next: any) {
        try {
            const dataFile = await uploadImages(req?.file, 'images/banners');
            req.body.bannerImageMulter = dataFile.nameFile;

            req.body.bannerImage = dataFile.downloadURL;

            await mapIndex('BN', BannrsModel, req);
            const dataCategories = new BannrsModel(req.body);
            dataCategories
                .save()
                .then(() => {
                    return res.status(200).json({ mess: 'Thêm quảng cáo thành công.' });
                })
                .catch((err: any) => next(err));
        } catch (error: any) {
            return res.status(400).send(error?.message);
        }
    }
}

module.exports = new BannerController();
