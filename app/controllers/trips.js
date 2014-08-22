'use strict';

var mp = require('multiparty');

exports.new = function(req, res){
  res.render('trips/new');
};

exports.create = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    console.log('fields', fields);
    console.log('files', files);
  });
};

exports.index = function(req, res){
};

exports.show = function(req, res){
};

