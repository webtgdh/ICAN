var StickyHeader = (function ($) {
	'use strict';

	var $page = $('body');
	var $header = $('.js-header');
	var $headerGroup;
	var $logo;

	var hasHero = false;
	var headerHeight = $header.outerHeight();
	var headerGroupHeight;
	var logoHeight;
	var logoWidth;

	//set scrolling variables
	var scrolling = false,
		previousTop = 0,
		currentTop = 0,
		scrollDelta = 10,
		scrollOffset = 100;


	var _setElOffsets = function() {
		$page.css('paddingTop', headerHeight );
	};

	var _autoHideHeader = function() {
		var currentTop = $(window).scrollTop();

		if( previousTop - currentTop && currentTop < scrollOffset ) {
			//if scrolling up...
			if ($header.hasClass('c-header--compact')) {
				$header.removeClass('c-header--compact');
				_showHeaderGroup();
				_resetLogo();
			}
	    } else if( currentTop - previousTop > scrollDelta && currentTop > scrollOffset ) {
			//if scrolling down...
			if (!$header.hasClass('c-header--compact')) {
				$header.addClass('c-header--compact');
				_hideHeaderGroup();
				_shrinkLogo();
			}
	    }

	   	previousTop = currentTop;
		scrolling = false;
	};

	var _showHeaderGroup = function() {
		$headerGroup.css({
			'max-height': headerGroupHeight,
			'opacity': 1
		});
	};

	var _hideHeaderGroup = function() {
		$headerGroup.css({
			'max-height': 0,
			'opacity': 0
		});
	};

	var _shrinkLogo = function() {

		$logo.css({
			opacity: 0,
			position: 'absolute'
		});

		setTimeout(function() {
			$logo.css({
				//width: 93,
				//height: 20
			});
		}, 200);

		setTimeout(function() {
			$logo.css({
				opacity: 1,
				//position: 'relative'
			});
		}, 600);
	};

	var _resetLogo = function() {
		$logo.css({
			opacity: '',
			position: '',
		//	width: '',
		//	height: ''
		});
	};

	var _hasHero = function() {
		if ($('html').hasClass('.js-has-hero')) {
			hasHero = true;
		}
		if (!hasHero) {
			_setElOffsets();
		}
	};

	var _init = function( isCompact ) {
		$header.addClass('is-fixed');

		_hasHero();

		if( isCompact ) {
			$headerGroup = $header.find('.js-header-group');
			headerGroupHeight = $headerGroup.outerHeight();

			$logo = $header.find('.js-header-logo');
			logoWidth = $logo.outerWidth();
			logoHeight = $logo.outerHeight();

			$(window).on('scroll', function(){

				if( !scrolling ) {
					scrolling = true;
					if( !window.requestAnimationFrame ) {
						setTimeout(_autoHideHeader, 250);
					} else {
						requestAnimationFrame(_autoHideHeader);
					}
				}
			});

			$(window).on('resize', function(){
				headerHeight = $header.height();
				_setElOffsets();
			});

		}

	};

	return {
		init: _init
	};

})(jQuery);
