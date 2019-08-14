const PostTC = require('../typecompose/post')
const Post = require('../model/post')
const user = require('../model/user')
const validator = require('validator')

PostTC.addResolver({
    name:"CreatePost",
    args: {
        record: PostTC.getInputType()
    },
    type: `type Postpayload {
        message:Boolean
        postId : MongoID
    }`,
    resolve : async({ context , args }) => {
        try{
            // check authentication
            if(!context.auth){
                throw new Error('Unauthenticated!')
            }

            // check validator
            const errors = [] 
            if(validator.isEmpty(args.record.text)){
                errors.push({ message : 'กรุณากรอกข้อมูลใน โพสต์'})
            }
            if(errors.length > 0){
                const error = newError('กรอกข้อมูลไม่ครบ')
                error.data = errors
                error.code = 422
                throw error
            }

            // call user for posts
            const User = await user.findById(context.userId).select('-password')
            
            // in model
            const newPost = new Post({
                text: args.record.text,
                name: User.name,
                user: context.userId
            })

            // save in Post
            const CreatePost = await newPost.save();
            
            return { postId : CreatePost.id , message: true}

        }catch(err){
            throw Error(err.message)
        }
    }
})

PostTC.addResolver({
        name:"Likespost",
        args: { postId : 'String' },
        type:`type likepayload {
            message:Boolean
        }`,
        resolve : async({ context , args }) =>{
            try{
                if(!context.auth){
                    throw new Error('Unauthenticated!')
                }
                const post = await Post.findById(args.postId)
                if(post.Likes.filter( like => like.user.toString() === context.userId).length > 0){
                    throw Error('คุณได้กดไลน์ไปแล้ว')
                }
                post.Likes.unshift({user: context.userId});

                await post.save();
                return { message: true }
            }catch(err){
                throw Error(err.message)
            }
        }
})

PostTC.addResolver({
    name:"unlikepost",
    args: { postId : 'String'},
    type: `type unlikepayload {
        message:Boolean
    }`,
    resolve : async({ context , args}) =>{
        try{
            // check authentication
            if(!context.auth){
                throw new Error('Unauthenticated!')
            }

            //call post for dislike
            const post = await Post.findById(args.postId)

            //check likes in post
            if(post.Likes.filter(like => like.user.toString() === context.userId).length === 0){
                throw Error('คุณยังไม่ได้กดไลท์')
            }
            
            // call use are index on Likes
            const removeIndex =  await post.Likes.map(like => like.user.toString()).indexOf(context.userId)
            
            // remove like
            const splice =  await post.Likes.splice(removeIndex, 1)            
        
            // save 
            await post.save()

            return { message : true}
        }catch(err){
            throw Error(err.message)
        }
    }
})

PostTC.addResolver({
    name: "Comment",
    type: PostTC , 
    args: { 
        record: `input commentInput{
        text : String,
        PostId : String
            }`
        },
    resolve : async ({ context , args }) =>{
        try{
            // check authentication
            if(!context.auth){
                throw new Error('Unauthenticated!')
            }

            // Call data user no password
            const User = await user.findById(context.userId).select('-password')
            // Call post data
            const post = await Post.findById(args.record.PostId)

            // in model
            const newComment = {
                text: args.record.text,
                name: User.name,
                user: context.userId
            }

            // add to comments array
            await post.comments.unshift(newComment)
            
            // save
            await post.save();

            return post

        }catch(err){
            throw Error(err.message)
        }
    }
})




const objpost = {
    
    ///// NewCreate /////
    CreatePost: PostTC.getResolver('CreatePost'),
    Likespost: PostTC.getResolver('Likespost'),
    unlikepost: PostTC.getResolver('unlikepost'),
    CommentPost: PostTC.getResolver('Comment'),
    ///// original /////
    PostCreateOne: PostTC.getResolver('createOne'),
    PostCreateMany: PostTC.getResolver('createMany'),
    PostUpdateById: PostTC.getResolver('updateById'),
    PostUpdateOne: PostTC.getResolver('updateOne'),
    PostUpdateMany: PostTC.getResolver('updateMany'),
    PostRemoveById: PostTC.getResolver('removeById'),
    PostRemoveOne: PostTC.getResolver('removeOne'),
    PostRemoveMany: PostTC.getResolver('removeMany')
}

module.exports = objpost