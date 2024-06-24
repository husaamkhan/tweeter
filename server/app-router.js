const express = require('express');
let router = express.Router();

// POST Requests
router.post('/post-tweet', postTweet);

// GET Requests
router.get('/get-tweet', getTweet);

async function postTweet(req, res, next) {};
async function getTweet(req, res, next) {};

module.exports = router;
