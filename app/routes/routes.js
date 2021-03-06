'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    trips          = require('../controllers/trips'),
    stops          = require('../controllers/stops'),
    home           = require('../controllers/home');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());

  app.get('/', home.index);
  app.get('/trips/new', trips.new);
  app.post('/trips', trips.create);
  app.get('/trips', trips.index);
  app.get('/trips/:tripId', trips.show);
  app.put('/trips/:tripId/distance', trips.updateDist);

  app.post('/trips/:tripId/stops', stops.create);
  app.get('/trips/:tripId/stops/:stopId', stops.show);
  app.post('/trips/:tripId/stops/:stopId/events', stops.addEvent);
  app.post('/trips/:tripId/stops/:stopId/photos', stops.addPhoto);

  console.log('Express: Routes Loaded');
};

