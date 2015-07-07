/* Exports the connectionController
 *
 * CRUD under /connect
 *  - POST /connect/{:key}
 */

///<reference path="../../typings/tsd.d.ts"/>
import express = require('express');
import Airport = require('../models/airport');
import Connection = require('../models/connection');

export var router = express.Router();
router.use(logDataMiddleware)
router.post('/:key', createConnection);
router.patch('/:from/:to', updateConnection);


/**
 * POST /connect/{:key}
 */
function createConnection(req: express.Request, res: express.Response, next: Function) {
    var query = {key: req.params.key};
    var onFind = function(err: any, airport: Airport.Type) {
        if (err) {
            console.error("WARN [Searching connection (%s)] -> %s", query, err.toString());
            res.status(400).send(err.toString());
        } else {
            var data = getDataFromRequest(req);
            var onCreate = function(err: any, connection: Connection.Type) {
                airport.connections.push(connection);
                airport.save();
                res.send("New connection from " + airport.key + " to " + connection.to);
                next();
            };
            Connection.Model.create(data, onCreate);
        }
    };
    Airport.Model.findOne(query, onFind);
}


/**
 * PATCH /connect/{:from}/{:to}
 */
function updateConnection(req: express.Request, res: express.Response, next: Function) {
    var query = {key: req.params.from};
    var onFind = function(err: any, airport: Airport.Type) {
        // TODO
    }
    Airport.Model.findOne(query, onFind);
}


/* aux */

function logDataMiddleware (req: express.Request, res: express.Response, next: Function) {
    console.log("  Connection controller");
    next();
};

function getDataFromRequest(req: express.Request) : Connection.Properties {
    var data = {to: req.body.to, price: req.body.price};
    console.log("  data: %s", JSON.stringify(data));
    return data;
}
