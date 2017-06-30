/**
 * Created by liushoubin on 23/6/17.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'root',
    database:'ETOKEN'
});



module.exports = connection;
