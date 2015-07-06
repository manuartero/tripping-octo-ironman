///<reference path="../typings/tsd.d.ts"/>
import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');


/* airport resource */
import AirportController = require('./controllers/airport_controller');
import ConnectionController = require('./controllers/connection_controller');

/* DB */
mongoose.connect('mongodb://localhost/tripping-octo-ironman');


/* middlewares */
var logRequestMiddleware = function(request: express.Request, response: express.Response, next: Function) {
    console.log("%s at: %s", request.method, request.path);
    console.log("  Headers: %s", JSON.stringify(request.headers));
    console.log("  Body: %s \n", JSON.stringify(request.body));
    next();
};

var errorMiddleware = function(error: any, request: express.Request, response: express.Response, next: Function) {
    console.error(error.stack);
    response.sendStatus(500);
};

var logResponseMiddleware = function(request: express.Request, response: express.Response, next: Function) {
    console.log("\n  Response for %s at %s: %s\n", request.method, request.path, response.statusCode);
    next();
}

/* APP */
var app = express();
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());
app.use(logRequestMiddleware);
app.use('/airport', AirportController.router);
app.use('/connect', ConnectionController.router);
app.use(logResponseMiddleware);
app.use(errorMiddleware);


/* SERVER */
var server = app.listen(3000, function () {
  console.log('App listening at port %s', server.address().port);
});
