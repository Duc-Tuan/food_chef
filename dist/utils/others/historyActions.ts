import { Request, Response } from 'express';
import { checkUser } from './checkModels';
import { mapIndex } from '../../controllers/Type';

const ActionsModel = require('../../models/ActionsModel');

export const historyActions = async (req: Request, content: string, model?: string, Highlights?: string, orhter?: string) => {
  const token: string = String(req?.headers['x-food-access-token']);
  const isUser = await checkUser(token);
  if (isUser?.status) {
    await mapIndex('ACT', ActionsModel, req);
    const data = {
      index: req.body.index,
      code: req.body.code,
      actionContent: content,
      actionOrther: orhter,
      actionHighlights: Highlights,
      actionUserId: isUser?.id,
      actionModel: model,
    };
    const actionNew = new ActionsModel(data);
    await actionNew.save();
    console.log('Oke');
    return { status: true };
  } else {
    return { status: false, mess: 'Vui lòng đăng nhập trước khi thực hiện hành động này.' };
  }
};