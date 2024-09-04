import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import TweetList from './TweetList';

const ProfilePage = () => {
	const [auth, setAuth] = useState(false);
	const [profile, setProfile] = useState(null);
	const [profile_pic, setProfilePic] = useState("");
	const [loading, setLoading]	= useState(true);
	const [error, setError] = useState(false);
	const [active, setActive] = useState("tweets");

	useEffect( () => {
		const getProfile = async () => {
			try {
				const response = await axios.get("user/authenticate");
			} catch (err) {
				if ( err.response.status == 403 ) {
					alert("Please sign in");
				} else {
					alert("Oops! An error occured! Please try again later");
				}

				navigate("/");
			}

			try {
				const response = await axios.get("/user/myprofile");
				setProfile(response.data);
			} catch(err) {
				setError(true);
			}
		};

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
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		if ( profile ) { getProfilePic(); }

		return () => {
			if ( profile_pic ) { URL.revokeObjectURL(profile_pic); }
		};
	}, [profile]);

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

	const handleSignOut = async () => {
		try {
			const response = await axios.post(`/user/signout`);
			alert("Signed out successfully!");
			navigate("/");
		} catch (err) {
			alert("Oops! An error occured while signing you out!");
			navigate("/");
		}
	}

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
					<h1>Oops! An error occured! Please try again later.</h1>
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
						className="large-button"
						onClick={ () => { handleEditProfile() } }
						disabled={!profile}
					>
						Edit Profile
					</button>

					<button
						className="large-button"
						onClick={ handleSignOut }
					>
						Sign Out
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
