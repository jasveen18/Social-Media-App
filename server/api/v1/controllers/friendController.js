const User = require('../models/userModel');
const userServices = require('../services/userServices');


// get request to see posts of all friends
const get_friends = async(req,res) => {

    try{

        const page = req.params.page? req.params.page : 1;
        const limit = req.params.perPage? req.params.perPage : 15;
        const skip = limit*(page-1);

        const users = await User.findById(req.userId).populate({path: 'friends', model: User, select: 'name username email'}).slice('friends', [skip,limit]);

        res.status(200).json({message: 'Friends list', data: users.friends});

    } catch(err){
        console.log('error in get friends: ', err);
        res.status(500).json({message: 'Failed to show user friends'});
    }
};


// get request for friend requests
const get_friend_requests = async(req,res) => {

    try{

        const page = req.params.page? req.params.page : 1;
        const limit = req.params.perPage? req.params.perPage : 15;
        const skip = limit*(page-1);

        const users = await User.findById(req.userId).populate({path: 'friendRequests', model: User, select: 'name username email'}).slice('friendRequests', [skip,limit]);

        res.status(200).json({message: 'Friend request list', data: users.friendRequests});

    } catch(err){
        console.log('error in get friends: ', err);
        res.status(500).json({message: 'Failed to show user friend request list'});
    }
};


// get request for friend request sent
const get_friend_request_sent = async(req,res) => {

    try{

        const page = req.params.page? req.params.page : 1;
        const limit = req.params.perPage? req.params.perPage : 15;
        const skip = limit*(page-1);

        const users = await User.findById(req.userId).populate({path: 'friendRequestsSent', model: User, select: 'name username email'}).slice('friendRequestsSent', [skip,limit]);

        res.status(200).json({message: 'Friend request sent list', data: users.friendRequestsSent});

    } catch(err){
        console.log('error in get friends: ', err);
        res.status(500).json({message: 'Failed to show user friend request sent list'});
    }
};


// post request for send friend request
const send_friend_request = async(req,res) => {

    try{

        const friendId = req.params.friendId;
        const userId = req.userId;

        const friend = await User.findById(friendId);
        // checking if friend is valid 
        if(!friend || !friend.email_verified){
            return res.status(404).json({message: 'Invalid user id'});
        }

        const user = await User.findById(userId);
        // checking if user is already a friend 
        if(user.friends.includes(mongoose.Types.ObjectId(friendId))){
            return res.status(404).json({message: 'Invalid user id'});
        }

        // checking if user is blocked or not
        if(user.blockedUsers.includes(mongoose.Types.ObjectId(friendId)) || friend.blockedUsers.includes(mongoose.Types.ObjectId(userId))){
            return res.status(400).json({message: `Can't send friend request to blocked user`});
        }

        // checking if friendId is already present in pending requests
        if(user.friendRequests.includes(mongoose.Types.ObjectId(friendId))){
            return res.status(400).json({message: 'Friend request already present in pending request'});
        }

        // checking if friend request is sent already
        if(user.friendRequestsSent.includes(mongoose.Types.ObjectId(friendId))){
            return res.status(400).json({message: 'Friend request already sent'});
        }

        user.friendRequestsSent.unshift(friendId);
        friend.friendRequestsSent.unshift(userId);

        res.status(200).json({message: 'Friend request sent successfully'});

    } catch(err){
        console.log('error in send friend request: ', err);
        res.status(500).json({message: 'Failed to send the friend request'})
    }
};


// post request to accept friend request
const accept_friend_request = async(req,res) => {

    try{

        const friendId = req.params.friendId;
        const userId = req.userId;

        const user = await User.findById(userId);

        // checking if friendId is present in pending requests
        if(!user.friendRequests.includes(mongoose.Types.ObjectId(friendId))){
            return res.status(404).json({message: 'No friend request found from the user'});
        }

        const friend = await User.findById(friendId);

        user.friendRequests = user.friendRequests.filter((id) => id.toString() !== friendId);
        friend.friendRequestsSent = friend.friendRequestsSent.filter((id) => id.toString() !== userId);

        if (!user.friends.includes(mongoose.Types.ObjectId(friendId))){
            user.friends.unshift(friendId);
        }

        if (!friend.friends.includes(mongoose.Types.ObjectId(userId))){
           friend.friends.unshift(userId);
        }

        await User.findByIdAndUpdate(userId, user);
        await User.findByIdAndUpdate(friendId, friend);

        res.status(200).json({message: 'Friend request accepted'});

    } catch(err){
        console.log('error in accept friend request: ', err);
        res.status(500).json({message: 'Failed to accept friend request'});
    }

};


// post request to reject friend request
const reject_friend_request = async(req,res) => {

    try{

        const friendId = req.params.friendId;
        const userId = req.userId;

        const user = await User.findById(userId);

        // checking if friendId is present in pending requests
        if(!user.friendRequests.includes(mongoose.Types.ObjectId(friendId))){
            return res.status(404).json({message: 'No friend request found from the user'});
        }

        const friend = await User.findById(friendId);

        user.friendRequests = user.friendRequests.filter((id) => id.toString() !== friendId);
        friend.friendRequestsSent = friend.friendRequestsSent.filter((id) => id.toString() !== userId);

        await User.findByIdAndUpdate(userId, user);
        await User.findByIdAndUpdate(friendId, friend);

        res.status(200).json({message: 'Friend request rejected'});

    } catch(err){
        console.log('error in reject friend request: ', err);
        res.status(500).json({message: 'Failed to reject friend request'});
    }

};


// post request to remove friend
const remove_friend = async(req,res) => {

    try{

        const friendId = req.params.friendId;
        const userId = req.userId;

        const friend = await User.findById(friendId);

        // checking if friend is valid or not
        if (!friend || !friend.email_verified){
            return res.status(404).json({message: "Invalid user id" });
        }

        const user = await User.findById(userId);

        user.friends = user.friends.filter((id) => id.toString() !== friendId);
        friend.friends = friend.friends.filter((id) => id.toString() !== userId);

        await User.findByIdAndUpdate(userId, user);
        await User.findByIdAndUpdate(friendId, friend);

        res.status(200).json({message: 'Friend removed successfully'});

    } catch(err){
        console.log('error in remove friend: ', err);
        res.status(500).json({message: 'Failed to remove friend'});
    }

};


// get request for blocked users
const get_blocked_users = async(req,res) => {

    try{

        const page = req.params.page? req.params.page : 1;
        const limit = req.params.perPage? req.params.perPage : 15;
        const skip = limit*(page-1);

        const users = await User.findById(req.userId).populate({path: 'blockedUsers', model: User, select: 'name username email'}).slice('blockedUsers', [skip,limit]);

        res.status(200).json({message: 'Blocked users list', data: users.blockedUsers});

    } catch(err){
        console.log('error in get friends: ', err);
        res.status(500).json({message: 'Failed to show blocked users list'});
    }

};


// post request to block users
const block_user = async (req, res) => {

    try {

        const blockUserId = req.params.blockUserId;
        const userId = req.userId;
  
        const blockUser = await User.findById(blockUserId);

        // checking if blockUserId is valid
        if (!blockUser || !blockUser.email_verified){
            return res.status(404).json({message: "Invalid user id" });
        }
  
        const user = await User.findById(userId);
  
        user.friends = user.friends.filter((id) => id.toString() !== blockUserId);
        user.friendRequests = user.friendRequests.filter((id) => id.toString() !== blockUserId);
        user.friendRequestsSent = user.friendRequestsSent.filter((id) => id.toString() !== blockUserId);
  
        if (!user.blockedUsers.includes(mongoose.Types.ObjectId(blockUserId))){
            user.blockedUsers.unshift(blockUserId);
        }
  
        blockUser.friends = blockUser.friends.filter((id) => id.toString() !== userId);
        blockUser.friendRequests = blockUser.friendRequests.filter((id) => id.toString() !== userId);
        blockUser.friendRequestsSent = blockUser.friendRequestsSent.filter((id) => id.toString() !== userId);
  
        await User.findByIdAndUpdate(userId, user);
        await User.findByIdAndUpdate(blockUserId, blockUser);
  
        res.status(200).json({message: "User blocked successfully" });

    } catch (err) {
        console.log('error in block user', err);
        res.status(500).json({message: "Failed to block user" });
    }

};
  



module.exports = { get_friends, get_friend_requests, get_friend_request_sent, get_blocked_users, send_friend_request, 
    accept_friend_request, reject_friend_request, remove_friend, block_user };