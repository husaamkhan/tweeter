import axios from 'axios';
import { useState, useEffect } from 'react';
import Navigation from './Navigation';

const ProfilePage = () => {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading]	= useState(true);
	const [error, setError] = useState(null);

	useEffect( () => {
		const getProfile = async () => {
			const response = await axios.get("/user/myprofile");
			setProfile(response.data);
		}

		getProfile();
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
				<div>
					<img src={`https://localhost:4000/user/profile-picture/${profile.username}`} alt="" />
					<h2>`${profile.firstname} ${profile.lastname}@${profile.username}`</h2>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
