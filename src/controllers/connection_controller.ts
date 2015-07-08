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
        } else if (doc) {
            let connection: any; // XXX
            connection = {key: req.body.key, price: req.body.price};
            var added = doc.addConnection(connection);
            if (added) {
                doc.save();
                res.status(202).send("Creating new connection from " + doc.key + " to " + connection.key);
            } else {
                res.status(400).send("Connection already exists. Refused");
            }
            next();
        } else {
            res.status(400).send("Key (from) doesnt exists");
        }
    };
    var onSearch = function(err: any, docs: Airport.Type[]) {
        if (!err) {
            docs.length > 0 ? Airport.Model.findOne({ key: req.params.key }, onFind) : res.status(400).send("Key (to) doesnt exists");
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
        } else {
            res.status(501);
            next();
        }
    }
    Airport.Model.findOne(query, onFind);
}


/* aux */

function logDataMiddleware (req: express.Request, res: express.Response, next: Function) {
    console.log("  Connection controller");
    next();
};
