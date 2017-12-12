var Modal = (function ($) {
	'use strict';

	var _defaultOptions = {
		removalDelay: 500, //delay removal by X to allow out-animation
		callbacks: {
			beforeOpen: function() {
				this.st.mainClass = 'mfp-zoom-in';
			},
		},
		overflowY: 'scroll',
		midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
	};

	var _galleryOptions = {
		delegate: 'a',
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			verticalFit: true,
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
		},
		removalDelay: 500, //delay removal by X to allow out-animation
		callbacks: {
			beforeOpen: function() {
				this.st.mainClass = 'mfp-zoom-in';
			},
		},
		midClick: true
	};

	var _videoOptions = {
		removalDelay: 500, //delay removal by X to allow out-animation
		callbacks: {
			beforeOpen: function() {
				this.st.mainClass = 'mfp-zoom-in';
			},
		},
		overflowY: 'scroll',
		midClick: true,

		disableOn: 700,
		type: 'iframe',
		preloader: false,

		fixedContentPos: false
	};

	var _openModalIfAlert = function() {
		var $modalError = $('.js-modal-error, .js-modal-success');
		var $modalTarget;
		if ($modalError.length === 0) return;

		$modalTarget = $modalError.closest('.js-modal-content');

		if ($modalTarget.length === 0) return;
		$.magnificPopup.open({
			items: {
			  src: "#" + $modalTarget.attr("id")
			}
		});
	};

	var _init = function( $trigger ) {
		_openModalIfAlert();

		$trigger.each(function() {
			var $this = $(this),
				type = $this.data("modal-type") ? $this.data("modal-type") : "default",
				ajaxSettings = {
					template: $this.data("template") ? $this.data("template") : null,
					ajaxUrl: $this.data("ajax-url") ? $this.data("ajax-url") : null
				},
				options,
				isAjax = type === "ajax",
				isGallery = type === "gallery" ? true : false,
				isVideo = type === "video";


			if( isAjax ) {
				var ajaxSrc = ajaxSettings.template !== null ? "/?altTemplate=" + ajaxSettings.template : $this.attr('href');

				options = {
					removalDelay: 500, //delay removal by X to allow out-animation
					items: {
                        src: ajaxSrc
                    },
					type: "ajax",
					ajax: {
                        tError: 'The content could not be loaded. <a href="/">Return to homepage.</a>'
                    },
					callbacks: {
						beforeOpen: function(){
	                        this.st.mainClass = "mfp-zoom-in";
						}
					}
				};
			} else if( isGallery ) {
				options = _galleryOptions;
			} else if ( isVideo ) {
				options = _videoOptions;
			} else {
				options = _defaultOptions;
			}

			$this.magnificPopup( options );

	    });

	};

	return {
		init: _init
	};

})(jQuery);
