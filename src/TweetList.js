import axios from 'axios';
import { useState, useEffect } from 'react';

const TweetList = ({ type, username }) => {
	const [tweets, setTweets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect( () => {
		const getTweets = async () => {
			try {
				let endpoint = "";
				switch(type) {
					case "tweets":
						endpoint = `/user/${username}/tweets`;
						break;
					case "replies":
						endpoint = `/user/${username}/replies`;
						break;
					case "likes":
						endpoint = `/user/${username}/likes`;
						break;
					default:
						endpoint = `/user/feed`;
						break;
				}

				const response = await axios.get(endpoint);
				setTweets(response);
			} catch(err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		getTweets();
	}, [type, username]);

	if ( loading ) {
		return (
			<div className="tweets-container">
				<h1>Loading...</h1>
			</div>
		);
	}

	if ( error ) {
		return (
			<div className="tweets-container">
				<h1>Oops! An error occured!</h1>
			</div>
		);
	}

	return (
		<div className="page-container">
			{tweets.length > 0 ? (
				<ul className="tweets-list">
				</ul>
			) : (
				<h1>Nothing here yet!</h1>
			)}
		</div>
	);
};

export default TweetList;
