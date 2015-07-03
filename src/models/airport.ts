/*
 * Exports the AirportInterface and the AirportModel
 */


import mongoose = require("mongoose");

export interface AirportInterface extends mongoose.Document {
    key:  string;
    name: string;
    lat:  number;
    lon:  number;
    connections() : AirportInterface[];
}

var airportSchema = new mongoose.Schema({
    key:  {type: String, required: true},
    name: {type: String},
    lat:  {type: Number},
    lon:  {type:Number}
});

airportSchema.method("toString()", function(){
    return JSON.stringify(this);
});

airportSchema.method("connections", function() {
    // TODO
    return [];
});

export var AirportModel = mongoose.model<AirportInterface>("Airport", airportSchema);
