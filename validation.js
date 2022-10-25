const mysql = require("mysql");
const DB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "11111111",
  database: "Alert",
});

var MySql = require('sync-mysql');

var syncDB = new MySql({
  host: 'localhost',
  user: "root",
  password: "11111111",
  database: "Alert",
});


module.exports = {
  Login: function (request, response) {
    let id_list = [];
    const user_data = syncDB.query(`SELECT * FROM Alert.user_data;`);
    const rows = syncDB.query(`SELECT COUNT(user_id) as count FROM user_data;`)[0].count;
    for (let i = 0 ; i < rows;i++) {
      id_list.push(user_data[i].user_id);
    }
    
    // form에서 입력한 값 로드
    let login_data = "";
    request.on("data", function (data) {
      login_data += data;
    });
    request.on("end", function () {
      const userdata = new URLSearchParams(login_data);
      const ID = userdata.get("ID");
      const password = userdata.get("PW");
      for (let i = 0; i < rows; i++) {
        if (ID === id_list[i]) {
          if (password === user_data[i].user_password) {
            console.log("correct");
            response.writeHead(302, { Location: "/live" });
            response.end("");
            break;
          } else {
            console.log("비밀번호가 잘못 되었습니다.");
            response.writeHead(302, { Location: "/login" });
            response.end("");
            break;
          }
        } else if (rows - 1 == i) {
          console.log("아이디가 잘못 되었습니다.");
          response.writeHead(302, { Location: "/login" });
          response.end("");
          break;
        }
      }
    });
  },
};
