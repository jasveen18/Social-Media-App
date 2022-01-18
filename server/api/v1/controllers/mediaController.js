const User = require('../models/userModel');
const cloudinary = require('../../../config/cloudinary');


// post request to upload image
const upload_image = async(req,res) => {

    try{

        const userId = req.params.id;

        const user = await User.findById(userId);

        const result = await cloudinary.uploader.upload(req.file.path);

        req.body.image = result.secure_url;
        req.body.imageId = result.public_id;

        user.image = req.body.image;
        user.imageId = req.body.imageId;
        await user.save();

        res.status(200).json({message: 'Image uploaded successfully', data: result });

    } catch(err){
        console.log('error in uploading image', err);
        res.status(500).json({message: 'failed to upload image'});
    }

};


// delete request to delete image
const delete_image = async(req,res) => {

    try{

        const userId = req.params.id;

        const user = await User.findById(userId);

        await cloudinary.uploader.destroy(user.imageId);

        res.status(200).json({message: 'Image deleted successfully'});

    } catch(err){
        console.log('error in image deletion', err);
        res.status(500).json({message: 'Failed to delete image'});
    }

};


module.exports = { upload_image, delete_image };

