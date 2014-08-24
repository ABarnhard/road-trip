/* global cartographer, google, calcRoute, async, geocode, _ */

(function(){
  'use strict';

  var map,
      directionsDisplay = new google.maps.DirectionsRenderer();

  $(document).ready(function(){
    $('button[type=button]').click(addStop);
    $('button[type=submit]').click(geocodeAndSubmit);
    map = cartographer('trip-map', 39.8282, -98.5795, 4);

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions'));

    var waypoints = makeWaypoints();
    calcRoute(waypoints, function(response){
      directionsDisplay.setDirections(response);
    });

  });

  function geocodeAndSubmit(e){
    var locations = $('input').toArray().map(function(input){
      return $(input).val().trim();
    });
    locations = _.compact(locations);
    if(locations.length){async.map(locations, lookUpGeocode, appendAndSubmit);}
    e.preventDefault();
  }

  function lookUpGeocode(location, cb){
    geocode(location, function(name, lat, lng){
      cb(null, {name:name, lat:lat, lng:lng});
    });
  }

  function appendAndSubmit(err, geocodedLocations){
    geocodedLocations.forEach(function(location, index){
      $('form').append('<input name="stops['+index+'][name]" value="'+location.name+'" type="hidden">');
      $('form').append('<input name="stops['+index+'][lat]" value="'+location.lat+'" type="hidden">');
      $('form').append('<input name="stops['+index+'][lng]" value="'+location.lng+'" type="hidden">');
    });
    var url = $('form').attr('action'),
        data = $('form').serialize(),
        type = $('form').attr('method');
    $.ajax({url:url, type:type, data:data, dataType:'json', success:function(data){
      resetForm();
      data.forEach(function(s){
        $('#stops').append('<li data-name="'+s.name+'" data-lat="'+s.lat+'" data-lng="'+s.lng+'"><a href="/trips/'+s.tripId+'/stops/'+s._id+'">'+s.name+'</a></li>');
      });
      var waypoints = makeWaypoints();
      calcRoute(waypoints, function(response){
        directionsDisplay.setDirections(response);
        updateTripDistance(response);
      });
    }});
  }

  function resetForm(){
    $('form').children('input[type=hidden]').remove();
    $('form').children('.stop-group').remove();
    $('form > .form-group:first-of-type').after('<div class="form-group stop-group"><input class="form-control" type="text" name="stopNames" placeholder="Tucson, AZ" /></div>');
  }

  function addStop(){
    var $last  = $('form > .stop-group:last-of-type'),
        $clone = $last.clone();
    // debugger;
    $clone.children('input').val('');
    $last.after($clone);
    $clone.children('input').focus();
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

