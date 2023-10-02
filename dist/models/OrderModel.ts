import { component } from './Model';

const mongodbOrder = require('mongoose');
const SchemaOrder = mongodbOrder.Schema;

const OrderSchema = new SchemaOrder(
  {
    ...component,
    orderTotal: { type: Number, default: null, require: true },
    orderFeeShipping: { type: Number, default: 0, require: true },
    orderReceiverId: { type: SchemaOrder.Types.ObjectId, ref: 'addressOrders', default: null },
    orderIdShipping: { type: SchemaOrder.Types.ObjectId, ref: 'shipers', default: null },
    orderIdUser: { type: SchemaOrder.Types.ObjectId, ref: 'Users', default: null },
    orderReceiver: {
      addressNameReceiver: { type: String, default: null },
      addressOrganReceive: { type: String, default: null },
      addressPhoneReceive: { type: String, default: null },
      addressTimeReceive: { type: String, default: null },
      addressDetail: { type: String, default: null },
      addressWards: { type: String, default: null },
      addressVillage: { type: String, default: null },
      addressDistrict: { type: String, default: null },
      addressCity: { type: String, default: null },
    },
    orderContent: [
      {
        _id: { type: SchemaOrder.Types.ObjectId, ref: 'Products', default: null },
        name: { type: String, length: 255, default: null, require: true },
        image: { type: String, length: 255, default: null, require: true },
        promotion: { type: Number, default: null, require: true },
        qty: { type: Number, default: null, require: true },
        price: { type: Number, default: null, require: true },
      },
    ],
    orderHistory: [
      {
        status: {
          type: String,
          default: 'ORDER',
          enum: [
            'ORDER',
            'PREPARE',
            'BEING_SHIPPED',
            'DELIVERED',
          ],
        },
        time: { type: Number, default: new Date() },
      },
    ],
    orderSatus: {
      type: String,
      default: 'WAIT_FOR_CONFIRMATION',
      enum: [
        'WAIT_FOR_CONFIRMATION',
        'CONFIRMED',
        'DELIVERED_ONLY',
        'DELIVERED',
        'SUSS_DELIVERY',
        'COMPLETED',
        'CANCELED',
      ],
    },
    orderPaymentMethods: {
      method: {
        type: String,
        default: 'PAYMENT_DELIVERED',
        enum: [
          'PAYMENT_DELIVERED',
          'PAYMENT_BANKCARD',
        ],
      },
      status: { type: Boolean, default: false, require: true },
      date: { type: Number, default: new Date().getTime() },
    },
    orderNotif: {
      type: String,
      default:
        'Sản phẩm sẽ được giao đến bạn nhanh nhất có thể khoản 1 ngày nếu cùng Tỉnh/Thành phố. Đơn hàng có thể giao chậm hơn nếu khác tỉnh. Cảm ơn bạn đã tin tưởng và đặt hàng từ cửa hàng của chúng tôi!!!',
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const Orders = mongodbOrder.model('Orders', OrderSchema);
module.exports = Orders;
