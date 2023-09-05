import { component } from './Model';

const mongodelPromotions = require('mongoose');
const SchemaPromotion = mongodelPromotions.Schema;

const PromotionSchema = new SchemaPromotion(
  {
    ...component,
    promotionContentEvent: { type: String, require: true, length: 255 },
    promotionContent: { type: Number, require: true, length: 255 },
    promotionStatus: { type: Boolean, require: true, default: false },
    promotionTimeStatus: { type: Number, require: true, default: new Date().getTime() },
    promotionTimeEnd: { type: Number, require: true, default: null },
  },
  {
    timestamps: true,
  },
);

const promotion = mongodelPromotions.model('Promotions', PromotionSchema);
module.exports = promotion;
