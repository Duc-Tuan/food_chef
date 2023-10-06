import { Application, Response, Request } from 'express';
const MerchantRouter = require('./router/MerchantRouter');
const CategoriesRouter = require('./router/CategoriesRouter');
const productRouter = require('./router/ProductRouter');
const accountRouter = require('./router/AccountRouter');
const uploadFileRouter = require('./router/UploadFileRouter');
const AddressRouter = require('./router/AddressRouter');
const BannerRouter = require('./router/BannerRouter');
const CartRouter = require('./router/CartRouter');
const CommentRouter = require('./router/CommentRouter');
const ShippingRouter = require('./router/ShippingRouter');
const OrdersRouter = require('./router/OrdersRouter');
const HeartRouter = require('./router/HeartRouter');
const siteRouter = require('./router/Site');

// admin
const AdminRouter = require('./router/AdminRouter');

const versionRouter: string = '/api/v1';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function route(app: Application) {
  // roles admin
  app.use(versionRouter + '/auths/admin', AdminRouter);

  // roles users
  app.use(versionRouter + '/products', productRouter);
  app.use(versionRouter + '/auths', accountRouter);
  app.use(versionRouter + '/banners', BannerRouter);
  app.use(versionRouter + '/categories', CategoriesRouter);
  app.use(versionRouter + '/merchants', MerchantRouter);
  app.use(versionRouter + '/addressOrders', AddressRouter);
  app.use(versionRouter + '/uploadFile', uploadFileRouter);
  app.use(versionRouter + '/comments', CommentRouter);
  app.use(versionRouter + '/carts', CartRouter);
  app.use(versionRouter + '/shippings', ShippingRouter);
  app.use(versionRouter + '/orders', OrdersRouter);
  app.use(versionRouter + '/hearts', HeartRouter);
  app.use(versionRouter + '/', siteRouter);
}

module.exports = route;
