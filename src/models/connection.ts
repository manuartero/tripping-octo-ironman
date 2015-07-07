/*
 * Exports:
 *
 *  - type Connection.Properties
 *  - type Connection.Type
 *  - var Connection.Model
 */

import mongoose = require("mongoose");
import mongooseUtils = require('../lib/utils/mongoose_utils');

var ObjectId = mongoose.Schema.Types.ObjectId;
var relationship = require("mongoose-relationship");


export interface Properties {
    to: string;
    price?:  number;
}


export interface Type extends Properties, mongoose.Document {
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


export var Model = mongoose.model<Type>("Connection", connectionSchema);
