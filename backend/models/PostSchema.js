const mongoose = require('mongoose');

const PostSchema=new mongoose.Schema({
    image : String,
    title: String,
    message: String,
    tags : [String],
    likeCount:{
        type:Number,
        default:0
    },
    postType:String,
})

const collection=mongoose.model("postcollection",PostSchema)

module.exports=collection