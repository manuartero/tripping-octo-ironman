///<reference path="../typings/tsd.d.ts"/>

import express = require('express');


import ObjectUtilsModule = require('./lib/utils/object-utils');
import HttpDownloaderModule = require('./lib/utils/http-downloader');
var HttpDownloader = HttpDownloaderModule.HttpDownloader;
var ObjectUtils = ObjectUtilsModule.instance;
var o1 = {a:"as", b:1, c:undefined};
var o2 = {a:"dd", c:42};


var app = express();

app.get('/', function (req, res) {
    console.log("COMPLETE: "  + JSON.stringify(ObjectUtils.complete(o1, o2)));
    console.log("OVERWRITE: " + JSON.stringify(ObjectUtils.overwrite(o1, o2)));
});

var server = app.listen(3000, function () {
  console.log('App listening at port %s', server.address().port);
});