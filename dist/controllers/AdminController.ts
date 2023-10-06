/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from 'express';
import { mapIndex } from './Type';
import { checkAccountAdmin, checkEmployeeRights } from '../utils/others/checkModels';
import { converDataUser } from '../utils/others/converData';
import { createTokens, validateToken } from '../jwt';
import { encodePass } from '../utils/others/encode';
const RolesModel = require('../models/RolesModel');
const UsersModel = require('../models/UsersModel');
const CartsModel = require('../models/CartsModel');

class BannerController {
    //GET /Roles/get
    async index(req: Request, res: Response, next: any) {
        try {
            var { page, pageSize, query } = req.query;
            let dataSearch: any = undefined;
            let queryData: any = undefined;

            if (query) {
                dataSearch = { $regex: query, $options: 'im' };
                queryData = {
                    $or: [
                        { roleTitle: dataSearch },
                        { code: dataSearch }
                    ],
                };
            }


            if (page || pageSize) {
                var skipNumber: number = 0;
                const pageSizeNew = Number(pageSize);
                let pageNew = Number(page);
                if (pageNew <= 1) pageNew = 1;
                skipNumber = (pageNew - 1) * pageSizeNew;

                RolesModel
                    .find(queryData, { index: 0 })
                    .skip(skipNumber)
                    .sort({ index: -1 })
                    .limit(pageSize)
                    .then((data: any) => {
                        RolesModel
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
                RolesModel
                    .find(queryData, { index: 0 })
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

    //POST /login
    async login(req: Request, res: Response, next: any) {
        const { password, usename } = req.body;
        const hiddenData = {
            userPassword: 0,
            userType: 0,
            index: 0,
            __v: 0,
            userImageMulter: 0,
            userCodeReset: 0,
        };
        try {
            const token: string = String(req?.headers['x-food-access-token']);
            console.log('tokenHeader: ', token);
            let dataTokenNew: string | undefined = undefined;
            let dataLogin: any;
            if (token && (password === undefined || usename === undefined)) {
                // const token = tokenHeader.slice(7);
                const dataValidate = validateToken(token);
                if (dataValidate?.status) {
                    dataLogin = await UsersModel.findById({ _id: dataValidate?.id, userType: "Admin" }, hiddenData).populate('userRole');
                } else {
                    return res.status(400).json(dataValidate);
                }
            } else {
                req.body.userPassword = encodePass(password);
                dataLogin = await UsersModel.findOne({ userName: usename, userPassword: req.body.userPassword, userType: "Admin" }, hiddenData).populate('userRole');
                dataTokenNew = createTokens({ id: dataLogin?._id });
            }
            if (!dataLogin) {
                return res.status(404).json({ status: false, mess: 'Thông tin đăng nhập không chính xác.' });
            }

            const dataPermission: string[] = [];
            dataLogin?.userRole?.map((i: any) => dataPermission.push(...i?.roleName));
            dataLogin.userRoles = dataPermission;

            return res.status(200).json({ data: converDataUser(dataLogin), status: true, token: dataTokenNew ?? token });
        } catch (error) {
            next(error);
        }
    }

    //[PUT] đăng ký tài khoản
    async createUser(req: Request, res: Response, next: any) {
        try {
            const { password, usename, userEmail } = req.body;
            if (password && usename && userEmail) {
                req.body.userType = 'Admin';
                await mapIndex('US', UsersModel, req);
                const checkName = await UsersModel.findOne({ userName: usename, userType: 'Admin' });
                if (checkName === null) {
                    req.body.userPassword = encodePass(password);
                    req.body.userName = usename;
                    const dataUser = new UsersModel(req.body);
                    return dataUser
                        .save()
                        .then(async (data: any) => {
                            const dataConver = {
                                id: data?._id,
                            };
                            await mapIndex('CAR', CartsModel, req);
                            req.body.cartdata = [];
                            req.body.cartuserid = data?._id;
                            await new CartsModel(req.body).save();
                            return createTokens(dataConver);
                        }).then((data: any) => {
                            return res.status(200).json({ status: true, mess: 'Đăng ký tài khoản thành công thành công.', token: data });
                        })
                        .catch((err: any) => next(err));
                } else {
                    return res.status(200).json({ status: false, mess: 'Tên tài khoản đã tồn tại. Vui lòng chọn tài tên khác' });
                }
            } else if (!userEmail) {
                return res.status(200).json({ status: false, mess: 'Không được để trống trường email.' });
            } else {
                return res.status(200).json({ status: false, mess: 'Không được để trống mật khẩu hoặc tài khoản.' });
            }
        } catch (error) {
            next(error);
        }
    }

    //GET nhân viên
    async getAll(req: Request, res: Response, next: any) {
        try {
            const isCheck: any = await checkEmployeeRights(req, "ViewStaff");
            const { roles, ...orther } = isCheck
            if (isCheck?.status) {
                var { page, pageSize, query } = req.query;
                let dataSearch: any = undefined;
                let queryData: any = undefined;

                if (query) {
                    dataSearch = { $regex: query, $options: 'im' };
                    queryData = {
                        $or: [
                            { userNickname: dataSearch },
                            { userName: dataSearch },
                            { userEmail: dataSearch },
                            { userPhone: dataSearch },
                            { code: dataSearch }
                        ],
                    };
                }


                if (page || pageSize) {
                    var skipNumber: number = 0;
                    const pageSizeNew = Number(pageSize);
                    let pageNew = Number(page);
                    if (pageNew <= 1) pageNew = 1;
                    skipNumber = (pageNew - 1) * pageSizeNew;

                    return UsersModel
                        .find({ userType: 'Admin', ...queryData }, { userPassword: 0, userCodeReset: 0, userImageMulter: 0 })
                        .skip(skipNumber)
                        .populate('userRole')
                        .sort({ index: -1 })
                        .limit(pageSize)
                        .then((data: any) => {
                            const dataConver = data?.map((d: any) => {
                                const dataPermission: string[] = [];
                                d?.userRole?.map((i: any) => dataPermission.push(...i?.roleName));
                                d.userRoles = dataPermission;
                                return converDataUser(d);
                            })

                            UsersModel
                                .countDocuments({ userType: 'Admin', ...queryData }, { userPassword: 0, userCodeReset: 0, userImageMulter: 0 })
                                .then((total: number) => {
                                    var totalPage: number = Math.ceil(total / pageSizeNew);
                                    return res.status(200).json({
                                        paganition: {
                                            totalPage: Number(totalPage),
                                            currentPage: Number(page),
                                            pageSize: Number(pageSize),
                                            totalElement: Number(total),
                                        },
                                        data: dataConver,
                                    });
                                })
                                .catch((error: any) => next(error));
                        });
                } else {
                    // get all
                    const checkData = await UsersModel.find({ userType: 'Admin' }, { userPassword: 0, userCodeReset: 0, userImageMulter: 0 }).populate('userRole');
                    const dataConver = checkData?.map((d: any) => {
                        const dataPermission: string[] = [];
                        d?.userRole?.map((i: any) => dataPermission.push(...i?.roleName));
                        d.userRoles = dataPermission;
                        return converDataUser(d);
                    })
                    return res.status(200).json(dataConver);
                }
            }
            return res.status(400).json(orther);

        } catch (error) {
            return next(error);
        }
    }

    //PUT /Roles/create
    async createRoles(req: Request, res: Response, next: any) {
        try {
            const isCheckAdmin = await checkAccountAdmin(req, res);
            const { roles, ...orther } = isCheckAdmin;
            if (isCheckAdmin?.status) {
                await mapIndex('PER', RolesModel, req);
                const dataRoles = new RolesModel(req.body);
                return dataRoles
                    .save()
                    .then(() => {
                        return res.status(200).json({ status: true, mess: 'Thêm quyền thành công.' });
                    })
                    .catch((err: any) => next(err));
            }

            return res.status(404).json(orther);

        } catch (error: any) {
            return res.status(400).send(error?.message);
        }
    }

    //POST /Roles/post
    async updateRoles(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const { roleName } = req.body;
            const isCheckRole = await RolesModel.findById({ _id: id });
            const isCheckAdmin = await checkAccountAdmin(req, res);

            const { roles, ...orther } = isCheckAdmin;

            if (isCheckRole && isCheckAdmin?.status) {
                await mapIndex('PER', RolesModel, req);
                return RolesModel.findByIdAndUpdate({ _id: id }, { roleName: roleName }).then(() => res.status(200).json({ status: true, mess: 'Cập nhật thành công' }))
            }

            return res.status(400).json(orther);
        } catch (error: any) {
            return next(error?.message);
        }
    }

    //DELETE /Roles/post
    async deleteRoles(req: Request, res: Response, next: any) {
        try {
            const { id } = req.params;
            const isCheckRole = await RolesModel.findById({ _id: id });
            const isCheckAdmin = await checkAccountAdmin(req, res);

            const { roles, ...orther } = isCheckAdmin;

            if (isCheckRole && isCheckAdmin?.status) {
                await mapIndex('PER', RolesModel, req);
                return RolesModel.findByIdAndDelete({ _id: id }).then(() => res.status(200).json({ status: true, mess: 'Xóa quyền thành công' }))
            }

            return res.status(400).json(orther);
        } catch (error: any) {
            return next(error?.message);
        }
    }
}

module.exports = new BannerController();
