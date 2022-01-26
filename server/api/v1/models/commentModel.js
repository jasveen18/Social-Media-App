const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text:{ 
        type: String, 
        trim: true 
    },

    author:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    replies:[
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment" 
        }
    ],
},

{
    timestamps: true,
}

);


// create a collection
const Comment = mongoose.model("COMMENT", commentSchema);

module.exports = Comment;