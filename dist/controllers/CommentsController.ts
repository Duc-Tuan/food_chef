/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { checkComment, checkProduct, checkUser } from '../utils/others/checkModels';
import { mapIndex } from './Type';
import { CommentContructor } from '../constructors/CommentContructor';
const CommentsModel = require('../models/CommentsModel');

class CommentsController {
    //GET /comments
    async index(req: Request, res: Response, next: any) {
        try {
            const { productId, userId } = req.body;
            const { page, pageSize } = req.query;
            const isProduct = await checkProduct(productId);
            if (isProduct?.status) {
                var skipNumber: number = 0;
                const fillter = userId ? {
                    commentUserId: userId,
                } : undefined;
                if (page || pageSize) {
                    const pageSizeNew = Number(pageSize);
                    let pageNew = Number(page);
                    if (pageNew <= 1) pageNew = 1;
                    skipNumber = (pageNew - 1) * pageSizeNew;

                    return CommentsModel
                        .find({ commentProductId: isProduct?.id, ...fillter })
                        .populate('commentUserId')
                        .skip(skipNumber)
                        .sort({ index: -1 })
                        .limit(pageSize)
                        .then((data: any) => {
                            CommentsModel
                                .countDocuments({ commentProductId: isProduct?.id, ...fillter })
                                .then((total: number) => {
                                    var totalPage: number = Math.ceil(total / pageSizeNew);
                                    const result: any[] = [];
                                    data?.map((i: any) => {
                                        const commentContruc = new CommentContructor(i?._id, i?.code, {
                                            userNickname: i?.commentUserId?.userNickname,
                                            userImage: i?.commentUserId?.userImage,
                                        }, i?.componentContent, i?.createdAt, i?.updatedAt);
                                        return result.push(commentContruc);
                                    });
                                    return res.status(200).json({
                                        paganition: {
                                            totalPage: Number(totalPage),
                                            currentPage: Number(page),
                                            pageSize: Number(pageSize),
                                            totalElement: Number(total),
                                        },
                                        data: result,
                                    });
                                })
                                .catch((error: any) => next(error));
                        });
                } else {
                    return CommentsModel
                        .find({ commentProductId: isProduct?.id, ...fillter })
                        .populate('commentUserId')
                        .sort({ index: -1 })
                        .then((data: any) => {
                            const result: any[] = [];
                            data?.map((i: any) => {
                                const commentContruc = new CommentContructor(i?._id, i?.code, {
                                    userNickname: i?.commentUserId?.userNickname,
                                    userImage: i?.commentUserId?.userImage,
                                }, i?.componentContent, i?.createdAt, i?.updatedAt);
                                return result.push(commentContruc);
                            });
                            return res.status(200).json(result);
                        });
                }
            }
            return res.status(400).json(isProduct);
        } catch (error) {
            return next(next);
        }
    }

    //PUT /comments
    async createComment(req: Request, res: Response, next: any) {
        try {
            const { productId, content } = req.body;
            const isProduct = await checkProduct(productId);
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            if (isUser?.status && isProduct?.status) {
                await mapIndex('CMM', CommentsModel, req);
                req.body.componentContent = content;
                req.body.commentProductId = isProduct?.id;
                req.body.commentUserId = isUser?.id;

                const commentNew = new CommentsModel(req.body);
                await commentNew.save();
                return res.status(400).json({ status: true, mess: 'Gửi bình luận thành công.' });
            }
            return res.status(400).json(!isUser?.status ? isUser : isProduct);
        } catch (error) {
            next(next);
        }
    }

    //DELETE /comments
    async deleteComment(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            const isComment = await checkComment(isUser?.id, id);
            if (isUser?.status && isComment?.status) {
                return CommentsModel.findByIdAndDelete({ _id: isComment?.id, commentUserId: isUser?.id })
                    .then(() => {
                        return res.status(200).json({ status: true, mess: 'Xóa bình luận thành công.' });
                    })
                    .catch((e: any) => next(e));
            }
            return res.status(400).json(!isUser ? isUser : isComment);
        } catch (error) {
            next(next);
        }
    }

    //PATCH /comments
    async patchComment(req: Request, res: Response, next: any) {
        try {
            const { content } = req.body;
            const { id } = req.params;
            const token: string = String(req?.headers['x-food-access-token']);
            const isUser = await checkUser(token);
            const isComment = await checkComment(isUser?.id, id);
            if (isUser?.status && isComment?.status) {
                return CommentsModel.findByIdAndUpdate({ _id: isComment?.id }, { componentContent: content })
                    .then(() => {
                        return res.status(200).json({ status: true, mess: 'Cập nhật bình luận thành công.' });
                    })
                    .catch((e: any) => next(e));
            }
            return res.status(400).json(!isUser ? isUser : isComment);
        } catch (error) {
            next(next);
        }
    }
}

module.exports = new CommentsController();
