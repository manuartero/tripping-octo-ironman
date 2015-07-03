///<reference path="../typings/tsd.d.ts"/>
import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');

import airportControllerModule = require('./controllers/airport_controller');
import airportRouter = airportControllerModule.router;

mongoose.connect('mongodb://localhost/tripping-octo-ironman');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/airport', airportRouter);

var server = app.listen(3000, function () {
  console.log('App listening at port %s', server.address().port);
});
