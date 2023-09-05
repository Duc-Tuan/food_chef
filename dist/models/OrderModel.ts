import { component } from './Model';

const mongodbOrder = require('mongoose');
const SchemaOrder = mongodbOrder.Schema;

const OrderSchema = new SchemaOrder(
  {
    ...component,
    orderTotal: { type: Number, default: null, require: true },
    orderShippings: { type: Number, default: 0, require: true },
    orderContent: [
      {
        idProduct: { type: SchemaOrder.Types.ObjectId, ref: 'Products', default: null },
        orderPromotion: { type: Number, default: null, require: true },
        orderQty: { type: Number, default: null, require: true },
        orderPrice: { type: Number, default: null, require: true },
      },
    ],
    orderSatus: {
      type: String,
      default: 'WAIT_FOR_CONFIRMATION',
      enum: [
        'CANCELED',
        'WAIT_FOR_CONFIRMATION',
        'CONFIRMED',
        'DELIVERED_ONLY',
        'DELIVERED',
        'SUSS_DELIVERY',
        'ITEM_RECEIVED',
        'COMPLETED',
      ],
    },
    orderNotif: {
      type: Number,
      default:
        'Sản phẩm sẽ được giao đến bạn nhanh nhất có thể khoản 1 ngày nếu cùng Tỉnh/Thành phố. Đơn hàng có thể giao chậm hơn nếu khách tỉnh. Cảm ơn bạn đã tin tưởng và đặt hàng từ cửa hàng của chúng tôi!!!',
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const Orders = mongodbOrder.model('Orders', OrderSchema);
module.exports = Orders;
