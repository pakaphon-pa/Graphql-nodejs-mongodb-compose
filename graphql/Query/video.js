const videoUTC = require('../typecompose/video')

const objectvideo = {
    videoById: videoUTC.getResolver('findById'),
    videoByIds: videoUTC.getResolver('findByIds'),
    videoOne: videoUTC.getResolver('findOne'),
    videoMany: videoUTC.getResolver('findMany'),
    videoCount: videoUTC.getResolver('count'),
    videoConnection: videoUTC.getResolver('connection'),
    videoagination: videoUTC.getResolver('pagination')
}

module.exports = objectvideo