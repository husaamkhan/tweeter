const express = require('express');
let router = express.Router();

// POST Requests
router.post('/login', logInUser);
router.post('/register', registerUser);
router.post('/tweet', postTweet);

// GET Requests
router.get('/feed', getFeed);
router.get('/search/:input', getSearchResults);
router.get('/notifications', getNotifications);
router.get('/profile/:username', getProfile);
router.get('/view-tweet/:tweet_id', getTweet);

// PUT Requests
router.put('/edit-profile', editProfile);
router.put('/change-password', changePassword);
router.put('/change-profile-picture', changeProfilePicture);

async function logInUser(req, res, next) {};
async function registerUser(req, res, next) {};
async function postTweet(req, res, next) {};
async function getFeed(req, res, next) {};
async function getSearchResults(req, res, next) {};
async function getNotifications(req, res, next) {};
async function getProfile(req, res, next) {};
async function getTweet(req, res, next) {};
async function editProfile(req, res, next) {};
async function changePassword(req, res, next) {};
async function changeProfilePicture(req, res, next) {};

module.exports = router;
