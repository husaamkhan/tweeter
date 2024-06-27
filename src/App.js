import './App.css';
import LogInPage from './LogInPage';
import RegistrationPage from './RegistrationPage';
import { Route, Routes, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  return (
	  <div className="App">
	  	<Routes>
	  		<Route path="/" element={<LogInPage />}/>
	  	</Routes>
	  </div>
  );
}

export default App;
