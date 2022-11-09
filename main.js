const fs = require("fs");
const url = require("url");
const express = require('express')
const session = require('express-session');
const access = require("./DB/access");
const template = require("./template.js");
const edit = require("./edit.js");
const validation = require("./validation");
const getData = require("./getData")
const create = require("./create");
const backEnd = require("./backendlogics")
const app = express()
const bodyParser = require('body-parser');

app.use(session({
    key: "is_logined",
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.get('*',(request, response, next) => {
  let nearTimeObject = backEnd.getNearTime(request, response)
  request.departTime = nearTimeObject.departure_time
  request.arriveAdress = nearTimeObject.arrive_adress
  request.departrueAdress = nearTimeObject.arrive_adress
  next();
})



app.get('/', (request, response) => {
  const title = "메인페이지";
  const header = template.header("로그인 이후 이용 가능 합니다.");
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
      const header = template.header("로그인 이후 이용 가능 합니다.");
      const HTML = template.HTML(title, header, body);
      response.send(HTML);
    });
  }
});
app.post('/login_process', (request, response) => {
  let formData = getData.getFormData(request, response);
  validation.verifyLogin(request, response, formData);
})
app.post("/logout_process", (request, response) => {
  if (request.session.is_logined === false)
    response.redirect("/");
  else 
    request.session.destroy(() => { response.redirect("/"); });
});
app.get("/signUp", (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  fs.readFile(`DATA/${pathname}`, "utf-8", (err, body) => {
    const title = edit.filterURL(pathname);
    const header = template.header("로그인 이후 이용 가능 합니다.");
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  });
});
app.post('/signUp_process', (request, response) => {
  let object = validation.getFormData(request, response);
  validation.verifySignup(request, response, object);
})
app.get("/profile", (request, response) => {
  if (request.session.is_logined === true) {
    // backEndLogic
    let pathname = url.parse(request.url, true).pathname;
    const userLocationTable = access.query(request, response,`SELECT * FROM Alert.user_location where user_id = "${request.session.userid}";`);
    let nicknameList = [];
    let adressList = [];
    for (let row = 0; row < userLocationTable.length;row++) {
      nicknameList.push(userLocationTable[row].nickname);
      adressList.push(userLocationTable[row].adress);      
    }
    
    // front end part
    let user_id = request.session.userid;
    const title = edit.filterURL(pathname);
    const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
    const body = template.funcname(user_id,nicknameList,adressList);
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else
    response.redirect("/login");
});
app.get('/alarm', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  const title = edit.filterURL(pathname);
  if (request.session.is_logined === true) {
    //backEndLogic
    let alarmData = backEnd.getAlarmData(request,response);
    
    // frontEndPart
    const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
    const body = template.alarm(alarmData);
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect("/login");
  }
})
app.get('/create_alarm', (request, response) => {
  if (request.session.is_logined === true) {
    let pathname = url.parse(request.url, true).pathname;

    // backEndLogic
    const userLocationData = access.query(request, response,`SELECT * FROM Alert.user_location where user_id = "${request.session.userid}";`);
    let body = create.alarm(userLocationData);

    // frontEndPart
    const title = edit.filterURL(pathname);
    const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect("/login");
  }
})
app.post('/create_alarm_process', (request, response) => {
  const alarmFomData = getData.getFormData(request,response)
  backEnd.createAlarm(request, response, alarmFomData);
})
app.get('/live', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  if (request.session.is_logined === true) {
    let nearTime = backEnd.getNearTime(request, response).departure_time;

    // frontEndPart
    const title = edit.filterURL(pathname);
    const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
    const body = template.funcname2(nearTime);
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
      const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
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



























