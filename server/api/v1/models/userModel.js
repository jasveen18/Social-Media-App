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
        unique:true
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
