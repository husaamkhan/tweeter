const express = require('express');
const fs = require("fs");

module.exports = (db, upload, path) => {
	const router = express.Router();

	// POST Requests
	router.post('/login', logInUser);
	router.post('/register', registerUser);
	router.post('/signout', signOutUser);
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
	router.get('/:username/check-username', checkUsername);
	router.get('/authenticate', authenticate);

	// PUT Requests
	router.put('/:username/edit-profile', editProfile);
	router.put('/change-password', changePassword);
	router.put('/:username/change-profile-picture', upload.single("file"), changeProfilePicture);

	async function logInUser(req, res, next) {
		try {
			const { username, password } = req.body;
			const user = await findUser(username);

			if ( user.length === 0 ) {
				res.status(401).send("Access denied");
			}
			else if ( password === user[0].password ) {
				req.session.username = user[0].username;
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

	async function signOutUser(req, res, next) {
		req.session.destroy((err) => {
			if (err) {
				return res.status(500).send("Internal server error");
			}
		});

		res.clearCookie("connect.sid");
		res.status(200).send("Successfully signed out");
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
			console.log(`Error getting user profile: ${err}`);
			res.status(500).send("Internal server error");
		}
	}

	async function getProfileInfo(username) {
		return new Promise((resolve, reject) => {
			const q = "SELECT first_name, last_name, followers, following, password FROM users "
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
			const response = await getProfilePicturePath(req.params.username);
			res.status(200).sendFile(path.resolve(`C:\\TweeterPictures\\${response[0].profile_picture_path}`), (err) => {
				if (err) throw err;
			})
		} catch(err) {
			console.log(`Error getting profile picture: ${err}`)
			res.status(500).send("Internal server error");
		}
	}

	async function getProfilePicturePath(username) {
		return new Promise((resolve, reject) => {
			const q = "SELECT profile_picture_path FROM users WHERE username = ?;";
			db.query(q, [username], (err, result) => {
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

	async function checkUsername(req, res, next) {
		try {
			const users = await findUser(req.params.username);
			if ( users.length == 0 ) {
				res.status(200).send("Username available");
			} else {
				res.status(400).send("Username unavailable");
			}
		} catch (err) {
			res.status(500).send("Internal server error");
		}
	}

	async function authenticate(req, res, next) {
		try {
			if ( req.session.logged_in ) {
				res.status(200).send("User is logged in");
			} else {
				res.status(403).send("User is not logged in")
			}
		} catch (err) {
			req.status(500).send("Internal server error");
		}
	}

	async function editProfile(req, res, next) {
		try {
			const new_profile = req.body;
			await storeUpdatedProfile(new_profile);
			res.status(200).send("Profile updated succesfully");
		} catch (err) {
			res.status(500).send("Internal server error!");
		}
	}

	async function storeUpdatedProfile(new_profile) {
		return new Promise((resolve, reject) => {
			const q = "UPDATE users SET first_name = ?, last_name = ?, username = ?, password = ? "
				+ `WHERE username = ?`;
			db.query(q,
				[new_profile.first_name, new_profile.last_name, new_profile.username,
				new_profile.password, new_profile.old_username], (err, result) => {
					if (err) {
						return reject(err);
					}

					resolve(result);
				}
			);
		});
	}

	async function changePassword(req, res, next) {}

	async function changeProfilePicture(req, res, next) {
		try {
			const pic = await getProfilePicturePath(req.params.username); // get old picture filename
			console.log(pic);
			if (pic[0].profile_picture_path !== "default.jpg") { // delete old picture if its not default picture
				fs.unlinkSync(`C:\\TweeterPictures\\${pic[0].profile_picture_path}`);
			}

			await setProfilePicture(req.params.username, req.file.filename)// set user's profile picture as new picture
			res.status(200).send("Image successfully saved");
		} catch (err) {
			console.log(err);
			res.status(500).send("Internal server error");
		}
	}

	async function removeProfilePicture(username) {
		return new Promise((resolve, reject) => {
			const q = "UPDATE users SET profile_picture_path = default.jpg WHERE username = ?";
			db.query(q, [username], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			})
		});
	}

	async function setProfilePicture(username, filename) {
		return new Promise((resolve, reject) => {
			const q = "UPDATE users SET profile_picture_path = ? WHERE username = ?";
			db.query(q, [filename, username], (err, result) => {
				if (err) {
					return reject(err);
				}

				resolve(result);
			});
		});
	}

	return router;
}
