const mongoose = require('mongoose');
const ProductSchema = require('../schema/product');

module.exports = mongoose.model('Product', ProductSchema);
