const PostTC = require('../typecompose/post')
const Post = require('../model/post')

// count  Likes
PostTC.addResolver({
    name:'CountLike',
    type: ` type ResultCount{
        LikeIs :  Int
    }`,
    args: { postId :  "String" } ,
    resolve: async({ args }) =>{
        const post = await Post.findById({ _id : args.postId})

        const count = await post.Likes

        return { LikeIs : count.length }
    }
})

const objPost = {
    CountLike : PostTC.getResolver('CountLike'),
    PostById: PostTC.getResolver('findById'),
    PostByIds: PostTC.getResolver('findByIds'),
    PostOne: PostTC.getResolver('findOne'),
    PostMany: PostTC.getResolver('findMany'),
    PostCount: PostTC.getResolver('count'),
    PostConnection: PostTC.getResolver('connection'),
    Postagination: PostTC.getResolver('pagination')
}

module.exports = objPost