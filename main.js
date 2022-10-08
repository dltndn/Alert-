var http = require('http');
var fs = require('fs');
var url = require('url');
var template = require('./template.js');

 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    function filterURL (queryData_id) {
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
    } 
    else if (pathname === "/login") {
      fs.readFile(`data/${pathname}`, "utf8", function (err, body) {
        const title = filterURL(pathname);
        const header = template.header();
        const HTML = template.HTML(title, header, body);
        response.writeHead(200);
        response.end(HTML);
      });
    } 
    else if (pathname === "/login_process") {
      console.log("passed login process");
      response.writeHead(302, { Location: "/" });
      response.end("clear");
    } 
    // err : 
    else if (pathname === "/signup") {
      const title = filterURL(pathname);
      const header = template.header();
      const body = `${title} 임시 페이지 내용 추가 필요`;
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    }
    else if (pathname === "/profile") {
      const title = filterURL(pathname);
      const header = template.header();
      const body = `${title} 임시 페이지 내용 추가 필요`;
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    } 
    else if (pathname === "/alarm") {
      const title = filterURL(pathname);
      const header = template.header();
      const body =
        `${title} 임시 페이지 내용 추가 필요` +
        `<p><input type="button" name="redirect_create_alarm" onClick="location.href='/create_alarm'" value="알람 생성 버튼"></p>`;
      const HTML = template.HTML(title, header, body);
      response.writeHead(200);
      response.end(HTML);
    } 
    else if (pathname === "/create_alarm") {
      fs.readFile(`data/${pathname}`, "utf8", function (err, body) {
        const title = filterURL(pathname);
        const header = template.header();
        const HTML = template.HTML(title, header, body);
        response.writeHead(200);
        response.end(HTML);
      });
    } 
    else if (pathname === "/create_alarm_process") {
      console.log("passed create alarm process");
      response.writeHead(302, { Location: "/live" });
      response.end("clear");
    }
    
    else if (pathname === "/live") {
      const title = filterURL(pathname);
      const header = template.header();
      const body = `${title} 임시 페이지 내용 추가 필요`;
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