import { validateToken } from '../../jwt';
const UsersModel = require('../../models/UsersModel');
const ProductModel = require('../../models/ProductModel');
const CartsModel = require('../../models/cartsModel');

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