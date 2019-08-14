const objuser = require('./user');
const objproduct = require('./product');
const objvideo = require('./video')
const objpost = require('./post')
const queries = Object.assign({}, objuser, objproduct , objvideo , objpost);

module.exports = queries;
