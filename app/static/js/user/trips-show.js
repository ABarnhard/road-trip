/* global cartographer, google, calcRoute, async, geocode */

(function(){
  'use strict';

  var count = 1,
      map;

  $(document).ready(function(){
    $('button[type=button]').click(addStop);
    $('button[type=submit]').click(createStops);
    map = cartographer('trip-map', 39.8282, -98.5795, 4);

    var directionsDisplay = new google.maps.DirectionsRenderer(),
        waypoints         = makeWaypoints();

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions'));

    calcRoute(waypoints, function(response){
      directionsDisplay.setDirections(response);
      updateTripDistance(response);
    });

  });

  function createStops(e){
    // debugger;
    var stopGroups = $('.stop-group').toArray();
    console.log(stopGroups);
    async.map(stopGroups, function(stopGroup, done){
      var locName = $(stopGroup).children('input[data-id=name]').val();
      geocode(locName, function(name, lat, lng){
        $(stopGroup).children('input[data-id=name]').val(name);
        $(stopGroup).children('input[data-id=lat]').val(lat);
        $(stopGroup).children('input[data-id=lng]').val(lng);
        done(null, stopGroup);
      });
    }, function(err, geocodedDivs){
      console.log(geocodedDivs);
      $('form').submit();
    });
    e.preventDefault();
  }

  function addStop(){
    count++;
    var $last      = $('form > .stop-group:last-of-type'),
        $formGroup = $('<div>'),
        name       = 'stop' + count,
        $i;

    $formGroup.addClass('form-group').addClass('stop-group');
    $i = $('<input>').prop('type', 'text').prop('name', name + '[name]').attr('data-id', 'name').addClass('form-control');
    $formGroup.append($i);
    $i = $('<input>').prop('type', 'hidden').prop('name', name + '[lat]').attr('data-id', 'lat');
    $formGroup.append($i);
    $i = $('<input>').prop('type', 'hidden').prop('name', name + '[lng]').attr('data-id', 'lng');
    $formGroup.append($i);
    $i = $('<input>').prop('type', 'hidden').prop('name', name + '[tripId]').attr('data-id', 'tripId').val($('h2').attr('data-trip-id'));
    $formGroup.append($i);
    $last.after($formGroup);
    $formGroup.children('input[type=text]').focus();
  }

  function makeWaypoints(){
    var $stops = $('#stops > li'),
        waypoints = $stops.toArray().map(function(s){
          return new google.maps.LatLng(parseFloat($(s).attr('data-lat')), parseFloat($(s).attr('data-lng')));
        }),
        $data = $('#trip-map');
    console.log(waypoints);
    waypoints.unshift(new google.maps.LatLng(parseFloat($data.attr('data-orig-lat')), parseFloat($data.attr('data-orig-lng'))));
    waypoints.push(new google.maps.LatLng(parseFloat($data.attr('data-dest-lat')), parseFloat($data.attr('data-dest-lng'))));
    return waypoints;
  }

  function updateTripDistance(response){
    // debugger;
    var distance = response.routes[0].legs.reduce(function(total, leg){return total + leg.distance.value * 0.00062137;}, 0),
        id       = $('h2').attr('data-trip-id'),
        type     = 'put',
        url      = '/trips/' + id + '/distance',
        data     = 'distance=' + distance;
    $.ajax({url:url, type:type, data:data, dataType:'json', success:function(data){
      console.log(data);
    }});
  }

})();

