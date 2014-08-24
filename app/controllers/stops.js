'use strict';

var Stop = require('../models/stop');

exports.create = function(req, res){
  req.body.tripId = req.params.tripId;
  // console.log(req.body);
  Stop.create(req.body, function(data){
    // console.log(data);
    res.send(data);
  });

};

exports.show = function(req, res){
  Stop.findById(req.params.stopId, function(err, s){
    res.render('stops/show', {stop:s});
  });
};

exports.addEvent = function(req, res){
};

exports.addPhoto = function(req, res){
};

