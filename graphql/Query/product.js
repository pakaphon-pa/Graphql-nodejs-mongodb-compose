const ProductUTC = require('../typecompose/product');

const objProduct = {
  ProductById: ProductUTC.getResolver('findById'),
  ProductByIds: ProductUTC.getResolver('findByIds'),
  ProductOne: ProductUTC.getResolver('findOne'),
  ProductMany: ProductUTC.getResolver('findMany'),
  ProductCount: ProductUTC.getResolver('count'),
  ProductConnection: ProductUTC.getResolver('connection'),
  Productagination: ProductUTC.getResolver('pagination')
};

module.exports = objProduct;
