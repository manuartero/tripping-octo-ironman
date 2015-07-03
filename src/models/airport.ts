import mongoose = require("mongoose");

interface AirportInterface extends mongoose.Document {
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

airportSchema.method("connections", function() {
    // TODO
    return [];
});


export var Airport = mongoose.model<AirportInterface>("Airport", airportSchema);
