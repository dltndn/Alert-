// asynchronous 

const mysql = require("mysql");
/** 동기적 데이터 베이스 접근 시 사용
   */
const asyncDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "11111111",
    database: "Alert",
});

// asynchronous

const MySql = require('sync-mysql');
/** 비동기적 데이터베이스 접근 시 사용
   */
const syncDB = new MySql({
    host: 'localhost',
    user: "root",
    password: "11111111",
    database: "Alert",
});

module.exports = asyncDB;
module.exports = syncDB;