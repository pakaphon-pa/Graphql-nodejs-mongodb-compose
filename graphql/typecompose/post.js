import { composeWithMongoose } from 'graphql-compose-mongoose';
const postmodel = require('../model/post')

const customizationOptions = {};
const PostTc = composeWithMongoose(postmodel,customizationOptions)

module.exports = PostTc