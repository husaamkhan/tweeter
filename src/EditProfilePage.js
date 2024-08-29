import axios from 'axios';
import { useLocation } from 'react-router-dom';

const EditProfilePage = () => {
	const location = useLocation();

	if ( !location.state ) {
		return(
			<div className="auth-container">
				<h1>Error! No profile information available! Please try again later.</h1>
			</div>
		);
	}

	return(
		<div className="auth-container">
			<h1>Edit Profile</h1>
			<div className="form-container">
				<div className="input-container">
					<label>First Name:</label>
					<input type="text" value={location.state.first_name}></input>
				</div>
				<div className="input-container">
					<label>Last Name:</label>
					<input type="text" value={location.state.last_name}></input>
				</div>
				<div className="input-container">
					<label>Username:</label>
					<input type="text" value={location.state.username}></input>
				</div>
				<div className="input-container">
					<label>Password:</label>
					<input type="password" value={location.state.password}></input>
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
