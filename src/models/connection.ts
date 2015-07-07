/*
 * Exports:
 *
 *  - type  Connection.Type
 *  - var   Connection.schema
 */

import mongoose = require("mongoose");


export interface Type extends mongoose.Document {
    key: string;
    price?:  number;
}

// export the schema since connection is an embedded document of airport
export var schema = new mongoose.Schema({
    key: {type: String, required: true, uppercase: true},
    price: {type: Number},
});

