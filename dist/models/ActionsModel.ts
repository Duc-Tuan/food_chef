import { component } from './Model';

const mongodbActions = require('mongoose');
const SchemaAction = mongodbActions.Schema;

const actionsSchema = new SchemaAction(
  {
    ...component,
    actionContent: { type: String, length: 255, require: true },
    actionOrther: { type: String, length: 255, default: null },
    actionHighlights: { type: String, length: 255, default: null },
    actionModel: { type: String, length: 255, default: null },
    actionUserId: { type: SchemaAction.Types.ObjectId, ref: 'Users', require: true },
  },
  {
    timestamps: true,
  },
);

const action = mongodbActions.model('actions', actionsSchema);
module.exports = action;
