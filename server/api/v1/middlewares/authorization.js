const jwt = require('jsonwebtoken');
const userServices = require('../services/userServices');

const Authenticate = async(req,res,next) => {
    try{
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await userServices.findOneOnly({_id: verifyToken._id});

        if(!rootUser){
            throw new Error('User not found');
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    }catch(err){
    
        console.log(err);
    }

};

module.exports = Authenticate;