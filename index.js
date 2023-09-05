/* eslint-disable @typescript-eslint/naming-convention */
import cors from 'cors';
import express from 'express';
import path from 'path';
require('dotenv').config();
require('./dist/data/mongooDb');

// const router = require('./dist/routers');
// const configUriImage = require('./dist/utils/others/configUriImage');

var __importDefault = function (mod) {
  return mod && mod.__esModule ? mod : { default: mod };
};
Object.defineProperty(exports, '__esModule', { value: true });

const express_1 = __importDefault(express);
const app = (0, express_1.default)();
app.use(cors());

app.use(express.static(path.join(__dirname, 'assets')));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', new Boolean(true).toString());
  // Pass to next layer of middleware
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router(app);
// configUriImage(app);

//catch 404 error and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler function
app.use((err, req, res) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

const post = process.env.POST || 3000;
app.listen(post, () => {
  console.log(`listening on ${post}`);
});
