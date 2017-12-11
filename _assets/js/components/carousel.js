var Carousel = (function ($) {
	'use strict';

	var responsiveOptions = [
		{
		  breakpoint: 1024,
		  settings: {
			slidesToShow: 3,
			slidesToScroll: 3,
			infinite: true,
			dots: true
		  }
		},
		{
		  breakpoint: 800,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 2
		  }
		},
		{
		  breakpoint: 480,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1
		  }
		}
	  ];

	var _init = function( $carousel ) {

		$carousel.each(function() {
			var $this = $(this),
				count = $this.children().length,
				settings = {
					items: $this.data("items") ? $this.data("items") : 1,
					loop: $this.data("loop") ? $this.data("loop") : false,
					nav: $this.data("nav") ? $this.data("nav") : false,
					dots: $this.data("dots") ? $this.data("dots") : false,
					center: $this.data("center") ? $this.data("center") : false,
					centerPadding: $this.data("center-padding") ? $this.data("center-padding") : "20px",
					autoHeight: $this.data("auto-height") ? $this.data("auto-height") : false,
					autoWidth: $this.data("auto-width") ? $this.data("auto-width") : false,
					autoPlay: $this.data("auto-play") ? $this.data("auto-play") : false,
					fade: $this.data("fade") ? $this.data("fade") : false,
					padded: $this.data("padded") ? $this.data("padded") : false,
					speed: $this.data("speed") ? $this.data("speed") : 4000
				};
			if( count > 1 ) {

				$this.slick({
				    slidesToShow: settings.items,
				    infinite: settings.loop,
				    arrows: settings.nav,
					adaptiveHeight: settings.autoHeight,
					variableWidth: settings.autoWidth,
				    autoplay: settings.autoPlay,
					autoplaySpeed: settings.speed,
					centerMode: settings.center,
					centerPadding: settings.centerPadding,
					dots: settings.dots,
					dotsClass: 'c-carousel__dots',
					appendArrows: $this.parent(),
					prevArrow: "<button class='c-carousel--prev'><div class='ico-arrow-left'></div><span class='u-visually-hidden'>Go to previous image</span></button>",
                	nextArrow: "<button class='c-carousel--next'><span class='u-visually-hidden'>Go to next image</span><div class='ico-arrow-right'></div></button>",
					fade: settings.fade,
					cssEase: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
					responsive: settings.items > 1 ? responsiveOptions :[]
				});

			}

	    });

	};

	return {
		init: _init
	};

})(jQuery);
