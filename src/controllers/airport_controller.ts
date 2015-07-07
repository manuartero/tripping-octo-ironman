/* Exports the airportController
 *
 * CRUD under /airport
 *  - POST               /airport
 *  - GET                /airport
 *  - GET                /airport/{key}
 *  - PATCH & PUT        /airport/{key}
 *  - DELETE             /airport/{key}
 */

///<reference path="../../typings/tsd.d.ts"/>
import express = require('express');
import mongoose = require('mongoose');
import Airport = require('../models/airport');


export var router = express.Router();
router.use(logDataMiddleware);
router.get('/:key', findByKey);
router.get('/', listAirports);
router.post('/', create);
router.patch('/:key', update);
router.put('/:key', overwrite);
router.delete('/:key', destroy);


/**
 * POST /airport
 */
function create(req: express.Request, res: express.Response, next: Function) {
    var data = getDataFromRequest(req);
    var onCreate = function(err: any, airport: Airport.Type) {
        if (err) {
            console.error("WARN [Creating] -> %s", err.toString());
            res.status(400).send(err.toString());
        } else {
            res.send("Airport created: " + airport.toString());
            console.log("  New airport: %s", airport.toString());
            next();
        }
    };
    Airport.Model.create(data, onCreate);
}


class AirportList {
    keys: string[];
    total: number;

    constructor() {
        this.keys = [];
    }

    toString() {
        return JSON.stringify(this);
    }
}

/**
 *  GET /airport
 */
function listAirports(req: express.Request, res: express.Response, next: Function) {
    var airportList = new AirportList();
    var finishResponse = function() {
        console.log("  %s", airportList.toString())
        res.json(airportList);
        next();
    };
    var onCount = function(err: any, count: number) {
        if (err) {
            console.error("WARN [Counting airports] -> %s", err.toString());
            res.status(400).send(err.toString());
        } else {
            airportList.total = count;
            finishResponse();
        }
    };
    var onFind = function(err: any, airports: Airport.Type[]) {
        if (err) {
            console.error("WARN [Listing airports] -> %s", err.toString());
            res.status(400).send(err.toString());
        } else {
            for (var i in airports) {
                airportList.keys.push(airports[i].key);
            }
            Airport.Model.count({}, onCount);
        }
    };
    Airport.Model.find({}, onFind).limit(10);
}


/**
 * GET /airport/{key}
 */
function findByKey(req: express.Request, res: express.Response, next: Function) {
    var query = { key: req.params.key };
    var onFind = function(err: any, airport: Airport.Type) {
        if (err) {
            console.error("WARN [Searching airport (%s)] -> %s", query, err.toString());
            res.status(400).send(err.toString());
        } else {
            res.json(airport);
            console.log("  Found: %s", airport.toString());
            next();
        }
    };
    Airport.Model.findOne(query, onFind);
}


/**
 * PATCH /airport/{key}
 */
function update(req: express.Request, res: express.Response, next: Function) {
    var data = getDataFromRequest(req);
    data.key = req.params.key;
    var query = { key: data.key };
    var onFind = function(err: any, airport: Airport.Type) {
        if (err) {
            console.warn("WARN [Searching airport (%s)] ->", query, err.toString());
            res.status(400).send(err.toString());
        } else {
            var onSave = function(err: any, newAirport: Airport.Type) {
                if (err) {
                    console.error("WARN [Saving airport] -> %s", err.toString());
                    res.status(400).send(err.toString());
                } else {
                    res.send("Saved: " + newAirport.toString());
                    console.log("  Airport updated: %s", newAirport.toString());
                    next();
                }
            };
            airport.mergeProperties(data);
            airport.save(onSave);
        }
    }
    Airport.Model.findOne(query, onFind);
}



/**
 * PUT /airport/{key}
 */
function overwrite(req: express.Request, res: express.Response, next: Function) {
    var data = getDataFromRequest(req);
    data.key = req.params.key;
    var query = { key: data.key };
    var onFind = function(err: any, airport: Airport.Type) {
        if (err) {
            console.error("WARN [Searching airport (%s)]", query);
            res.status(400).send(err.toString());
        } else {
            var onSave = function(err: any, newAirport: Airport.Type) {
                if (err) {
                    console.error("WARN [Saving airport] -> %s", err.toString());
                } else {
                    res.send("Saved: " + newAirport.toString());
                    console.log("  Airport updated: %s", newAirport.toString());
                    next();
                }
            };
            airport.overwriteProperties(data);
            airport.save(onSave);
        }
    };
    Airport.Model.findOne(query, onFind);
}


/**
 * DELETE /airport/{key}
 */
function destroy(req: express.Request, res: express.Response, next: Function) {
    var query = { key: req.params.key };
    var onRemove = function(err: any, airport: Airport.Type) {
        if (err) {
            res.status(400).send(err.toString());
        } else {
            res.json(airport);
            next();
        }
    };
    Airport.Model.findOneAndRemove(query, onRemove);
}


/* aux */

function logDataMiddleware(req: express.Request, res: express.Response, next: Function) {
    console.log("  Airport Controller");
    next();
}

function getDataFromRequest(req: express.Request) : Airport.Properties {
    var data = {
        key: req.body.key,
        name: req.body.name,
        lat: req.body.lat,
        lon: req.params.lon,
    };
    console.log("  data: %s", JSON.stringify(data));
    return data;
}
