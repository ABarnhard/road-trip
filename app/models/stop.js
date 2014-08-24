'use strict';

var Mongo = require('mongodb'),
    async = require('async'),
    _     = require('lodash'),
    fs    = require('fs'),
    path  = require('path');

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

Stop.findById = function(id, cb){
  id = Mongo.ObjectID(id);
  Stop.collection.findOne({_id:id}, function(err, o){
    var s = _.create(Stop.prototype, o);
    cb(err, s);
  });
};

Stop.create = function(obj, cb){
  var stops = obj.stops.map(function(s){
    s.tripId = obj.tripId;
    return s;
  });

  async.map(stops, saveStops, finished);

  function saveStops(obj, done){
    var s = new Stop(obj);
    Stop.collection.save(s, function(){
      console.log(s);
      done(null, s);
    });
  }

  function finished(err, savedStops){
    var stopData = savedStops.map(function(s){
      return {name:s.loc.name, lat:s.loc.lat, lng:s.loc.lng, _id:s._id, tripId:s.tripId};
    });
    cb(stopData);
  }

};

Stop.addEvents = function(obj, cb){
  Stop.findById(obj.stopId, function(err, s){
    var count = 0;
    if(typeof obj.events !== 'string'){
      count = obj.events.length;
      obj.events.forEach(function(event){
        s.events.push(event);
      });
    }else{
      count = 1;
      s.events.push(obj.events);
    }
    s.save(function(){
      cb(count);
    });
  });
};

Stop.addPhotos = function(id, files, cb){
  Stop.findById(id, function(err, s){
    var count = s.moveFiles(files);
    s.save(function(){
      cb(count);
    });
  });
};

Stop.prototype.moveFiles = function(files){
  var baseDir = __dirname + '/../static',
      relDir  = '/img/' + this._id,
      absDir  = baseDir + relDir,
      exists = fs.existsSync(absDir);

  if(!exists){
    fs.mkdirSync(absDir);
  }

  var photos = files.photos.map(function(photo, index){
    if(!photo.size){return;}

    var ext      = path.extname(photo.path),
        name     = index + ext,
        absPath  = absDir + '/' + name,
        relPath  = relDir + '/' + name;

    fs.renameSync(photo.path, absPath);
    return relPath;
  });

  photos = _.compact(photos);
  var self = this;
  if(photos.length){
    photos.forEach(function(photo){
      self.photos.push(photo);
    });
  }
  return photos.length;
};

Stop.prototype.save = function(cb){
  Stop.collection.save(this, cb);
};

module.exports = Stop;

