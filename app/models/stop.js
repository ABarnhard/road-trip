'use strict';

function Person(){
}

Object.defineProperty(Person, 'collection', {
  get: function(){return global.mongodb.collection('stops');}
});

Person.all = function(cb){
  Person.collection.find().toArray(cb);
};

module.exports = Person;

