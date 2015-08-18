import airportModule = require('../models/airport');
import Airport = airportModule.Airport;
import airportSchema = require('../models/mongo/airport_schema');
import AirportDocument = airportSchema.AirportDocument;


var a1 = { key: "Test_1", name: "testing airport no.1" },
    a2 = { key: "Test_2", name: "testing airport no.2" },
    a3 = { key: "Test_3" };

export function tearUp(done: Function) {
    console.info("Tear UP");
    var onCreate = function(err: any, doc: AirportDocument) {
        console.info("    Fixture: %s", doc.toString());
    }
    airportSchema.DB.create(a1, onCreate);
    airportSchema.DB.create(a2, onCreate);
    airportSchema.DB.create(a3, onCreate);
    done();
}

export function tearDown(done?: Function) {
    console.info("TEAR DOWN");
    // TODO
}
