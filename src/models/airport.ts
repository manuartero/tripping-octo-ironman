/*
 * Exports the type AirportProperties, the type AirportInterface and the var AirportModel
 */

import mongoose = require("mongoose");
import mongooseUtils = require('../lib/utils/mongoose_utils');

import connectionModule = require('./connection');
import ConnectionProperties = connectionModule.ConnectionProperties;
import ConnectionInterface = connectionModule.ConnectionInterface;
import Connection = connectionModule.ConnectionModel;

var ObjectId = mongoose.Schema.Types.ObjectId;

export interface AirportProperties {
    key:  string;
    name?: string;
    lat?:  number;
    lon?:  number;
}


export interface AirportInterface extends AirportProperties, mongoose.Document {
    created_at: Date;
    updated_at: Date;
    connections: ConnectionInterface[];
    overwriteProperties(other: AirportProperties) : void;
    mergeProperties(other: AirportProperties) : void;
}


var airportSchema = new mongoose.Schema({
    key:  {type: String, required: true, uppercase:true, unique:true},
    name: {type: String},
    lat:  {type: Number, default: null},
    lon:  {type:Number,  default: null},
    connections:[ {type:ObjectId, ref:"Connection", default: []} ],
    created_at: {type: Date},
    updated_at: {type: Date}
});

airportSchema.method('toString', mongooseUtils.toStringOverride);
airportSchema.method('overwriteProperties', mongooseUtils.overwriteProperties);
airportSchema.method('mergeProperties', mongooseUtils.mergeProperties);
airportSchema.pre('save', mongooseUtils.updateAndCreate);


export var AirportModel = mongoose.model<AirportInterface>("Airport", airportSchema);
