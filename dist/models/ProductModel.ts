import { component } from './Model';

const mongodbProduct = require('mongoose');
const SchemaProducts = mongodbProduct.Schema;

const ProductSchema = new SchemaProducts(
  {
    ...component,
    productName: { type: String, length: 255, require: true },
    productUnit: { type: String, length: 255, default: null },
    productPromotion: { type: SchemaProducts.Types.ObjectId, ref: 'Promotions', default: null },
    productCategory: { type: SchemaProducts.Types.ObjectId, ref: 'Categories', default: null },
    productDesc: { type: String, length: 255, default: null },
    productDescribes: { type: String, default: null },
    productPrice: { type: Number, require: true, length: 15 },
    productQty: { type: Number, require: true, length: 15 },
    productSource: { type: String, require: null, length: 255 },
    productWarehouse: { type: Number, require: true, length: 15 },
    productStatus: { type: SchemaProducts.Types.ObjectId, default: null, ref: 'StatusProducts' },
    productImage: {
      type: String,
      default: null,
    },
    productImageDetail: [
      {
        type: String,
        default: null,
      },
    ],
    productImageMulter: [
      {
        type: String,
        default: null,
      },
    ],
    productComment: {
      type: SchemaProducts.Types.ObjectId,
      default: null,
      ref: 'Comments',
    },
  },
  {
    timestamps: true,
  },
);

// enum: ['STOCKING', 'OUT_OF_STOCK']

const Products = mongodbProduct.model('Products', ProductSchema);
module.exports = Products;
