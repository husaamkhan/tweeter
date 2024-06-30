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

	async function logInUser(req, res, next) {}
	async function registerUser(req, res, next) {
		const { firstname, lastname, username, password } = req.body;
		const user = await findUser(username);

		if (user) {
			console.log(`Error registering user with username '`, username, `': user already exists`);
			res.status(400).send("Username taken");
		} else {
			const q = `INSERT INTO users (username, password, first_name, last_name) VALUES (` +
				`${username}, ${password}, ${firstname}, ${lastname})`;
			await db.query(query, (err, result) => {
				if (err) {
					console.error(`Error executing query: ${q}, ${err}`);
				} else {
					console.log(result);
				}
			})

			res.status(200).send("Successfully registered")
		}
	}

	async function findUser(username) {
		try {
			const q = `SELECT * FROM users WHERE username = ${username}'`;
			await db.query(query, (err, result) => {
				if (err) {
					console.error("Error executing query: " + q + ", err");
				} else {
					console.log(result);
				}
			});
			const user = await query(q);
			return user;
		} catch (err) {
			res.status(500).send("Error fetching user: " + err);
		}
	}

	async function postTweet(req, res, next) {}
	async function getFeed(req, res, next) {}
	async function getSearchResults(req, res, next) {}
	async function getNotifications(req, res, next) {}
	async function getProfile(req, res, next) {}
	async function getTweet(req, res, next) {}
	async function editProfile(req, res, next) {}
	async function changePassword(req, res, next) {}
	async function changeProfilePicture(req, res, next) {}

	return router;
}
