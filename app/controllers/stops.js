'use strict';

var Stop = require('../models/stop'),
    Trip = require('../models/trip'),
    mp   = require('multiparty');

exports.create = function(req, res){
  req.body.tripId = req.params.tripId;
  // console.log(req.body);
  Stop.create(req.body, function(data){
    // console.log(data);
    Trip.updateStops(req.params.tripId, data.length, function(){
      res.send(data);
    });
  });

};

exports.show = function(req, res){
  Stop.findById(req.params.stopId, function(err, s){
    res.render('stops/show', {stop:s});
  });
};

exports.addEvent = function(req, res){
  req.body.stopId = req.params.stopId;
  console.log(req.body);
  Stop.addEvents(req.body, function(count){
    Trip.updateEvents(req.params.tripId, count, function(){
      res.redirect('/trips/'+req.params.tripId+'/stops/' + req.params.stopId);
    });
  });
};

exports.addPhoto = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    Stop.addPhotos(req.params.stopId, files, function(count){
      Trip.updatePhotos(req.params.tripId, count, function(){
        res.redirect('/trips/'+req.params.tripId+'/stops/' + req.params.stopId);
      });
    });
  });
};

