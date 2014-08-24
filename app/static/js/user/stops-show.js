/* global cartographer, addMarker */

(function(){
  'use strict';

  var map;

  $(document).ready(function(){
    $('#addEvent').click(addEvent);
    var lat  = $('#stop-map').attr('data-lat'),
        lng  = $('#stop-map').attr('data-lng'),
        name = $('#stop-map').attr('data-name');

    map = cartographer('stop-map', lat, lng, 8);
    addMarker(map, lat, lng, name, '/img/stop-pin.png');
  });

  function addEvent(){
    var $last  = $('form > .event-group:last-of-type'),
        $clone = $last.clone();
    // debugger;
    $clone.children('input').val('');
    $last.after($clone);
    $clone.children('input').focus();
  }

})();

