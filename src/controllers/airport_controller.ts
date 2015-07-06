/* Exports the airportController
 *
 * CRUD under /airport 
 *  - POST /airport
 *  - GET /airport/{key} 
 *  - PATCH&PUT /airport/{key}
 *  - DELETE /airport/{key}
 */

///<reference path="../../typings/tsd.d.ts"/>
import express = require('express');
import mongoose = require('mongoose');

import airportModule = require('../models/airport');
import AirportProperties = airportModule.AirportProperties;
import AirportInterface = airportModule.AirportInterface;
import Airport = airportModule.AirportModel;


var logDataMiddleware = function(request: express.Request, response: express.Response, next: Function) {
    if (request.body.length !== 0) {
        var data = _getData(request);
        console.log("  Airport Controller\n  Data: " + JSON.stringify(data));
    }
    next();
}

export var router = express.Router();
router.use(logDataMiddleware);
router.get('/:key', findByKey);
router.post('/', create);
router.patch('/:key', update);
router.put('/:key', overwrite);
router.delete('/:key', destroy);


/**
 * POST /airport
 */
function create(request: express.Request, response: express.Response, next: Function) {
    var data = _getData(request);
    var onCreate = function(error: any, obj: AirportInterface) {
        if (error) {
            console.error("WARN [Creating] -> %s", error.toString());
            response.status(400).send(error.toString());
        } else {
            response.send("Airport created: " + obj.toString());
            next();
        }
    };
    Airport.create(data, onCreate);
}


/**
 * GET /airport/{key}
 */
function findByKey(request: express.Request, response: express.Response, next: Function) {
    var query = { key: request.params.key };
    var onFind = function(error: any, obj: AirportInterface) {
        if (error) {
            console.error("WARN [Searching %s] -> %s", query, error.toString());
            response.status(400).send(error.toString());
        } else { 
            response.json(obj);
            next();
        }
    }
    Airport.findOne(query, onFind);
}


/**
 * PATCH /airport/{key}
 */
function update(request: express.Request, response: express.Response, next: Function) {
    var data = _getData(request);
    data.key = request.params.key;
    var query = { key: data.key };
    var onFind = function(error: any, obj: AirportInterface) {
        if (error) {
            response.status(400).send(error.toString());
        } else {
            obj.mergeProperties(data);
            obj.save(function(err: any, res: AirportInterface) { _onSave(err, res, response, next); });
        }
    }
    Airport.findOne(query, onFind);
}



/**
 * PUT /airport/{key}
 */
function overwrite(request: express.Request, response: express.Response, next: Function) {
    var data = _getData(request);
    data.key = request.params.key;
    var query = { key: data.key };
    var onFind = function(error: any, obj: AirportInterface) {
        if (error) {
            response.status(400).send(error.toString());
        } else {
            obj.overwriteProperties(data);
            obj.save(function(err: any, res: AirportInterface) { _onSave(err, res, response, next); });
        }
    };
    Airport.findOne(query, onFind);
}


/**
 * DELETE /airport/{key}
 */
function destroy(request: express.Request, response: express.Response, next: Function) {
    var query = { key: request.params.key };
    var onRemove = function(error: any, obj: AirportInterface) {
        if (error) {
            response.status(400).send(error.toString());
        } else {
            response.json(obj);
            next();
        }
    };
    Airport.findOneAndRemove(query, onRemove);
}



/* aux */

function _onSave(error: any, obj: AirportInterface, response: express.Response, next: Function) {
    if (error) {
        console.error("WARN [Saving %s] -> %s", obj._id, error.toString());
    } else {
        response.send("Saved: " + obj.toString());
        next();
    }
}

function _getData(request: express.Request) : AirportProperties {
   return {
        key: request.body.key,
        name: request.body.name,
        lat: request.body.lat,
        lon: request.params.lon,
    };
}
