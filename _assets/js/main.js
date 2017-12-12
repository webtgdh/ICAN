(function($){
	'use strict';
	var $window = window,
		$html	= $('html');

	var enhanceEdgeCaseBrowsers = function() {

		if( !Modernizr.classlist ) {
			$html.removeClass('no-enhance').addClass('enhance');
		}

	};

	var scrollTo = function(el) {

		el.on('click', function(event) {
			var $this = $(this),
				target = $($this.attr('href')),
				heightOffset = 60;

			if (target.length) {
				var ref = $this.data("ref");
				event.preventDefault();

				$('html, body').animate({
					scrollTop: (target.offset().top - heightOffset)
				}, 500);

			}

		});
	};

	var responsiveTables = function() {
		var $tables = $('.s-free-content').find('table'),
			$tableWrap = $('<div>', {
				class: 'o-table o-table--scroll'
			});

		$tables.each(function() {
			$(this).wrap($tableWrap);
		});

	};

/* ===========================================================
		# breakpoints
=========================================================== */

	var breakpoints = [{
		context: ['small-max', 'small', 'medium'],
		call_for_each_context: false,
		match: function() {
			//console.log('small');
			$window.MobileNavigation.init( $('.js-nav') );
			$window.StickyHeader.init(false);
		},
		unmatch: function() {
			// unbind and scripts if possible
			location.reload();
		}
	}, {
		context: ['large', 'x-large', 'xx-large'],
		call_for_each_context: false,
		match: function() {
			//console.log('medium - xxl');
			$window.StickyHeader.init(true);
		},
		unmatch: function() {
			// unbind and scripts if possible
			location.reload();
		}
	}];


/* ===========================================================

	# Init

=========================================================== */

	if( $window.IsModern ){

		enhanceEdgeCaseBrowsers();
		$window.ToggleEl.init();
//		$('select').selectric();
		scrollTo($('a[href^="#"]:not(".js-no-scroll")'));
		$('.js-tabs').tabs();

		$window.Carousel.init( $('.js-carousel') );
		$window.Modal.init( $('.js-modal') );
//		$window.Accordion.init();
		$window.GMaps.init();
		$window.ValidateForms.init( $('.js-form') );
		responsiveTables();

		MQ.init(breakpoints);
	}

})(jQuery);
