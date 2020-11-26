const mysql = require('mysql');
const express = require('express');
const employeeAPI = express.Router();

let sqlManager = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
	password: "yourpassword",
	database: "covid_testing_schema" //Change this to your local database name
});

sqlManager.connect( (err) => {
    if (err) throw err;
});

employeeAPI.post("/addTest", (req, res) => {
    let barcode = req.body.barcode;
    let employeeID = req.body.employeeId;
    if (barcode && employeeID) {
		sqlManager.query('INSERT INTO EmployeeTest (testBarcode, employeeID, collectionTime, collectedBy) VALUES (?, ?, "2020-01-19 03:14:07", "100");', [barcode, employeeID], function(error, results, fields) {
            if (error == null) {
                console.log("Successfully saved employee test result.");
                res.redirect('../static/testCollection.html');
            }else{
                console.log("Error: " + error);
            }
			res.end();
		});
	} else {
		res.send('Please enter the employeeID and barcode.');
		res.end();
    }
    return false;
});

module.exports = employeeAPI;


