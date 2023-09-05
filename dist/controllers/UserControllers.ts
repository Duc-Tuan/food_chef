import { Response, Request } from 'express';
import path from 'path';
import { nameFile } from '../styles';
import { mapIndex } from './Type';
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
    if (req.file) {
      req.body.userImage = 'http://' + process.env.URL + `/${nameFile.users}/` + req.file?.filename;
      req.body.userImageMulter = req.file?.filename;
    }
    await mapIndex('US', Users, req);
    const checkName = await Users.findOne({ userName: req.body.userName });
    if (checkName === null) {
      const dataUser = new Users(req.body);
      dataUser
        .save()
        .then(() => {
          return res.status(200).json({ mess: 'Đăng ký tài khoản thành công thành công.' });
        })
        .catch((err: any) => next(err));
    } else {
      if (req.file?.filename !== null) {
        try {
          const directoryPath =
            path.dirname(path.dirname(__dirname)) + `\\dist\\assets\\others\\${nameFile.users}\\${req.file?.filename}`;
          fs.unlinkSync(directoryPath);
        } catch (e) {
          console.error('Lỗi !!! Không tìm thấy đường dẫn để xóa ảnh');
        }
      }
      return res.status(400).json({ mess: 'Tên tài khoản đã tồn tại. Vui lòng chọn tài tên khác' });
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
