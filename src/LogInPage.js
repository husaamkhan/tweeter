import './LogInPage.css'

const LogInPage = () => {
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
				<button>Log In</button>
			</div>
		</div>
	)
}

export default LogInPage
