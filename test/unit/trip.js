/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Trip      = require('../../app/models/trip'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'road-trip-test',
    obj       = {
      name:['Test'],
      cash:['500'],
      origin:['Test, USA'],
      origLat:['0'],
      origLng:['0'],
      destination:['Test 2, USA'],
      destLat:['1'],
      destLng:['1'],
      distance:['300'],
      from:['2014-09-01'],
      to:['2014-09-10'],
      mpg:['55'],
      costPerGal:['3.50']
    },
    t;

describe('Trip', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      t = new Trip(obj);
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Trip object', function(){
      expect(t).to.be.instanceof(Trip);
      expect(t._id).to.be.instanceof(Mongo.ObjectID);
      expect(t.name).to.equal('Test');
      expect(t.cash).to.be.closeTo(500, 0.1);
      expect(t.originLoc.name).to.equal('Test, USA');
      expect(t.originLoc.lat).to.be.closeTo(0, 0.01);
      expect(t.originLoc.lng).to.be.closeTo(0, 0.01);
      expect(t.destinationLoc.name).to.equal('Test 2, USA');
      expect(t.destinationLoc.lat).to.be.closeTo(1, 0.01);
      expect(t.destinationLoc.lng).to.be.closeTo(1, 0.01);
      expect(t.distance).to.be.closeTo(300, 0.1);
      expect(t.from).to.respondTo('getDate');
      expect(t.to).to.respondTo('getDate');
      expect(t.mpg).to.be.closeTo(55, 0.1);
      expect(t.costPerGal).to.be.closeTo(3.50, 0.1);
      expect(t.stops).to.equal(0);
      expect(t.photos).to.equal(0);
      expect(t.events).to.equal(0);
    });
  });

  describe('#gallons', function(){
    it('should return the number of gallons the trip takes', function(){
      expect(t.gallons).to.be.closeTo(5.45, 0.1);
    });
  });

  describe('#cost', function(){
    it('should return the total cost of gas for the trip', function(){
      expect(t.cost).to.be.closeTo(19.07, 0.1);
    });
  });

  describe('.all', function(){
    it('should get all trips', function(done){
      Trip.all(function(err, trips){
        expect(trips).to.have.length(3);
        done();
      });
    });
  });
});

