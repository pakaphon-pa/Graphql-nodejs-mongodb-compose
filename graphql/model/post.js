const mongoose = require('mongoose')
const PostSchema = require('../schema/post')

module.exports = mongoose.model('post',PostSchema)
