import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import TweetList from './TweetList';

const ProfilePage = () => {
	const [profile, setProfile] = useState(null);
	const [profile_pic, setProfilePic] = useState("");
	const [loading, setLoading]	= useState(true);
	const [error, setError] = useState(null);
	const [active, setActive] = useState("tweets");

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
	}, [profile, profile_pic]);

	const navigate = useNavigate();
	const handleTweets = () => { setActive("tweets") };
	const handleReplies = () => { setActive("replies") };
	const handleLikes = () => { setActive("likes") };
	const handleEditProfile = () => { 
		if ( profile ) {
			navigate("/edit-profile", { 
				state: {
					first_name: profile.first_name,
					last_name: profile.last_name,
					username: profile.username,
					password: profile.password
				}
			});
		}
	};

	if ( loading ) {
		return (
			<div className="page-container">
				<Navigation />
				<div className="column-divider"></div>
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
				<div className="column-divider"></div>
				<div className="content-container">
					<h1>{error}</h1>
				</div>
			</div>
		);
	}
	
	return (
		<div className="page-container">
			<Navigation />
			<div className="column-divider"></div>
			<div className="profile-container">
				<div className="large-row-container">
					<img className="profile-pic" src={profile_pic} alt="" />
		
					<button 
						className="edit-profile"
						onClick={ () => { handleEditProfile() } }
						disabled={!profile}
					>
						Edit Profile
					</button>

				</div>
				<div className="small-row-container">
					<h1>{profile.first_name} {profile.last_name}@{profile.username}</h1>
				</div>
				<div className="small-row-container">
					<h2 className="profile-info">Followers: {profile.followers}</h2>
					<h2 className="profile-info">Following: {profile.following}</h2>
				</div>
				<div className="row-divider"></div>
				<div className="small-row-container">
					<ul className="profile-nav-ul">	

						<li  
						className="profile-nav-tweets-li"
						id="tweets"
						onClick={ () => { handleTweets() } }
						style={{
							backgroundColor: active === "tweets" ? "#009bff" : "#00102d"
						}}
						>Tweets</li>

						<li 
							className="profile-nav-replies-li"
							id="replies"
							onClick={ () => { handleReplies() } }
							style={{
								backgroundColor: active === "replies" ? "#009bff" : "#00102d"
							}}
						>Replies</li>
						<li
							className="profile-nav-likes-li"
							id="likes"
							onClick={ () => { handleLikes() } }
							style={{
								backgroundColor: active === "likes" ? "#009bff" : "#00102d"
							}}
						>Likes</li>

					</ul>
				</div>
				<div className="row-divider"></div>
				<TweetList type={active} username={profile.username} />
			</div>
			<div className="column-divider"></div>
		</div>
	);
}

export default ProfilePage;
