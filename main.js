const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const url = require("url");
const template = require("./template.js");
const edit = require("./edit.js");
const mysql      = require('mysql');
const DB = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '11111111',
  database : 'Alert'
});
 
 
DB.connect();

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  
  if (pathname === "/") {
    if (queryData.id === undefined) {
      const title = "메인페이지";
      const header = template.header();
      const body = template.body();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    } else {
      const title = "메인페이지";
      const header = template.header();
      const body = template.body();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    }
  } else if (pathname === "/login") {
    fs.readFile(`DATA/${pathname}`, "utf8", function (err, body) {
      const title = edit.filterURL(pathname);
      const header = template.header();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    });
  } else if (pathname === "/login_process") {
    
    DB.query(`SELECT user_id FROM Alert.user_data;`, function (error, users_id) {
      if (error) {
        throw error;
      }
      DB.query(`SELECT COUNT(user_id) as count FROM user_data`, function (error2, rows) {
        if (error2) {
          throw error2;
        }
        // DB 인스턴스의 개수
        let count = rows[0].count;
        id_list = [];
        // DB의 user_id값을 전부 불러옴
        for (let i = 0 ; i < count;i++) {
          id_list.push(users_id[i].user_id);
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
          
          for (let i = 0 ; i < count;i++) {
            if (ID === users_id[i].user_id) {
              DB.query(`SELECT * FROM user_data WHERE user_id = '${ID}'`, function (error, user_data) {
                if (error) {
                  throw error;
                }
                if (password === user_data[0].user_password) {
                  response.writeHead(302, { Location: "/live" });
                  response.end("clear");
                } else {
                  console.log("비밀번호가 잘못 되었습니다.");
                  response.writeHead(302, { Location: "/login" });
                  response.end("clear");
                }
              });
            }
            else if (count - 1 === i) {
              // alert("아이디가 잘못 되었습니다.");
              console.log("아이디가 잘못 되었습니다.");
              response.writeHead(302, { Location: "/login" });
              response.end("clear");
            }
          }
        });
      });
    })








      
 
  } else if (pathname === "/signUp") {
    fs.readFile(`DATA/${pathname}`, "utf-8", function (err, body) {
      const title = edit.filterURL(pathname);
      const header = template.header();
      const HTML = template.HTML(title,header, body);
      response.writeHead(200);
      response.end(HTML);
    });
    
  } else if (pathname === "/signUp_process") {
    // 중복확인 필요, 패스워드 동일 여부
    // 회원의 아이디 정보    
    // console.log("passing process");
    // DB.query(`SELECT user_id FROM Alert.user_data`, function(error,user_id_data){
    //   if(error){
    //     throw error;
    //   }
    //   // 회원의 수
    //   DB.query(`SELECT COUNT(user_id) FROM user_data;`, function(error2,count){
    //     if(error2){
    //       throw error2;
    //     }
      
    //     console.log(count);
    //     console.log(user_id_data);
        
    //   });
      
      
    // });



    // 입력부
    let signup_data = "";
    request.on("data", function (data) {
      signup_data += data;
    });
    request.on("end", function () {
      const userdata = new URLSearchParams(signup_data);
      const ID = userdata.get("ID");
      const password = userdata.get("pwd");
      DB.query(`INSERT INTO user_data (user_id, user_password) VALUES(?, ?)`, [ID, password], function (error, result) {
          if (error) {
            throw error;
      }});
    });
    response.writeHead(302, { Location: `/profile` });
    response.end();
  } else if (pathname === "/profile") {
    DB.query(`SELECT user_id FROM Alert.user_data;`, function (error, user_data) {
      if (error) {
        throw error;
      }
      let user_id = user_data[0].user_id;
      console.log(user_id);
      const title = edit.filterURL(pathname);
      const header = template.header();
      const body = template.funcname(user_id);
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    });
  } else if (pathname === "/alarm") {
    const title = edit.filterURL(pathname);
    const header = template.header();
    const body = template.alarm(title);
    const HTML = template.HTML(title, header, body);
    response.writeHead(200);
    response.end(HTML);
  } else if (pathname === "/create_alarm") {
    fs.readFile(`data/${pathname}`, "utf8", function (err, body) {
      const title = edit.filterURL(pathname);
      const header = template.header();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    });
  } else if (pathname === "/create_alarm_process") {
    console.log("passed create alarm process");
    response.writeHead(302, { Location: "/live" });
    response.end("clear");
  } else if (pathname === "/live") {
    const title = edit.filterURL(pathname);
    const header = template.header();
    const body = template.funcname2();
    const HTML = template.HTML(title, header, body);
    response.writeHead(200);
    response.end(HTML);
  } else if (pathname === "/create_userloc") {
    fs.readFile(`data/${pathname}`, "utf8", function (err, body) {
      const title = edit.filterURL(pathname);
      const header = template.header();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    });
  } else if (pathname === "/create_userloc_process") {
    console.log("passed login process");
    response.writeHead(302, { Location: "/" });
    response.end("clear");
  } else {
    console.log(pathname);
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
