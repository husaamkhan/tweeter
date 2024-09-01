import './App.css';
import LogInPage from './LogInPage';
import RegistrationPage from './RegistrationPage';
import HomePage from './HomePage';
import SearchPage from './SearchPage'
import NotificationsPage from './NotificationsPage';
import ProfilePage from './ProfilePage';
import PostPage from './PostPage';
import EditProfilePage from './EditProfilePage';
import ChangeProfilePicturePage from "./ChangeProfilePicturePage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<LogInPage />} />
					<Route path="/registration" element={<RegistrationPage />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/notifications" element={<NotificationsPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/post" element={<PostPage />} />
					<Route path="/edit-profile" element={<EditProfilePage />} />
					<Route path="/change-profile-picture" element={<ChangeProfilePicturePage />} />
				</Routes>
			</Router>
	  	</div>
  	);
}

export default App;
