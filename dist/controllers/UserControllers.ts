/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response } from 'express';
import { createTokens, validateToken } from '../jwt';
import { nameFile } from '../styles';
import { deleteFile } from '../utils/firebase/funcFireBase';
import { encodePass } from '../utils/others/encode';
import { mapIndex } from './Type';
import { sendEmail } from '../utils/others/sendEmail';
import { historyActions } from '../utils/others/historyActions';
import { checkAccountAdmin, checkCart, checkEmployeeRights, checkRoles } from '../utils/others/checkModels';
const Users = require('../models/UsersModel');
const AddressModel = require('../models/AddressModel');
const cartsModel = require('../models/CartsModel');
const RolesModel = require('../models/RolesModel');

class UsersController {
  //[GET] danh sách tài khoản tất cả hoặc theo phân trang page&pageSize hoặc tìm kiếm theo query&status
  async index(req: Request, res: Response, next: any) {
    try {
      const isCheck: any = await checkEmployeeRights(req, "ViewUsers");
      const { roles, ...orther } = isCheck;
      if (isCheck?.status) {
        var { page, pageSize, query, status } = req.query;
        let dataSearch: any = undefined;
        let queryData: any = undefined;

        // query data search
        if (status && query) {
          dataSearch = { $regex: query, $options: 'i' };
          queryData = {
            userStatus: status,
            $or: [
              { userNickname: dataSearch },
              { userEmail: dataSearch },
              { userPhone: dataSearch },
              { userName: dataSearch },
              { userProvinceCity: dataSearch },
            ],
          };
        } else if (query) {
          dataSearch = { $regex: query, $options: 'im' };
          queryData = {
            $or: [
              { userNickname: dataSearch },
              { userEmail: dataSearch },
              { userPhone: dataSearch },
              { userName: dataSearch },
              { userProvinceCity: dataSearch },
            ],
          };
        } else if (status) {
          queryData = { userStatus: status };
        }

        var skipNumber: number = 0;
        const hidden = {
          userImageMulter: 0,
          userPassword: 0,
          userRoles: 0,
          userType: 0,
          userRole: 0,
          userAdrressOrder: 0,
          userCodeReset: 0,
        }
        // get page, pageSize, query and status data
        if (page || pageSize) {
          const pageSizeNew = Number(pageSize);
          let pageNew = Number(page);
          if (pageNew <= 1) pageNew = 1;
          skipNumber = (pageNew - 1) * pageSizeNew;

          return Users.find({ userType: "User", ...queryData }, hidden)
            .skip(skipNumber)
            .sort({ index: -1 })
            .limit(pageSize)
            .then((data: any) => {
              Users.countDocuments({ userType: "User", ...queryData })
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
          return Users.find({ userType: "User", ...queryData }, hidden)
            .sort({ index: -1 })
            .then((data: any) => {
              return res.status(200).json(data);
            })
            .catch((err: any) => {
              return next(err);
            });
        }
      }
      return res.status(400).json(orther);
    } catch (error) {
      return next(error);
    }
  }

  //[PUT] đăng ký tài khoản
  async createUser(req: Request, res: Response, next: any) {
    try {
      const { password, usename } = req.body;
      if (password && usename) {
        if (req.file) {
          req.body.userImage = 'http://' + process.env.URL + `/${nameFile.users}/` + req.file?.filename;
          req.body.userImageMulter = req.file?.filename;
        }
        await mapIndex('US', Users, req);
        const checkName = await Users.findOne({ userName: usename });
        if (checkName === null) {
          req.body.userPassword = encodePass(password);
          req.body.userName = usename;
          const dataUser = new Users(req.body);
          dataUser
            .save()
            .then(async (data: any) => {
              const dataConver = {
                id: data?._id,
              };
              await mapIndex('CAR', cartsModel, req);
              req.body.cartdata = [];
              req.body.cartuserid = data?._id;
              await new cartsModel(req.body).save();
              return createTokens(dataConver);
            }).then((data: any) => {
              return res.status(200).json({ status: true, mess: 'Đăng ký tài khoản thành công thành công.', token: data });
            })
            .catch((err: any) => next(err));
        } else {
          return res.status(200).json({ status: false, mess: 'Tên tài khoản đã tồn tại. Vui lòng chọn tài tên khác' });
        }
      } else {
        return res.status(200).json({ status: false, mess: 'Không được để trống mật khẩu hoặc tài khoản.' });
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: any) {
    const { password, usename } = req.body;
    const hiddenData = {
      userPassword: 0,
      userType: 0,
      index: 0,
      userRole: 0,
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
          dataLogin = await Users.findById({ _id: dataValidate?.id }, hiddenData);
        } else {
          return res.status(400).json(dataValidate);
        }
      } else {
        req.body.userPassword = encodePass(password);
        dataLogin = await Users.findOne({ userName: usename, userPassword: req.body.userPassword }, hiddenData);
        dataTokenNew = createTokens({ id: dataLogin?._id });
      }
      if (!dataLogin) {
        return res.status(404).json({ status: false, mess: 'Thông tin đăng nhập không chính xác.' });
      }
      return res.status(200).json({ data: dataLogin, status: true, token: dataTokenNew ?? token });
    } catch (error) {
      next(error);
    }
  }

  //[DELETE] Xóa một tài khoản theo id
  async deleteUser(req: Request, res: Response, next: any) {
    const isCheck: any = await checkEmployeeRights(req, "DeleteUsers");
    const { roles, ...orther } = isCheck;
    if (isCheck?.status) {
      const { id } = req.params;
      Users.findById(id)
        .then(async (data: any) => {
          if (data.userImageMulter !== null) {
            try {
              await deleteFile(data?.userImageMulter);
              // const directoryPath =
              //   path.dirname(path.dirname(__dirname)) +
              //   `\\dist\\assets\\others\\${nameFile.users}\\${data.userImageMulter}`;
              // fs.unlinkSync(directoryPath);
            } catch (e) {
              console.error('Lỗi !!! Không tìm thấy đường dẫn để xóa ảnh');
            }
          }
          await AddressModel.deleteMany({ address_useId: data?._id });
          await cartsModel.deleteMany({ cartuserid: data?._id });
          return Users.findByIdAndDelete({ _id: data?._id });
        })
        .then(() => {
          return res.status(200).json({ status: true, mess: 'Xóa tài khoản thành công.' });
        })
        .catch((err: any) => {
          next(err);
          return res.status(400).json({ status: false, mess: 'Không tìm thấy id của tài khoản.' });
        });
    }
    return res.status(400).json(orther);
  }

  //[PATCH] update thông tin user
  async updateUser(req: Request, res: Response, next: any) {
    const { id } = req.params;
    const { userEmail, userName, code, index, userStatus, passwordOld, passwordNew, userPassword, userRole, userType, ...orther } = req.body;
    try {
      const checkUser = await Users.findOne({ _id: id });
      if (checkUser) {
        const isCheck = await checkAccountAdmin(req, next);
        if (isCheck?.roles === 'Admin' && isCheck?.status) {
          const isRoles: any = await checkRoles(userRole);
          if (isRoles?.status) {
            const dataUpdate = {
              userRole: isRoles?.id,
              userType,
            }

            return Users.findByIdAndUpdate({ _id: id }, dataUpdate)
              .then(() => { return res.status(200).json({ status: true, mess: 'Cập nhật thông tin thành công.' }); })
              .catch((err: any) => { return next(err); });

          }
          return res.status(400).json({ status: false, mess: 'Đã xảy ra lỗi. Vui lòng quay lại sau!!!' })
        }


        if (passwordOld) {
          const encodePassword = encodePass(passwordOld);
          const checkPassUser = await Users.findOne({ _id: id, userPassword: encodePassword });
          if (checkPassUser) {
            const encodePasswordNew = encodePass(passwordNew);
            Users.findByIdAndUpdate({ _id: id }, { userPassword: encodePasswordNew })
              .then(() => { return res.status(200).json({ status: true, mess: 'Đổi mật khẩu thành công.' }); })
              .catch((err: any) => { return next(err); });
          } else {
            return res.status(200).json({ mess: 'Mật khẩu cũ không chính xác.', status: false });
          }
        } else {
          if (req.body.userImage && checkUser?.userImageMulter !== null) {
            await deleteFile(checkUser?.userImageMulter);
          }
          Users.findByIdAndUpdate({ _id: id }, orther)
            .then(() => { return res.status(200).json({ status: true, mess: 'Cập nhật thông tin thành công.' }); })
            .catch((err: any) => { return next(err); });
        }
      } else {
        return res.status(404).json({ mess: 'Cập nhật thất bại.', status: false });
      }
    } catch (error) {
      return next(error);
    }
  }

  //[POST] reset password
  async resetPassword(req: Request, res: Response, next: any) {
    try {
      const { usename, email, code, id, passwordNew } = req.body;
      const codeUser: number = Math.floor(Math.random() * 100000);
      if (usename && email) {
        const dataUser = await Users.findOne({ userName: usename, userEmail: email });
        if (dataUser !== null) {
          const isEmail: any = await sendEmail(dataUser?.userEmail, `<h3>Mã code của bạn là: ${codeUser}</h3>`);
          if (isEmail?.status) {
            await Users.findByIdAndUpdate({ _id: dataUser?.id }, { userCodeReset: codeUser });
            isEmail.id = dataUser?.id;
            return res.status(200).json(isEmail);
          }
        } else {
          return res.status(200).json({ status: false, mess: 'Thông tin emal không chính xác.' });
        }
      } else if (code && id) {
        const isUser = await Users.findOne({ userCodeReset: Number(code), _id: id });
        if (isUser) {
          return res.status(200).json({ status: true, password: true });
        }
        return res.status(200).json({ status: false, mess: "Mã code không chính xác." });
      } else if (passwordNew && id) {
        const isUser = await Users.findOne({ _id: id });
        if (isUser?.userCodeReset !== null) {
          const pass = encodePass(passwordNew);
          await Users.findByIdAndUpdate({ _id: isUser?.id }, { userPassword: pass, userCodeReset: null });
          return res.status(200).json({ status: true, mess: 'Cập nhật mật khẩu thành công!!!', navigate: true });
        } else {
          return res.status(404).json({ status: false, mess: 'Cút ngay.' });
        }
      }
      return res.status(404).json({ status: false, mess: 'Cút' });
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = new UsersController();
