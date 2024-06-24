const express = require('express');
const path  require('path');
const app = express();

// Serve static files for production build. (NOT FOR LOCAL DEVELOPMENT SERVER)
// app.use(express.static(path.join(__dirname, '../src/build')))
app.use(express.json());


const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');

const db_config = {
	host: 'localhost',
	port: 3306, // default MySQL port
	user: 'your_mysql_user',
	password: 'your_mysql_password',
	database: 'tweeter_db'
};

const conection = mysql.createConnection(db_config)
const session_store = new MySQLStore({
	createDatabaseTable: true
}, connection);

app.use(session({
	secret: "enter_a_secret_key_here",
	resave: true,
	saveUninitialized: true,
	store: session_store
}));

app.use(req, res, next) {
	console.log(req.session);
	console.log("Request: " + req.path);
	next();
};

let user_router = require('./user-router.js');
app.use('/user', user_router);
let app_router = require('./app-router.js');
app.use('/app', app_router);

app.get('/', sendLogInPage);
app.get('/register', sendRegistrationPage);

app.use(req, res, next) {
	res.status(404).send("404 Not Found!");
};

async function sendLogInPage(req, res, next) {
	if (req.session.logged_in) { // Checks if user already logged in
		res.status(200).send("User already logged in. Redirecting to dashboard");
	}

	res.status(200).send("Sending log in page");
}

async function sendRegistrationPage(req, res, next) {
	res.status(200).send("Sending registration page")
}

app.listen(3000, () => {
	console.log("Server running on port 3000");
})
