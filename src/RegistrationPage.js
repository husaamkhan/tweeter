import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
	const navigate = useNavigate();

	const [data, setData] = useState({
		firstname: "",
		lastname: "",
		username: "",
		password: ""
	});

	const handleRegister = async () => {
		try{
			if ( data.firstname === "" || data.lastname === "" || data.username === "" || 
				data.password === "" ) {
				alert("Please fill all fields!");
				return;
			}

			const response = await axios.post("/user/register", data, {
				headers: {
					"Content-Type": "application/json"
				}
			});

			if ( response.status === 200 ) {
				alert("Registration successful!");
				navigate("/");
			}

		} catch (err) {
			if ( err.response.status === 400 ) {
				alert("That username is already taken! Please try a different username.");
			} else {
				alert("An error occured during registration! Please try again later.");
			}
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setData({
			...data,
			[name]: value
		});
	};

	return (
		<div className="auth-page">
			<div className="auth-container">
				<h1 className="logo">Tweeter</h1>
				<div className="form-container">
					<div className="input-container">
						<label>First Name:</label>
						<input type="text" name="firstname" onChange={handleChange} />
					</div>
					<div className="input-container">
						<label>Last Name:</label>
						<input type="text" name="lastname" onChange={handleChange} />
					</div>
					<div className="input-container">
						<label>Username:</label>
						<input type="text" name="username" onChange={handleChange} />
					</div>
					<div className="input-container">
						<label>Password:</label>
						<input type="password" className="password-input" name="password"
							onChange={handleChange} />
					</div>
				</div>
				<button onClick={ () => { handleRegister() } }>Create Account</button>
			</div>
		</div>
	);
}

export default RegistrationPage;
