import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const EditProfilePage = () => {
	const location = useLocation();
	const [fn_value, setFirstNameValue] = useState(location.state.first_name)
	const [ln_value, setLastNameValue] = useState(location.state.last_name);
	const [un_value, setUserNameValue] = useState(location.state.username);
	const [pw_value, setPassWordValue] = useState(location.state.password);

	const checkChanges = () => {
		if ( location.state.first_name == fn_value && location.state.last_name == ln_value &&
			location.state.username == un_value && location.state.password == pw_value ) {
			return false;
		}

		return true;
	};
	const handleUpdate = () => {
		if ( checkChanges() ) {
			// check if a user with the username already exists
			// send new profile info to server
		}
	};
	const handleChangeProfilePicture = () => {};

	return(
		<div className="auth-container">
			<h1>Edit Profile</h1>
			<div className="form-container">
				<div className="input-container">
					<label>First Name:</label>
					<input
						type="text"
						value={location.state.first_name}
						onChange={(e) => setFirstNameValue(e.target.value)}
					>
					</input>
				</div>
				<div className="input-container">
					<label>Last Name:</label>
					<input
						type="text"
						value={location.state.last_name}
						onChange={(e) => setLastNameValue(e.target.value)}
					></input>
				</div>
				<div className="input-container">
					<label>Username:</label>
					<input
						type="text"
						value={location.state.username}
						onChange={(e) => setUserNameValue(e.target.value)}
					></input>
				</div>
				<div className="input-container">
					<label>Password:</label>
					<input 
						type="password" 
						value={location.state.password}
						onChange={(e) => setPassWordValue(e.target.value)}
					></input>
				</div>
			</div>
			<div>
				<button>Update</button>
				<button>Change Profile Picture</button>
			</div>
		</div>
	);
}

export default EditProfilePage;
