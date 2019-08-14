const UserTC = require('../typecompose/user');
const user = require('../model/user')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
import { GraphQLString , GraphQLNonNull } from 'graphql'




  UserTC.addResolver({
    name:'CreateUser',
    type: `type UserPayload { id: MongoID, Token:String  , Message:String}`,
    args: 
     { 
      record: UserTC.getInputType()
      //name: 'String' , email : 'String' , password : 'String 'e})

     }  ,
    resolve: async ({ source, args, context, info ,res }) => {

      try{
        // check validator
        const errors = []
        if(!validator.isEmail(args.record.email)){
            errors.push({ message: 'E-mail is invalid'})
        }
      
        if(validator.isEmpty(args.record.name) || !validator.isLength(args.record.name,{min:5})){
          errors.push({message:'กรุณากรอกให้ครบ'})
        }
        
        if(validator.isEmpty(args.record.password) || !validator.isLength(args.record.password,{min:8})){
          errors.push({message:'พาสเวิดสั้นเกิน'})
        }

        if(errors.length > 0){
          const error = new Error( 'กรุณากรอกข้อมูล' );
          error.data = errors
          error.code = 422
          throw error
        }

        // Check user is exists
        const existingUser = await user.findOne({ email: args.record.email });
          if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
          }

        // in model
        const UserInsert =  new user({
          name : args.record.name,
          email : args.record.email,
          password : args.record.password
        });

        // bcrypt password
        const salt = await bcrypt.genSalt(10);

        UserInsert.password = await bcrypt.hash(args.record.password, salt)

        // save
        const userInput = await UserInsert.save()

        // payload for token
        const payload = {
          user : {
            id : userInput._id
          }
        }

        // get token after save
        const token  = jwt.sign(payload,config.get('jwtSecret'),{
          expiresIn: '4h'
        })

        return { Token : token , id : userInput.id , Message : "Success" }
    }catch(err){
      throw Error(err.message)
    }
  }
  })

  UserTC.addResolver({
    name:"editprofile",
    type:`type editprofilepayload{ 
             id:MongoID ,
             Message:Boolean
            }`,
    args: { 
          record : `input profileInput {
                           name: String
                           
            }` 
          },
    resolve : async ({ args , context })=>{
      try{

        // check authentication
        if(!context.auth){
          throw new Error('Unauthenticated!')
        }

        // find and update
        const userUpdate = await user.findByIdAndUpdate({_id:context.userId} , {name : args.record.name})

        
        return { id : userUpdate.id , Message : true }
      }catch(err){
        throw Error(err.message)
      }
    }
  })

const objUser = {
  
  ///// Create New ////
  CreateOneUser: UserTC.getResolver('CreateUser'),
  UpdateOneUserById : UserTC.getResolver('editprofile'),


  ///// original ////
  userCreateOne: UserTC.getResolver('createOne'),
  userCreateMany: UserTC.getResolver('createMany'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany')

};

module.exports = objUser;
