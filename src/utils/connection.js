const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"root",
    database:"taskmanager"
});

module.exports = connection;