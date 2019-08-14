import { composeWithMongoose } from 'graphql-compose-mongoose';
const productModel = require('../model/product');

const customizationOptions = {};
const ProductUTC = composeWithMongoose(productModel, customizationOptions);

module.exports = ProductUTC;
