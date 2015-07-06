/* Exports the airportController
 *
 * CRUD under /airport 
 *  - POST /airport
 *  - GET /airport/{key} 
 *  - PATCH&PUT /airport/{key}
 *  - DELETE /airport/{key}
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
router.delete('/:key', destroy);


/**
 * POST /airport
 */
function create(request: express.Request, response: express.Response) {
    var data = _getData(request);
    var onCreate = function(error: any, obj: AirportInterface) {
        error ? response.sendStatus(400) : response.send("Airport created: " + obj.toString());
    };
    Airport.create(data, onCreate);
}

/**
 * GET /airport/{key}
 */
function findByKey(request: express.Request, response: express.Response) {
    var query = { key: request.params.key };
    var onFind = function(error: any, obj: AirportInterface) {
        error ? response.sendStatus(400) : response.json(obj);
    }
    Airport.findOne(query, onFind);
}

/**
 * PATCH /airport/{key}
 */
function update(request: express.Request, response: express.Response) {
    var data = _getData(request);
    console.log("DATA: " + JSON.stringify(data));
    data.key = request.params.key;
    var query = { key: data.key };
    var onFind = function(error: any, obj: AirportInterface) {
        error ? response.sendStatus(400) : _update(query, obj, response); // FIXME obj
    }
    Airport.findOne(query, onFind);
}

function _update(query: Object, obj: AirportInterface, response: express.Response) {
    var onUpdate = function(error: any, raw: any) {
        error ? response.sendStatus(400) : response.send("Updated: " + obj.toString());
    };
    Airport.update(query, obj, onUpdate);
}

/**
 * PUT /airport/{key}
 */
function overwrite(request: express.Request, response: express.Response) {
    var data = _getData(request);
    data.key = request.params.key;
    var query = { key: data.key };
    console.log(JSON.stringify(data));
    var onUpdate = function(error: any, raw: any) {
        console.log(error.toString());
        error ? response.sendStatus(400) : response.send("Updated: " + raw);
    };
    Airport.update(query, data, onUpdate);
}

/**
 * DELETE /airport/{key}
 */
function destroy(request: express.Request, res: express.Response) {
    // TODO
}


function _getData(request: express.Request) : AirportProperties {
   return {
        key: request.body.key,
        name: request.body.name,
        lat: request.body.lat,
        lon: request.params.lon,
    };
}
