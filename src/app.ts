///<reference path="../typings/tsd.d.ts"/>

import express = require('express');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  console.log('App listening at port %s', server.address().port);
});