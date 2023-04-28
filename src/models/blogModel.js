const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    image:{
     type:String,
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: 'Author'
    },

   isDeleted:{
    type:Boolean,
    default :false,
   }

},{timestamps:true});

module.exports = mongoose.model('Blog', blogSchema) 
