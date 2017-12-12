var ToggleEl = (function ($) {
	'use strict';
	var $html = $('html');

	// toggle class helper
	var _toggleEl = function(el, className) {
		if (el.hasClass(className + '-open')) {
			el.removeClass(className + '-open');
		} else {
			el.addClass(className + '-open');
		}
	};

	var init = function() {
		var $trigger = $('[data-toggle]');

		$trigger.on("click", function() {
			var className = $(this).data("toggle");
			_toggleEl($html, className);
		});
	};

	return {
		init: init
	};

})(jQuery);
