/* Export the airportController 
 *
 */
 
///<reference path="../../typings/tsd.d.ts"/>
import express = require("express");
import mongoose = require("mongoose");

import airportModule = require("../models/airport");
import AirportInterface = airportModule.AirportInterface;
import Airport = airportModule.AirportModel;

export var router = express.Router();
router.get('/:key', findByKey);
router.post('/', create);

function create(request: express.Request, res: express.Response) {
    var data = {
        key: request.body.key,
        name: request.body.name,
        lat: request.params.lat,
        lon: request.params.lon
    };
    var onCreate = function(error: any, obj: AirportInterface) {
        error ? res.send(400) : res.send("Airport created: " + obj.toString());
    };
    Airport.create(data, onCreate);
}

function findByKey(request: express.Request, res: express.Response) {
    var data = { key: request.params.key };
    var onFind = function(error: any, obj: AirportInterface) {
        error ? res.send(400) : res.json(obj);
    }
    Airport.findOne(data, onFind);
}
