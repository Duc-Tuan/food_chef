import express, { Application } from 'express';
import { nameFile } from '../../styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function configUriImage(app: Application) {
  app.use(`/${nameFile.products}`, express.static(`dist/assets/others/${nameFile.products}`));
  app.use(`/${nameFile.users}`, express.static(`dist/assets/others/${nameFile.users}`));
}

module.exports = configUriImage;
