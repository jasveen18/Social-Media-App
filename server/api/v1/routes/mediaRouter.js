const express = require('express');
const router = express.Router();
const multer = require('multer');
const media = require('../controllers/mediaController');
const authorization = require('../middlewares/authorization');


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


router.post('/:id', authorization, upload.single('image'), media.upload_image);

router.delete('/:id', authorization, media.delete_image);


module.exports = router;