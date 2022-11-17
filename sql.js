var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '11111111',
  database : 'Alert'
});
 
connection.connect();
 
connection.query('select * from user_data;', function (error, results, fields) {
  if (error)  {
    console.log(error);
  }
  console.log(results);
});
 
connection.end();

