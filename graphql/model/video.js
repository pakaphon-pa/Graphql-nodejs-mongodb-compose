const mongoose = require('mongoose')
const videoSchema = require('../schema/video')

module.exports = mongoose.model('video' , videoSchema)