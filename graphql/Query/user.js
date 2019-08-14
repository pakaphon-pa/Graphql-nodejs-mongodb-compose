const UserTC = require('../typecompose/user');
const user = require('../model/user')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const config = require('config')
const bcrypt = require('bcryptjs')

/// find All 
UserTC.addResolver({
  name: 'findall',
  args: { limit : 'Int' },
  type:  [UserTC],
  resolve: async ({ source, args }) => {
    const res = await user.find().sort({ date: -1 }); 
    return res;
  },
});

/// find by ID
UserTC.addResolver({
  name:'findwithID',
  args: { _id : 'MongoID' },
  type: UserTC,
  resolve: async({ args })=>{
      const res = await user.findById(args._id)
      if(!res){
        const error = new Error('ไม่มีข้อมุลอยู่')
        throw error
      }
      return res
  }
})

// Login 
UserTC.addResolver({
  name:'login',
  args: { email : 'String' , password : 'String' },
  type: `type tokenpayload { Token:String, TokenExpiration:Int , ID : MongoID }`, 
  resolve: async({ args })=>{
      try{
        const errors = []
        if(!validator.isEmail(args.email)){
          errors.push({ message: 'กรุณากรอก Email'})
        }
        
        if(validator.isEmpty(args.password) ){
          errors.push({message : 'กรุณากรอก password' })
        }

        if(errors.length > 0){
          const error = new Error('กรุณากรอกข้อมูล')
          error.data = errors
          error.code = 422
          throw error
        }

        const { email , password } = args

        let User  =  await user.findOne({ email })
        if(!User){
          const error  = new Error('กรุณากรอกให้ถูกต้อง')
          throw error
        }

        let isMatch = await bcrypt.compare(password, User.password)
        if(!isMatch){
          const error = new Error('กรุณากรอกให้ถูกต้อง')
          throw error 
        }
        
        const payload = {
          UserId : User._id,
          email : User.email
        }
        const token  = jwt.sign(payload,config.get('jwtSecret'),{
          expiresIn: '4h',

        })
        return { Token : token , TokenExpiration : 4  , ID : User.id} 
      }catch(err){
        throw Error(err.message)
      }
      
  }
})

// call profile by authentication
UserTC.addResolver({
  name:'profile',
  type: UserTC,
  args: { _id : 'MongoID'} , 
  resolve : async({ context , req  }) => {
    try{
      if(!context.auth){
        throw new Error('Unauthenticated!')
      }
      const profile = await user.findById(context.userId).select('-password')
      if(!profile){
        throw new Error('ไม่มีโปรไฟล์นี้อยู่')
      }
      return profile
    }catch(err){
      throw Error(err.message)
    }

     
  }
})


const objUser = {
  me: UserTC.getResolver('profile'),
  auth : UserTC.getResolver('login'),
  Userfindall: UserTC.getResolver('findall'),
  SearchWithIDUser: UserTC.getResolver('findwithID'),
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  userCount: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
  userPagination: UserTC.getResolver('pagination'),


  
};

module.exports = objUser;
