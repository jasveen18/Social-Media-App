const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    
    imageId:{
        type:String
    },

    caption:{
        type:String,
        trim:true
    },

    creator:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: {
            type:String
        },    
    },

    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],

    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
},

{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
}

);


// create a collection
const Post = mongoose.model('POST', postSchema);

module.exports = Post;