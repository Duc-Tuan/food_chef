import { component } from './Model';

const mongodbShiper = require('mongoose');
const SchemaShiper = mongodbShiper.Schema;

const shiperSchema = new SchemaShiper(
  {
    ...component,
    shippername: { type: String, length: 255, require: true, default: null },
    shipperphone: { type: String, length: 255, require: true, default: null },
    shipperfee: { type: Number, length: 100, require: true, default: 0 },
    shipperunit: { type: String, length: 100, require: true, default: null },
    shiperImage: {
      type: String,
      default: null,
    },
    shiperImageMulter: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const shiper = mongodbShiper.model('shipers', shiperSchema);
module.exports = shiper;
