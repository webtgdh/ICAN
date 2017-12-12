var GMaps = (function($) {
	'use strict';

	var map,
		coords,
		$mapCanvas;

	/* ===========================================================
		// This function initializes the map
	=========================================================== */
	var initCallback = function() {
		var stringCoords = $('#mapCanvas').data("location").split(',');

		coords = new google.maps.LatLng(parseFloat(stringCoords[0]), parseFloat(stringCoords[1]));
		map = new google.maps.Map(document.getElementById('mapCanvas'), {
			zoom: 13,
			center: coords
		});
		var marker = new google.maps.Marker({
			position: coords,
			map: map,
			icon: {
                anchor: new google.maps.Point(24, 32),
                url: "/assets/img/marker.png"
            }
        });

	};

	var _loadMapScript = function() {

		// Asynchronously Load the map API
		var script = document.createElement('script');
		script.src = "https://maps.googleapis.com/maps/api/js?callback=window.GMaps.initCallback";
		document.body.appendChild(script);

	};

	/* ===========================================================
		// Check if a map canvas exists and kick things off
	=========================================================== */
	var init = function() {
		$mapCanvas = $('#mapCanvas');

		if( $mapCanvas.length > 0 ) {
			_loadMapScript();
		}
	};

	return {
		init: init,
		initCallback: initCallback
	};

})(jQuery);
