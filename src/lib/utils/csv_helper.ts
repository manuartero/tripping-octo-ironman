///<reference path="../../../typings/tsd.d.ts"/>
import fs = require('fs');
var parse = require('csv-parse');


/** CsvReader.ConstructorOpts */
export interface ConstructorOpts {
    delimiter: string;
    comment: string;
}

/** CsvHelper.CsvReader */
export class CsvReader {

    private _delimiter: string;
    private _comment: string;

    constructor(opt?: ConstructorOpts) {
        this._delimiter = opt && opt.delimiter ||  ';';
        this._comment = opt && opt.comment || '#';
    }

    read(path: string, callback:(rows: string[]) => any) {
        var self = this;
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                console.error("Reading %s: %s", path, err.toString());
                return;
            }
            var opt = { comment: self._comment, delimiter: self._delimiter };
            parse(data, opt, function(err, rows:string[]) {
                callback(rows);
            });
        });
    }

    /** readAndParse(path, ["A", "B"], foo( [{A, B}, {A, B}...{A, B}] )) */
    readAndParse(path: string, keys: string[], callback: (objs: Object[]) => any) {
        var self = this;
        fs.readFile(path, 'utf8', function(err, data) {
            if (err) {
                console.error("Reading %s: %s", path, err.toString());
                return;
            }
            var opt = { comment: self._comment, delimiter: self._delimiter };
            parse(data, opt, function(err, rows:string[]) {
                var objs = self._asObjs(rows, keys);
                callback(objs);
            });
        });
    }

    private _asObjs(rows: string[], keys: string[]): Object[] {
        var response: Object[] = [];
        for (var row of rows) {
            var item: Object = {}, i:number = 0;
            for (var key of keys) {
                item[key] = row[i++];
            }
            response.push(item);
        }
        return response;
    }

    toString(): string {
        return "{delimiter: '" + this._delimiter + "', comment: '" + this._comment + "'}"
    }
}

