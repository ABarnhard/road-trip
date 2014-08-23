'use strict';

var Stop = require('../models/stop');

exports.create = function(req, res){
  Stop.create(req.body, function(){
    res.redirect('/treasures/' + req.params.tripId);
  });
};

exports.show = function(req, res){
};

exports.addEvent = function(req, res){
};

exports.addPhoto = function(req, res){
};

