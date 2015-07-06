/*
 * Exports the type ConnectionProperties, the type ConnectionInterface and the var ConnectionModel
 */

import mongoose = require("mongoose");
import mongooseUtils = require('../lib/utils/mongoose_utils');

import airportModule = require('../models/airport');
import AirportProperties = airportModule.AirportProperties;
import AirportInterface = airportModule.AirportInterface;
import Airport = airportModule.AirportModel;

var ObjectId = mongoose.Schema.Types.ObjectId;
var relationship = require("mongoose-relationship");

export interface ConnectionProperties {
    to: string;
    price?:  number;
}

export interface ConnectionInterface extends ConnectionProperties, mongoose.Document {
    created_at: Date;
    updated_at: Date;
}

var connectionSchema = new mongoose.Schema({
    to: {type: String, required: true, uppercase: true, unique:true},
    price: {type: Number},
    airport: {type: ObjectId, ref:"Parent", childPath:"children" },
    created_at: {type: Date},
    updated_at: {type: Date}
});

connectionSchema.pre('save', mongooseUtils.updateAndCreate);
connectionSchema.plugin(relationship, {relationshipPathName:'airport'} );


export var ConnectionModel = mongoose.model<ConnectionInterface>("Connection", connectionSchema);
