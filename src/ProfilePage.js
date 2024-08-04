import axios from 'axios';
import { useState, useEffect } from 'react';
import Navigation from './Navigation';

const ProfilePage = () => {
	const [profile, setProfile] = useState(null);
	const [profile_pic, setProfilePic] = useState("");
	const [loading, setLoading]	= useState(true);
	const [error, setError] = useState(null);

	useEffect( () => {
		const getProfile = async () => {
			try {
				const response = await axios.get("/user/myprofile");
				setProfile(response.data);
			} catch(err) {
				setError(err.message);
			}
		}

		getProfile();
	}, []);

	useEffect( () => {
		const getProfilePic = async () => {
			try {
				const response = await axios.get(`/user/profile-picture/${profile.username}`, {
					responseType: "blob"
				});

				setProfilePic(URL.createObjectURL(response.data));
			} catch(err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		if ( profile ) { getProfilePic(profile.username); }

		return () => {
			if ( profile_pic ) { URL.revokeObjectURL(profile_pic); }
		};
	}, [profile]);

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
					<h1>{error}</h1>
				</div>
			</div>
		);
	}

	return (
		<div className="page-container">
			<Navigation />
			<div className="divider"></div>
			<div className="profile-container">
				<div className="large-row-container">
					<img className="profile-pic" src={profile_pic} alt="" />
					<button className="edit-profile">Edit Profile</button>
				</div>
				<div className="small-row-container">
					<h1>{profile.first_name} {profile.last_name}@{profile.username}</h1>
				</div>
				<div className="small-row-container">
					<h2 className="profile-info">Followers: {profile.followers}</h2>
					<h2 className="profile-info">Following: {profile.following}</h2>
				</div>
				<div className="small-row-container">
					<ul className="profile-nav-ul">	
						<li className="profile-nav-posts-li">Posts</li>
						<li className="profile-nav-replies-li">Replies</li>
						<li className="profile-nav-likes-li">Likes</li>
					</ul>
				</div>
			</div>
			<div className="divider"></div>
		</div>
	);
}

export default ProfilePage;
