/* Exports airportController.router
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
import airportModule = require('../models/airport');
import airportHelper = require('./helpers/airport_helper');
import airportSchema = require('../models/mongo/airport_schema');
import Airport = airportModule.Airport;
import AirportList = airportHelper.AirportList;
import AirportDocument = airportSchema.AirportDocument;


export var router = express.Router();
router.use(logDataMiddleware);
router.get('/:key', findByKey);
router.get('/', listAirports);
router.post('/', create);
router.patch('/:key', update);
router.put('/:key', overwrite);
router.delete('/:key', destroy);


/**
 * POST {key, name?, lat?, lon?} /airport
 *
 * Responses
 *
 *  - 201 (OK Created)   {airport}
 *  - 400 (Bad Request)  {cause: string}
 *  - 500 (Server Error) {}
 */
function create(req: express.Request, res: express.Response, next: Function) {
    var data = getDataFromRequest(req);
    var onCreate = (err: any, a: AirportDocument) => {
        if (err) {
            console.error("Creating airport -> %s", err.toString());
            res.status(500).json(null);
        } else {
            console.info("  New airport: %s", a.toString());
            res.status(201).json(a.toString());
        }
    };
    var onFind = (err: any, a: AirportDocument) => {
        if (err) {
            console.error("Finding airport -> %s", err.toString());
            res.status(500).json(null);
        } else if (a) {
            console.info("Duplicated airport -> %s", a.key);
            res.status(400).json({ cause: "Already exists" });
        } else {
            airportSchema.DB.create(data, onCreate);
        }
    };
    data.key ?
        airportSchema.DB.find({key: data.key}, onFind) :
        res.status(400).json({ cause: "key expected" });
}


/**
 *  GET /airport
 *
 * Responses
 *
 *  - 200 (OK Finish)    {list}
 *  - 500 (Server error) {}
 */
function listAirports(req: express.Request, res: express.Response, next: Function) {
    var l = new AirportList(),
    onCount = (err: any, count: number) => {
        if (err) {
            console.error("Counting airports -> %s", err.toString());
            res.status(500).json(null);
        } else {
            l.total = count;
            console.info("  Airports list: %s", l.toString())
            res.status(200).json(l);
        }
    },
    onFind = (err: any, as: AirportDocument[]) => {
        if (err) {
            console.error("Listing airports -> %s", err.toString());
            res.status(500).json(null);
        } else {
            for (var a of as) {
                l.keys.push(a.key);
            }
            airportSchema.DB.count({}, onCount);
        }
    };
    airportSchema.DB.find({}, onFind).limit(10);
}


/**
 * GET /airport/{key}
 *
 * Responses
 *
 *  - 200 (OK Finish)    {a}
 *  - 204 (OK Empty)     {}
 *  - 500 (Server Error) {}
 */
function findByKey(req: express.Request, res: express.Response, next: Function) {
    var query = { key: req.params.key },

    responseFor = (a: AirportDocument) => {
        if (a) {
            console.info("  Found: %s", a.toString());
            res.status(200).json(a);
        } else {
            console.info("  No airport found");
            res.status(204).json(null);
        }
    },

    onFind = (err: any, a: AirportDocument) => {
        if (err) {
            console.error("  Searching airport (%s) -> %s", query, err.toString());
            res.status(500).json(null);
        } else {
            responseFor(a);
        }
    };

    airportSchema.DB.findOne(query, onFind);
}


/**
 * PATCH  {name?, lat? lon?}  /airport/{key}
 *
 * Responses
 *
 *  - 202 (Ok Doing)     {a}
 *  - 400 (Bad Request)  {cause: string}
 *  - 500 (Server Error) {}
 */
function update(req: express.Request, res: express.Response, next: Function) {
    var data = getDataFromRequest(req);
    data.key = req.params.key;
    var query = { key: req.params.key },

    responseFor = (a: AirportDocument) => {
        if (a) {
            a.mergeProperties(data);
            a.save();
            console.info("  Saving airport: %s", a.toString());
            res.status(202).json(a);
        } else {
            console.info("  No airport found");
            res.status(400).json({ cause: "No airport found" });
        }
    },

    onFind = (err: any, a: AirportDocument) => {
        if (err) {
            console.error("  Searching airport (%s) -> %s", query, err.toString());
            res.status(500).json(null);
        } else {
            responseFor(a);
        }
    };

    Object.keys(data).length > 0 ?
        airportSchema.DB.findOne(query, onFind) :
        res.status(400).json({ cause: "(name | lat | lon) expected" });
}


/**
 * PUT  {name?, lat? lon?}  /airport/{key}
 *
 * Responses
 *
 * - 202 (OK Doing)     {a}
 * - 400 (Bad Request)  {cause: string}
 * - 500 (Server Error) {}
 * -
 */
function overwrite(req: express.Request, res: express.Response, next: Function) {
    var data = getDataFromRequest(req);
    var query = { key: req.params.key },

    responseFor = (a: AirportDocument) => {
        if (a) {
            a.overwriteProperties(data);
            a.save();
            console.info("  Saving airport: %s", a.toString());
            res.status(202).json(a);
        } else {
            console.info("  No airport found");
            res.status(400).json({ cause: "No airport found" });
        }
    },

    onFind = (err: any, a: AirportDocument) => {
        if (err) {
            console.error("  Searching airport (%s) -> ]", query);
            res.status(500).json(null);
        } else {
            responseFor(a);
        }
    };

    Object.keys(data).length > 0 ?
        airportSchema.DB.findOne(query, onFind) :
        res.status(400).json({ cause: "(name | lat | lon) expected" });
}


/**
 * DELETE  /airport/{key}
 *
 * Responses
 *
 *  - 202 (OK Doing)      {a}
 *  - 400 (Bad Request)   {cause: "No airport found"}
 *  - 500 (Server Error)  {}
 */
function destroy(req: express.Request, res: express.Response, next: Function) {
    var query = { key: req.params.key },

    responseFor = (a: AirportDocument) => {
        if (a) {
            console.info("  Removing airport: %s", a.toString());
            res.status(202).json(a);
        } else {
            console.info("  No airport found");
            res.status(400).json({ cause: "No airport found" });
        }
    },

    onRemove = (err: any, a: AirportDocument) => {
        if (err) {
            console.error("  Removing airport (%s) -> %s", query, err.toString());
            res.status(500).json(null);
        } else {
            responseFor(a);
        }
    };
    airportSchema.DB.findOneAndRemove(query, onRemove);
}


/* aux */

function logDataMiddleware(req: express.Request, res: express.Response, next: Function) {
    console.log("  Airport Controller");
    next();
}

function getDataFromRequest(req: express.Request) : Airport {
    var data = {
        key: req.body.key,
        name: req.body.name,
        lat: req.body.lat,
        lon: req.params.lon,
    };
    console.log("  data: %s", JSON.stringify(data));
    return data;
}
