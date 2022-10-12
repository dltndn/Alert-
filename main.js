var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var template = require("./template.js");

console.log("tete");
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  function filterURL(queryData_id) {
    let title = queryData_id.substring(1, queryData_id.length);
    return title;
  }
  if (pathname === "/") {
    if (queryData.id === undefined) {
      const title = "메인페이지";
      const header = template.header();
      const body = template.body();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    } else {
      const header = template.header();
      const body = template.body();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    }
  } else if (pathname === "/login") {
    fs.readFile(`data/${pathname}`, "utf8", function (err, body) {
      const title = filterURL(pathname);
      const header = template.header();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    });
  } else if (pathname === "/login_process") {
    console.log("passed login process");
    response.writeHead(302, { Location: "/" });
    response.end("clear");
  } else if (pathname === "/signUp") {
    fs.readFile(`data${pathname}`, "utf-8", function (err, body) {
      const title = filterURL(pathname);
      const header = template.header();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    });
  } else if (pathname === "/profile") {
    let userID = "mockID";
    let mock_nick_adress = {
      nick: ["mock1", "mock2"],
      adress: ["경기도", "서울시"],
    };
    let len = mock_nick_adress.nick.length;
    let nick_adress_form = ``;
    for (let i = 0; i < len; i++) {
      nick_adress_form += `<p><div>${mock_nick_adress.nick[i]}</div><div> ${mock_nick_adress.adress[i]}</div></p>`;
    }

    const body = `<form method="post" action="">
      <div>
          <p><span>ID</span>${userID}<span>님</span></p>
          <div>${nick_adress_form}</div>
      </div>
      <p><input type="button" value="사용자 정의 위치 생성" onClick="location.href='/create_userloc'"></p>
      <button>수정,삭제</button>
  </form>`;

    const title = filterURL(pathname);
    const header = template.header();
    const HTML = template.HTML(title, header, body);
    response.writeHead(200);
    response.end(HTML);
  } else if (pathname === "/alarm") {
    const title = filterURL(pathname);
    const header = template.header();
    const body =
      `${title} 임시 페이지 내용 추가 필요` +
      `<p><input type="button" name="redirect_create_alarm" onClick="location.href='/create_alarm'" value="알람 생성 버튼"></p>`;
    const HTML = template.HTML(title, header, body);
    response.writeHead(200);
    response.end(HTML);
  } else if (pathname === "/create_alarm") {
    fs.readFile(`data/${pathname}`, "utf8", function (err, body) {
      const title = filterURL(pathname);
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
    let mock_estimated_time = "0:45";
    let mock_start_time = "8:00";
    let mock_arrival_time = "8:45";

    const body = `<form method="post">
    <div>
      <p>예상 소요 시간:${mock_estimated_time}</p>
      <div>
        <p>출발시간:${mock_start_time}</p>
        <p>도착시간:${mock_arrival_time}</p>
      </div>
    </div>
    <p>지도API</p>
    <p>cctv API</p>
  </form>`;
    const title = filterURL(pathname);
    const header = template.header();
    const HTML = template.HTML(title, header, body);
    response.writeHead(200);
    response.end(HTML);
  } else if (pathname === "/create_userloc") {
    fs.readFile(`data/${pathname}`, "utf8", function (err, body) {
      const title = filterURL(pathname);
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
