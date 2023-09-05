import { Application, Response, Request } from 'express';
const productRouter = require('./router/ProductRouter');
const accountRouter = require('./router/AccountRouter');
const uploadFileRouter = require('./router/UploadFileRouter');
const siteRouter = require('./router/Site');

const versionRouter: string = '/api/v1';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function route(app: Application) {
  app.use(versionRouter + '/products', productRouter);
  app.use(versionRouter + '/accounts', accountRouter);
  app.use(versionRouter + '/uploadFile', uploadFileRouter);
  app.use(versionRouter + '/aaaa', siteRouter);
}

module.exports = route;
