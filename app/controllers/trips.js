'use strict';

var Trip   = require('../models/trip'),
    mp     = require('multiparty'),
    moment = require('moment');

exports.new = function(req, res){
  res.render('trips/new');
};

exports.create = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    // console.log('fields', fields);
    // console.log('files', files);
    Trip.create(fields, files, function(){
      res.redirect('/trips');
    });
  });
};

exports.index = function(req, res){
  Trip.all(function(err, trips){
    res.render('trips/index', {trips:trips, moment:moment});
  });
};

exports.show = function(req, res){
  Trip.findById(req.params.tripId, function(err, trip){
    res.render('trips/show', {trip:trip});
  });
};

