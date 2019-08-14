import { composeWithMongoose } from 'graphql-compose-mongoose';
const User = require('../model/user');

const customizationOptions = {};
const UserTC = composeWithMongoose(User, customizationOptions);


module.exports = UserTC;
