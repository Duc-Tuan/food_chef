/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { checkCart, checkProduct, checkUser } from '../utils/others/checkModels';
import { CartsContructor } from '../constructors/cartContructor';
const CartsModel = require('../models/CartsModel');
const ProductModel = require('../models/ProductModel');

class CartsController {
    //GET /carts
    async index(req: Request, res: Response, next: any) {
        try {
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                CartsModel
                    .find({ cartuserid: isUser?.id }, { index: 0, cartuserid: 0 })
                    .sort({ index: -1 })
                    .then(async (data: any) => {

                        const ids = data[0]?.cartdata?.map((i: any) => i?.productId);
                        const products = await ProductModel.find({ _id: [...ids] });

                        return { data, products };
                    }).then((data: any) => {
                        const dataCarts: any[] = [];
                        for (let i = 0; i < data?.products.length; i++) {
                            dataCarts.push({
                                _id: data?.products[i]._id,
                                productname: data?.products[i].productName,
                                productimage: data?.products[i].productImage,
                                productpromotion: data?.products[i].productPromotion,
                                productprice: data?.products[i].productPrice,
                                qty: data?.data[0]?.cartdata[i]?.qty,
                            });
                        }
                        const result = new CartsContructor(data?.data[0]?._id,
                            data?.data[0]?.code,
                            dataCarts,
                            data?.data[0]?.createdAt,
                            data?.data[0]?.updatedAt).data();
                        return res.status(200).json(result);
                    })
                    .catch((err: any) => {
                        return next(err);
                    });
            } else {
                return res.status(400).json(isUser);
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    //POST /carts
    async postCart(req: Request, res: Response, next: any) {
        try {
            const { productId, qty } = req.body;
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                const isCart = await CartsModel.findOne({ cartuserid: isUser?.id });
                if (isCart) {
                    const isProduct = await checkProduct(productId);
                    if (isProduct?.status) {
                        const isCartpost = await checkCart(isProduct?.id, isUser?.id);
                        if (isCartpost?.status) {
                            isCart.cartdata.map((i: any) => {
                                if ((i?.productId).toString() === (isProduct?.id).toString()) return i.qty += Number(qty);
                            });
                            await isCart.save();
                        } else {
                            isCart.cartdata.push({ productId: isProduct?.id, qty: Number(qty) });
                            await isCart.save();
                        }
                        return res.status(200).json({ status: true, mess: 'Thêm vào giỏ hàng thành công.' });
                    }
                    return res.status(400).json(isProduct);
                }
                return res.status(400).json({ status: false, mess: 'Không tìm thấy giỏ hàng của bạn.' });
            } else {
                return res.status(400).json(isUser);
            }
        } catch (error) {
            next(error);
        }
    }

    //DELETE /carts
    async deleteCart(req: Request, res: Response, next: any) {
        try {
            const { productId } = req.body;
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status) {
                const isCart = await CartsModel.findOne({ cartuserid: isUser?.id });
                if (isCart) {
                    const isCartpost = await checkCart(productId, isUser?.id);
                    if (isCartpost?.status) {
                        const dataNew = isCart.cartdata.filter((i: any) => (i?.productId).toString() !== productId);
                        isCart.cartdata = dataNew;
                        await isCart.save();
                        return res.status(200).json({ status: true, mess: 'Xóa sản phẩm trong giỏ hàng thành công.' });
                    } else {
                        return res.status(400).json({ status: false, mess: 'Không tìm thấy sản phẩm trong giỏ để xóa.' });
                    }
                }
                return res.status(400).json({ status: false, mess: 'Không tìm thấy giỏ hàng của bạn.' });
            } else {
                return res.status(400).json(isUser);
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CartsController();
