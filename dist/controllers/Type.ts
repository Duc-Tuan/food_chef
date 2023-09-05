import path from 'path';
import fs from 'fs';
import { autoCode } from '../styles';

export const mapIndex = async (code: string, TableMongoodb: any, req: any) => {
  const dataOld: any[] = await TableMongoodb.find();
  if (dataOld.length !== 0) {
    req.body.index = dataOld[dataOld.length - 1].index + 1;
    req.body.code = autoCode(code, dataOld[dataOld.length - 1]?.index + 1);
  } else {
    req.body.index = 1;
    req.body.code = autoCode(code, 1);
  }

  return req.body;
};

export const deleteImage = (nameFileCustom: string, name: any) => {
  const directoryPath = path.dirname(path.dirname(__dirname)) + `\\dist\\assets\\others\\${nameFileCustom}\\${name}`;
  fs.unlinkSync(directoryPath);
};
