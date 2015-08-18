///<reference path="../../typings/tsd.d.ts"/>
import request = require('supertest');
import chai = require('chai');
import mongoose = require('mongoose');

import config = require('../config');
import airportModule = require('../models/airport');
import Airport = airportModule.Airport;
import airportSchema = require('../models/mongo/airport_schema');
import AirportDocument = airportSchema.AirportDocument;
import AirportFixtures = require('./airport_fixtures');

var BASE_URL = config.envs.test.baseUrl;
var expect = chai.expect;


describe('Airport Testing', function() {

  before(function(done) {
    mongoose.connect(config.envs.test.db, function() {
      mongoose.connection.db.dropDatabase(function() {
        AirportFixtures.tearUp(done);
      });
    });
  });

  describe('API', function() {

    it('should refuse to duplicate existing docs', function(done) {
      var validation = (err: any, res: request.Response) => {
        expect(res.status).to.equal(400);
        var b = JSON.parse(res.body);
        expect(b).to.have.property("cause");
        done();
      }
      request(BASE_URL)
        .post('/airport')
        .send({ key: "Test_3" })
        .end(validation);
    });

  });

  after(function() {
    AirportFixtures.tearDown();
  });
});
