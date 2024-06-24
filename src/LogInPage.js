import './LogInPage.css'

const LogInPage = () => {
	const logInClick = () => {
		alert("log in button clicked!");
	}

	const registerClick = () => {
		alert("register button clicked!");
	}

	return (
		<div className="log-in-div">
			<h1 className="logo">Tweeter</h1>	
			<div className="information-div">
				<div className="input-div">
					<label for="username">Username:</label>
					<input type="text" id="username" />
				</div>
				<div className="input-div">
					<label for="password">Password:</label>
					<input type="text" id="password" />
				</div>
			</div>
			<div log-in-buttons>
				<button onClick={logInClick}>Log In</button>
				<button onClick={registerClick}>Register</button>
			</div>
		</div>
	)
}

export default LogInPage
