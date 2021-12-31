const express = require('express');
const auth = require('../controllers/authController');
const router = express.Router();

router.post('/signin', auth.signin);

router.post('/login', auth.login);


module.exports = router;