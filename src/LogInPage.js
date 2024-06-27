import './LogInPage.css';
import { useNavigate } from 'react-router-dom';

const LogInPage = () => {
	const navigate = useNavigate();

	const handleLogInClick = () => {
		alert("log in button clicked!");
	}

	const handleRegisterClick = () => {
		navigate("/registration")
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
				<button onClick={handleLogInClick}>Log In</button>
				<button onClick={handleRegisterClick}>Register</button>
			</div>
		</div>
	)
}

export default LogInPage;
