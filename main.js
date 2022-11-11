var http = require("http");
var fs = require("fs");
var url = require("url");
var template = require("./template.js");
var edit = require("./edit.js");
const livePage = require("./livePage.js");
const testGetLiveData = require("./getLiveData.js");

//const express = require("express");
// const session = require("express-session");
// const session1 = express();


// session1.use(session({
//   key: "tMapTest",
//   secret: "mysecret",
//   resave: false,
//   saveUninitialized: true
// })
// );

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
    console.log("passed login process");
    response.writeHead(302, { Location: "/" });
    response.end("clear");
  } else if (pathname === "/signUp") {
    fs.readFile(`DATA/${pathname}`, "utf-8", function (err, body) {
      const title = edit.filterURL(pathname);
      const header = template.header();
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    });
  } else if (pathname === "/profile") {
    const title = edit.filterURL(pathname);
    const header = template.header();
    const body = template.profile_body();
    const HTML = template.HTML(title, header, body);
    response.writeHead(200);
    response.end(HTML);
  } else if (pathname === "/alarm") {
    const title = edit.filterURL(pathname);
    const header = template.header();
    const body = template.alarm_body();
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
    const HTML = livePage.livePage(request, response,title);
    response.writeHead(200);
    response.end(HTML);
  }else if (pathname === "/live_before_process") { 
    console.log("passed live_before_process");
    const HTML = template.liveBeforeProcess();
    // response.writeHead(302, { Location: "/live" });
    // request.socket.setTimeout(10000);
    // request.socket.removeAllListeners('timeout'); 
    // request.socket.on('timeout', function () {
    //   response.writeHead(302, { Location: "/live" });
    //   response.end(HTML);
    // });
    response.writeHead(200);
    response.end(HTML);
  }else if (pathname === "/create_userloc") {
    const title = edit.filterURL(pathname);
    const header = template.header();
    const body = template.create_userLoc();
    const HTML = template.HTML(title, header, body);
    response.writeHead(200);
    response.end(HTML);
  } else if (pathname === "/create_userloc_process") {
    console.log("passed login process");
    response.writeHead(302, { Location: "/" });
    response.end("clear");
  }else if (pathname === "/testGetLive") {
    // const startX = 126.803066712453; //출발지 x좌표
    // const startY = 37.4637380346779; //출발지 y좌표
    // const endX = 126.853838305598; //도착지 x좌표
    // const endY = 37.4859944046897; //도착지 y좌표
    // const title = edit.filterURL(pathname);
    // const HTML = testGetLiveData.getLiveData(request, response, title, startX, startY, endX, endY);
    // response.writeHead(200);
    // response.end(HTML);
  } else {
    console.log(pathname);
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
