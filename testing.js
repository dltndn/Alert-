const fs = require("fs");
const url = require("url");
const express = require('express')
const template = require("./template.js");
const edit = require("./edit.js");

const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('/Users/gimjuyeon/Documents/Alert!/style'));

app.get('/', (request, response) => {
  const title = "메인페이지";
  const header = template.header("로그인 이후 이용 가능 합니다.");
  const body = template.body();
  const HTML = template.HTML(title, header, body);
  response.send(HTML);
})
app.get("/login", (request, response) => {
  
let pathname = url.parse(request.url, true).pathname;
fs.readFile(`DATA/${pathname}`, "utf8", (err, body) => {
    let title = edit.filterURL(pathname);
    let header = template.header("로그인 이후 이용 가능 합니다.");
    let HTML = template.HTML(title, header, body);
    
    response.sendFile('/tesing.html');
    response.end();
});

});

app.use((request, response, next) => {
  response.status(404).send("404 Not Found")
})
app.listen(3000);



























