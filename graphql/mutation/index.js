const objuser = require('./user')
const objproduct = require('./product')
const objvideo = require('./video')
const objpost = require('./post')
const mutation = Object.assign({}, objuser, objproduct , objvideo , objpost)

module.exports = mutation;
