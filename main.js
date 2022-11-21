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
const livePage = require("./livePage.js");
const backEnd = require("./backendlogics")
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('/Users/gimjuyeon/Documents/Alert!/style'));
app.use(session({
    key: "is_logined",
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
}));
app.use('*',(request, response, next) => {
  let nearTimeObject = backEnd.getNearTime(request, response)
  request.departTime = nearTimeObject.departure_time
  request.arriveAdress = nearTimeObject.arrive_adress
  request.departrueAdress = nearTimeObject.departrue_adress;
  request.departureTime = nearTimeObject.departure_time;
  next();
})

app.get('/', (request, response) => {
  fs.readFile("./style/images/map.svg", (err, img)=>{
    if (err) {
      console.log(err)
    }
    const title = "메인페이지";
    const header = template.header("로그인 이후 이용 가능 합니다.");
    const body = template.body();
    const HTML = template.HTML(title, header, body);
    // response.writeHead(200, {'Content-Type': 'image/svg+xml'}) //svg+xml 이 부분이 중요//보낼 헤더를 만듬
    // response.write(img);   //본문을 만들고
    // response.end();  //클라이언트에게 응답을 전송한다
    response.send(HTML);
  })
  
})
app.get("/login", (request, response) => {
  if (request.session.is_logined === true) {
    response.redirect("back");
  } else {
    let pathname = url.parse(request.url, true).pathname;
    const title = edit.filterURL(pathname);
    const header = template.header("로그인 이후 이용 가능 합니다.");
    const loginPage = template.login();
    const HTML = template.HTML(title, header, loginPage);
    response.send(HTML);
    
  }
});
app.post('/login_process', (request, response) => {
  let formData = getData.getFormData(request, response);
  validation.verifyLogin(request, response, formData);
})
app.get("/logout_process", (request, response) => {
  if (request.session.is_logined === false){
    response.redirect("/");
  }
  else {
    request.session.destroy(() => { 
      backEnd.alertRedirect(request,response, "로그아웃 되었습니다.", "/");
    });
  }
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
  let object = getData.getFormData(request, response);
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
app.get('/edit_delete_alarm', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  const title = edit.filterURL(pathname);
  if (request.session.is_logined === true) {
    //backEndLogic
    let alarmData = backEnd.editAlarmData(request,response);
    // frontEndPart
    const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
    const body = template.alarm(alarmData);
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect("/login");
  }
})
app.post('/update_alarm', (request, response) => {
  if (request.session.is_logined === true) {
    let pathname = url.parse(request.url, true).pathname;
    // backEndLogic
    const userLocationData = access.query(request, response,`SELECT * FROM Alert.user_location where user_id = "${request.session.userid}";`);
    let body = create.editAlarm(userLocationData , request.body.alarm_id);

    // frontEndPart
    const title = edit.filterURL(pathname);
    const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else {
    response.redirect("/login");
  }
})
app.post('/update_alarm_process', (request, response) => {
  if (request.session.is_logined === true) {
    // backEndLogic
    const alarmFomData = getData.getFormData(request,response)
    backEnd.editAlarm(request, response, alarmFomData);
  } else {
    response.redirect("/login");
  }
})
app.post('/delete_alarm_process', (request, response) => {
  if (request.session.is_logined === true) {
    const alarm_id = request.body.alarm_id;
    access.query(request, response , `DELETE FROM Alert.alarm WHERE alarm_id = '${alarm_id}';`);
    // access.query(request, response , `DELETE FROM Alert.connect WHERE alarm_id = '${alarm_id}';`);
    response.redirect("/alarm");
  } else {
    response.redirect("/login");
  }
})
app.get('/create_userloc', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  fs.readFile(`data/${pathname}`, "utf8", (err, body) => {
    if (request.session.is_logined === true) {
      const title = edit.filterURL(pathname);
      const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
      const body = template.create_userLoc();
      const HTML = template.HTML(title, header, body);
      response.send(HTML);
    } else {
      response.redirect("/login");
    }
  });
})
app.post('/create_userloc_process', (request, response) => {
  const locationData = getData.getFormData(request,response)
  backEnd.createLocation(request, response, locationData);
  response.redirect('/create_userloc');
})
app.get("/edit_delete_userlocation", (request, response) => {
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
    const body = template.edit_delete_userlocation(user_id,nicknameList,adressList);
    const HTML = template.HTML(title, header, body);
    response.send(HTML);
  } else
    response.redirect("/login");
});
app.post('/update_userlocation', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  fs.readFile(`data/${pathname}`, "utf8", (err, body) => {
    if (request.session.is_logined === true) {
      const title = edit.filterURL(pathname);
      const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
      const body = template.edit_userLoc(request.body.userlocation_row);
      const HTML = template.HTML(title, header, body);
      response.send(HTML);
    } else {
      response.redirect("/login");
    }
  });
})
app.post('/update_userlocation_process', (request, response) => {
  if (request.session.is_logined === true) {
    backEnd.editLocation(request, response, request.body);
  } else {
    response.redirect("/login");
  }
})
app.post('/delete_userlocation_process', (request, response) => {
  if (request.session.is_logined === true) {
    const userLocationTable = access.query(request, response , `SELECT * FROM Alert.user_location WHERE (user_id = '${request.session.userid}');`)
    const deleteIndex = request.body.userlocation_row;
    const selectedRow = userLocationTable[deleteIndex];

    access.insertQuery(request, response , 
      `DELETE FROM Alert.user_location WHERE (user_id = '${selectedRow.user_id}' AND nickname = '${selectedRow.nickname}' AND adress = '${selectedRow.adress}');`)
    response.redirect("/profile")
  } else {
    response.redirect("/login");
  }
})
app.get('/live_before_process', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  const title = edit.filterURL(pathname);
  const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
  const HTML = livePage.livePage(request, response, title, header);
  response.send(HTML);
})
app.get('/live', (request, response) => {
  let pathname = url.parse(request.url, true).pathname;
  console.log("passed live_before_process");
  const header = template.header(request.departrueAdress + " " + request.departTime+ " " + request.arriveAdress , "logout_process", "로그아웃");
  const HTML = template.liveBeforeProcess(request,response);
  response.send(HTML);
})
app.use((request, response, next) => {
  response.status(404).send("404 Not Found")
})
app.listen(3000);



























