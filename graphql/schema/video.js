const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    view:{
        type:String,
        require:true
    }

})

module.exports = videoSchema