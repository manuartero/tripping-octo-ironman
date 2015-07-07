/* Exports the connectionController
 *
 * CRUD under /connect 
 *  - POST /connect/{:key}
 */

///<reference path="../../typings/tsd.d.ts"/>
import express = require('express');
import mongoose = require('mongoose');
import Airport = require('../models/airport');
import Connection = require('../models/connection');


var logDataMiddleware = function(request: express.Request, response: express.Response, next: Function) {
    if (request.body.length !== 0) {
        // FIXME: dobule call to _getData; how to pass data to next() ?
        var data = _getData(request);
        console.log("  Connection controller\n  Data: %s", JSON.stringify(data));
    }
    next();
}


export var router = express.Router();
router.use(logDataMiddleware)
router.post('/:key', create);


/**
 * POST /connect/{:key}
 */
function create(request: express.Request, response: express.Response, next: Function) {
    var query = {key: request.params.key};
    Airport.Model.findOne(query, function(error: any, airport: Airport.Type) {
        if (error) {
            response.status(400).send(error.toString());
        } else {
            var data = _getData(request);
            Connection.Model.create(data, function(error: any, connection: Connection.Type){
                airport.connections.push(connection);
                airport.save();
                response.send("New connection from " + airport.key + " to " + connection.to);
                next();
            });
        }
    });
}


function _getData(request: express.Request) : Connection.Properties {
   return {
        to: request.body.to,
        price: request.body.price
    };
}
