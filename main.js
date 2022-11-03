const fs = require("fs");
const url = require("url");
const template = require("./template.js");
const edit = require("./edit.js");
const mysql      = require('mysql');
const validation = require("./validation");
const express = require('express')
const session = require('express-session');
const access = require("./DB/access");
const create = require("./create");
const app = express()
const DB = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '11111111',
  database : 'Alert'
});

DB.connect();

app.use(session({
    key: "is_logined",
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
  })
);

var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => {
  const title = "메인페이지";
  const header = template.header();
  const body = template.body();
  const HTML = template.HTML(title, header, body);
  response.send(HTML);
})
app.get("/login", (request, response) => {
  if (request.session.is_logined === true) {
    response.redirect("back");
  } else {
    let pathname = url.parse(request.url, true).pathname;
    fs.readFile(`DATA/${pathname}`, "utf8", (err, body) => {
      const title = edit.filterURL(pathname);
      const header = template.header();
      const HTML = template.HTML(title, header, body);
      response.send(HTML);
    });
  }
});
app.post('/login_process', (request, response) => {
  let o = validation.getFormData(request, response);
  validation.verifyLogin(request, response, o);
})
app.get("/logout_process", (request, response) => {
  if (request.session.is_logined === false) {
    response.redirect("/");
  } else {
    request.session.destroy(() => {
      response.redirect("/");
    });
  }
});
app.get("/signUp", (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  fs.readFile(`DATA/${pathname}`, "utf-8", (err, body) => {
    const title = edit.filterURL(pathname);
    const header = template.header();
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  });
});
app.post('/signUp_process', (request, response) => {
  let o = validation.getFormData(request, response);
  validation.verifySignup(request, response, o);
})
app.get("/profile", (request, response) => {
  if (request.session.is_logined === true) {
    let pathname = url.parse(request.url, true).pathname;
    // let user_data = access.query(`SELECT user_id FROM Alert.user_data;`);

    // backend logic
    // 이부분 수정
    const userLocationData = access.query(request, response,`SELECT * FROM Alert.user_location where user_id = "${request.session.userid}";`);
    let nick = [];
    let adress = [];
    for (let i = 0; i < userLocationData.length;i++) {
      nick.push(userLocationData[i].nickname);
      adress.push(userLocationData[i].adress);      
    }

    // front end part
    let user_id = request.session.userid;
    const title = edit.filterURL(pathname);
    const header = template.header("logout_process", "로그아웃");
    const body = template.funcname(user_id,nick,adress);
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect("/login");
  }
});
app.get('/alarm', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  const title = edit.filterURL(pathname);
  if (request.session.is_logined === true) {
    






    
    // front end part
    const header = template.header("logout_process", "로그아웃");
    const body = template.alarm( );
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect("/login");
  }
})
app.get('/create_alarm', (request, response) => {
  if (request.session.is_logined === true) {
    let pathname = url.parse(request.url, true).pathname;

      //backend part
    const userLocationData = access.query(request, response,`SELECT * FROM Alert.user_location where user_id = "${request.session.userid}";`);
    console.log(userLocationData);
    let body = create.alarm(userLocationData);

    // front
    const title = edit.filterURL(pathname);
    const header = template.header("logout_process", "로그아웃");
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect("/login");
  }
})
app.post('/create_alarm_process', (request, response) => {
  // 데이터 받아오고
















})
app.get('/live', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  if (request.session.is_logined === true) {
    const title = edit.filterURL(pathname);
    const header = template.header("logout_process", "로그아웃");
    const body = template.funcname2();
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect('/login');
  }
})
app.get('/create_userloc', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  fs.readFile(`data/${pathname}`, "utf8", (err, body) => {
    if (request.session.is_logined === true) {
      const title = edit.filterURL(pathname);
      const header = template.header("logout_process", "로그아웃");
      const HTML = template.HTML(title, header, body);
      response.send(HTML);
    } else {
      response.redirect("/login");
    }
  });
})
app.get('/create_userloc_process', (request, response) => {
  response.redirect('/');
})

app.use((request, response, next) => {
  response.status(404).send("404 Not Found")
})
app.listen(3000);

































// var app = http.createServer( (request, response) => {
//   var _url = request.url;
//   var queryData = url.parse(_url, true).query;
//   var pathname = url.parse(_url, true).pathname;
  
//   if (pathname === "/") {
//     if (queryData.id === undefined) {
      
//     } else {
//       const title = "메인페이지";
//       const header = template.header();
//       const body = template.body();
//       const HTML = template.HTML(title, header, body);
//       response.writeHead(200);
//       response.end(HTML);
//     }
//   } else if (pathname === "/login") {
//     fs.readFile(`DATA/${pathname}`, "utf8", (err, body) => {
//       const title = edit.filterURL(pathname);
//       const header = template.header();
//       const HTML = template.HTML(title, header, body);
//       response.writeHead(200);
//       response.end(HTML);
//     });
//   } else if (pathname === "/login_process") {
//     const login_process = async () => {
//       const userData = await validate.getFormData(request, response, "ID", "PW");
//       validate.verifyLogin(request, response, userData);
//       loginStatus = userData.loginStatus;
//       userIndex = userData.userIndex;
//     }
//     login_process();
//   } else if (pathname === "/logout_process") {
//     // validate.Login(request, response);
//   } else if (pathname === "/signUp") {
//     fs.readFile(`DATA/${pathname}`, "utf-8", (err, body) => {
//       const title = edit.filterURL(pathname);
//       const header = template.header();
//       const HTML = template.HTML(title,header, body);
//       response.writeHead(200);
//       response.end(HTML);
//     });
    
//   } else if (pathname === "/signUp_process") {
//     const signupProcess = async () => {
//       const userData = await validate.getFormData(request, response, "ID", "pwd", "contrastPwd");
//       validation.searchUser(request, response, userData);


//     }
//     signupProcess();
    
//     // 아이디 중복 확인
    

//     // 비밀번호 중복 확인
//     // 회원의 아이디 정보
    
    
    



//     // // 입력부
//     // let signup_data = "";
//     // request.on("data", (data) => {
//     //   signup_data += data;
//     // });
//     // request.on("end", () => {
//     //   const userdata = new URLSearchParams(signup_data);
//     //   const ID = userdata.get("ID");
//     //   const password = userdata.get("pwd");
//     //   DB.query(`INSERT INTO user_data (user_id, user_password) VALUES(?, ?)`, [ID, password], (error, result) => {
//     //       if (error) {
//     //         throw error;
//     //   }});
//     // });
//     // response.writeHead(302, { Location: `/profile` });
//     response.writeHead(200);
//     response.end('done');
//   // } else if (pathname === "/checkID_process") {
//   } else if (pathname === "/profile") {
//     DB.query(`SELECT user_id FROM Alert.user_data;`, (error, user_data) => {
//       if (error) {
//         throw error;
//       }
//       let user_id = user_data[2].user_id;
//       const title = edit.filterURL(pathname);
//       const header = template.header();
//       const body = template.funcname(user_id);
//       const HTML = template.HTML(title, header, body);
//       response.writeHead(200);
//       response.end(HTML);
//     });
//   } else if (pathname === "/alarm") {
//     const title = edit.filterURL(pathname);
//     const header = template.header();
//     const body = template.alarm(title);
//     const HTML = template.HTML(title, header, body);
//     response.writeHead(200);
//     response.end(HTML);
//   } else if (pathname === "/create_alarm") {
//     fs.readFile(`data/${pathname}`, "utf8", (err, body) => {
//       const title = edit.filterURL(pathname);
//       const header = template.header();
//       const HTML = template.HTML(title, header, body);
//       response.writeHead(200);
//       response.end(HTML);
//     });
//   } else if (pathname === "/create_alarm_process") {
//     response.writeHead(302, { Location: "/live" });
//     response.end("clear");
//   } else if (pathname === "/live") {
    
//     const title = edit.filterURL(pathname);
//     const header = template.header();
//     const body = template.funcname2();
//     const HTML = template.HTML(title, header, body);
//     response.writeHead(200);
//     response.end(HTML);
//   } else if (pathname === "/create_userloc") {
//     fs.readFile(`data/${pathname}`, "utf8", (err, body) => {
//       const title = edit.filterURL(pathname);
//       const header = template.header();
//       const HTML = template.HTML(title, header, body);
//       response.writeHead(200);
//       response.end(HTML);
//     });
//   } else if (pathname === "/create_userloc_process") {
//     response.writeHead(302, { Location: "/" });
//     response.end("clear");
//   } else {
//     response.writeHead(404);
//     response.end("Not found");
//   }
// });
// app.listen(3000);
