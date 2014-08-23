/* global google, geocode, calcRoute */

(function(){
  'use strict';

  $(document).ready(function(){
    $('button[type=submit]').click(addTrip);
  });


  function addTrip(e){
    var origin = $('input[name=origin]').val();
    geocode(origin, function(name, lat, lng){
      // console.log('geocode', name, lat, lng);
      $('input[name=origin]').val(name);
      $('input[name=origLat]').val(lat);
      $('input[name=origLng]').val(lng);
      var begin       = new google.maps.LatLng(lat, lng),
          destination = $('input[name=destination]').val();
      geocode(destination, function(name, lat, lng){
        // console.log('geocode', name, lat, lng);
        $('input[name=destination]').val(name);
        $('input[name=destLat]').val(lat);
        $('input[name=destLng]').val(lng);
        var end    = new google.maps.LatLng(lat, lng),
            points = [];
        points.push(begin, end);
        // console.log('points', points);
        calcRoute(points, function(response){
          // console.log('response', response);
          // distance.value is in meters, must convert cause 'Merica
          var miles = response.routes[0].legs[0].distance.value * 0.00062137;
          $('input[name=distance]').val(miles);
          $('form').submit();
        });
      });
    });
    e.preventDefault();
  }

})();

