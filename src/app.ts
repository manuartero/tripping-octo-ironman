///<reference path="../typings/tsd.d.ts"/>
import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');

/* controllers */
import AirportController = require('./controllers/airport_controller');
import ConnectionController = require('./controllers/connection_controller');
import SeedController = require('./controllers/seed_controller');


/* DB */
mongoose.connect('mongodb://localhost/tripping-octo-ironman');


/* APP */
var app = express();
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());
app.use(logRequestMiddleware);
app.use('/airport', AirportController.router);
app.use('/connect', ConnectionController.router);
app.use('/seed', SeedController.router);
app.use(notFoundMiddleware);


/* SERVER */
var server = app.listen(3000, function() {
  console.info('App listening at port %s', server.address().port);
});


/* middlewares */

// FIXME NOT WORKING AS EXPECTED
function notFoundMiddleware(req: express.Request, res: express.Response, next: Function) {
    res.status(404).end('Cannot ' + req.method + ' at ' + req.path);
}

function logRequestMiddleware(req: express.Request, res: express.Response, next: Function) {
    console.info("%s at: %s", req.method, req.path);
    console.info("  Headers: %s", JSON.stringify(req.headers));
    console.info("  Body: %s", JSON.stringify(req.body));
    next();
};
