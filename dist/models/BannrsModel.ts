import { component } from './Model';

const mongodbBanner = require('mongoose');
const SchemaBanners = mongodbBanner.Schema;

const bannersSchema = new SchemaBanners(
  {
    ...component,
    bannerName: { type: String, length: 255, require: true, default: null },
    bannerLink: { type: String, length: 255, require: true, default: null },
    bannerImage: {
      type: String,
      default: null,
    },
    bannerImageMulter: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const banners = mongodbBanner.model('banners', bannersSchema);
module.exports = banners;
