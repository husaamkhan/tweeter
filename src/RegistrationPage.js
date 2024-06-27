const RegistrationPage = () => {
	const handleCreateAccountClick = () => {};

	return (
		<div className="registration-div">
			<h1 className="logo">Tweeter</h1>
			<label for="firstname-input">First Name:</label>
			<input type="text" id="firstname-input"/>
			<label for="lastname-input">Last Name:</label>
			<input type="text" id="lastname-input"/>
			<label for="username-input">Username:</label>
			<input type="text" id="username-input"/>
			<label for="password-input">Password:</label>
			<input type="text" id="password-input"/>
			<button onClick={handleCreateAccountClick}>Create Account</button>
		</div>
	);
}

export default RegistrationPage;
