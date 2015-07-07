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
 * POST {key:string, price?:number} /connect/{:key}
 */
function createConnection(req: express.Request, res: express.Response, next: Function) {
    var onFind = function(err: any, doc: Airport.Type) {
        if (err) {
            console.error("Searching airport (%s) -> %s", { key: req.params.key }, err.toString());
            res.status(500).end();
        } else {
            let connection: Connection.Type;
            connection.key = req.body.key;
            connection.price = req.body.price;
            doc.addConnection(connection);
            doc.save();
            res.status(202).send("Creating new connection from " + doc.key + " to " + connection.key);
            next();
         }
    };
    var onSearch = function(err: any, docs: Airport.Type[]) {
        if (!err) {
            docs.length ? Airport.Model.findOne({ key: req.params.key }, onFind) : res.status(400).send("Key doesnt exists");
        }
    };
    req.body.key ?
        Airport.Model.find({ key: req.body.key }, onSearch) :
        res.status(400).send("{key:string, price?:number}. key needed");
}


/**
 * PATCH /connect/{:from}/{:to}
 */
function updateConnection(req: express.Request, res: express.Response, next: Function) {
    var query = {key: req.params.from};
    var onFind = function(err: any, airport: Airport.Type) {
        // TODO
        if (err) {
            console.warn("Finding airport (%s) -> ", query, err.toString());
            res.status(500).end();
        }
    }
    Airport.Model.findOne(query, onFind);
}


/* aux */

function logDataMiddleware (req: express.Request, res: express.Response, next: Function) {
    console.log("  Connection controller");
    next();
};
