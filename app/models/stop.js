'use strict';

var Mongo = require('mongodb'),
    async = require('async');

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

Stop.create = function(obj, cb){
  var stops = Object.keys(obj).map(function(k){
    return obj[k];
  });
  async.map(stops, function(o, done){
    var s = new Stop(o);
    s.save(function(){
      done(null, s);
    });
  }, function(err, savedStops){
    cb();
  });
};

Stop.prototype.save = function(cb){
  Stop.collection.save(this, cb);
};

module.exports = Stop;

