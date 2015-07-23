var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');
var Profile = require('./models/Profile');
var _ = require('lodash');

var app = express();
app.use('/json', express.static(path.join(__dirname, 'json')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.use('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', function (req, res) {
  Profile.getProfiles().then(function (profiles) {
    res.render('index.html', {
      profiles: profiles
    });
  });
});

var port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8888;
app.listen(port);
