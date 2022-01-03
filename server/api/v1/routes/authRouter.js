const express = require('express');
const auth = require('../controllers/authController');
const user = require('../controllers/userController');
const authorization = require('../middlewares/authorization');
const router = express.Router();



router.post('/signin', auth.signin);

router.get('/email_verify', auth.email_verify);

router.post('/forgot_password', auth.forgot_password);

router.post('/logout', authorization, auth.logout);

router.get('/:id', authorization, user.profile);

router.put('/:id', authorization, user.edit_profile);

router.delete('/delete/:id', authorization, user.delete_profile);

router.post('/search', authorization, user.search_user);


module.exports = router;
