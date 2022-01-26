const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');


// get request to fetch all comments
const fetch_all_comments = async(req,res) => {

    try{

        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.perPage ? req.query.perPage : 20;
        const skip = limit * (page - 1);

        const comments = await Post.findById(postId).populate('comments').slice('comments', [skip, limit]);

        res.status(200).json({message: "Comments fetched successfully", data: comments});

    } catch(err){
        console.log('Error in fetch all comments: ', err);
        res.status(500).json({message: 'Failed to fetch comments'});
    }

};


// post request to create comment
const create_comment = async(req,res) => {

    try{

        const { postId } = req.params;
        const { comment } = req.body;

        if(!comment){
            return res.status(400).json({message: 'Please write a comment'});
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: 'No post with given id'});
        }

        const newComment = new Comment({comment, author:req.userid});
        await newComment.save();

        post.comments.pull(newComment._id);

        await Post.findByIdAndUpdate(postId, post);

        res.status(201).json({message: 'New comment added successfully', data: comment});

    } catch(err){
        console.log('Error in create comment: ', err);
        res.status(500).json({message: 'Failed to create new comment'});
    }

};


// get request for fetch comment
const fetch_comment = async(req,res) => {

    try{

        const { postId, commentId } = req.params;

        const comment = await Comment.findById(commentId).populate('replies');

        res.status(200).json({message: 'Comment fetched successfully', data: comment});

    } catch(err){
        console.log('Error in fetch comment: ', err);
        res.status(500).json({message: 'Failed to fetch comment'});
    }

};


// put request for update comment
const update_comment = async(req,res) => {

    try{

        const { postId, commentId } = req.params;

        const post = await Post.findById(postId);
        
        if (!post.comments.includes(mongoose.Types.ObjectId(commentId))){
            return res.status(404).json({message: "Comment with given id not found in that post"});
        }

        const comment = await Comment.findById(commentId);

        if (comment.author.toString() !== req.userId){
            return res.status(401).json({message: "Cannot update that comment"});
        }

        const { content } = req.body;

        if (!content){
            return res.status(400).json({ success: false, message: "Comment cannot be empty" });
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });

        res.status(200).json({message: "Comment updated successfully", data: updatedComment});

    } catch(err){
        console.log('Error in update comment: ', err);
        res.status(500).json({message: 'Failed to update comment'});
    }

};


// delete request for delete comment
const delete_comment = async(req,res) => {

    try{

        const { postId, commentId } = req.params;

        const post = await Post.findById(postId);
        
        if (!post.comments.includes(mongoose.Types.ObjectId(commentId))){
            return res.status(404).json({message: "Comment with given id not found in that post"});
        }

        const comment = await Comment.findById(commentId);

        if (comment.author.toString() !== req.userId){
            return res.status(401).json({message: "Cannot delete that comment"});
        }

        await Comment.findByIdAndDelete(commentId);

        post.comments = post.comments.filter((id) => id.toString() !== commentId);

        await Post.findByIdAndUpdate(postId, post);

        res.status(200).json({message: "Comment deleted successfully"});

    } catch(err){
        console.log('Error in delete comment: ', err);
        res.status(500).json({message: 'Failed to delete comment'});
    }

};


// post request for reply to comment
const reply_comment = async(req,res) => {

    try{

        const { postId, commentId } = req.params;

        const post = await Post.findById(postId);
        
        if (!post.comments.includes(mongoose.Types.ObjectId(commentId))){
            return res.status(404).json({message: "Comment with given id not found in that post"});
        }

        const { reply } = req.body;

        if(!reply){
            return res.status(400).json({message: 'Please write a comment'});
        }

        const newReply = new Comment({ reply, author: req.userId });
        await newReply.save();

        const comment = await Comment.findById(commentId);
        comment.replies.unshift(newReply._id);

        await Comment.findByIdAndUpdate(commentId, comment);

        res.status(200).json({message: "Reply to comment added successfully"});

    } catch(err){
        console.log('Error in reply to comment: ', err);
        res.status(500).json({message: 'Failed to reply to the comment'});
    }

};



module.exports = { fetch_all_comments, create_comment, fetch_comment, update_comment, delete_comment, reply_comment};