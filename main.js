var http = require("http");
var fs = require("fs");
var url = require("url");
const express = require("express");
const bodyParser = require("body-parser");
var template = require("./template.js");
var edit = require("./edit.js");
const livePage = require("./livePage.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// const session = require("express-session");
// const session1 = express();


// session1.use(session({
//   key: "tMapTest",
//   secret: "mysecret",
//   resave: false,
//   saveUninitialized: true
// })
// );

var app1 = http.createServer(function (request, response) {
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
    const sX = 126.803066712453;  //출발지 x 좌표(ex: 126.803066712453)
    const sY = 37.4637380346779;  //출발지 y 좌표(ex: 37.4637380346779)
    const eX = 126.733648687356;
    const eY = 37.5792212937947;
    const title = edit.filterURL(pathname);
    const HTML = livePage.livePage(request, response, title, sX, sY, eX, eY);
    console.log(response.header);
    console.log("hoo");
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
    const adress_nick = request;
    console.log(adress_nick);
    // response.writeHead(302, { Location: "/" });
    response.writeHead(200);
    response.end("clear");
  }else {
    console.log(pathname);
    response.writeHead(404);
    response.end("Not found");
  }
});
app1.listen(3000);
