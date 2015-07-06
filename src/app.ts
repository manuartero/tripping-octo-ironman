///<reference path="../typings/tsd.d.ts"/>
import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');


/* airport resource */
import airportControllerModule = require('./controllers/airport_controller');
import airportRouter = airportControllerModule.router;


/* DB */
mongoose.connect('mongodb://localhost/tripping-octo-ironman');


/* middlewares */
var loggerMiddleware = function(request: express.Request, response: express.Response, next: Function) {
    console.log("%s at: %s", request.method, request.path);
    console.log("Headers: %s", JSON.stringify(request.headers));
    console.log("Body: %s", JSON.stringify(request.body));
    next();
};

var errorMiddleware = function(error: any, request: express.Request, response: express.Response, next: Function) {
    console.error(error.stack);
    response.sendStatus(500);
};


/* APP */
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(loggerMiddleware);
app.use('/airport', airportRouter);
app.use(errorMiddleware);


/* SERVER */
var server = app.listen(3000, function () {
  console.log('App listening at port %s', server.address().port);
});
