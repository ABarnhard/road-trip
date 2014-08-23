'use strict';

var Mongo = require('mongodb');

function Trip(o){
  this._id            = Mongo.ObjectID();
  this.name           = o.name[0];
  this.cash           = o.cash[0] * 1;
  this.originLoc      = {name:o.origin[0], lat:parseFloat(o.origLat[0]), lng:parseFloat(o.origLng[0])};
  this.destinationLoc = {name:o.destination[0], lat:parseFloat(o.destLat[0]), lng:parseFloat(o.destLng[0])};
  this.distance       = o.distance * 1;
  this.from           = new Date(o.from[0]);
  this.to             = new Date(o.to[0]);
  this.mpg            = o.mpg[0] * 1;
  this.costPerGal     = o.costPerGal[0] * 1;
}

Object.defineProperty(Trip, 'collection', {
  get: function(){return global.mongodb.collection('trips');}
});

Trip.all = function(cb){
  Trip.collection.find().toArray(cb);
};

module.exports = Trip;

