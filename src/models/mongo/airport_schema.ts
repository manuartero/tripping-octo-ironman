/**
 * Exports
 *
 * - var    airportSchema.DB
 * - type   airportSchema.AirportDocument
 */
import mongoose = require('mongoose');
import airportModule = require('../airport')
import commons = require('../helpers/model_helper');
import AirportImplementation = airportModule.AirportImplementation;


// embedded document
var connectionSchema = new mongoose.Schema({
    key: {type: String, required: true, uppercase: true},
    price: {type: Number},
}, { _id: false });

var airportSchema = new mongoose.Schema({
    key:  {type: String, required: true, uppercase:true, unique:true},
    name: {type: String},
    lat:  {type: Number, default: null},
    lon:  {type:Number,  default: null},
    connections:[ connectionSchema ],
    created_at: {type: Date},
    updated_at: {type: Date}
});

airportSchema.method('toString', AirportImplementation.prototype.toString);
airportSchema.method('overwriteProperties', commons.overwriteProperties);
airportSchema.method('mergeProperties', commons.mergeProperties);
airportSchema.method('getConnection', AirportImplementation.prototype.getConnection);
airportSchema.method('addConnections', AirportImplementation.prototype.addConnections);
airportSchema.method('addConnection', AirportImplementation.prototype.addConnection);
airportSchema.method('removeConnections', AirportImplementation.prototype.removeConnections);
airportSchema.method('removeConnection', AirportImplementation.prototype.removeConnection);
airportSchema.method('_search', AirportImplementation.prototype._search);
airportSchema.pre('save', commons.updateAndCreate);

export interface AirportDocument extends airportModule.Airport, mongoose.Document { }
export var DB = mongoose.model<AirportDocument>("Airport", airportSchema);
