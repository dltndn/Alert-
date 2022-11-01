var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

var app = express()

app.use(session({
  secret: 'reasl secresaet code',
  resave: false,
  saveUninitialized: true
}))

app.get('/', function (req, res, next) {
    console.log(req.session.num);
    if (req.session.num === undefined) {
        req.session.num = 1;
    }
    else {
        req.session.num += 1 ;
    }
  res.send(`${req.session.num}`);
})

app.listen(8080, () => {
    console.log("test");
})