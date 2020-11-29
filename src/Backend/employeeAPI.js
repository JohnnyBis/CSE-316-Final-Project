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

employeeAPI.post("/addPool", (req, res) => {
    let poolBarcode = req.body.poolBarcode;
    let testList = req.body.testList;
    console.log(poolBarcode);
    console.log(testList);

    if (poolBarcode && testList) {
		sqlManager.query('INSERT INTO Pool (poolBarcode) VALUES (?);', [poolBarcode], function(error, results, fields) {
            if (error) throw error;
            try {
                if (didCreatePoolMap(poolBarcode, testList)) res.end();
            } catch (error) {
                throw error;
            }
		});
	} else {
	    res.send('Please enter the employeeID and barcode.');
		res.end();
    }
    return false;
});

function didCreatePoolMap(poolBarcode, testList) {    
    let combinedValues = [];
    for(let i = 0; i < testList.length; i++) {
        combinedValues.push([testList[i], poolBarcode]);
    }

    sqlManager.query('INSERT INTO PoolMap (testBarcode, poolBarcode) VALUES ?;', [combinedValues], function(error, results, fields) {
        if (error) throw error;
        return true
    });
}

module.exports = employeeAPI;