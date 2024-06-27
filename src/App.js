import './App.css';
import LogInPage from './LogInPage';
import RegistrationPage from './RegistrationPage';
import { BrowserRouter as Router, Route, Routes, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<LogInPage />} />
					<Route path="/registration" element={<RegistrationPage />} />
				</Routes>
			</Router>
	  	</div>
  	);
}

export default App;
