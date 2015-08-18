/* Exports the seedController
 *
 *  - POST /seed
 */

///<reference path="../../typings/tsd.d.ts"/>
import express = require('express');
import path = require('path');
import CsvHelper = require('../lib/utils/csv_helper');
import airportModule = require('../models/airport');
import connectionModule = require('../models/connection');
import airportsCrawler = require('../lib/crawlers/airport_codes');
import airportSchema = require('../models/mongo/airport_schema');
import Airport = airportModule.Airport;
import Connection = connectionModule.Connection;
import AirportDocument = airportSchema.AirportDocument;


export var router = express.Router();
router.post('/', seedDB);

let DEFAULT_FILE = path.join(process.env.PWD, 'resources/airports.csv');

interface RowFromFile {
    key: string;
    url: string;
}

/**
 * POST {} /seed
 */
function seedDB(req: express.Request, res: express.Response, next: Function) {
    var csvReader = new CsvHelper.CsvReader();
    csvReader.readAndParse(DEFAULT_FILE, ["key", "url"], _onRead);
    res.status(202).send("Working on...");
    next();
}

function _onRead(data: RowFromFile[]) {
    for (var i in data) {
        airportSchema.DB.create({ key: data[i].key }, function(err: any, doc: AirportDocument) {
            if (i == data.length - 1) { _lastAirportCreated(data); }
        })
    }
}

function _lastAirportCreated(data: RowFromFile[]) {
    var crawler = new airportsCrawler.Crawler();
    for (var i in data) {
        airportSchema.DB.findOne({ key: data[i].key }, function(err: any, doc: AirportDocument) {
            var airportInfo = crawler.parse(data[i].url);
            doc.lat = airportInfo.lat;
            doc.lon = airportInfo.lon;
            for (var connectionKey of airportInfo.connections) {
                var c: Connection = { key: connectionKey };
                doc.addConnection(c);
            }
            doc.save();
        });
    }
}
