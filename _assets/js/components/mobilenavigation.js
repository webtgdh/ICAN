var MobileNavigation = (function ($) {
	'use strict';

	var $nav;

	var _handleGateways = function() {
		$nav.find('.is-gateway').on('click', function(e) {
			e.preventDefault();
			setTimeout(function() {
				$nav.scrollTop(0);
			}, 150);
		});
	};

	var init = function( nav ) {
		if (nav.length === 0) {
			return;
		}
		$nav = nav;

		_handleGateways();

		$nav.slinky({
			resize: true,
			title: true
		});
	};

	return {
		init: init
	};

})(jQuery);
