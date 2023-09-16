import { component } from './Model';

const mongodbUsers = require('mongoose');
const SchemaUser = mongodbUsers.Schema;

const UserSchema = new SchemaUser(
  {
    ...component,
    userNickname: { type: String, length: 255, default: null },
    userType: { type: String, length: 255, default: 'User' },
    userRole: [{ type: SchemaUser.Types.ObjectId, ref: 'Roles', default: null }],
    userGender: { type: String, length: 255, default: 'Khác', enum: ['Nam', 'Nữ', 'Khác'] },
    userAdrressDesc: { type: String, length: 255, default: null },
    userProvinceCity: { type: String, length: 255, default: null },
    userDistrict: { type: String, length: 255, default: null },
    userCommune: { type: String, length: 255, default: null },
    userAge: { type: String, length: 100, default: null },
    userEmail: { type: String, length: 255, default: null },
    userPhone: { type: String, length: 255, default: null },
    userName: { type: String, require: true, length: 255 },
    userPassword: { type: String, require: true, length: 255 },
    userStatus: { type: Boolean, default: true },
    userCodeReset: { type: Number, default: null },
    userImage: {
      type: String,
      default: null,
    },
    userImageMulter: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongodbUsers.model('Users', UserSchema);
module.exports = User;
