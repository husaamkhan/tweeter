const express = require('express');
const path = require('path');
const app = express();
const db_config = require('./config');

// Serve static files for production build. (NOT FOR LOCAL DEVELOPMENT SERVER)
// app.use(express.static(path.join(__dirname, '../src/build')))
app.use(express.json());


const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2');

const db = mysql.createConnection(db_config);

db.connect((err) => {
	if (err) {
		console.error("Error connecting to database: " + err);
		return;
	}
	
	console.log("Successfully connected to database");
})

const session_store = new MySQLStore({}, db);

app.use(session({
	secret: "secret_key",
	resave: true,
	saveUninitialized: true,
	store: session_store
}));

app.use(function (req, res, next) {
	console.log(req.session);
	console.log("Request: " + req.path);
	next();
});

let user_router = require('./user-router.js')(db);
app.use('/user', user_router);
let app_router = require('./app-router.js');
app.use('/app', app_router);

app.use(function (req, res, next) {
	res.status(404).send("404 Not Found!");
});

app.listen(4000, () => {
	console.log("Server running on port 4000");
})

// Exports connection so routers don't have to create their own separate connections
module.exports = { db }; 
