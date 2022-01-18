const express = require('express');
const friend = require('../controllers/friendController');
const authorization = require('../middlewares/authorization');
const router = express.Router();


router.get("/", authorization, friend.get_friends);

router.get("/requests", authorization, friend.get_friend_requests);

router.get("/requests/sent", authorization, friend.get_friend_request_sent);

router.post("/request/:friendId", authorization, friend.send_friend_request);

router.post("/request/accept/:friendId", authorization, friend.accept_friend_request);

router.post("/request/reject/:friendId", authorization, friend.reject_friend_request);

router.post("/remove/:friendId", authorization, friend.remove_friend);

router.get("/block", authorization, friend.get_blocked_users);

router.post("/block/:blockUserId", authorization, friend.block_user);


module.exports = router;