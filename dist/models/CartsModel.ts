/* eslint-disable @typescript-eslint/indent */
import { component } from './Model';

const mongodbCarts = require('mongoose');
const SchemaCarts = mongodbCarts.Schema;

const cartsSchema = new SchemaCarts(
    {
        ...component,
        cartdata: [{
            productId: {
                type: SchemaCarts.Types.ObjectId,
                ref: 'Products',
            },
            qty: { type: Number, length: 10, require: true, default: 0 },
        }],
        cartuserid: {
            type: SchemaCarts.Types.ObjectId,
            ref: 'Users',
        },
    },
    {
        timestamps: true,
    },
);

const carts = mongodbCarts.model('carts', cartsSchema);
module.exports = carts;
