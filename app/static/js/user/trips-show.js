/* global cartographer, google, calcRoute */

(function(){
  'use strict';

  var map;

  $(document).ready(function(){
    $('button[type=button]').click(addStop);
    map = cartographer('trip-map', 39.8282, -98.5795, 4);

    var directionsDisplay = new google.maps.DirectionsRenderer(),
        waypoints         = makeWaypoints();

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions'));

    calcRoute(waypoints, function(response){
      directionsDisplay.setDirections(response);
    });

  });

  function addStop(){
    var $last  = $('form > .stop-group:last-of-type'),
        $clone = $last.clone(),
        $i     = $clone.children('input');
    $i.val('');
    $i.attr('placeholder', '');
    $last.after($clone);
    $i.focus();
  }

  function makeWaypoints(){
    var $stops = $('ol > li'),
        waypoints = $stops.toArray().map(function(s){
          return new google.maps.LatLng(parseFloat($(s).attr('data-lat')), parseFloat($(s).attr('data-lng')));
        }),
        $data = $('#trip-map');
    console.log(waypoints);
    waypoints.unshift(new google.maps.LatLng(parseFloat($data.attr('data-orig-lat')), parseFloat($data.attr('data-orig-lng'))));
    waypoints.push(new google.maps.LatLng(parseFloat($data.attr('data-dest-lat')), parseFloat($data.attr('data-dest-lng'))));
    return waypoints;
  }

})();

