let mysql = require('mysql');

let sqlManager = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "cse@test2020"
});

sqlManager.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});