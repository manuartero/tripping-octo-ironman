/*
 * Exports:
 *
 *  - type    airportModule.Airport                 Logic model
 *  - class   airportModule.AirportImplementation   Usefull just in airport_schema.ts
 */

import connectionModule = require('./connection');
import Connection = connectionModule.Connection;

export interface Airport {
    key:  string;
    name?: string;
    lat?:  number;
    lon?: number;
    connections?: Connection[];
    created_at?: Date;
    updated_at?: Date;

    overwriteProperties?(other: any): void;
    mergeProperties?(other: any): void;
    getConnection?(key: string): Connection;
    addConnections?(cs: Connection[]) : number
    addConnection?(c: Connection): boolean;
    removeConnections?(keys: string[]): number;
    removeConnection?(key: string): Connection;
}


export class AirportImplementation implements Airport {

    key: string;
    name: string;
    lat: number;
    lon: number;
    connections: Connection[];
    created_at: Date;
    updated_at: Date;

    constructor(key: string) {
        this.key = key;
    }

    /**
     * Return the found item or null
     */
    getConnection(key: string): Connection {
        var filteredConnections = this.connections.filter(function(item) {
            return item.key == key;
        });
        return (filteredConnections.length == 0 ? null : filteredConnections[0]);
    }

    /**
     * Return number of added items
     */
    addConnections(cs: Connection[]): number {
        var count = 0;
        for (var c of cs) {
            if (this.addConnection(c)) { count++; }
        }
        return count;
    }

    /**
     * Return success flag
     */
    addConnection(c: Connection): boolean {
        if (!this.connections) { this.connections = []; }
        var connectionIndex = this._search(c.key);
        if (connectionIndex < 0) {
            this.connections.push(c);
            return true;
        }
        return false;
    }

    /**
     * Return the number of removed items
     */
    removeConnections(keys: string[]): number {
        var count = 0;
        for (var key of keys) {
            if (this.removeConnection(key)) { count++; }
        }
        return count;
    }

    /**
     * Return the removed item or null
     */
    removeConnection(key: string): Connection {
        var connectionIndex = this._search(key);
        var removedConnection = null;
        if (connectionIndex >= 0) {
            removedConnection = this.connections.splice(connectionIndex, 1)[0];
        }
        return removedConnection;
    }

    _search(key: string): number {
        for (var c in this.connections) {
            if (this.connections[c].key == key) { return c; }
        }
        return -1;
    }

    toString(): string {
        var o = {
            key: this.key,
            name: this.name,
            lat: this.lat,
            lon: this.lon,
            connections: this.connections
        };
        return JSON.stringify(o);
    }
}
