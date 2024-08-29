const express = require('express');

module.exports = (db, path) => {
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
	router.get('/myprofile', getMyProfile);
	router.get('/profile-picture/:username', getProfilePicture);
	router.get('/view-tweet/:tweet_id', getTweet);
	router.get('/:username/tweets', getUserTweets);
	router.get('/:username/replies', getUserReplies);
	router.get('/:username/likes', getUserLikes);

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
				req.session.username = user[0].username;
				req.session.user_id = user[0].user_id;
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
		// get user id from request session
		// create query that gets the row in the follows table in which user id matches follower id
		// send query to db
		// get followee id from query result
		// send query to db that matches followee id with tweets
		// add tweets to list
		// repeat for all followees
		// sort tweets by date
		// return tweets

		try {
			const followees = await getFollows(req);
			let tweets = [];

			if ( followees.length > 0 ) {
				for (followee_id in followees) {
					let followee_tweets = await getTweets(followee_tweets);
					
					if ( tweets.length === 0 ) {
						tweets = followee_tweets;
						continue;
					}

					let tweets = merge(followee_tweets, tweets);
				}					
			}

			res.status(200).json(tweets);

		} catch(err) {
			console.log(`Error getting feed: ${err}`);
			res.status(500).send("Internal Server Error occured while getting user's feed");
		}
	}

	async function getFollows(req) {
		return new Promise((resolve, reject) => {
			const q = "SELECT followee_id FROM follows WHERE follower_id = ?;";
			db.query(q, [req.session.user_id], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	async function getTweets(user_id) {
		return new Promise((resolve, reject) => {
			const q = "SELECT * FROM tweets WHERE user_id = ?;";
			db.query(q, [req.session.user_id], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	function mergeTweets(arr1, arr2) {
		let temp = [];

		let i1 = arr1.length-1;
		let i2 = arr2.length-1;
		t = 0;
		 
		while(t < arr1.length+arr2.length && (i1 !== -1 && i2 !== -1)) {
			if ( i1 === -1 ) {
				temp[t] = arr2[i2];
				i2--;
				continue;
			}

			if ( i2 === -1 ) {
				temp[t] = arr1[i1];
				i1--;
				continue;
			}

			if ( compareDate(arr1[i1].date, arr2[i2].date) ) {
				temp[t] = arr1[i1];
				i1--;
			} else {
				temp[t] = arr2[i2];
				i2--;
			}

			t++;
		}
	}

	function compareDate(d1, d2) {
		console.log(d1);
	}

	async function getSearchResults(req, res, next) {}
	async function getNotifications(req, res, next) {}
	async function getProfile(req, res, next) {}

	async function getMyProfile(req, res, next) {
		try {
			let profile = await getProfileInfo(req.session.username);

			if ( profile.length !== 0 ) {
				profile[0].username = req.session.username;
				res.status(200).json(profile[0]);
			} else {
				console.log(`Error: User with username ${req.session.username} not found!`);
				res.status(404).send("User not found");
			}
		} catch(err) {
			console.log(`Error getting user profile: ${err}`)
			res.status(500).send("Internal server error");
		}
	}

	async function getProfileInfo(username) {
		return new Promise((resolve, reject) => {
			const q = "SELECT first_name, last_name, followers, following, posts, likes, password FROM users " 
						+ "WHERE username = ?;";
			
			db.query(q, [username], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	async function getProfilePicture(req, res, next) {
		try {
			const id = await findProfilePictureId(req.params.username);
			const response = await getProfilePicturePath(id[0]);
			const filepath = response[0].filepath;
			
			res.status(200).sendFile(path.resolve(filepath), (err) => {
				if (err) throw err;
			})
		} catch(err) {
			console.log(`Error getting profile picture: ${err}`)
			res.status(500).send("Internal server error");
		}
	}

	async function findProfilePictureId(username) {
		return new Promise((resolve, reject) => {
			const q = "SELECT profile_picture_id FROM users WHERE username = ?;";
			db.query(q, [username], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	async function getProfilePicturePath(id) {
		return new Promise((resolve, reject) => {
			const q = "SELECT filepath FROM profile_pictures WHERE profile_picture_id = ?;";
			db.query(q, [id], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	async function getTweet(req, res, next) {}

	async function getUserTweets(req, res, next) {
		try {
			const user = await findUser(req.params.username);
			const tweets = await retrieveUserTweets(user[0].user_id);
			res.status(200).json(tweets);
		} catch(err) {
			res.status(500).send("Internal server error");
		}

	}

	async function retrieveUserTweets(user_id) {
		return new Promise((resolve, reject) => {
			const q = `SELECT * FROM tweets WHERE user_id = ${user_id}`;
			db.query(q, [user_id], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	async function getUserReplies(req, res, next) {
		try {
			const user = await findUser(req.params.username);
			const reply_ids = await retrieveUserReplies(user[0].user_id);

			let tweets = [];
			for (let i = 0; i < reply_ids.length; i++) {
				tweets[i] = await retrieveTweetById(reply_ids[i])[0];
			}

			res.status(200).json(tweets);
		} catch(err) {
			res.status(500).send("Internal server error");
		}
	}

	async function retrieveUserReplies(user_id) {
		return new Promise((resolve, reject) => {
			const q = `SELECT * FROM replies WHERE user_id = ${user_id}`;
			db.query(q, [user_id], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	async function retrieveTweetById(tweet_id) {
		return new Promise((resolve, reject) => {
			const q = `SELECT * FROM tweet WHERE tweet_id = ${tweet_id}`;
			db.query(q, [tweet_id], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	async function getUserLikes(req, res, next) {}
	async function editProfile(req, res, next) {}
	async function changePassword(req, res, next) {}
	async function changeProfilePicture(req, res, next) {}

	return router;
}
