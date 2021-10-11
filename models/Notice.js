const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title:{type:String},
    description:{type:String},
    content:{type:String},
    noticeType:{type:String , default:'daily'},
    image_url:{type:String},
    cloudinary_id:{type:String},
    clicks:{type:Number , default:0}
})

module.exports = mongoose.model('Notice',  userSchema)