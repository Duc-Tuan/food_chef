import { component } from './Model';

const mongodbRoles = require('mongoose');
const SchemaRole = mongodbRoles.Schema;

const Roleschema = new SchemaRole(
  {
    ...component,
    roleTitle: {
      type: String,
      require: true,
      length: 255
    },
    roleName: [
      {
        type: String,
        require: true,
        length: 255,
        enum: [
          'ViewDashBoard',

          'ViewProducts',
          'ViewProducts',
          'ViewShipping',
          'ViewUsers',
          'ViewCategories',
          'ViewOrders',
          'ViewStatus',
          'ViewPromotions',
          'ViewRoles',
          'ViewStaff',

          'CreateProducts',
          'CreateShipping',
          'CreateUsers',
          'CreateCategories',
          'CreateBanners',
          'CreateOrders',
          'CreateStatus',
          'CreatePromotions',
          'CreateRoles',
          'CreateStaff',

          'DeleteProducts',
          'DeleteShipping',
          'DeleteUsers',
          'DeleteCategories',
          'DeleteBanners',
          'DeleteOrders',
          'DeleteStatus',
          'DeletePromotions',
          'DeleteRoles',
          'DeleteStaff',

          'EditProducts',
          'EditShipping',
          'EditUsers',
          'EditCategories',
          'EditOrders',
          'EditBanners',
          'EditStatus',
          'EditPromotions',
          'EditRoles',
          'EditStaff',
        ],
      }
    ],
  },
  {
    timestamps: true,
  },
);

const Role = mongodbRoles.model('Roles', Roleschema);
module.exports = Role;
