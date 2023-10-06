import { Request } from 'express';
import { validateToken } from '../../jwt';
const UsersModel = require('../../models/UsersModel');
const ProductModel = require('../../models/ProductModel');
const CartsModel = require('../../models/CartsModel');
const CommentsModel = require('../../models/CommentsModel');
const RolesModel = require('../../models/RolesModel');

export const checkUser = async (token: string) => {
  const dataValidate = validateToken(token);
  if (dataValidate?.status) {
    const checkData = await UsersModel.findById(dataValidate?.id);
    if (checkData) {
      return { status: true, id: checkData?._id };
    }
    return { status: false, mess: 'Không tìm tháy id người dùng này.' };
  } else {
    return dataValidate;
  }
};

export const checkProduct = async (id: string) => {
  const isProduct = await ProductModel.findById(id);
  if (isProduct) {
    return { status: true, id: isProduct?._id };
  } else {
    return { status: false, mess: 'không tìm tháy sản phẩm này.' };
  }
};

export const checkCart = async (idProduct: string, id: string) => {
  const isCart = await CartsModel.findOne({ cartuserid: id });
  const isEmty = isCart?.cartdata?.some((i: any) => (i?.productId).toString() === (idProduct).toString());
  return { status: isEmty };
};

export const checkComment = async (userId: string, id: string) => {
  const isComment = await CommentsModel.findOne({ _id: id, commentUserId: userId });
  if (isComment) {
    return { status: true, id: isComment?._id };
  }
  return { status: false, mess: 'Không tìm thấy bình luận này.' };
};

export const checkAccountAdmin = async (req: Request, next: any) => {
  try {
    const token: string = String(req?.headers['x-food-access-token']);
    const dataValidate = validateToken(token);
    if (dataValidate?.status) {
      const checkData = await UsersModel.findById(dataValidate?.id);
      if (checkData?.userType === 'Admin') {
        return { status: true, roles: 'Admin' };
      } else if (checkData?.userType === 'User') {
        return { status: true, roles: 'User' };
      }
      return { status: false, roles: 'Admin', mess: 'Không tìm tháy id người dùng này.' };
    } else {
      return {
        roles: 'Admin',
        ...dataValidate
      };
    }
  } catch (error) {
    return next(error);
  }
};

export const checkPermission = async (req: Request) => {
  try {
    const token: string = String(req?.headers['x-food-access-token']);
    const dataValidate = validateToken(token);
    if (dataValidate?.status) {
      const checkData = await UsersModel.findById(dataValidate?.id);
      if (checkData?.userType === 'Admin') {
        return { status: true, roles: 'Admin' };
      } else if (checkData?.userType === 'User') {
        return { status: true, roles: 'User' };
      }
      return { status: false, roles: 'Admin', mess: 'Không tìm tháy id người dùng này.' };
    } else {
      return {
        roles: 'Admin',
        ...dataValidate
      };
    }
  } catch (error) {
    return error;
  }
};

export const checkRoles = async (data: string[]) => {
  try {
    const isCheck = await RolesModel.find({ _id: { $in: data } });
    const ids = isCheck?.map((i: any) => i?._id);
    if (isCheck) {
      return { status: true, id: ids };
    }
    return { status: false, mess: 'Không tìm thấy quyền này.' };
  } catch (error) {
    return error;
  }
};

export const checkEmployeeRights = async (req: Request, permission: string) => {
  try {
    const token: string = String(req?.headers['x-food-access-token']);
    const dataValidate = validateToken(token);
    if (dataValidate?.status) {
      const checkData = await UsersModel.findById(dataValidate?.id).populate('userRole');
      const dataPermission: string[] = [];
      checkData?.userRole?.map((i: any) => dataPermission.push(...i?.roleName))
      const checkPermission: boolean = dataPermission?.some((i: any) => i.toString() === permission.toString());
      if (checkData?.userType === 'Admin' && checkPermission) {
        return { status: true, roles: 'Admin' };
      }
      return { status: false, roles: 'Admin', mess: 'Bạn không có quyền.' };
    } else {
      return {
        roles: 'Admin',
        ...dataValidate
      };
    }
  } catch (error) {
    return error;
  }
};