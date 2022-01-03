const express = require('express');
const userRoutes = require('./authRouter');
const authController = require('../controllers/authController');
const router = express.Router();


router.post('/login', authController.login);

router.use('/users', userRoutes);

router.get("*", (req, res) => {
    res.status(404).send("Page not found!");
});

module.exports = router;
