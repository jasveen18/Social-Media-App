const express = require('express');
const userRoutes = require('./authRouter');
const friendRoutes = require('./userRouter');
const mediaRoutes = require('./mediaRouter');
const postRoutes = require('./postRouter');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/login', authController.login);

router.use('/users', userRoutes);

router.use('/friends', friendRoutes);

router.use('/upload', mediaRoutes);

router.use('/post', postRoutes);


router.get("*", (req, res) => {
    res.status(404).send("Page not found!");
});

module.exports = router;