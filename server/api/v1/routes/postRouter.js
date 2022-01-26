const express = require('express');
const multer = require('multer');
const authorization = require('../middlewares/authorization');
const post = require('../controllers/postController');
const comment = require('../controllers/commentController');
const router = express.Router();


const storage = multer.diskStorage({
    filename: function(req,file,callback){
        callback(null, Date.now()+file.originalname);
    }
});

const imageFilter = function(req,file,cb){
    //accept image files only
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)){
        return cb(new Error('Only image files are allowed'),false);
    }
    cb(null,true);
};

const upload = multer({ storage:storage, fileFilter: imageFilter});


router.get('/', authorization, post.fetch_all_posts);

router.post('/', authorization, upload.single('image'), post.create_post);

router.get('/:id', authorization, post.fetch_post);

router.put('/:id', authorization, upload.single('image'), post.update_post);

router.delete('/:id', authorization, post.delete_post);

router.put('/:id', authorization, post.like_dislike_post);

router.get('/:postId/comments', authorization, comment.fetch_all_comments);

router.post('/:postId/comments', authorization, comment.create_comment);

router.get('/:postId/comments/:commentId', authorization, comment.fetch_comment);

router.put('/:postId/comments/:commentId', authorization, comment.update_comment);

router.delete('/:postId/comments/:commentId', authorization, comment.delete_comment);

router.post('/:postId/comments/:commentId/reply', authorization, comment.reply_comment);


module.exports = router;