const ProductTC = require('../typecompose/product');

const objProduct = {
  ProductCreateOne: ProductTC.getResolver('createOne'),
  ProductCreateMany: ProductTC.getResolver('createMany'),
  ProductUpdateById: ProductTC.getResolver('updateById'),
  ProductUpdateOne: ProductTC.getResolver('updateOne'),
  ProductUpdateMany: ProductTC.getResolver('updateMany'),
  ProductRemoveById: ProductTC.getResolver('removeById'),
  ProductRemoveOne: ProductTC.getResolver('removeOne'),
  ProductRemoveMany: ProductTC.getResolver('removeMany')
};

module.exports = objProduct;
