const express = require('express');

module.exports = (db) => {
	const router = express.Router();

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

	async function logInUser(req, res, next) {
		try {
			const { username, password } = req.body;
			const user = await findUser(username);

			if ( user.length === 0 ) {
				res.status(401).send("Access denied");
			}
			else if ( password === user[0].password ) {
				req.session.username = user.username;
				req.session.user_id = user.user_id;
				req.session.logged_in = true;

				res.status(200).send("Access granted");
			} else {
				res.status(401).send("Access denied");
			}
		} catch (err) {
			console.log(`Error logging in user: ${err}`);
			res.status(500).send("Internal Server Error occured while authenticating user");
		}
	}

	async function registerUser(req, res, next) {
		try {
			const { firstname, lastname, username, password } = req.body;
			const user = await findUser(username);

			if ( user.length !== 0 ) {
				res.status(400).send("Username taken");
			} else {
				
				const q = "INSERT INTO users (username, password, first_name, last_name) VALUES (" +
					"?, ?, ?, ?)";

				db.query(q, [username, password, firstname, lastname], (err, result) => {
					if (err) throw err;
				});

				res.status(200).send("Successfully registered");
			}

		} catch (err) {
			res.status(500).send("Internal Server Error occured while registering user");
		}
	}

	async function findUser(username) {
		return new Promise((resolve, reject) => {
			const q = "SELECT * FROM users WHERE username = ?;";

			db.query(q, [username], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	async function postTweet(req, res, next) {}

	async function getFeed(req, res, next) {
		
	}

	async function getSearchResults(req, res, next) {}
	async function getNotifications(req, res, next) {}
	async function getProfile(req, res, next) {}
	async function getTweet(req, res, next) {}
	async function editProfile(req, res, next) {}
	async function changePassword(req, res, next) {}
	async function changeProfilePicture(req, res, next) {}

	return router;
}
