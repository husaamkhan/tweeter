import './LogInPage.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const LogInPage = () => {
	const navigate = useNavigate();
	const [data, setData] = useState({
		username: "",
		password: ""
	});

	const handleLogIn = async () => {
		try {
			if ( data.username === "" || data.password === "" ) {
				alert("Please fill all fields!");
				return;
			}

			const response = await axios.post("/user/login", data, {
				headers: {
					"Content-Type": "application/json"
				}
			});

			if ( response.status === 200 ) {
				alert("Log in successful!");
			}
		} catch (err) {
			if ( err.response.status === 401 ) {
				alert("Incorrect username or password! Please try again.");
			} else {
				alert("An error occured! Please try again later.");
			}
		}
	};

	const handleRegister = () => {
		navigate("/registration");
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setData({
			...data,
			[name]: value
		});
	};

	return (
		<div className="auth-container">
			<h1 className="logo">Tweeter</h1>	
			<div className="form-container">
				<div className="input-container">
					<label>Username:</label>
					<input type="text" name="username" onChange={handleChange} />
				</div>
				<div className="input-container">
					<label>Password:</label>
					<input type="password" className="password-input" name="password" onChange={handleChange} />
				</div>
			</div>
			<div>
				<button onClick={handleLogIn}>Log In</button>
				<button onClick={handleRegister}>Register</button>
			</div>
		</div>
	);
}

export default LogInPage;
