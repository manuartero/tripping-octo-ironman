///<reference path="../typings/tsd.d.ts"/>
import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import AirportController = require('./controllers/airport_controller');
import ConnectionController = require('./controllers/connection_controller');
import SeedController = require('./controllers/seed_controller');
import config = require('./config');


/* APP */
var app = express();
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());
app.use(logRequestMiddleware);
app.use('/airport', AirportController.router);
app.use('/connect', ConnectionController.router);
app.use('/seed', SeedController.router);


/* DB */
var env = process.env.NODE_ENV || 'dev';
var dbName = config.envs[env].db;
mongoose.connect(dbName, function(err: any) {
    err ?
        console.error("Connecting to %s => %s", dbName, err.toString()) :
        console.info("Connected to %s", dbName);
});


/* SERVER */
var server = app.listen(3000, function() {
  console.info('App listening at port %s', server.address().port);
});


/* aux */

function logRequestMiddleware(req: express.Request, res: express.Response, next: Function) {
    console.info("%s at: %s", req.method, req.path);
    console.info("  Headers: %s", JSON.stringify(req.headers));
    console.info("  Body: %s", JSON.stringify(req.body));
    res.type('json');
    next();
};
