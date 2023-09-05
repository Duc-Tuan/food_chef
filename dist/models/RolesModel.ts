import { component } from './Model';

const mongodbRoles = require('mongoose');
const SchemaRole = mongodbRoles.Schema;

const Roleschema = new SchemaRole(
  {
    ...component,
    roleName: {
      type: String,
      require: true,
      length: 255,
      enum: ['Products', 'Users', 'Categories', 'Orders', 'Status', 'Promotions'],
    },
    roleNameChildren: {
      type: String,
      require: true,
      length: 255,
      enum: [
        'CreateProducts',
        'CreateUsers',
        'CreateCategories',
        'CreateOrders',
        'CreateStatus',
        'CreatePromotions',

        'DeleteProducts',
        'DeleteUsers',
        'DeleteCategories',
        'DeleteOrders',
        'DeleteStatus',
        'DeletePromotions',

        'EditProducts',
        'EditUsers',
        'EditCategories',
        'EditOrders',
        'EditStatus',
        'EditPromotions',
      ],
    },
  },
  {
    timestamps: true,
  },
);

const Role = mongodbRoles.model('Roles', Roleschema);
module.exports = Role;
