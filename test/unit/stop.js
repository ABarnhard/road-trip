/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Stop      = require('../../app/models/stop'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'road-trip-test';

describe('Stop', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Stop object', function(){
      var s = new Stop();
      expect(s).to.be.instanceof(Stop);
    });
  });

  describe('.all', function(){
    it('should get all stops', function(done){
      Stop.all(function(err, stops){
        expect(stops).to.have.length(3);
        done();
      });
    });
  });
});

