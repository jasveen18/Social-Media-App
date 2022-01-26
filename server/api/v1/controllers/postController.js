const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const cloudinary = require('../../../config/cloudinary');


// get request to see all posts
const fetch_all_posts = async(req,res) => {

    try{

        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.perPage ? req.query.perPage : 20;
        const skip = limit * (page - 1);

        const posts = await Post.find().sort({createdAt: -1}).limit(limit).skip(skip);

        res.status(200).json({message: 'Posts fetched successfully', data: posts});

    } catch(err){
        console.log('Error in get posts: ', err);
        res.status(500).json({message: 'Failed to fetch posts'});
    }

};


// post request to crete a new post
const create_post = async(req,res) => {

    try{

        const { caption } = req.body;

        if(!req.file && !caption){
            return res.ststus(400).json({message: 'No data given for the post'});
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        req.body.image = result.secure_url;
        req.body.imageId = result.public_id;

        const image = req.body.image;
        const imageId = req.body.imageId
        const creator = { 
            id: req.rootUser._id,
            username:req.rootUser.username,
       }

        const newPost = new Post({image:image, imageId:imageId, caption:caption, creator:creator});
        await newPost.save();

        res.status(201).json({message: 'New post created'});

    } catch(err){
        console.log('Error in create new post: ', err);
        res.status(500).json({message: 'Failed to upload post'});
    }

};


// get request to see a post with id
const fetch_post = async(req,res) => {

    try{

        const { id } = req.params;

        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({message: 'No post with given id'});
        }

        res.status(200).json({message: 'Post fetched successfully'});

    } catch(err){
        console.log('Error in fetch post: ', err);
        res.status(500).json({message: 'Failed to fetch post'});
    }

};


// put request to update post
const update_post = async(req,res) => {

    try{

        const { id } = req.params;

        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({message: 'No post with given id'});
        }

        if (post.creator.id.toString() !== req.userId){
            return res.status(401).json({message: "Cannot update this post" });
        }

        if(post){

            if(req.file){
                cloudinary.uploader.destroy(post.imageId);
                const newPost = cloudinary.uploader.upload(req.file.path);

                req.body.image = newResult.secure_url;
				req.body.imageId = newResult.public_id;
				post.image= req.body.image;
				post.imageId= req.body.imageId;
				post.save();
            }

            post.caption = req.body.caption;
            post.save();

            res.ststus(200).json({message: 'Post updated successfully'});

        }

    } catch(err){
        console.log('Error in update post: ', err);
        res.status(500).json({message: 'Failed to update post'});
    }

};


// delete request to delete post
const delete_post = async(req,res) => {

    try{

        const { id } = req.params;

        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({message: 'No post with given id'});
        }

        if (post.creator.id.toString() !== req.userId){
            return res.status(401).json({message: "Cannot update this post" });
        }

        if(post){
            cloudinary.uploader.destroy(post.imageId);
            post.comments.forEach((curr) => {
                Comment.findByIdAndRemove(curr, (err) => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('Comments Deleted');
                    }
                })    
            })
        }
        
        await Post.findByIdAndDelete(id);
        
        res.ststus(200).json({message: 'Post deleted successfully'});

    } catch(err){
        console.log('Error in delete post: ', err);
        res.status(500).json({message: 'Failed to delete post'});
    }

};


// put request for likes and dislikes
const like_dislike_post = async(req,res) => {

    try{

        const { id } = req.params;

        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({message: 'No post with given id'});
        }

        let message = 'Post liked successfully';

        const index = post.likes.find((ID) => ID.toString() === String(req.userId));

        if(index){
            post.likes.unshift(req.userId);
        }

        else
        {
            post.likes = post.likes.filter((ID) => ID.toString() !== String(req.userId));
            message = 'Post disliked successfully';
        }

        await Post.findByIdAndUpdate(id, post);

        res.status(200).json({message});

    } catch(err){
        console.log('Error in like/dislike post: ', err);
        res.status(500).json({message: 'Failed to like/dislike post'});
    }

};


module.exports = { fetch_all_posts, create_post, fetch_post, update_post, delete_post, like_dislike_post};