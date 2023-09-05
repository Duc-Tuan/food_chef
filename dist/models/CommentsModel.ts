import { component } from './Model';

const mongodbComment = require('mongoose');
const SchemaComment = mongodbComment.Schema;

const commentSchema = new SchemaComment(
  {
    ...component,
    commentUserId: { type: SchemaComment.Types.ObjectId, ref: 'Users', default: null },
    // commentProductId: { type: SchemaComment.Types.ObjectId, ref: 'Product', default: null },
    componentContent: { type: String, require: true, length: 255 },
  },
  {
    timestamps: true,
  },
);

// enum: ['STOCKING', 'OUT_OF_STOCK']

const comments = mongodbComment.model('Comments', commentSchema);
module.exports = comments;
