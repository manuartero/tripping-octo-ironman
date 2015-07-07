/*
 * Exports:
 *
 *  - type Airport.Properties
 *  - type Airport.Type
 *  - var Airport.Model
 */

import mongoose = require("mongoose");
import mongooseUtils = require('../lib/utils/mongoose_utils');
import Connection = require('./connection');

var ObjectId = mongoose.Schema.Types.ObjectId;


export interface Properties {
    key:  string;
    name?: string;
    lat?:  number;
    lon?:  number;
}


export interface Type extends Properties, mongoose.Document {
    created_at: Date;
    updated_at: Date;
    connections: Connection.Type[];
    overwriteProperties(other: Properties) : void;
    mergeProperties(other: Properties) : void;
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

airportSchema.method('toString', minString);
airportSchema.method('overwriteProperties', mongooseUtils.overwriteProperties);
airportSchema.method('mergeProperties', mongooseUtils.mergeProperties);
airportSchema.pre('save', mongooseUtils.updateAndCreate);

function minString(): string {
    var s = this.key;
    if (this.name) {
        s += " (" + this.name + ")";
    }
    return s;
}


export var Model = mongoose.model<Type>("Airport", airportSchema);
