let mysql = require('mysql');
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');

let app = express();

let sqlManager = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yourpassword"
});


sqlManager.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get("/", function(req, res) {
	res.sendFile('patientLogin.html', { root: path.join(__dirname, '../Frontend') });
});

app.get("/labHome", function(req, res) {
	res.sendFile('poolMapping.html', { root: path.join(__dirname, '../Frontend') });
});

app.post("/login", function(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	if (username && password) {
		sqlManager.query('SELECT * FROM LabEmployee WHERE username = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.username = username;
				res.redirect('/labHome');
			} else {
				res.send('Incorrect Username and/or Password!');
			}
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.listen(8080);
