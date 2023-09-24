import { component } from './Model';

const mongodbHeart = require('mongoose');
const SchemaHeart = mongodbHeart.Schema;

const heartSchema = new SchemaHeart(
    {
        ...component,
        heart_content: [{ type: SchemaHeart.Types.ObjectId, ref: 'Products', default: null }],
        heart_useId: {
            type: SchemaHeart.Types.ObjectId,
            ref: 'users',
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

const hearts = mongodbHeart.model('hearts', heartSchema);
module.exports = hearts;
