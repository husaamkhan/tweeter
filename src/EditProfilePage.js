import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const EditProfilePage = () => {
	const location = useLocation();
	const [fn_value, setFirstNameValue] = useState(location.state.first_name)
	const [ln_value, setLastNameValue] = useState(location.state.last_name);
	const [un_value, setUserNameValue] = useState(location.state.username);
	const [pw_value, setPassWordValue] = useState(location.state.password);

	const navigate = useNavigate();
	const checkChanges = () => {
		if ( location.state.first_name === fn_value  && location.state.last_name === ln_value
			&& location.state.username === un_value && location.state.password === pw_value ) {
			return false;
		}

		return true;
	};

	const handleUpdate = async () => {
		alert("update click1");
		if ( checkChanges() ) {
			let changes_ok = true;

			if ( un_value !== location.state.username ) {
				const response = await axios.get(`/user/${un_value}/check-username`);
				if ( response.status !== 200 ) {
					changes_ok = false;
				}
			}

			if ( changes_ok ) {
				const new_profile = {
					"first_name": fn_value,
					"last_name": ln_value,
					"username": un_value,
					"password": pw_value,
					"old_username": location.state.username
				};
				const response = await axios.put(`/user/${location.state.username}/edit-profile`,
					new_profile);

				if ( response.status === 200 ) {
					alert("Profile successfully updated");
				} else {
					alert("Error updating profile! Please try again later!");
				}

				navigate("/profile");
			}
		}
	};
	const handleChangeProfilePicture = () => {
		navigate("/change-profile-picture",
		{
			state: {
				username: location.state.username
			}
		});
	};

	return(
		<div className="auth-container">
			<h1>Edit Profile</h1>
			<div className="form-container">
				<div className="input-container">
					<label>First Name:</label>
					<input
						type="text"
						value={fn_value}
						onChange={(e) => setFirstNameValue(e.target.value)}
					>
					</input>
				</div>
				<div className="input-container">
					<label>Last Name:</label>
					<input
						type="text"
						value={ln_value}
						onChange={(e) => setLastNameValue(e.target.value)}
					></input>
				</div>
				<div className="input-container">
					<label>Username:</label>
					<input
						type="text"
						value={un_value}
						onChange={(e) => setUserNameValue(e.target.value)}
					></input>
				</div>
				<div className="input-container">
					<label>Password:</label>
					<input
						type="password"
						value={pw_value}
						onChange={(e) => setPassWordValue(e.target.value)}
					></input>
				</div>
			</div>
			<div>
				<button onClick={handleUpdate}>Update</button>
				<button onClick={handleChangeProfilePicture}>Change Profile Picture</button>
			</div>
		</div>
	);
}

export default EditProfilePage;
