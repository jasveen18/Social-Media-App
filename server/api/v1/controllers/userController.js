const User = require('../models/userModel');
const userServices = require('../services/userServices');
const bcrypt = require('bcrypt');


// get request for view user profile
const profile = async(req,res) => {

    const userId = req.params.id;

    try{

        const vaild_user = await userServices.findOneById(userId);

        if(!vaild_user){
            return res.status(404).json({message: 'user not found'});
        }

        return res.status(200).json({message: 'user found', username:vaild_user.username, email: vaild_user.email});

    } catch(err){
        console.log('error in profile', err);
        return res.status(500);
    }

};


// post request for search user
const search_user = async(req,res) => {

    const { username, email } = req.body;

    if(!username || !email){
        return res.status(422).json({message: 'please enter user to search'});
    }

    try{

        const results = await userServices.search(username, email);

        if(results.length=== 0){
            return res.status(404).json({message: 'user not found'});
        }

        return res.status(200).json({message: 'user found', results});

    } catch(err){
        console.log('error in search user', err);
        res.status(500).json([]);
    }

};


// put request for edit user profile
const edit_profile = async(req,res) => {

    const userId = req.params.id;

    try{

        const valid_user = await User.findById(userId);

        if(!valid_user){
            return res.status(404).json({message: 'user not found'});
        }
        
        valid_user.name = req.body.name;
        valid_user.username = req.body.username;
        valid_user.password = bycrypt.hashSync(req.body.password, 10);
        valid_user.save();
        
        res.status(200).json({message: 'Profile updated successfully'});

    } catch(err){
        console.log('error in profile edit', err);
        res.status(500);
    }
};


// delete request for delete user profile
const delete_profile = async(req,res) => {

    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.status(200).json({message: 'user deleted successfully'});
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
};


module.exports = { profile, edit_profile, delete_profile, search_user };