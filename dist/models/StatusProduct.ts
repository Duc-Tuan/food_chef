import { component } from './Model';

const mongodbStatusProduct = require('mongoose');
const SchemaStatusProduct = mongodbStatusProduct.Schema;

const StatusProductSchema = new SchemaStatusProduct(
  {
    ...component,
    statusName: { type: String, require: true, length: 255, enum: ['STOCKING', 'OUT_OF_STOCK'] },
  },
  {
    timestamps: true,
  },
);

// enum: ['STOCKING', 'OUT_OF_STOCK']

const StatusProduct = mongodbStatusProduct.model('StatusProducts', StatusProductSchema);
module.exports = StatusProduct;
