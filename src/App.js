import './App.css';
import LogInPage from './LogInPage';
import RegistrationPage from './RegistrationPage';
import HomePage from './HomePage';
import SearchPage from './SearchPage'
import NotificationsPage from './NotificationsPage';
import ProfilePage from './ProfilePage';
import PostPage from './PostPage';
import { BrowserRouter as Router, Route, Routes, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
				</Routes>
			</Router>
	  	</div>
  	);
}

export default App;
