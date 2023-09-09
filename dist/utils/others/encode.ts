/* eslint-disable import/no-extraneous-dependencies */
var CryptoJS = require('crypto-js');

const key = 'Đoán mật khẩu bằng mắt';

export const encodePass = (data: string | number) => {
  var ciphertext: string = CryptoJS.HmacSHA1(JSON.stringify(data), key).toString();
  return ciphertext;
};