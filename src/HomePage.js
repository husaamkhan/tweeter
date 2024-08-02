import Navigation from './Navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
	const [feed, setFeed] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect( () => {
		const fetchFeed = async () => {
			try {
				const response = await axios.get("/user/feed");
				setFeed(response.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		fetchFeed();
	}, []);	

	if ( loading ) {
		return (
			<div className="page-container">
				<Navigation />
				<div className="divider"></div>
				<div className="content-container">
					<h1>Loading...</h1>
				</div>
			</div>
		);
	}

	if ( error ) {
		return (
			<div className="page-container">
				<Navigation />
				<div className="divider"></div>
				<div className="content-container">
					<h1>Oops! An error occured.</h1>
				</div>
			</div>
		);
	}

	return (
		<div className="page-container">
			<Navigation />
			<div className="divider"></div>
			<div className="content-container">
				{feed.length > 0 ? (
					<ul>
						{feed.map((post) => (
							<li key={post.id}>{post.content}</li>
						))}
					</ul>
				) : (
					<h1>No tweets to see yet!</h1>
				)}
			</div>
		</div>
	); 
}

export default HomePage;
