import { useNavigate } from 'react-router-dom';

const Navigation = () => {
	const navigate = useNavigate();

	const handleHome = () => { navigate("/home") };
	const handleSearch = () => { navigate("/search") };
	const handleNotifications = () => { navigate("/notifications") };
	const handleProfile = () => { navigate("/profile") };
	const handlePost = () => { navigate("/post") };
	
	return (
		<div className="nav-container">
			<h1 className="logo">Tweeter</h1>
			<ul className="nav-ul">
				<li className="nav-home-li" onClick={handleHome}>Home</li>
				<li className="nav-li" onClick={handleSearch}>Search</li>
				<li className="nav-li" onClick={handleNotifications}>Notifications</li>
				<li className="nav-li" onClick={handleProfile}>Profile</li>
				<li className="nav-post-li" onClick={handlePost}>Post</li>
			</ul>
		</div>
	)
}

export default Navigation
