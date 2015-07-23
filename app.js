var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');

var app = express();
app.use('/json', express.static(path.join(__dirname, 'json')));
app.use('/img', express.static(path.join(__dirname, 'img')));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(8888);
