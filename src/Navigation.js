const Navigation = () => {
	const handleHome = () => {};
	const handleSearch = () => {};
	const handleNotifications = () => {};
	const handleProfile = () => {};
	const handlePost = () => {};
	
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
