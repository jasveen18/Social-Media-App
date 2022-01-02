const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const tokenManager = require('../helpers/token_manager');
const userServices = require('../services/userServices');
const bcrypt = require('bcrypt');



const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});


// post request for new user signin
const signin = async(req,res) => {

    const { name, username, email, password, confirm_password } = req.body;

    if(!username || !email || !password || !confirm_password || !name){
        return res.status(422).json({error: 'please fill the fields properly'});
    }

    try{

        const user = await userServices.findOnebyEmailorUsername(username, email);
        
        if(user){
            if(user.email===email && user.email_verified===true){
                return res.status(422).json({error: 'email already exist'});
            }
            else if(user.username===username){
                return res.status(422).json({error: 'username already exist'});
            }
        }

        
        if(password != confirm_password){
            return res.status(422).json({error: 'password is not matching'});
        }
        else if(password.length<6){
            return res.status(422).json({error: 'password length should be minimum of 6 '});
        }
        else
        {
            const user = new User({username,name,email,password,confirm_password});
            //pre function called
            await user.save();

            const verificationToken = tokenManager.newToken(
                { username: req.username }, 
                process.env.SECRET_KEY,
                '1h'
            );

            const url = `http://localhost:5000/users/email_verify?token=${verificationToken}`;

            transporter.sendMail({
                to: email,
                subject: 'Verify Account',
                html: `Click <a href = '${url}'>here</a> to confirm your email.`
            });

            return res.status(201).send({
                message: `Sent a verification email to ${email}`
              });

        }


    }catch(err){
        console.log('error in registration',err);
    }

};


// post request for login
const login = async(req,res) => {

    try{
        const { username,password } = req.body;

        if(!username || !password){
            return res.status(400).json({error:'please fill the details'});
        }

        const userLogin = await userServices.findOnebyEmailorUsername(email, username);

        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password);

            const loginToken = tokenManager.newToken(
                { username: req.username },
                process.env.SECRET_KEY,
                "1h"
            );

            res.cookie('jwtoken', loginToken, {
                expire: new Date(Date.now()+25892000000),
                httpOnly: true
            });

            if(!isMatch){
                res.status(400).json({error:'invalid credientials'});
            }
            else
            {
                res.status(200).json({message:'user login successfull', token:loginToken});
            }
        }
        else
        {
            res.status(400).json({error:'invalid credientials'});
        }
        
    }catch(err){
        console.log('error in login',err);
    }
}


//get request for email verification
const email_verify = (token) => {
    const decoded = tokenManager.verify(token, process.env.SECRET_KEY);
    if (decoded.verified === false) {
      return {
        status: 401,
        message: `Email verification failed - ${decoded.content}`,
      };
    }

    try {
      User.findOneAndUpdate(
        { username: decoded.content.username },
        { email_verified: true },
        null,
        (err, docs) => {
          if (err) {
            throw new Error(err);
          }
        }
      );

      ({ username: decoded.content.username }, (err, res) => {
        User.deleteMany(
          { email: res.email, email_verified: false },
          (err) => {
            if (err) {
              throw new Error(err);
            }
          }
        );
      });

    } catch (err) {
      return {
        status: 500,
        message: `Verification failed - ${err.message}`,
      };
    }
    return {
      status: 200,
      message: "Email verification successful!",
    };
};


const forgot_password = async(req,res) => {

    if(req.query.token){
        const decoded = tokenManager.verify(token, process.env.SECRET_KEY);

        if(decoded.verified === false){
            return res.status(401).json({message: 'Invalid token'});
        }

        try{

            const hashedPassword = bcrypt.hashSync(req.body, 10);
            User.findOneAndUpdate(
               { username: decoded.content.username },
               { password: hashedPassword },
               null,
               (err, docs) => {
                    if(err){
                       throw new Error(err);
                    }
                }
            );

        } catch(err){
            console.log('error in forgot password', err);
            return res.status(500).json({message:err});
        };

    } else{

        try{

            const verificationToken = tokenManager.newToken(
                { username: req.body.username },
                process.env.SECRET_KEY,
                "1h"
            );

            User.findOne({ username: req.body.username }, (err, res) => {
                if (err) {
                  console.log(err);
                }
                transporter.sendMail({
                    address: res.email,
                    subject: "Password Change Request - Social-Media-App",
                    body: `Hey ${res.username}!<br><br>
                            We recieved the request to change your account password.<br>
                            Click on the link to change your account: 
                            http://localhost:5000/users/forgot_password?token=${verificationToken}<br><br>
                            Team Social-Media-App`,
                });
                
            });
             

        } catch(err){
            console.log('error in forgot password', err);
            return res.status(500).json({message: err});
        }

        return res.status(200).json({message: `Password change email sent to ${req.body.username}`});
    }

};
  

const logout = (req,res) => {
    res.clearCookie('login_token').status(200).json({message: 'User logged out successfully'});
};




module.exports = { signin, login, email_verify, logout, forgot_password };
