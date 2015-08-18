/* Exports connectionController.router
 *
 * CRUD under /connect
 *  - POST   /connect/{:key}
 *  - PATCH  /coonect/{:from}/{:to}
 */

///<reference path="../../typings/tsd.d.ts"/>
import express = require('express');
import airportModule = require('../models/airport');
import connectionModule = require('../models/connection');
import airportSchema = require('../models/mongo/airport_schema');
import Airport = airportModule.Airport;
import AirportDocument = airportSchema.AirportDocument;

export var router = express.Router();
router.use(logDataMiddleware)
router.post('/:key', createConnection);
router.patch('/:from/:to', updateConnection);


/**
 * POST {key:string, price?:number} /connect/{:key}
 *
 * Responses
 *  - 202 (OK Doing)     {a}
 *  - 400 (Bad Request)  {cause: string}
 *  - 500 (Server Error) {}
 */
function createConnection(req: express.Request, res: express.Response, next: Function) {

    var responseFor = (a: AirportDocument) => {
        if (a) {
            var connection = { key: req.body.key, price: req.body.price };
            var added = a.addConnection(connection);
            if (added) {
                a.save();
                console.info("  Creating new connection: %s", a);
                res.status(202).json(a);
            } else {
                console.info("  Connection already exists");
                res.status(400).json({ cause: "Connection already exists" });
            }
        } else {
            console.info("  Key (from) doesnt exists");
            res.status(400).json({ cause: "Key (from) doesnt exists" });
        }
    },

    onFind = (err: any, a: AirportDocument) => {
        if (err) {
            console.error("  Searching airport (%s) -> %s", { key: req.params.key }, err.toString());
            res.status(500).json(null);
        } else {
            responseFor(a);
        }
    },

    onSearch = (err: any, docs: AirportDocument[]) => {
        if (!err) {
            docs.length > 0 ?
                airportSchema.DB.findOne({ key: req.params.key }, onFind) :
                res.status(400).send("Key (to) doesnt exists");
        }
    };

    if (req.body.key === req.params.key) {
        console.info("  (to) and (from) are not the same");
        res.status(400).json({ cause: "(to) and (from) are not the same" });
    } else {
        req.body.key ?
            airportSchema.DB.find({ key: req.body.key }, onSearch) :
            res.status(400).json({ cause: "key needed" });
    }
}


/**
 * PATCH /connect/{:from}/{:to}
 *
 * Responses
 *
 *  - 500 (Server Error)    {err}
 *  - 501 (Not Implemented) {}
 */
function updateConnection(req: express.Request, res: express.Response) {
    var query = {key: req.params.from},

    onFind = (err: any, a: AirportDocument) => {
        if (err) {
            console.error("  Finding airport (%s) -> ", query, err.toString());
            res.status(500).json(null);
        } else {
            // TODO
            res.status(501).json(null);
        }
    }

    airportSchema.DB.findOne(query, onFind);
}


/* aux */

function logDataMiddleware (req: express.Request, res: express.Response, next: Function) {
    console.log("  Connection controller");
    next();
};
