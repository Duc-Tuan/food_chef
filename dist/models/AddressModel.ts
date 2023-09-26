import { component } from './Model';

const mongodbAddressOrder = require('mongoose');
const SchemaAddressOrder = mongodbAddressOrder.Schema;

const AddressSchemaOrder = new SchemaAddressOrder(
  {
    ...component,
    addressNameReceiver: { type: String, length: 255, require: true, default: null },
    addressOrganReceive: { type: String, length: 255, require: true, default: null },
    addressPhoneReceive: { type: String, length: 255, require: true, default: null },
    addressTimeReceive: { type: String, length: 255, require: true, default: null },
    addressDetail: { type: String, length: 255, require: true, default: null },
    addressWards: { type: String, length: 255, require: true, default: null },
    addressVillage: { type: String, length: 255, require: true, default: null },
    addressDistrict: { type: String, length: 255, require: true, default: null },
    addressCity: { type: String, length: 255, require: true, default: null },
    addressDefault: { type: Boolean, require: true, default: false },
    address_useId: {
      type: SchemaAddressOrder.Types.ObjectId,
      ref: 'users',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const addressOrder = mongodbAddressOrder.model('addressOrders', AddressSchemaOrder);
module.exports = addressOrder;
