import { Request, Response } from 'express';
import path from 'path';
import { nameFile } from '../styles';
import { encodePass } from '../utils/others/encode';
import { mapIndex } from './Type';
import { createTokens, validateToken } from '../jwt';
const fs = require('fs');
const Users = require('../models/UsersModel');

class UsersController {
  //[GET] danh sách tài khoản tất cả hoặc theo phân trang page&pageSize hoặc tìm kiếm theo query&status
  index(req: Request, res: Response, next: any) {
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
    // get page, pageSize, query and status data
    if (page || pageSize) {
      const pageSizeNew = Number(pageSize);
      let pageNew = Number(page);
      if (pageNew <= 1) pageNew = 1;
      skipNumber = (pageNew - 1) * pageSizeNew;

      Users.find(queryData, {
        userImageMulter: 0,
        userPassword: 0,
        userType: 0,
        userRole: 0,
        userAdrressOrder: 0,
      })
        .skip(skipNumber)
        .sort({ index: -1 })
        .limit(pageSize)
        .then((data: any) => {
          Users.countDocuments(queryData)
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
      Users.find(queryData, {
        userImageMulter: 0,
        userPassword: 0,
        userType: 0,
        userRole: 0,
        userAdrressOrder: 0,
      })
        .sort({ index: -1 })
        .then((data: any) => {
          return res.status(200).json(data);
        })
        .catch((err: any) => {
          return next(err);
        });
    }
  }

  //[PUT] đăng ký tài khoản
  async createUser(req: Request, res: Response, next: any) {
    try {
      const { password, usename } = req.body;
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
            return createTokens(dataConver);
          }).then((data: any) => {
            return res.status(200).json({ mess: 'Đăng ký tài khoản thành công thành công.', token: data });
          })
          .catch((err: any) => next(err));
      } else {
        return res.status(400).json({ mess: 'Tên tài khoản đã tồn tại. Vui lòng chọn tài tên khác' });
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
    };
    try {
      const tokenHeader = req?.headers.authorization;
      let dataTokenNew: string | undefined = undefined;
      let dataLogin: any;
      if (tokenHeader && (password === undefined || usename === undefined)) {
        const token = tokenHeader.slice(7);
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
      return res.status(200).json({ data: dataLogin, status: true, token: dataTokenNew ?? tokenHeader?.slice(7) });
    } catch (error) {
      next(error);
    }
  }

  //[DELETE] Xóa một tài khoản theo id
  deleteUser(req: Request, res: Response, next: any) {
    const { id } = req.params;
    Users.findById(id)
      .then((data: any) => {
        if (data.userImageMulter !== null) {
          try {
            const directoryPath =
              path.dirname(path.dirname(__dirname)) +
              `\\dist\\assets\\others\\${nameFile.users}\\${data.userImageMulter}`;
            fs.unlinkSync(directoryPath);
          } catch (e) {
            console.error('Lỗi !!! Không tìm thấy đường dẫn để xóa ảnh');
          }
        }
        return Users.findByIdAndDelete({ _id: data?._id });
      })
      .then(() => {
        return res.status(200).json({ mess: 'Xóa sản phẩm thành công.' });
      })
      .catch((err: any) => {
        next(err);
        return res.status(400).json({ mess: 'Không tìm thấy id của sản phẩm.' });
      });
  }
}

module.exports = new UsersController();
