/*
 * Exports the AirportProperties, AirportInterface and AirportModel
 */

import mongoose = require("mongoose");

export interface AirportProperties {
    key:  string;
    name?: string;
    lat?:  number;
    lon?:  number;
}

export interface AirportInterface extends AirportProperties, mongoose.Document {
    created_at: Date;
    updated_at: Date;
    connections(): AirportInterface[];
}

var airportSchema = new mongoose.Schema({
    key:  {type: String, required: true, uppercase:true, unique:true},
    name: {type: String},
    lat:  {type: Number, default: null},
    lon:  {type:Number,  default: null},
    created_at: {type: Date},
    updated_at: {type: Date},
});

/**
 * created_at & updated_at auto value
 */
airportSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

/**
 * @override
 */
airportSchema.method("toString()", function(){
    return JSON.stringify(this);
});

airportSchema.method("connections", function() {
    // TODO
    return [];
});


export var AirportModel = mongoose.model<AirportInterface>("Airport", airportSchema);
