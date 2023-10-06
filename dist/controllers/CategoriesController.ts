/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { uploadImages } from '../utils/firebase/funcFireBase';
import { mapIndex } from './Type';
import { nameFile } from '../styles';
import { checkEmployeeRights } from '../utils/others/checkModels';
const CategoriesModel = require('../models/CategoriesModel');

class CategoriesController {
    //GET /categories
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
                        { categoryName: dataSearch, },
                        { code: dataSearch, }
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

                CategoriesModel
                    .find(queryData, { categoryImageMulter: 0, index: 0 })
                    .skip(skipNumber)
                    .sort({ index: -1 })
                    .limit(pageSize)
                    .then((data: any) => {
                        CategoriesModel
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
                CategoriesModel
                    .find(queryData, { categoryImageMulter: 0, index: 0 })
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


    //PUT /categories
    async createCategories(req: Request, res: Response, next: any) {
        try {
            const isCheck: any = await checkEmployeeRights(req, "CreateCategories");
            const { roles, ...orther } = isCheck
            if (isCheck?.status) {
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
            }
            return res.status(400).json(orther)
        } catch (error: any) {
            return res.status(400).send(error?.message);
        }
    }
}

module.exports = new CategoriesController();
