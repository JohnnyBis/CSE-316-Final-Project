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
            if (error != null) {
                throw new Error("Error: " + error);
            }
            console.log("Successfully saved employee test result.");
            res.redirect('../static/testCollection.html');
			res.end();
		});
	} else {
		res.send('Please enter the employeeID and barcode.');
		res.end();
    }
    return false;
});

employeeAPI.get("/queryDB/all", (req, res) => {
    sqlManager.query('SELECT testBarcode, employeeID FROM EmployeeTest;', function(error, results, fields) {
        if (error != null) {
            throw new Error('Database failed to connect!');
        }
        res.json(results);
    });
});

employeeAPI.get("/deleteTest/:barcodeID", (req, res) => {
    let id = req.params.barcodeID;
    sqlManager.query(`DELETE FROM EmployeeTest WHERE EmployeeTest.testBarcode = '${id}';`, function(error, results, fields) {
        if (error) throw error;
        console.log(results, fields);
        res.send("Successfully deleted test.");
        res.end();
    });
});

module.exports = employeeAPI;