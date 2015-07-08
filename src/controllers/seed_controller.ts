/* Exports the seedController
 *
 *  - POST /seed
 */

///<reference path="../../typings/tsd.d.ts"/>
import express = require('express');
import CsvHelper = require('../lib/utils/csv_helper');
import Airport = require('../models/airport');

export var router = express.Router();
router.post('/', seedDB);

let DEFAULT_FILE = "/Users/manutero/workspace/personales/tripping-octo-ironman/resources/airports.csv"; // XXX

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
    next();
}

function _onRead(data: RowFromFile[]) {
    for (var o of data) {
        Airport.Model.create({ key: o.key });
    }
}
