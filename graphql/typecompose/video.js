import { composeWithMongoose } from 'graphql-compose-mongoose'
const Video = require('../model/video')

const customizationOptions = {};
const VideoTC = composeWithMongoose(Video,customizationOptions)

module.exports =  VideoTC