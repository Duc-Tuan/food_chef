import { component } from './Model';

const mongodbMerchant = require('mongoose');
const SchemaMerchant = mongodbMerchant.Schema;

const merchantSchema = new SchemaMerchant(
  {
    ...component,
    merchantName: { type: String, length: 255, require: true, default: null },
    merchantAddress: { type: String, length: 255, require: true, default: null },
    merchantEmail: { type: String, length: 255, require: true, default: null },
    merchantPhone: { type: String, length: 255, require: true, default: null },
    merchantTimeOpen: { type: String, length: 255, require: true, default: null },
    merchantLike: { type: Number, length: 10, require: true, default: null },
    merchantFollowing: { type: Number, length: 10, require: true, default: null },
    merchantFeedback: { type: Number, length: 10, require: true, default: null },
    merchantLocation: [{ type: String, length: 10, require: true, default: null }],
    merchantImage: {
      type: String,
      default: null,
    },
    merchantImageMulter: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const merchant = mongodbMerchant.model('merchant', merchantSchema);
module.exports = merchant;
