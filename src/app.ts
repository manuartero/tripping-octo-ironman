///<reference path="../typings/tsd.d.ts"/>

import express = require('express');
import mongoose = require('mongoose');

import ObjectUtilsModule = require('./lib/utils/object_utils');
import HttpDownloaderModule = require('./lib/utils/http_downloader');
import AirportModule = require('./models/airport');
var HttpDownloader = HttpDownloaderModule.HttpDownloader;
var ObjectUtils = ObjectUtilsModule.instance;
var Airport = AirportModule.Airport;


mongoose.connect('mongodb://localhost/tripping-octo-ironman');
var app = express();

app.get('/', function (req, res) {
    var o1 = {a:"as", b:1, c:undefined};
    var o2 = {a:"dd", c:42};
    var a1 = new Airport({key: "ABC"});
    console.log("COMPLETE: "  + JSON.stringify(ObjectUtils.complete(o1, o2)));
    console.log("OVERWRITE: " + JSON.stringify(ObjectUtils.overwrite(o1, o2)));
    a1.save();
    console.log(a1);
});

var server = app.listen(3000, function () {
  console.log('App listening at port %s', server.address().port);
});
