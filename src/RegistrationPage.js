const RegistrationPage = () => {
	const handleCreateAccountClick = () => {};

	return (
		<div className="auth-page">
			<div className="auth-container">
				<h1 className="logo">Tweeter</h1>
				<div className="form-container">
					<div className="input-container">
						<label for="firstname-input">First Name:</label>
						<input type="text" id="firstname-input"/>
					</div>
					<div className="input-container">
						<label for="lastname-input">Last Name:</label>
						<input type="text" id="lastname-input"/>
					</div>
					<div className="input-container">
						<label for="username-input">Username:</label>
						<input type="text" id="username-input"/>
					</div>
					<div className="input-container">
						<label for="password-input">Password:</label>
						<input type="text" id="password-input"/>
					</div>
				</div>
				<button onClick={handleCreateAccountClick}>Create Account</button>
			</div>
		</div>
	);
}

export default RegistrationPage;
