import { component } from './Model';

const mongodbAddressOrder = require('mongoose');
const SchemaAddressOrder = mongodbAddressOrder.Schema;

const AddressSchemaOrder = new SchemaAddressOrder(
  {
    ...component,
    addressOrganReceive: { type: String, length: 255, require: true, default: null },
    addressPhoneReceive: { type: String, length: 255, require: true, default: null },
    addressTimeReceive: { type: String, length: 255, require: true, default: null },
    addressDetail: { type: String, length: 255, require: true, default: null },
    addressDefault: { type: Boolean, require: true, default: false },
  },
  {
    timestamps: true,
  },
);

const addressOrder = mongodbAddressOrder.model('addressOrders', AddressSchemaOrder);
module.exports = addressOrder;
