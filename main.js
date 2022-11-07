const fs = require("fs");
const url = require("url");
const express = require('express')
const session = require('express-session');
const access = require("./DB/access");
const template = require("./template.js");
const edit = require("./edit.js");
const validation = require("./validation");
const create = require("./create");
const backEnd = require("./backendlogics")
const app = express()

app.use(session({
    key: "is_logined",
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
  })
);

let bodyParser = require('body-parser');

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
  let object = validation.getFormData(request, response);
  validation.verifyLogin(request, response, object);
})
app.get("/logout_process", (request, response) => {
  if (request.session.is_logined === false)
    response.redirect("/");
  else 
    request.session.destroy(() => { response.redirect("/"); });
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
    const header = template.header("logout_process", "로그아웃");
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
    let part = backEnd.parsingAlarmData(request,response);
    
    // frontEndPart
    const header = template.header("logout_process", "로그아웃");
    const body = template.alarm(part);
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
    const header = template.header("logout_process", "로그아웃");
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect("/login");
  }
})
app.post('/create_alarm_process', (request, response) => {
  const alarmData = validation.getFormData(request,response)
  
  // backendlogic
  backEnd.createAlarm(request, response, alarmData);
})
app.get('/live', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  if (request.session.is_logined === true) {
    
    // backEndLogic
    let today = new Date();
    // 요일 계산
    let browserDate = today.getDay()
    let browserHours = today.getHours(); // 시
    let browserMinutes = today.getMinutes();  // 분
    // DB에서 테이블 가지고온 후 요일 문자열 비교 => 출발 시간 비교
    let alarmTable = access.query(request, response, `select * from Alert.alarm where user_id = '${request.session.userid}';`)
    let rowCount = alarmTable.length

    let list = []

    // 요일 비교
    for (let row = 0; row < rowCount ;row++) {
      for (let j = 0; j < alarmTable[row].day_of_week.length ;j++) {
        if (browserDate <= parseInt(alarmTable[row].day_of_week.substring(j,j+1))) {
          list.push(alarmTable[row])
          break;
        }
      }
    }

    if (list.length === 0) {
      let min = 6;
      for (let tuples = 0; tuples < rowCount; tuples++) {
        if (min >= parseInt(alarmTable[tuples].day_of_week.substring(0, 1))) {
          min = parseInt(alarmTable[tuples].day_of_week.substring(0, 1));
        }
      }
      for (let tuples = 0; tuples < rowCount; tuples++) {
        if (min === parseInt(alarmTable[tuples].day_of_week.substring(0, 1))) {
          list.push(alarmTable[tuples]);
        }
      }
    }
    // 이 부분 수정
    if (list.length === 0) {
      console.log("등록된 알람이 없음")
    }

    let timelist = [];

    for (let tuples = 0; tuples < list.length ;tuples++) {
      for (let row = 0; row < list[tuples].departure_time.length ;row++) {
        if (list[tuples].departure_time.substring(row,row+1) === ":") {
          let hour = parseInt(list[tuples].departure_time.substring(0,row)); 
          let min = parseInt(list[tuples].departure_time.substring(row+1,parseInt(list[tuples].departure_time.length + 1)))
          if (browserHours === hour && browserMinutes <= min){
            timelist.push(hour*100 + min)
          }
          else if (browserHours < hour) {
            timelist.push(hour*100 + min)
          }
          break;
        }
      }
    }
    
    // 여기 문제
    let departTime = Math.min.apply(null, timelist);
    // let departTime = Math.min(timelist)
    console.log(departTime)
    let result = ""
    if (departTime < 100) {
      result = "0:" + departTime
    }
    else {
      result = Math.floor(departTime/100) + ":" + departTime%100
    }
    console.log(result)

    // frontEndPart
    const title = edit.filterURL(pathname);
    const header = template.header("logout_process", "로그아웃");
    const body = template.funcname2(result);
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



























