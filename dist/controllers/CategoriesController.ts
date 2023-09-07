/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { uploadImages } from '../utils/firebase/funcFireBase';
import { mapIndex } from './Type';
import { nameFile } from '../styles';
const CategoriesModel = require('../models/CategoriesModel');

class CategoriesController {
    //GET /categories
    async index(req: Request, res: Response, next: any) {
        try {
            CategoriesModel
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
    async createCategories(req: Request, res: Response, next: any) {
        try {
            const dataFile = await uploadImages(req?.file, `images/${nameFile.categories}`);
            req.body.categoryImageMulter = dataFile.nameFile;

            req.body.categoryImage = dataFile.downloadURL;

            await mapIndex('CT', CategoriesModel, req);
            const dataCategories = new CategoriesModel(req.body);
            dataCategories
                .save()
                .then(() => {
                    return res.status(200).json({ mess: 'Thêm thể loại thành công.' });
                })
                .catch((err: any) => next(err));
        } catch (error: any) {
            return res.status(400).send(error?.message);
        }
    }
}

module.exports = new CategoriesController();
