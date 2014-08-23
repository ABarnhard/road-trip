'use strict';

var Mongo = require('mongodb');

function Stop(o){
  this.loc    = {name:o.name, lat:parseFloat(o.lat), lng:parseFloat(o.lng)};
  this.tripId = Mongo.ObjectID(o.tripId);
  this.photos = [];
  this.events = [];
}

Object.defineProperty(Stop, 'collection', {
  get: function(){return global.mongodb.collection('stops');}
});

Stop.all = function(cb){
  Stop.collection.find().toArray(cb);
};

Stop.find = function(id, cb){
  Stop.collection.find({tripId:id}).toArray(cb);
};

module.exports = Stop;

