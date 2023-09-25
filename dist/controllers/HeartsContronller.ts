/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { mapIndex } from './Type';
import { checkProduct, checkUser } from '../utils/others/checkModels';
const HeartModel = require('../models/HeartModel');
const ProductModel = require('../models/ProductModel');

class AddressOrderController {
    //POST 
    async createHeart(req: Request, res: Response, next: any) {
        try {
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                const { products_id } = req.body;
                const isHeart = await HeartModel.findOne({ heart_useId: isUser?.id });
                const isProduct = await checkProduct(products_id);
                if (isProduct?.status) {
                    if (isHeart) {
                        const dataHeartsOld = [...isHeart?.heart_content];
                        const isEmty = dataHeartsOld?.some((i: any) => i.toString() === isProduct?.id.toString());
                        let dataHeartsNews: any[] = [];
                        if (isEmty) {
                            const dataRemove: any[] = dataHeartsOld?.filter((i: any) => i.toString() !== isProduct?.id.toString())
                            dataHeartsNews = dataRemove;
                        } else {
                            dataHeartsOld.unshift(isProduct?.id);
                            dataHeartsNews = dataHeartsOld;
                        }
                        await HeartModel.findOneAndUpdate({ heart_useId: isUser?.id }, { heart_content: dataHeartsNews });
                        return res.status(200).json({ status: true, mess: 'Đã cập nhật mục ưa thích thành công.' });
                    }
                    req.body.heart_useId = isUser?.id;
                    req.body.heart_content = [isProduct?.id];
                    await mapIndex('HEA', HeartModel, req);
                    const heartNews = new HeartModel(req.body);
                    await heartNews.save();
                    return res.status(200).json({ status: true, mess: 'Đã cập nhật mục ưa thích thành công..' });
                } else {
                    return res.status(400).json({ status: false, mess: 'Không tìm thấy sản phẩm.' });
                }
            } else {
                return res.status(400).json(isUser);
            }
        } catch (error) {
            return res.status(400).json({ status: false, mess: 'Không tìm thấy sản phẩm.' });
        }
    }

    //GET 
    async index(req: Request, res: Response, next: any) {
        try {
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                return HeartModel
                    .findOne({ heart_useId: isUser?.id }, { heart_useId: 0, index: 0 })
                    .then((data: any) => {
                        return res.status(200).json(data);
                    })
                    .catch((err: any) => {
                        return next(err);
                    });
            }
            return res.status(400).json(isUser);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new AddressOrderController();
