/* global cartographer, google */

(function(){
  'use strict';

  var map;

  $(document).ready(function(){
    var directionsDisplay = new google.maps.DirectionsRenderer();
    map = cartographer('trip-map', 39.8282, -98.5795, 4);
    directionsDisplay.setMap(map);
  });

})();

