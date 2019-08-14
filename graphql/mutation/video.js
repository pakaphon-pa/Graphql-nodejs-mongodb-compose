const videoTC = require('../typecompose/video')

const objvideo= {
    videoCreateOne: videoTC.getResolver('createOne'),
    videoCreateMany: videoTC.getResolver('createMany'),
    videoUpdateById: videoTC.getResolver('updateById'),
    videoUpdateOne: videoTC.getResolver('updateOne'),
    videoUpdateMany: videoTC.getResolver('updateMany'),
    videoRemoveById: videoTC.getResolver('removeById'),
    videoRemoveOne: videoTC.getResolver('removeOne'),
    videoRemoveMany: videoTC.getResolver('removeMany')
  };
  
  module.exports = objvideo;
  