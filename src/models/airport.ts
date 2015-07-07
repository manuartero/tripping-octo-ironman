/*
 * Exports:
 *
 *  - type  Airport.Type
 *  - var   Airport.Model
 */

import mongoose = require("mongoose");
import mongooseUtils = require('../lib/utils/mongoose_utils');
import Connection = require('./connection');


export interface Type extends mongoose.Document {

    key:  string;
    name?: string;
    lat?:  number;
    lon?: number;
    connections?: Connection.Type[];
    created_at: Date;
    updated_at: Date;

    overwriteProperties(other: any): void;
    mergeProperties(other: any): void;
    getConnection(key: string): Connection.Type;
    addConnections(cs: Connection.Type[]) : number
    addConnection(c: Connection.Type): boolean;
    removeConnections(keys: string[]): number;
    removeConnection(key: string): Connection.Type;
}


var schema = new mongoose.Schema({
    key:  {type: String, required: true, uppercase:true, unique:true},
    name: {type: String},
    lat:  {type: Number, default: null},
    lon:  {type:Number,  default: null},
    connections:[ Connection.schema ],
    created_at: {type: Date},
    updated_at: {type: Date}
});

schema.method('toString', _minString);
schema.method('overwriteProperties', mongooseUtils.overwriteProperties);
schema.method('mergeProperties', mongooseUtils.mergeProperties);
schema.method('getConnection', getConnection);
schema.method('addConnections', addConnections);
schema.method('addConnection', addConnection);
schema.method('removeConnections', removeConnections);
schema.method('removeConnection', removeConnection);
schema.pre('save', mongooseUtils.updateAndCreate);


/**
 * Return the found item or null
 */
function getConnection(key: string): Connection.Type {
    var filteredConnections = this.connections.filter(function(item) {
        return item.key == key;
    });
    return (filteredConnections.length == 0 ? null : filteredConnections[0]);
}

/**
 * Return number of added items
 */
function addConnections(cs: Connection.Type[]): number {
    var count = 0;
    for (var c of cs) {
        if (this.addConnection(c)) { count++; }
    }
    return count;
}

/**
 * Return success flag
 */
function addConnection(c: Connection.Type): boolean {
    if (!this.connections) { this.connections = []; }
    var connectionIndex = _search(c.key);
    if (connectionIndex < 0) {
        this.connections.push(c);
        return true;
    }
    return false;
}

/**
 * Return the number of removed items
 */
function removeConnections(keys: string[]): number {
    var count = 0;
    for (var key of keys) {
        if (this.removeConnection(key)) { count++; }
    }
    return count;
}

/**
 * Return the removed item or null
 */
function removeConnection(key: string): Connection.Type {
    var connectionIndex = _search(key);
    var removedConnection = null;
    if (connectionIndex >= 0) {
        removedConnection = this.connections.splice(connectionIndex, 1)[0];
    }
    return removedConnection;
}

// FIXME: already exists?
function _search(key: string): number {
    for (var c in this.connections) {
        if (this.connections[c].key == key) { return c; }
    }
    return -1;
}

function _minString(): string {
    var s = this.key;
    if (this.name) { s += " (" + this.name + ")"; }
    return s;
}


export var Model = mongoose.model<Type>("Airport", schema);
