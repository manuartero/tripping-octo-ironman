/* Export the airportController 
 *
 */
 
///<reference path="../../typings/tsd.d.ts"/>
import express = require("express");
import mongoose = require("mongoose");

import airportModule = require("../models/airport");
import AirportProperties = airportModule.AirportProperties;
import AirportInterface = airportModule.AirportInterface;
import Airport = airportModule.AirportModel;

export var router = express.Router();
router.get('/:key', findByKey);
router.post('/', create);
router.patch('/:key', update);
router.put('/:key', overwrite);


/* private functions */

/**
 * POST /airport
 */
function create(request: express.Request, res: express.Response) {
    var data = getData(request);
    var onCreate = function(error: any, obj: AirportInterface) {
        error ? res.sendStatus(400) : res.send("Airport created: " + obj.toString());
    };
    Airport.create(data, onCreate);
}

/**
 * GET /airport/{key}
 */
function findByKey(request: express.Request, res: express.Response) {
    var query = { key: request.params.key };
    var onFind = function(error: any, obj: AirportInterface) {
        error ? res.sendStatus(400) : res.json(obj);
    }
    Airport.findOne(query, onFind);
}

/**
 * PATCH /airport/{key}
 */
function update(request: express.Request, res: express.Response) {
    var data = getData(request);
    console.log("DATA: " + JSON.stringify(data));
    data.key = request.params.key;
    var query = { key: data.key };
    var onFind = function(error: any, obj: AirportInterface) {
        error ? res.sendStatus(400) : _update(query, obj, res); // FIXME obj
    }
    Airport.findOne(query, onFind);
}

function _update(query: Object, obj: AirportInterface, res: express.Response) {
    var onUpdate = function(error: any, raw: any) {
        error ? res.sendStatus(400) : res.send("Updated: " + obj.toString());
    };
    Airport.update(query, obj, onUpdate);
}

/**
 * PUT /airport/{key}
 */
function overwrite(request: express.Request, res: express.Response) {
    var data = getData(request);
    data.key = request.params.key;
    var query = { key: data.key };
    console.log(JSON.stringify(data));
    var onUpdate = function(error: any, raw: any) {
        console.log(error.toString());
        error ? res.sendStatus(400) : res.send("Updated: " + raw);
    };
    Airport.update(query, data, onUpdate);
}

function getData(request: express.Request) : AirportProperties {
   return {
        key: request.body.key,
        name: request.body.name,
        lat: request.body.lat,
        lon: request.params.lon,
    };
}
