import { component } from './Model';

const mongodbCategory = require('mongoose');
const SchemaCategory = mongodbCategory.Schema;

const categorySchema = new SchemaCategory(
  {
    ...component,
    categoryName: { type: String, length: 255, require: true, default: null },
    categoryImage: {
      type: String,
      default: null,
    },
    categoryImageMulter: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// enum: ['STOCKING', 'OUT_OF_STOCK']

const categories = mongodbCategory.model('categories', categorySchema);
module.exports = categories;
