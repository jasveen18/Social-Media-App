const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
    },

    password:{
        type:String,
        required:true,
        min:6
    },

    confirm_password:{
        type:String,
        required:true,
        min:6
    },

    email_verified:{
        type: Boolean,
        required: true,
        default: false,
        sparse:true
    },

    image:{
        type:String,
        required:true
    },
    
    imageId:{
        type:String
    },

    friends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    friendRequestsSent:[
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],

    friendRequests:[
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],

    blockedUsers:[
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],

    
},


    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }

);


//hashing the password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.confirm_password = await bcrypt.hash(this.confirm_password,12);
    }
    next();
});



// create a collection
const User = mongoose.model('USER', userSchema);

module.exports = User;
