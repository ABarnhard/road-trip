/* jshint unused:false, camelcase:false */
/* global google */

function geocode(address, cb){
  'use strict';
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address:address}, function(results, status){
    //console.log('results', results);
    var name = results[0].formatted_address,
        lat  = results[0].geometry.location.lat(),
        lng  = results[0].geometry.location.lng();
    cb(name, lat, lng);
  });
}

function calcRoute(waypoints, cb){
  'use strict';
  console.log('waypoints', waypoints);
  var directionsService = new google.maps.DirectionsService(),
      origin            = waypoints[0],
      destination       = waypoints[waypoints.length - 1];
  waypoints.pop();
  waypoints.shift();
  waypoints = waypoints.map(function(wp){
    return {location:wp, stopover:true};
  });
  var request = {
    origin:origin,
    destination:destination,
    waypoints:waypoints,
    optimizeWaypoints:true,
    travelMode:google.maps.TravelMode.DRIVING
  };
  console.log('request', request);
  directionsService.route(request, function(response, status){
    if(status === google.maps.DirectionsStatus.OK){
      //console.log('response', response);
      cb(response);
    }else{
      cb(-1);
    }
  });
}
