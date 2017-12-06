/*

//https://github.com/frend/frend.co/blob/gh-pages/_components/accordion/accordion.js
// converted to use jquery
var Accordion = (function ($) {
	'use strict';
	var $html = $('html');

	var selector = '.js-accordion',
		headerSelector = '.js-accordion__header',
		headerIdPrefix = 'accordion-header',
		panelSelector = '.js-accordion__panel',
		panelIdPrefix = 'accordion-panel',
		firstPanelsOpenByDefault = true,
		multiselectable = true,
		readyClass = 'c-accordion--is-ready',
		transitionLength = 300;

	// set accordion element NodeLists
	var accordionContainers = $( selector );

	// A11Y
	var _addA11y = function( accordionContainer ) {
		// get accordion elements
		var accordionHeaders = $( headerSelector );
		var accordionPanels = $( panelSelector );

		// add relevant roles and properties
		accordionContainer.attr('role', 'tablist');
		accordionContainer.attr('aria-multiselectable', multiselectable);

		accordionHeaders.each( function() {
			var $this = $(this);
			var currentId = $this.attr('id');

			$this.attr('role', 'tab');
			$this.attr('aria-controls', currentId.replace( headerIdPrefix, panelIdPrefix ) );
			// make headers focusable, this is preferred over wrapping contents in native button element
			$this.attr('tabindex', 0);
		});


		accordionPanels.each( function() {
			var $this = $(this);
			var currentId = $this.attr('id');
			$this.attr('role', 'tabpanel');
			$this.attr('aria-labelledby', currentId.replace( panelIdPrefix, headerIdPrefix ) );
			// make tabpanel focusable
			$this.attr('tabindex', 0);
		});
	};

	var _removeA11y = function(accordionContainer) {
		// get accordion elements
		var accordionHeaders = $(headerSelector, accordionContainer);
		var accordionPanels = $(panelSelector, accordionContainer);

		// remove roles and properties
		accordionContainer.removeAttr('role');
		accordionContainer.removeAttr('aria-multiselectable');

		accordionHeaders.each( function(accordionHeader) {
			var $this = $(this);
			$this.removeAttr('role');
			$this.removeAttr('aria-controls');
			$this.removeAttr('aria-selected');
			$this.removeAttr('aria-expanded');
			// remove headers focusablility
			$this.removeAttr('tabindex');
		});

		accordionPanels.each( function(accordionPanel) {
			var $this = $(this);
			$this.removeAttr('role');
			$this.removeAttr('aria-labelledby');
			$this.removeAttr('aria-hidden');
			// remove tabpanel focusablibility
			$this.removeAttr('tabindex');
		});
	};

	//	UTILS
	var _getPanelHeight = function(panel) {
		//	set auto height and read offsetHeight

		panel.css('height', 'auto');
		var height = panel.outerHeight();
		//	remove style
		panel.css('height', '');
		return height;
	};

	var _setPanelHeight = function(panel) {
		//	get panel height
		var panelHeight = _getPanelHeight(panel);
		//	recalc style and layout
//		panel.getBoundingClientRect();

		panel.offset();
		//	set height on panel, reset to 'auto' on transition complete
		panel.css('height', panelHeight);
//		panel.style.height = panelHeight + 'px';
		setTimeout( function(){
			panel.css({
				transition: 'none',
				height: 'auto'
			});
			//	recalc style and layout
//			panel.getBoundingClientRect();
			panel.offset();
			panel.css('transition', '');
		}, transitionLength);
	};

	var _unsetPanelHeight = function(panel) {
		//	get panel height
		var panelHeight = _getPanelHeight(panel);
		//	set panel height from 'auto' to px
		panel.css('height',panelHeight);
//		panel.style.height = panelHeight + 'px';
		//	recalc style and layout
		panel.offset();
//		panel.getBoundingClientRect();
		//	reset height
		panel.css('height',0);
	};

	// ACTIONS
	var _hideAllPanels = function(accordionContainer) {
		// get accordion elements
		var siblingHeaders = $(headerSelector, accordionContainer);
		var siblingPanels = $(panelSelector, accordionContainer);

		// set inactives
		siblingHeaders.each( function(header) {
			var $this = $(this);
			$this.attr('tabindex', -1);
			$this.attr('aria-selected', 'false');
			$this.attr('aria-expanded', 'false');
		});
		siblingPanels.each( function(panel) {
			var $this = $(this);
			if ($this.attr('aria-hidden') === 'false') _unsetPanelHeight(panel);
			//	toggle aria-hidden
			$this.attr('aria-hidden', 'true');
		});
	};

	var _hidePanel = function(target) {
		//	get panel
		var activePanel = $( '#' + target.attr('aria-controls') );
		target.attr('aria-selected', 'false');
		target.attr('aria-expanded', 'false');
		//	toggle aria-hidden
		_unsetPanelHeight(activePanel);
		activePanel.attr('aria-hidden', 'true');
	};

	var _showPanel = function(target) {
		//	get panel
		var activePanel = $( '#' + target.attr('aria-controls') );

		//	set attributes on header
		target.attr('tabindex', 0);
		target.attr('aria-selected', 'true');
		target.attr('aria-expanded', 'true');
		//	toggle aria-hidden and set height on panel
		_setPanelHeight( activePanel );
		activePanel.attr('aria-hidden', 'false');
		setTimeout(function(){
			_bindAccordionEvents( target.parent() );
		},transitionLength );
	};

	var _togglePanel = function (target) {
		// get context of accordion container and its children

		var thisContainer = target.parent();

		// close target panel if already active
		if ( target.attr('aria-selected') === 'true' ) {
			_hidePanel(target);
			return;
		}
		// if not multiselectable hide all, then show target
		if (!multiselectable) _hideAllPanels(thisContainer);

		_showPanel(target);
		if (transitionLength > 0) _unbindAccordionEvents(thisContainer);
	};

	var _giveHeaderFocus = function( headerSet, i ) {
		// remove focusability from inactives
		headerSet.each( function(header) {
			$(this).attr('tabindex', -1);
		});
		// set active focus
		$( headerSet[i] ).attr('tabindex', 0);
		$( headerSet[i] ).focus();
	};

	//	EVENTS
	var _eventHeaderClick = function(e) {
		_togglePanel( $(this) );
	};

	var _eventHeaderKeydown = function (e) {

		// collect header targets, and their prev/next
		var currentHeader = $(e.currentTarget);
		var isModifierKey = e.metaKey || e.altKey;
		// get context of accordion container and its children
		var thisContainer = currentHeader.parent();
		var theseHeaders = $(headerSelector, thisContainer);
//		var currentHeaderIndex = [].indexOf.call(theseHeaders, currentHeader);
		var currentHeaderIndex = theseHeaders.index( currentHeader );

		// don't catch key events when ⌘ or Alt modifier is present
		if (isModifierKey) return;

		// catch enter/space, left/right and up/down arrow key events
		// if new panel show it, if next/prev move focus
		switch (e.keyCode) {
			case 13:
			case 32:
				_togglePanel(currentHeader);
				e.preventDefault();
				break;
			case 37:
			case 38: {
				var previousHeaderIndex = (currentHeaderIndex === 0) ? theseHeaders.length - 1 : currentHeaderIndex - 1;
				_giveHeaderFocus(theseHeaders, previousHeaderIndex);
				e.preventDefault();
				break;
			}
			case 39:
			case 40: {
				var nextHeaderIndex = (currentHeaderIndex < theseHeaders.length - 1) ? currentHeaderIndex + 1 : 0;
				_giveHeaderFocus(theseHeaders, nextHeaderIndex);
				e.preventDefault();
				break;
			}
			default:
				break;
		}
	};

	//	BIND EVENTS
	var _bindAccordionEvents = function( accordionContainer ) {
		var accordionHeaders = $(headerSelector, accordionContainer);
		// bind all accordion header click and keydown events
		accordionHeaders.each( function(accordionHeader) {
			var $this = $(this);
			$this.on('click', _eventHeaderClick);
			$this.on('keydown', _eventHeaderKeydown);
		});
	};

	//	UNBIND EVENTS
	var _unbindAccordionEvents = function( accordionContainer ) {
		var accordionHeaders = $(headerSelector, accordionContainer);
		// unbind all accordion header click and keydown events
		accordionHeaders.each( function(accordionHeader) {
			var $this = $(this);
			$this.off('click', _eventHeaderClick);
			$this.off('keydown', _eventHeaderKeydown);
		});
	};

	// DESTROY
	var destroy = function() {
		accordionContainers.each( function(accordionContainer) {
			var $this = $(this);
			_removeA11y( $this );
			_unbindAccordionEvents( $this );
			$this.removeClass( readyClass );
		});
	};

	// INIT
	var init = function() {
		if ( accordionContainers.length ) {
			accordionContainers.each( function(accordionContainer) {
				var $this = $(this);

				_addA11y( $this );
				_bindAccordionEvents( $this );
				_hideAllPanels( $this );
				// set all first accordion panels active on init if required (default behaviour)
				// otherwise make sure first accordion header for each is focusable
				if (firstPanelsOpenByDefault) {
					_togglePanel( $this.find( headerSelector ).first() );
				} else {
					$this.find( headerSelector.first() ).attr('tabindex', 0);
				}
				// set ready style hook
				$this.addClass( readyClass );
			});
		}
	};



	return {
		init: init,
		destroy: destroy
	};

})(jQuery);
*/

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhY2NvcmRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcblxuLy9odHRwczovL2dpdGh1Yi5jb20vZnJlbmQvZnJlbmQuY28vYmxvYi9naC1wYWdlcy9fY29tcG9uZW50cy9hY2NvcmRpb24vYWNjb3JkaW9uLmpzXG4vLyBjb252ZXJ0ZWQgdG8gdXNlIGpxdWVyeVxudmFyIEFjY29yZGlvbiA9IChmdW5jdGlvbiAoJCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciAkaHRtbCA9ICQoJ2h0bWwnKTtcblxuXHR2YXIgc2VsZWN0b3IgPSAnLmpzLWFjY29yZGlvbicsXG5cdFx0aGVhZGVyU2VsZWN0b3IgPSAnLmpzLWFjY29yZGlvbl9faGVhZGVyJyxcblx0XHRoZWFkZXJJZFByZWZpeCA9ICdhY2NvcmRpb24taGVhZGVyJyxcblx0XHRwYW5lbFNlbGVjdG9yID0gJy5qcy1hY2NvcmRpb25fX3BhbmVsJyxcblx0XHRwYW5lbElkUHJlZml4ID0gJ2FjY29yZGlvbi1wYW5lbCcsXG5cdFx0Zmlyc3RQYW5lbHNPcGVuQnlEZWZhdWx0ID0gdHJ1ZSxcblx0XHRtdWx0aXNlbGVjdGFibGUgPSB0cnVlLFxuXHRcdHJlYWR5Q2xhc3MgPSAnYy1hY2NvcmRpb24tLWlzLXJlYWR5Jyxcblx0XHR0cmFuc2l0aW9uTGVuZ3RoID0gMzAwO1xuXG5cdC8vIHNldCBhY2NvcmRpb24gZWxlbWVudCBOb2RlTGlzdHNcblx0dmFyIGFjY29yZGlvbkNvbnRhaW5lcnMgPSAkKCBzZWxlY3RvciApO1xuXG5cdC8vIEExMVlcblx0dmFyIF9hZGRBMTF5ID0gZnVuY3Rpb24oIGFjY29yZGlvbkNvbnRhaW5lciApIHtcblx0XHQvLyBnZXQgYWNjb3JkaW9uIGVsZW1lbnRzXG5cdFx0dmFyIGFjY29yZGlvbkhlYWRlcnMgPSAkKCBoZWFkZXJTZWxlY3RvciApO1xuXHRcdHZhciBhY2NvcmRpb25QYW5lbHMgPSAkKCBwYW5lbFNlbGVjdG9yICk7XG5cblx0XHQvLyBhZGQgcmVsZXZhbnQgcm9sZXMgYW5kIHByb3BlcnRpZXNcblx0XHRhY2NvcmRpb25Db250YWluZXIuYXR0cigncm9sZScsICd0YWJsaXN0Jyk7XG5cdFx0YWNjb3JkaW9uQ29udGFpbmVyLmF0dHIoJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJywgbXVsdGlzZWxlY3RhYmxlKTtcblxuXHRcdGFjY29yZGlvbkhlYWRlcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIGN1cnJlbnRJZCA9ICR0aGlzLmF0dHIoJ2lkJyk7XG5cblx0XHRcdCR0aGlzLmF0dHIoJ3JvbGUnLCAndGFiJyk7XG5cdFx0XHQkdGhpcy5hdHRyKCdhcmlhLWNvbnRyb2xzJywgY3VycmVudElkLnJlcGxhY2UoIGhlYWRlcklkUHJlZml4LCBwYW5lbElkUHJlZml4ICkgKTtcblx0XHRcdC8vIG1ha2UgaGVhZGVycyBmb2N1c2FibGUsIHRoaXMgaXMgcHJlZmVycmVkIG92ZXIgd3JhcHBpbmcgY29udGVudHMgaW4gbmF0aXZlIGJ1dHRvbiBlbGVtZW50XG5cdFx0XHQkdGhpcy5hdHRyKCd0YWJpbmRleCcsIDApO1xuXHRcdH0pO1xuXG5cblx0XHRhY2NvcmRpb25QYW5lbHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIGN1cnJlbnRJZCA9ICR0aGlzLmF0dHIoJ2lkJyk7XG5cdFx0XHQkdGhpcy5hdHRyKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG5cdFx0XHQkdGhpcy5hdHRyKCdhcmlhLWxhYmVsbGVkYnknLCBjdXJyZW50SWQucmVwbGFjZSggcGFuZWxJZFByZWZpeCwgaGVhZGVySWRQcmVmaXggKSApO1xuXHRcdFx0Ly8gbWFrZSB0YWJwYW5lbCBmb2N1c2FibGVcblx0XHRcdCR0aGlzLmF0dHIoJ3RhYmluZGV4JywgMCk7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIF9yZW1vdmVBMTF5ID0gZnVuY3Rpb24oYWNjb3JkaW9uQ29udGFpbmVyKSB7XG5cdFx0Ly8gZ2V0IGFjY29yZGlvbiBlbGVtZW50c1xuXHRcdHZhciBhY2NvcmRpb25IZWFkZXJzID0gJChoZWFkZXJTZWxlY3RvciwgYWNjb3JkaW9uQ29udGFpbmVyKTtcblx0XHR2YXIgYWNjb3JkaW9uUGFuZWxzID0gJChwYW5lbFNlbGVjdG9yLCBhY2NvcmRpb25Db250YWluZXIpO1xuXG5cdFx0Ly8gcmVtb3ZlIHJvbGVzIGFuZCBwcm9wZXJ0aWVzXG5cdFx0YWNjb3JkaW9uQ29udGFpbmVyLnJlbW92ZUF0dHIoJ3JvbGUnKTtcblx0XHRhY2NvcmRpb25Db250YWluZXIucmVtb3ZlQXR0cignYXJpYS1tdWx0aXNlbGVjdGFibGUnKTtcblxuXHRcdGFjY29yZGlvbkhlYWRlcnMuZWFjaCggZnVuY3Rpb24oYWNjb3JkaW9uSGVhZGVyKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0JHRoaXMucmVtb3ZlQXR0cigncm9sZScpO1xuXHRcdFx0JHRoaXMucmVtb3ZlQXR0cignYXJpYS1jb250cm9scycpO1xuXHRcdFx0JHRoaXMucmVtb3ZlQXR0cignYXJpYS1zZWxlY3RlZCcpO1xuXHRcdFx0JHRoaXMucmVtb3ZlQXR0cignYXJpYS1leHBhbmRlZCcpO1xuXHRcdFx0Ly8gcmVtb3ZlIGhlYWRlcnMgZm9jdXNhYmxpbGl0eVxuXHRcdFx0JHRoaXMucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcblx0XHR9KTtcblxuXHRcdGFjY29yZGlvblBhbmVscy5lYWNoKCBmdW5jdGlvbihhY2NvcmRpb25QYW5lbCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdCR0aGlzLnJlbW92ZUF0dHIoJ3JvbGUnKTtcblx0XHRcdCR0aGlzLnJlbW92ZUF0dHIoJ2FyaWEtbGFiZWxsZWRieScpO1xuXHRcdFx0JHRoaXMucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4nKTtcblx0XHRcdC8vIHJlbW92ZSB0YWJwYW5lbCBmb2N1c2FibGliaWxpdHlcblx0XHRcdCR0aGlzLnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XG5cdFx0fSk7XG5cdH07XG5cblx0Ly9cdFVUSUxTXG5cdHZhciBfZ2V0UGFuZWxIZWlnaHQgPSBmdW5jdGlvbihwYW5lbCkge1xuXHRcdC8vXHRzZXQgYXV0byBoZWlnaHQgYW5kIHJlYWQgb2Zmc2V0SGVpZ2h0XG5cblx0XHRwYW5lbC5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG5cdFx0dmFyIGhlaWdodCA9IHBhbmVsLm91dGVySGVpZ2h0KCk7XG5cdFx0Ly9cdHJlbW92ZSBzdHlsZVxuXHRcdHBhbmVsLmNzcygnaGVpZ2h0JywgJycpO1xuXHRcdHJldHVybiBoZWlnaHQ7XG5cdH07XG5cblx0dmFyIF9zZXRQYW5lbEhlaWdodCA9IGZ1bmN0aW9uKHBhbmVsKSB7XG5cdFx0Ly9cdGdldCBwYW5lbCBoZWlnaHRcblx0XHR2YXIgcGFuZWxIZWlnaHQgPSBfZ2V0UGFuZWxIZWlnaHQocGFuZWwpO1xuXHRcdC8vXHRyZWNhbGMgc3R5bGUgYW5kIGxheW91dFxuLy9cdFx0cGFuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRwYW5lbC5vZmZzZXQoKTtcblx0XHQvL1x0c2V0IGhlaWdodCBvbiBwYW5lbCwgcmVzZXQgdG8gJ2F1dG8nIG9uIHRyYW5zaXRpb24gY29tcGxldGVcblx0XHRwYW5lbC5jc3MoJ2hlaWdodCcsIHBhbmVsSGVpZ2h0KTtcbi8vXHRcdHBhbmVsLnN0eWxlLmhlaWdodCA9IHBhbmVsSGVpZ2h0ICsgJ3B4Jztcblx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuXHRcdFx0cGFuZWwuY3NzKHtcblx0XHRcdFx0dHJhbnNpdGlvbjogJ25vbmUnLFxuXHRcdFx0XHRoZWlnaHQ6ICdhdXRvJ1xuXHRcdFx0fSk7XG5cdFx0XHQvL1x0cmVjYWxjIHN0eWxlIGFuZCBsYXlvdXRcbi8vXHRcdFx0cGFuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRwYW5lbC5vZmZzZXQoKTtcblx0XHRcdHBhbmVsLmNzcygndHJhbnNpdGlvbicsICcnKTtcblx0XHR9LCB0cmFuc2l0aW9uTGVuZ3RoKTtcblx0fTtcblxuXHR2YXIgX3Vuc2V0UGFuZWxIZWlnaHQgPSBmdW5jdGlvbihwYW5lbCkge1xuXHRcdC8vXHRnZXQgcGFuZWwgaGVpZ2h0XG5cdFx0dmFyIHBhbmVsSGVpZ2h0ID0gX2dldFBhbmVsSGVpZ2h0KHBhbmVsKTtcblx0XHQvL1x0c2V0IHBhbmVsIGhlaWdodCBmcm9tICdhdXRvJyB0byBweFxuXHRcdHBhbmVsLmNzcygnaGVpZ2h0JyxwYW5lbEhlaWdodCk7XG4vL1x0XHRwYW5lbC5zdHlsZS5oZWlnaHQgPSBwYW5lbEhlaWdodCArICdweCc7XG5cdFx0Ly9cdHJlY2FsYyBzdHlsZSBhbmQgbGF5b3V0XG5cdFx0cGFuZWwub2Zmc2V0KCk7XG4vL1x0XHRwYW5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHQvL1x0cmVzZXQgaGVpZ2h0XG5cdFx0cGFuZWwuY3NzKCdoZWlnaHQnLDApO1xuXHR9O1xuXG5cdC8vIEFDVElPTlNcblx0dmFyIF9oaWRlQWxsUGFuZWxzID0gZnVuY3Rpb24oYWNjb3JkaW9uQ29udGFpbmVyKSB7XG5cdFx0Ly8gZ2V0IGFjY29yZGlvbiBlbGVtZW50c1xuXHRcdHZhciBzaWJsaW5nSGVhZGVycyA9ICQoaGVhZGVyU2VsZWN0b3IsIGFjY29yZGlvbkNvbnRhaW5lcik7XG5cdFx0dmFyIHNpYmxpbmdQYW5lbHMgPSAkKHBhbmVsU2VsZWN0b3IsIGFjY29yZGlvbkNvbnRhaW5lcik7XG5cblx0XHQvLyBzZXQgaW5hY3RpdmVzXG5cdFx0c2libGluZ0hlYWRlcnMuZWFjaCggZnVuY3Rpb24oaGVhZGVyKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0JHRoaXMuYXR0cigndGFiaW5kZXgnLCAtMSk7XG5cdFx0XHQkdGhpcy5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG5cdFx0XHQkdGhpcy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG5cdFx0fSk7XG5cdFx0c2libGluZ1BhbmVscy5lYWNoKCBmdW5jdGlvbihwYW5lbCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdGlmICgkdGhpcy5hdHRyKCdhcmlhLWhpZGRlbicpID09PSAnZmFsc2UnKSBfdW5zZXRQYW5lbEhlaWdodChwYW5lbCk7XG5cdFx0XHQvL1x0dG9nZ2xlIGFyaWEtaGlkZGVuXG5cdFx0XHQkdGhpcy5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIF9oaWRlUGFuZWwgPSBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHQvL1x0Z2V0IHBhbmVsXG5cdFx0dmFyIGFjdGl2ZVBhbmVsID0gJCggJyMnICsgdGFyZ2V0LmF0dHIoJ2FyaWEtY29udHJvbHMnKSApO1xuXHRcdHRhcmdldC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG5cdFx0dGFyZ2V0LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcblx0XHQvL1x0dG9nZ2xlIGFyaWEtaGlkZGVuXG5cdFx0X3Vuc2V0UGFuZWxIZWlnaHQoYWN0aXZlUGFuZWwpO1xuXHRcdGFjdGl2ZVBhbmVsLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblx0fTtcblxuXHR2YXIgX3Nob3dQYW5lbCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdC8vXHRnZXQgcGFuZWxcblx0XHR2YXIgYWN0aXZlUGFuZWwgPSAkKCAnIycgKyB0YXJnZXQuYXR0cignYXJpYS1jb250cm9scycpICk7XG5cblx0XHQvL1x0c2V0IGF0dHJpYnV0ZXMgb24gaGVhZGVyXG5cdFx0dGFyZ2V0LmF0dHIoJ3RhYmluZGV4JywgMCk7XG5cdFx0dGFyZ2V0LmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xuXHRcdHRhcmdldC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcblx0XHQvL1x0dG9nZ2xlIGFyaWEtaGlkZGVuIGFuZCBzZXQgaGVpZ2h0IG9uIHBhbmVsXG5cdFx0X3NldFBhbmVsSGVpZ2h0KCBhY3RpdmVQYW5lbCApO1xuXHRcdGFjdGl2ZVBhbmVsLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0X2JpbmRBY2NvcmRpb25FdmVudHMoIHRhcmdldC5wYXJlbnQoKSApO1xuXHRcdH0sdHJhbnNpdGlvbkxlbmd0aCApO1xuXHR9O1xuXG5cdHZhciBfdG9nZ2xlUGFuZWwgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdFx0Ly8gZ2V0IGNvbnRleHQgb2YgYWNjb3JkaW9uIGNvbnRhaW5lciBhbmQgaXRzIGNoaWxkcmVuXG5cblx0XHR2YXIgdGhpc0NvbnRhaW5lciA9IHRhcmdldC5wYXJlbnQoKTtcblxuXHRcdC8vIGNsb3NlIHRhcmdldCBwYW5lbCBpZiBhbHJlYWR5IGFjdGl2ZVxuXHRcdGlmICggdGFyZ2V0LmF0dHIoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnICkge1xuXHRcdFx0X2hpZGVQYW5lbCh0YXJnZXQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBpZiBub3QgbXVsdGlzZWxlY3RhYmxlIGhpZGUgYWxsLCB0aGVuIHNob3cgdGFyZ2V0XG5cdFx0aWYgKCFtdWx0aXNlbGVjdGFibGUpIF9oaWRlQWxsUGFuZWxzKHRoaXNDb250YWluZXIpO1xuXG5cdFx0X3Nob3dQYW5lbCh0YXJnZXQpO1xuXHRcdGlmICh0cmFuc2l0aW9uTGVuZ3RoID4gMCkgX3VuYmluZEFjY29yZGlvbkV2ZW50cyh0aGlzQ29udGFpbmVyKTtcblx0fTtcblxuXHR2YXIgX2dpdmVIZWFkZXJGb2N1cyA9IGZ1bmN0aW9uKCBoZWFkZXJTZXQsIGkgKSB7XG5cdFx0Ly8gcmVtb3ZlIGZvY3VzYWJpbGl0eSBmcm9tIGluYWN0aXZlc1xuXHRcdGhlYWRlclNldC5lYWNoKCBmdW5jdGlvbihoZWFkZXIpIHtcblx0XHRcdCQodGhpcykuYXR0cigndGFiaW5kZXgnLCAtMSk7XG5cdFx0fSk7XG5cdFx0Ly8gc2V0IGFjdGl2ZSBmb2N1c1xuXHRcdCQoIGhlYWRlclNldFtpXSApLmF0dHIoJ3RhYmluZGV4JywgMCk7XG5cdFx0JCggaGVhZGVyU2V0W2ldICkuZm9jdXMoKTtcblx0fTtcblxuXHQvL1x0RVZFTlRTXG5cdHZhciBfZXZlbnRIZWFkZXJDbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0XHRfdG9nZ2xlUGFuZWwoICQodGhpcykgKTtcblx0fTtcblxuXHR2YXIgX2V2ZW50SGVhZGVyS2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG5cblx0XHQvLyBjb2xsZWN0IGhlYWRlciB0YXJnZXRzLCBhbmQgdGhlaXIgcHJldi9uZXh0XG5cdFx0dmFyIGN1cnJlbnRIZWFkZXIgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cdFx0dmFyIGlzTW9kaWZpZXJLZXkgPSBlLm1ldGFLZXkgfHwgZS5hbHRLZXk7XG5cdFx0Ly8gZ2V0IGNvbnRleHQgb2YgYWNjb3JkaW9uIGNvbnRhaW5lciBhbmQgaXRzIGNoaWxkcmVuXG5cdFx0dmFyIHRoaXNDb250YWluZXIgPSBjdXJyZW50SGVhZGVyLnBhcmVudCgpO1xuXHRcdHZhciB0aGVzZUhlYWRlcnMgPSAkKGhlYWRlclNlbGVjdG9yLCB0aGlzQ29udGFpbmVyKTtcbi8vXHRcdHZhciBjdXJyZW50SGVhZGVySW5kZXggPSBbXS5pbmRleE9mLmNhbGwodGhlc2VIZWFkZXJzLCBjdXJyZW50SGVhZGVyKTtcblx0XHR2YXIgY3VycmVudEhlYWRlckluZGV4ID0gdGhlc2VIZWFkZXJzLmluZGV4KCBjdXJyZW50SGVhZGVyICk7XG5cblx0XHQvLyBkb24ndCBjYXRjaCBrZXkgZXZlbnRzIHdoZW4g4oyYIG9yIEFsdCBtb2RpZmllciBpcyBwcmVzZW50XG5cdFx0aWYgKGlzTW9kaWZpZXJLZXkpIHJldHVybjtcblxuXHRcdC8vIGNhdGNoIGVudGVyL3NwYWNlLCBsZWZ0L3JpZ2h0IGFuZCB1cC9kb3duIGFycm93IGtleSBldmVudHNcblx0XHQvLyBpZiBuZXcgcGFuZWwgc2hvdyBpdCwgaWYgbmV4dC9wcmV2IG1vdmUgZm9jdXNcblx0XHRzd2l0Y2ggKGUua2V5Q29kZSkge1xuXHRcdFx0Y2FzZSAxMzpcblx0XHRcdGNhc2UgMzI6XG5cdFx0XHRcdF90b2dnbGVQYW5lbChjdXJyZW50SGVhZGVyKTtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzc6XG5cdFx0XHRjYXNlIDM4OiB7XG5cdFx0XHRcdHZhciBwcmV2aW91c0hlYWRlckluZGV4ID0gKGN1cnJlbnRIZWFkZXJJbmRleCA9PT0gMCkgPyB0aGVzZUhlYWRlcnMubGVuZ3RoIC0gMSA6IGN1cnJlbnRIZWFkZXJJbmRleCAtIDE7XG5cdFx0XHRcdF9naXZlSGVhZGVyRm9jdXModGhlc2VIZWFkZXJzLCBwcmV2aW91c0hlYWRlckluZGV4KTtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNhc2UgMzk6XG5cdFx0XHRjYXNlIDQwOiB7XG5cdFx0XHRcdHZhciBuZXh0SGVhZGVySW5kZXggPSAoY3VycmVudEhlYWRlckluZGV4IDwgdGhlc2VIZWFkZXJzLmxlbmd0aCAtIDEpID8gY3VycmVudEhlYWRlckluZGV4ICsgMSA6IDA7XG5cdFx0XHRcdF9naXZlSGVhZGVyRm9jdXModGhlc2VIZWFkZXJzLCBuZXh0SGVhZGVySW5kZXgpO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9O1xuXG5cdC8vXHRCSU5EIEVWRU5UU1xuXHR2YXIgX2JpbmRBY2NvcmRpb25FdmVudHMgPSBmdW5jdGlvbiggYWNjb3JkaW9uQ29udGFpbmVyICkge1xuXHRcdHZhciBhY2NvcmRpb25IZWFkZXJzID0gJChoZWFkZXJTZWxlY3RvciwgYWNjb3JkaW9uQ29udGFpbmVyKTtcblx0XHQvLyBiaW5kIGFsbCBhY2NvcmRpb24gaGVhZGVyIGNsaWNrIGFuZCBrZXlkb3duIGV2ZW50c1xuXHRcdGFjY29yZGlvbkhlYWRlcnMuZWFjaCggZnVuY3Rpb24oYWNjb3JkaW9uSGVhZGVyKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0JHRoaXMub24oJ2NsaWNrJywgX2V2ZW50SGVhZGVyQ2xpY2spO1xuXHRcdFx0JHRoaXMub24oJ2tleWRvd24nLCBfZXZlbnRIZWFkZXJLZXlkb3duKTtcblx0XHR9KTtcblx0fTtcblxuXHQvL1x0VU5CSU5EIEVWRU5UU1xuXHR2YXIgX3VuYmluZEFjY29yZGlvbkV2ZW50cyA9IGZ1bmN0aW9uKCBhY2NvcmRpb25Db250YWluZXIgKSB7XG5cdFx0dmFyIGFjY29yZGlvbkhlYWRlcnMgPSAkKGhlYWRlclNlbGVjdG9yLCBhY2NvcmRpb25Db250YWluZXIpO1xuXHRcdC8vIHVuYmluZCBhbGwgYWNjb3JkaW9uIGhlYWRlciBjbGljayBhbmQga2V5ZG93biBldmVudHNcblx0XHRhY2NvcmRpb25IZWFkZXJzLmVhY2goIGZ1bmN0aW9uKGFjY29yZGlvbkhlYWRlcikge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdCR0aGlzLm9mZignY2xpY2snLCBfZXZlbnRIZWFkZXJDbGljayk7XG5cdFx0XHQkdGhpcy5vZmYoJ2tleWRvd24nLCBfZXZlbnRIZWFkZXJLZXlkb3duKTtcblx0XHR9KTtcblx0fTtcblxuXHQvLyBERVNUUk9ZXG5cdHZhciBkZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdFx0YWNjb3JkaW9uQ29udGFpbmVycy5lYWNoKCBmdW5jdGlvbihhY2NvcmRpb25Db250YWluZXIpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHRfcmVtb3ZlQTExeSggJHRoaXMgKTtcblx0XHRcdF91bmJpbmRBY2NvcmRpb25FdmVudHMoICR0aGlzICk7XG5cdFx0XHQkdGhpcy5yZW1vdmVDbGFzcyggcmVhZHlDbGFzcyApO1xuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIElOSVRcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIGFjY29yZGlvbkNvbnRhaW5lcnMubGVuZ3RoICkge1xuXHRcdFx0YWNjb3JkaW9uQ29udGFpbmVycy5lYWNoKCBmdW5jdGlvbihhY2NvcmRpb25Db250YWluZXIpIHtcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblxuXHRcdFx0XHRfYWRkQTExeSggJHRoaXMgKTtcblx0XHRcdFx0X2JpbmRBY2NvcmRpb25FdmVudHMoICR0aGlzICk7XG5cdFx0XHRcdF9oaWRlQWxsUGFuZWxzKCAkdGhpcyApO1xuXHRcdFx0XHQvLyBzZXQgYWxsIGZpcnN0IGFjY29yZGlvbiBwYW5lbHMgYWN0aXZlIG9uIGluaXQgaWYgcmVxdWlyZWQgKGRlZmF1bHQgYmVoYXZpb3VyKVxuXHRcdFx0XHQvLyBvdGhlcndpc2UgbWFrZSBzdXJlIGZpcnN0IGFjY29yZGlvbiBoZWFkZXIgZm9yIGVhY2ggaXMgZm9jdXNhYmxlXG5cdFx0XHRcdGlmIChmaXJzdFBhbmVsc09wZW5CeURlZmF1bHQpIHtcblx0XHRcdFx0XHRfdG9nZ2xlUGFuZWwoICR0aGlzLmZpbmQoIGhlYWRlclNlbGVjdG9yICkuZmlyc3QoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCR0aGlzLmZpbmQoIGhlYWRlclNlbGVjdG9yLmZpcnN0KCkgKS5hdHRyKCd0YWJpbmRleCcsIDApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHNldCByZWFkeSBzdHlsZSBob29rXG5cdFx0XHRcdCR0aGlzLmFkZENsYXNzKCByZWFkeUNsYXNzICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRkZXN0cm95OiBkZXN0cm95XG5cdH07XG5cbn0pKGpRdWVyeSk7XG4qL1xuIl0sImZpbGUiOiJhY2NvcmRpb24uanMifQ==


var Carousel = (function ($) {
	'use strict';

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
					centerPadding: $this.data("center-padding") ? $this.data("center-padding") : "0px",
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
					prevArrow: "<button class='c-carousel__nav c-carousel__nav--prev'><i class='ico-arrow-left'></i><span class='u-hide-text'>Prev</span></button>",
                	nextArrow: "<button class='c-carousel__nav c-carousel__nav--next'><span class='u-hide-text'>Next</span><i class='ico-arrow-right'></i></button>",
				    fade: settings.fade
				});

			}

	    });

	};

	return {
		init: _init
	};

})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjYXJvdXNlbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBDYXJvdXNlbCA9IChmdW5jdGlvbiAoJCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIF9pbml0ID0gZnVuY3Rpb24oICRjYXJvdXNlbCApIHtcblxuXHRcdCRjYXJvdXNlbC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHRcdFx0Y291bnQgPSAkdGhpcy5jaGlsZHJlbigpLmxlbmd0aCxcblx0XHRcdFx0c2V0dGluZ3MgPSB7XG5cdFx0XHRcdFx0aXRlbXM6ICR0aGlzLmRhdGEoXCJpdGVtc1wiKSA/ICR0aGlzLmRhdGEoXCJpdGVtc1wiKSA6IDEsXG5cdFx0XHRcdFx0bG9vcDogJHRoaXMuZGF0YShcImxvb3BcIikgPyAkdGhpcy5kYXRhKFwibG9vcFwiKSA6IGZhbHNlLFxuXHRcdFx0XHRcdG5hdjogJHRoaXMuZGF0YShcIm5hdlwiKSA/ICR0aGlzLmRhdGEoXCJuYXZcIikgOiBmYWxzZSxcblx0XHRcdFx0XHRkb3RzOiAkdGhpcy5kYXRhKFwiZG90c1wiKSA/ICR0aGlzLmRhdGEoXCJkb3RzXCIpIDogZmFsc2UsXG5cdFx0XHRcdFx0Y2VudGVyOiAkdGhpcy5kYXRhKFwiY2VudGVyXCIpID8gJHRoaXMuZGF0YShcImNlbnRlclwiKSA6IGZhbHNlLFxuXHRcdFx0XHRcdGNlbnRlclBhZGRpbmc6ICR0aGlzLmRhdGEoXCJjZW50ZXItcGFkZGluZ1wiKSA/ICR0aGlzLmRhdGEoXCJjZW50ZXItcGFkZGluZ1wiKSA6IFwiMHB4XCIsXG5cdFx0XHRcdFx0YXV0b0hlaWdodDogJHRoaXMuZGF0YShcImF1dG8taGVpZ2h0XCIpID8gJHRoaXMuZGF0YShcImF1dG8taGVpZ2h0XCIpIDogZmFsc2UsXG5cdFx0XHRcdFx0YXV0b1dpZHRoOiAkdGhpcy5kYXRhKFwiYXV0by13aWR0aFwiKSA/ICR0aGlzLmRhdGEoXCJhdXRvLXdpZHRoXCIpIDogZmFsc2UsXG5cdFx0XHRcdFx0YXV0b1BsYXk6ICR0aGlzLmRhdGEoXCJhdXRvLXBsYXlcIikgPyAkdGhpcy5kYXRhKFwiYXV0by1wbGF5XCIpIDogZmFsc2UsXG5cdFx0XHRcdFx0ZmFkZTogJHRoaXMuZGF0YShcImZhZGVcIikgPyAkdGhpcy5kYXRhKFwiZmFkZVwiKSA6IGZhbHNlLFxuXHRcdFx0XHRcdHBhZGRlZDogJHRoaXMuZGF0YShcInBhZGRlZFwiKSA/ICR0aGlzLmRhdGEoXCJwYWRkZWRcIikgOiBmYWxzZSxcblx0XHRcdFx0XHRzcGVlZDogJHRoaXMuZGF0YShcInNwZWVkXCIpID8gJHRoaXMuZGF0YShcInNwZWVkXCIpIDogNDAwMFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRpZiggY291bnQgPiAxICkge1xuXG5cdFx0XHRcdCR0aGlzLnNsaWNrKHtcblx0XHRcdFx0ICAgIHNsaWRlc1RvU2hvdzogc2V0dGluZ3MuaXRlbXMsXG5cdFx0XHRcdCAgICBpbmZpbml0ZTogc2V0dGluZ3MubG9vcCxcblx0XHRcdFx0ICAgIGFycm93czogc2V0dGluZ3MubmF2LFxuXHRcdFx0XHRcdGFkYXB0aXZlSGVpZ2h0OiBzZXR0aW5ncy5hdXRvSGVpZ2h0LFxuXHRcdFx0XHRcdHZhcmlhYmxlV2lkdGg6IHNldHRpbmdzLmF1dG9XaWR0aCxcblx0XHRcdFx0ICAgIGF1dG9wbGF5OiBzZXR0aW5ncy5hdXRvUGxheSxcblx0XHRcdFx0XHRhdXRvcGxheVNwZWVkOiBzZXR0aW5ncy5zcGVlZCxcblx0XHRcdFx0XHRjZW50ZXJNb2RlOiBzZXR0aW5ncy5jZW50ZXIsXG5cdFx0XHRcdFx0Y2VudGVyUGFkZGluZzogc2V0dGluZ3MuY2VudGVyUGFkZGluZyxcblx0XHRcdFx0XHRkb3RzOiBzZXR0aW5ncy5kb3RzLFxuXHRcdFx0XHRcdGRvdHNDbGFzczogJ2MtY2Fyb3VzZWxfX2RvdHMnLFxuXHRcdFx0XHRcdHByZXZBcnJvdzogXCI8YnV0dG9uIGNsYXNzPSdjLWNhcm91c2VsX19uYXYgYy1jYXJvdXNlbF9fbmF2LS1wcmV2Jz48aSBjbGFzcz0naWNvLWFycm93LWxlZnQnPjwvaT48c3BhbiBjbGFzcz0ndS1oaWRlLXRleHQnPlByZXY8L3NwYW4+PC9idXR0b24+XCIsXG4gICAgICAgICAgICAgICAgXHRuZXh0QXJyb3c6IFwiPGJ1dHRvbiBjbGFzcz0nYy1jYXJvdXNlbF9fbmF2IGMtY2Fyb3VzZWxfX25hdi0tbmV4dCc+PHNwYW4gY2xhc3M9J3UtaGlkZS10ZXh0Jz5OZXh0PC9zcGFuPjxpIGNsYXNzPSdpY28tYXJyb3ctcmlnaHQnPjwvaT48L2J1dHRvbj5cIixcblx0XHRcdFx0ICAgIGZhZGU6IHNldHRpbmdzLmZhZGVcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblxuXHQgICAgfSk7XG5cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IF9pbml0XG5cdH07XG5cbn0pKGpRdWVyeSk7XG4iXSwiZmlsZSI6ImNhcm91c2VsLmpzIn0=

/*
var GMaps = (function($) {
	'use strict';

	var map,
		infoWindow,
		markerData,
		mapMarkers = [],
		$mapCanvas,
		dataSrc;

	// This function will iterate over markersData array
	// creating markers with createMarker function
	var _displayMarkers = function(){

	   // this variable sets the map bounds according to markers position
	   var bounds = new google.maps.LatLngBounds();

	   // for loop traverses markersData array calling createMarker function for each marker
	   for( var i = 0; i < markerData.length; i++ ) {
			var $this = markerData[i];

			var latlng = new google.maps.LatLng( $this.map.Latitude, $this.map.Longitude );
			_createMarker( $this, latlng );

			// marker position is added to bounds variable
			bounds.extend( latlng );
	   }

	   // Finally the bounds variable is used to set the map bounds
	   //map.setCenter( marker.getPosition() );
	   //map.fitBounds(bounds);
	   if( markerData.length === 1 ) {
		   map.setCenter( mapMarkers[0].position );
	   } else {
		   map.fitBounds(bounds);
	   }
	};

	// This function creates each marker and it sets
	// their Info Window content
	var _createMarker = function( markerData, latlng ){

		var marker = new google.maps.Marker({
			map: map,
			position: latlng,
			title: markerData.name,
			icon: {
				anchor: new google.maps.Point(16, 32),
				url: "/assets/img/marker.png"
			}
		});

	   // This event expects a click on a marker
	   // When this event is fired the Info Window content is created
	   // and the Info Window is opened.
	   google.maps.event.addListener( marker, 'click', function() {
	// use the below for custom modal
	//	   openMapModal( marker.supplierId );

	      // Creating the content to be inserted in the infowindow
	      var iwContent = '<div id="iw_container">' +
	            '<h4 class="iw_title">' + markerData.name + '</h4>' +
	         '<div class="iw_content">' + markerData.address + '<br />' +
	         markerData.phoneNumber + '</div></div>';

	      // including content to the Info Window.
	      infoWindow.setContent( iwContent );

	      // opening the Info Window in the current map and at the current marker location.
	      infoWindow.open(map, marker);

	   });

	   mapMarkers.push( marker );
	};

	// This function initializes the map
	var initCallback = function() {
		var mapOptions = {
			center: new google.maps.LatLng(51.510959,-0.21874),
			scrollwheel: false,
			zoom: 14,
			mapTypeId: 'roadmap'
		};

		var mapCanvas = document.getElementById('mapCanvas');
		map = new google.maps.Map( mapCanvas, mapOptions);

		// a new Info Window is created
		infoWindow = new google.maps.InfoWindow();

		// Event that closes the Info Window with a click on the map
		google.maps.event.addListener(map, 'click', function() {
			infoWindow.close();
		});

		jQuery.getJSON( dataSrc, function( data ) {
			// add json result to global var
			markerData = data.offices;
		})
		.done(function() {
			// Finally displayMarkers() function is called to begin the markers creation
			_displayMarkers();
		})
		.fail(function() {
			// console.log( "error" );
		});

	};

	// This function sets the data url for the JSON & async
	// loads google maps. After loading the assets it will call
	var _loadMapScript = function() {
		dataSrc = "/?altTemplate=JSONMapMarkers";

		// Asynchronously Load the map API
		var script = document.createElement('script');
		script.src = "http://maps.googleapis.com/maps/api/js?callback=window.GMaps.initCallback";
		document.body.appendChild(script);

	};

	// Check if a map canvas exists and kick things off
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
*/

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJnTWFwcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxudmFyIEdNYXBzID0gKGZ1bmN0aW9uKCQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBtYXAsXG5cdFx0aW5mb1dpbmRvdyxcblx0XHRtYXJrZXJEYXRhLFxuXHRcdG1hcE1hcmtlcnMgPSBbXSxcblx0XHQkbWFwQ2FudmFzLFxuXHRcdGRhdGFTcmM7XG5cblx0Ly8gVGhpcyBmdW5jdGlvbiB3aWxsIGl0ZXJhdGUgb3ZlciBtYXJrZXJzRGF0YSBhcnJheVxuXHQvLyBjcmVhdGluZyBtYXJrZXJzIHdpdGggY3JlYXRlTWFya2VyIGZ1bmN0aW9uXG5cdHZhciBfZGlzcGxheU1hcmtlcnMgPSBmdW5jdGlvbigpe1xuXG5cdCAgIC8vIHRoaXMgdmFyaWFibGUgc2V0cyB0aGUgbWFwIGJvdW5kcyBhY2NvcmRpbmcgdG8gbWFya2VycyBwb3NpdGlvblxuXHQgICB2YXIgYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xuXG5cdCAgIC8vIGZvciBsb29wIHRyYXZlcnNlcyBtYXJrZXJzRGF0YSBhcnJheSBjYWxsaW5nIGNyZWF0ZU1hcmtlciBmdW5jdGlvbiBmb3IgZWFjaCBtYXJrZXJcblx0ICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBtYXJrZXJEYXRhLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dmFyICR0aGlzID0gbWFya2VyRGF0YVtpXTtcblxuXHRcdFx0dmFyIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoICR0aGlzLm1hcC5MYXRpdHVkZSwgJHRoaXMubWFwLkxvbmdpdHVkZSApO1xuXHRcdFx0X2NyZWF0ZU1hcmtlciggJHRoaXMsIGxhdGxuZyApO1xuXG5cdFx0XHQvLyBtYXJrZXIgcG9zaXRpb24gaXMgYWRkZWQgdG8gYm91bmRzIHZhcmlhYmxlXG5cdFx0XHRib3VuZHMuZXh0ZW5kKCBsYXRsbmcgKTtcblx0ICAgfVxuXG5cdCAgIC8vIEZpbmFsbHkgdGhlIGJvdW5kcyB2YXJpYWJsZSBpcyB1c2VkIHRvIHNldCB0aGUgbWFwIGJvdW5kc1xuXHQgICAvL21hcC5zZXRDZW50ZXIoIG1hcmtlci5nZXRQb3NpdGlvbigpICk7XG5cdCAgIC8vbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xuXHQgICBpZiggbWFya2VyRGF0YS5sZW5ndGggPT09IDEgKSB7XG5cdFx0ICAgbWFwLnNldENlbnRlciggbWFwTWFya2Vyc1swXS5wb3NpdGlvbiApO1xuXHQgICB9IGVsc2Uge1xuXHRcdCAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcblx0ICAgfVxuXHR9O1xuXG5cdC8vIFRoaXMgZnVuY3Rpb24gY3JlYXRlcyBlYWNoIG1hcmtlciBhbmQgaXQgc2V0c1xuXHQvLyB0aGVpciBJbmZvIFdpbmRvdyBjb250ZW50XG5cdHZhciBfY3JlYXRlTWFya2VyID0gZnVuY3Rpb24oIG1hcmtlckRhdGEsIGxhdGxuZyApe1xuXG5cdFx0dmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0bWFwOiBtYXAsXG5cdFx0XHRwb3NpdGlvbjogbGF0bG5nLFxuXHRcdFx0dGl0bGU6IG1hcmtlckRhdGEubmFtZSxcblx0XHRcdGljb246IHtcblx0XHRcdFx0YW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMTYsIDMyKSxcblx0XHRcdFx0dXJsOiBcIi9hc3NldHMvaW1nL21hcmtlci5wbmdcIlxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdCAgIC8vIFRoaXMgZXZlbnQgZXhwZWN0cyBhIGNsaWNrIG9uIGEgbWFya2VyXG5cdCAgIC8vIFdoZW4gdGhpcyBldmVudCBpcyBmaXJlZCB0aGUgSW5mbyBXaW5kb3cgY29udGVudCBpcyBjcmVhdGVkXG5cdCAgIC8vIGFuZCB0aGUgSW5mbyBXaW5kb3cgaXMgb3BlbmVkLlxuXHQgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciggbWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0Ly8gdXNlIHRoZSBiZWxvdyBmb3IgY3VzdG9tIG1vZGFsXG5cdC8vXHQgICBvcGVuTWFwTW9kYWwoIG1hcmtlci5zdXBwbGllcklkICk7XG5cblx0ICAgICAgLy8gQ3JlYXRpbmcgdGhlIGNvbnRlbnQgdG8gYmUgaW5zZXJ0ZWQgaW4gdGhlIGluZm93aW5kb3dcblx0ICAgICAgdmFyIGl3Q29udGVudCA9ICc8ZGl2IGlkPVwiaXdfY29udGFpbmVyXCI+JyArXG5cdCAgICAgICAgICAgICc8aDQgY2xhc3M9XCJpd190aXRsZVwiPicgKyBtYXJrZXJEYXRhLm5hbWUgKyAnPC9oND4nICtcblx0ICAgICAgICAgJzxkaXYgY2xhc3M9XCJpd19jb250ZW50XCI+JyArIG1hcmtlckRhdGEuYWRkcmVzcyArICc8YnIgLz4nICtcblx0ICAgICAgICAgbWFya2VyRGF0YS5waG9uZU51bWJlciArICc8L2Rpdj48L2Rpdj4nO1xuXG5cdCAgICAgIC8vIGluY2x1ZGluZyBjb250ZW50IHRvIHRoZSBJbmZvIFdpbmRvdy5cblx0ICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KCBpd0NvbnRlbnQgKTtcblxuXHQgICAgICAvLyBvcGVuaW5nIHRoZSBJbmZvIFdpbmRvdyBpbiB0aGUgY3VycmVudCBtYXAgYW5kIGF0IHRoZSBjdXJyZW50IG1hcmtlciBsb2NhdGlvbi5cblx0ICAgICAgaW5mb1dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcblxuXHQgICB9KTtcblxuXHQgICBtYXBNYXJrZXJzLnB1c2goIG1hcmtlciApO1xuXHR9O1xuXG5cdC8vIFRoaXMgZnVuY3Rpb24gaW5pdGlhbGl6ZXMgdGhlIG1hcFxuXHR2YXIgaW5pdENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1hcE9wdGlvbnMgPSB7XG5cdFx0XHRjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNTEuNTEwOTU5LC0wLjIxODc0KSxcblx0XHRcdHNjcm9sbHdoZWVsOiBmYWxzZSxcblx0XHRcdHpvb206IDE0LFxuXHRcdFx0bWFwVHlwZUlkOiAncm9hZG1hcCdcblx0XHR9O1xuXG5cdFx0dmFyIG1hcENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBDYW52YXMnKTtcblx0XHRtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKCBtYXBDYW52YXMsIG1hcE9wdGlvbnMpO1xuXG5cdFx0Ly8gYSBuZXcgSW5mbyBXaW5kb3cgaXMgY3JlYXRlZFxuXHRcdGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpO1xuXG5cdFx0Ly8gRXZlbnQgdGhhdCBjbG9zZXMgdGhlIEluZm8gV2luZG93IHdpdGggYSBjbGljayBvbiB0aGUgbWFwXG5cdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdGluZm9XaW5kb3cuY2xvc2UoKTtcblx0XHR9KTtcblxuXHRcdGpRdWVyeS5nZXRKU09OKCBkYXRhU3JjLCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdC8vIGFkZCBqc29uIHJlc3VsdCB0byBnbG9iYWwgdmFyXG5cdFx0XHRtYXJrZXJEYXRhID0gZGF0YS5vZmZpY2VzO1xuXHRcdH0pXG5cdFx0LmRvbmUoZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBGaW5hbGx5IGRpc3BsYXlNYXJrZXJzKCkgZnVuY3Rpb24gaXMgY2FsbGVkIHRvIGJlZ2luIHRoZSBtYXJrZXJzIGNyZWF0aW9uXG5cdFx0XHRfZGlzcGxheU1hcmtlcnMoKTtcblx0XHR9KVxuXHRcdC5mYWlsKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coIFwiZXJyb3JcIiApO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0Ly8gVGhpcyBmdW5jdGlvbiBzZXRzIHRoZSBkYXRhIHVybCBmb3IgdGhlIEpTT04gJiBhc3luY1xuXHQvLyBsb2FkcyBnb29nbGUgbWFwcy4gQWZ0ZXIgbG9hZGluZyB0aGUgYXNzZXRzIGl0IHdpbGwgY2FsbFxuXHR2YXIgX2xvYWRNYXBTY3JpcHQgPSBmdW5jdGlvbigpIHtcblx0XHRkYXRhU3JjID0gXCIvP2FsdFRlbXBsYXRlPUpTT05NYXBNYXJrZXJzXCI7XG5cblx0XHQvLyBBc3luY2hyb25vdXNseSBMb2FkIHRoZSBtYXAgQVBJXG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC5zcmMgPSBcImh0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzP2NhbGxiYWNrPXdpbmRvdy5HTWFwcy5pbml0Q2FsbGJhY2tcIjtcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cblx0fTtcblxuXHQvLyBDaGVjayBpZiBhIG1hcCBjYW52YXMgZXhpc3RzIGFuZCBraWNrIHRoaW5ncyBvZmZcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHQkbWFwQ2FudmFzID0gJCgnI21hcENhbnZhcycpO1xuXG5cdFx0aWYoICRtYXBDYW52YXMubGVuZ3RoID4gMCApIHtcblx0XHRcdF9sb2FkTWFwU2NyaXB0KCk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRpbml0Q2FsbGJhY2s6IGluaXRDYWxsYmFja1xuXHR9O1xuXG59KShqUXVlcnkpO1xuKi9cbiJdLCJmaWxlIjoiZ01hcHMuanMifQ==

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "tabs",
			defaults = {
				contentClass: 'c-tabs__content'
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = $(element);
			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
			init: function () {
				this._activeTab		= ( this.getUrlHash() !== "" ? $('#' + this.getUrlHash() ).index() : 0 );
				this.$nav 			= this.element.find('nav');
				this.$navList		= this.$nav.find('ul');
				this.$navItems		= this.$navList.find('li');
				this.$navLinks		= this.$navItems.find('a');
				this.$content 		= this.element.find('.c-tabs__content');
				this.$contentTabs	= this.$content.children();
				this._tabLength		= this.$navItems.length;
				this._resizeTimer	= 0;

				this.element.addClass('js-tabs--loaded');

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example bellow
//				this.setTabIndexes();
				this.setEventHandlers();
				// @todo get hash fragment or first
				this.setActiveTab( this._activeTab );
				this.resizeHandler();
				this.addNav();

			},
			getUrlHash: function() {
//				return document.URL.substr(document.URL.indexOf('#')+1);
				return location.hash.match(/^#?(.*)$/)[1];
			},
			setEventHandlers: function() {
				var $self = this;

				$self.$navList.find('li').on('click', function( e ){
					var $this = $(this);

					if( !$this.hasClass('is-active') ) {
						$self.setActiveTab( $this.index() );
						$self.setActiveHash( $this.find('a').attr('href') );
					}
					e.preventDefault();
				});
			},
			setActiveHash: function( urlHash ) {
				if( Modernizr.history ) {
					history.pushState( null, null, urlHash );
				}
				/*
				else {
					location.hash = urlHash;
				}
				*/
			},
			setTabIndexes: function() {
				for( var i = 0; i < this._tabLength; i++ ) {
					this.$navItems.eq( i ).attr('data-index', i);
					this.$contentTabs.eq( i ).attr('data-index', i);
				}
			},
			setActiveTab: function( i ) {
				this._activeTab = i;

				var $activeNavItem 		= this.$navList.children('li').eq( this._activeTab ),
					$activeContentTab 	= this.$content.children('section').eq( this._activeTab );

				this.$navList.find('.is-active').removeClass('is-active');
				this.$content.find('.is-active').removeClass('is-active');

				$activeNavItem.addClass('is-active');
				$activeContentTab.addClass('is-active');

				this.animateContentHeight( $activeContentTab );
			},
			addNav: function() {
				var delta = 40,
					$self = this,
					$prevButton = $('<button>', {
						'class': 'c-tabs__page c-tabs__page--prev js-tabs-page-prev',
						'text': 'prev'
					}),
					$nextButton = $('<button>', {
						'class': 'c-tabs__page c-tabs__page--next js-tabs-page-next',
						'text': 'next'
					});

				this.$nav.prepend( $prevButton );
				this.$nav.append( $nextButton );

				this.$navList.on('scroll', function() {
					$self.updateScrollIndicator( $prevButton, $nextButton );
				} );
				this.updateScrollIndicator( $prevButton, $nextButton );

				$nextButton.on('click', function() {
					$self.scrollMenuBar( delta );
				});

				$nextButton.on('tap', function() {
					$self.scrollMenuBar( delta );
				});
				$prevButton.on('click', function() {
					$self.scrollMenuBar( -delta );
				});
				$prevButton.on('tap', function() {
					$self.scrollMenuBar( -delta );
				});
			},
			updateScrollIndicator: function( $leftScroll, $rightScroll) {
				var $self = this,
					$menuBar = $self.$navList.get(0);

				$leftScroll.removeClass('is-disabled');
				$rightScroll.removeClass('is-disabled');
				
				if( $menuBar.scrollLeft <= 0 ) {
					$leftScroll.addClass('is-disabled');
				}

				// 5px tolerance because browsers!
				if( $menuBar.scrollLeft + $self.$navList.innerWidth() + 5 >= $menuBar.scrollWidth ) {
					$rightScroll.addClass('is-disabled');
				}
			},
			scrollMenuBar: function( delta ) {
				var $menuBar = this.$navList.get(0);
				$menuBar.scrollLeft += delta;
			},
			animateContentHeight: function( el ) {
				this.$content.css({
					'height': el.innerHeight()
				});
			},
			resizeHandler: function() {
				var $activeContentTab = this.$content.children('section').eq( this._activeTab ),
					$self = this;

				// On resize, run the function and reset the timeout
				// 250 is the delay in milliseconds. Change as you see fit.
				$(window).resize(function() {
					clearTimeout( this._resizeTimer );
					this._resizeTimer = setTimeout( $self.animateContentHeight( $activeContentTab ), 250 );
				});
			}
				
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
			return this.each(function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
						$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				}
			});
		};

})( jQuery, window, document );
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkudGFicy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0aGUgc2VtaS1jb2xvbiBiZWZvcmUgZnVuY3Rpb24gaW52b2NhdGlvbiBpcyBhIHNhZmV0eSBuZXQgYWdhaW5zdCBjb25jYXRlbmF0ZWRcbi8vIHNjcmlwdHMgYW5kL29yIG90aGVyIHBsdWdpbnMgd2hpY2ggbWF5IG5vdCBiZSBjbG9zZWQgcHJvcGVybHkuXG47KGZ1bmN0aW9uICggJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkICkge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0Ly8gdW5kZWZpbmVkIGlzIHVzZWQgaGVyZSBhcyB0aGUgdW5kZWZpbmVkIGdsb2JhbCB2YXJpYWJsZSBpbiBFQ01BU2NyaXB0IDMgaXNcblx0XHQvLyBtdXRhYmxlIChpZS4gaXQgY2FuIGJlIGNoYW5nZWQgYnkgc29tZW9uZSBlbHNlKS4gdW5kZWZpbmVkIGlzbid0IHJlYWxseSBiZWluZ1xuXHRcdC8vIHBhc3NlZCBpbiBzbyB3ZSBjYW4gZW5zdXJlIHRoZSB2YWx1ZSBvZiBpdCBpcyB0cnVseSB1bmRlZmluZWQuIEluIEVTNSwgdW5kZWZpbmVkXG5cdFx0Ly8gY2FuIG5vIGxvbmdlciBiZSBtb2RpZmllZC5cblxuXHRcdC8vIHdpbmRvdyBhbmQgZG9jdW1lbnQgYXJlIHBhc3NlZCB0aHJvdWdoIGFzIGxvY2FsIHZhcmlhYmxlIHJhdGhlciB0aGFuIGdsb2JhbFxuXHRcdC8vIGFzIHRoaXMgKHNsaWdodGx5KSBxdWlja2VucyB0aGUgcmVzb2x1dGlvbiBwcm9jZXNzIGFuZCBjYW4gYmUgbW9yZSBlZmZpY2llbnRseVxuXHRcdC8vIG1pbmlmaWVkIChlc3BlY2lhbGx5IHdoZW4gYm90aCBhcmUgcmVndWxhcmx5IHJlZmVyZW5jZWQgaW4geW91ciBwbHVnaW4pLlxuXG5cdFx0Ly8gQ3JlYXRlIHRoZSBkZWZhdWx0cyBvbmNlXG5cdFx0dmFyIHBsdWdpbk5hbWUgPSBcInRhYnNcIixcblx0XHRcdGRlZmF1bHRzID0ge1xuXHRcdFx0XHRjb250ZW50Q2xhc3M6ICdjLXRhYnNfX2NvbnRlbnQnXG5cdFx0XHR9O1xuXG5cdFx0Ly8gVGhlIGFjdHVhbCBwbHVnaW4gY29uc3RydWN0b3Jcblx0XHRmdW5jdGlvbiBQbHVnaW4gKCBlbGVtZW50LCBvcHRpb25zICkge1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gJChlbGVtZW50KTtcblx0XHRcdC8vIGpRdWVyeSBoYXMgYW4gZXh0ZW5kIG1ldGhvZCB3aGljaCBtZXJnZXMgdGhlIGNvbnRlbnRzIG9mIHR3byBvclxuXHRcdFx0Ly8gbW9yZSBvYmplY3RzLCBzdG9yaW5nIHRoZSByZXN1bHQgaW4gdGhlIGZpcnN0IG9iamVjdC4gVGhlIGZpcnN0IG9iamVjdFxuXHRcdFx0Ly8gaXMgZ2VuZXJhbGx5IGVtcHR5IGFzIHdlIGRvbid0IHdhbnQgdG8gYWx0ZXIgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3Jcblx0XHRcdC8vIGZ1dHVyZSBpbnN0YW5jZXMgb2YgdGhlIHBsdWdpblxuXHRcdFx0dGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMgKTtcblx0XHRcdHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHM7XG5cdFx0XHR0aGlzLl9uYW1lID0gcGx1Z2luTmFtZTtcblx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdH1cblxuXHRcdC8vIEF2b2lkIFBsdWdpbi5wcm90b3R5cGUgY29uZmxpY3RzXG5cdFx0JC5leHRlbmQoUGx1Z2luLnByb3RvdHlwZSwge1xuXHRcdFx0aW5pdDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aGlzLl9hY3RpdmVUYWJcdFx0PSAoIHRoaXMuZ2V0VXJsSGFzaCgpICE9PSBcIlwiID8gJCgnIycgKyB0aGlzLmdldFVybEhhc2goKSApLmluZGV4KCkgOiAwICk7XG5cdFx0XHRcdHRoaXMuJG5hdiBcdFx0XHQ9IHRoaXMuZWxlbWVudC5maW5kKCduYXYnKTtcblx0XHRcdFx0dGhpcy4kbmF2TGlzdFx0XHQ9IHRoaXMuJG5hdi5maW5kKCd1bCcpO1xuXHRcdFx0XHR0aGlzLiRuYXZJdGVtc1x0XHQ9IHRoaXMuJG5hdkxpc3QuZmluZCgnbGknKTtcblx0XHRcdFx0dGhpcy4kbmF2TGlua3NcdFx0PSB0aGlzLiRuYXZJdGVtcy5maW5kKCdhJyk7XG5cdFx0XHRcdHRoaXMuJGNvbnRlbnQgXHRcdD0gdGhpcy5lbGVtZW50LmZpbmQoJy5jLXRhYnNfX2NvbnRlbnQnKTtcblx0XHRcdFx0dGhpcy4kY29udGVudFRhYnNcdD0gdGhpcy4kY29udGVudC5jaGlsZHJlbigpO1xuXHRcdFx0XHR0aGlzLl90YWJMZW5ndGhcdFx0PSB0aGlzLiRuYXZJdGVtcy5sZW5ndGg7XG5cdFx0XHRcdHRoaXMuX3Jlc2l6ZVRpbWVyXHQ9IDA7XG5cblx0XHRcdFx0dGhpcy5lbGVtZW50LmFkZENsYXNzKCdqcy10YWJzLS1sb2FkZWQnKTtcblxuXHRcdFx0XHQvLyBQbGFjZSBpbml0aWFsaXphdGlvbiBsb2dpYyBoZXJlXG5cdFx0XHRcdC8vIFlvdSBhbHJlYWR5IGhhdmUgYWNjZXNzIHRvIHRoZSBET00gZWxlbWVudCBhbmRcblx0XHRcdFx0Ly8gdGhlIG9wdGlvbnMgdmlhIHRoZSBpbnN0YW5jZSwgZS5nLiB0aGlzLmVsZW1lbnRcblx0XHRcdFx0Ly8gYW5kIHRoaXMuc2V0dGluZ3Ncblx0XHRcdFx0Ly8geW91IGNhbiBhZGQgbW9yZSBmdW5jdGlvbnMgbGlrZSB0aGUgb25lIGJlbG93IGFuZFxuXHRcdFx0XHQvLyBjYWxsIHRoZW0gbGlrZSB0aGUgZXhhbXBsZSBiZWxsb3dcbi8vXHRcdFx0XHR0aGlzLnNldFRhYkluZGV4ZXMoKTtcblx0XHRcdFx0dGhpcy5zZXRFdmVudEhhbmRsZXJzKCk7XG5cdFx0XHRcdC8vIEB0b2RvIGdldCBoYXNoIGZyYWdtZW50IG9yIGZpcnN0XG5cdFx0XHRcdHRoaXMuc2V0QWN0aXZlVGFiKCB0aGlzLl9hY3RpdmVUYWIgKTtcblx0XHRcdFx0dGhpcy5yZXNpemVIYW5kbGVyKCk7XG5cdFx0XHRcdHRoaXMuYWRkTmF2KCk7XG5cblx0XHRcdH0sXG5cdFx0XHRnZXRVcmxIYXNoOiBmdW5jdGlvbigpIHtcbi8vXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQuVVJMLnN1YnN0cihkb2N1bWVudC5VUkwuaW5kZXhPZignIycpKzEpO1xuXHRcdFx0XHRyZXR1cm4gbG9jYXRpb24uaGFzaC5tYXRjaCgvXiM/KC4qKSQvKVsxXTtcblx0XHRcdH0sXG5cdFx0XHRzZXRFdmVudEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyICRzZWxmID0gdGhpcztcblxuXHRcdFx0XHQkc2VsZi4kbmF2TGlzdC5maW5kKCdsaScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCBlICl7XG5cdFx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblxuXHRcdFx0XHRcdGlmKCAhJHRoaXMuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpICkge1xuXHRcdFx0XHRcdFx0JHNlbGYuc2V0QWN0aXZlVGFiKCAkdGhpcy5pbmRleCgpICk7XG5cdFx0XHRcdFx0XHQkc2VsZi5zZXRBY3RpdmVIYXNoKCAkdGhpcy5maW5kKCdhJykuYXR0cignaHJlZicpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0QWN0aXZlSGFzaDogZnVuY3Rpb24oIHVybEhhc2ggKSB7XG5cdFx0XHRcdGlmKCBNb2Rlcm5penIuaGlzdG9yeSApIHtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSggbnVsbCwgbnVsbCwgdXJsSGFzaCApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qXG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSB1cmxIYXNoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCovXG5cdFx0XHR9LFxuXHRcdFx0c2V0VGFiSW5kZXhlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5fdGFiTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0dGhpcy4kbmF2SXRlbXMuZXEoIGkgKS5hdHRyKCdkYXRhLWluZGV4JywgaSk7XG5cdFx0XHRcdFx0dGhpcy4kY29udGVudFRhYnMuZXEoIGkgKS5hdHRyKCdkYXRhLWluZGV4JywgaSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzZXRBY3RpdmVUYWI6IGZ1bmN0aW9uKCBpICkge1xuXHRcdFx0XHR0aGlzLl9hY3RpdmVUYWIgPSBpO1xuXG5cdFx0XHRcdHZhciAkYWN0aXZlTmF2SXRlbSBcdFx0PSB0aGlzLiRuYXZMaXN0LmNoaWxkcmVuKCdsaScpLmVxKCB0aGlzLl9hY3RpdmVUYWIgKSxcblx0XHRcdFx0XHQkYWN0aXZlQ29udGVudFRhYiBcdD0gdGhpcy4kY29udGVudC5jaGlsZHJlbignc2VjdGlvbicpLmVxKCB0aGlzLl9hY3RpdmVUYWIgKTtcblxuXHRcdFx0XHR0aGlzLiRuYXZMaXN0LmZpbmQoJy5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdHRoaXMuJGNvbnRlbnQuZmluZCgnLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRcdFx0XHQkYWN0aXZlTmF2SXRlbS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRhY3RpdmVDb250ZW50VGFiLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRcdFx0XHR0aGlzLmFuaW1hdGVDb250ZW50SGVpZ2h0KCAkYWN0aXZlQ29udGVudFRhYiApO1xuXHRcdFx0fSxcblx0XHRcdGFkZE5hdjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBkZWx0YSA9IDQwLFxuXHRcdFx0XHRcdCRzZWxmID0gdGhpcyxcblx0XHRcdFx0XHQkcHJldkJ1dHRvbiA9ICQoJzxidXR0b24+Jywge1xuXHRcdFx0XHRcdFx0J2NsYXNzJzogJ2MtdGFic19fcGFnZSBjLXRhYnNfX3BhZ2UtLXByZXYganMtdGFicy1wYWdlLXByZXYnLFxuXHRcdFx0XHRcdFx0J3RleHQnOiAncHJldidcblx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHQkbmV4dEJ1dHRvbiA9ICQoJzxidXR0b24+Jywge1xuXHRcdFx0XHRcdFx0J2NsYXNzJzogJ2MtdGFic19fcGFnZSBjLXRhYnNfX3BhZ2UtLW5leHQganMtdGFicy1wYWdlLW5leHQnLFxuXHRcdFx0XHRcdFx0J3RleHQnOiAnbmV4dCdcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR0aGlzLiRuYXYucHJlcGVuZCggJHByZXZCdXR0b24gKTtcblx0XHRcdFx0dGhpcy4kbmF2LmFwcGVuZCggJG5leHRCdXR0b24gKTtcblxuXHRcdFx0XHR0aGlzLiRuYXZMaXN0Lm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkc2VsZi51cGRhdGVTY3JvbGxJbmRpY2F0b3IoICRwcmV2QnV0dG9uLCAkbmV4dEJ1dHRvbiApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHRoaXMudXBkYXRlU2Nyb2xsSW5kaWNhdG9yKCAkcHJldkJ1dHRvbiwgJG5leHRCdXR0b24gKTtcblxuXHRcdFx0XHQkbmV4dEJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkc2VsZi5zY3JvbGxNZW51QmFyKCBkZWx0YSApO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkbmV4dEJ1dHRvbi5vbigndGFwJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JHNlbGYuc2Nyb2xsTWVudUJhciggZGVsdGEgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRwcmV2QnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRzZWxmLnNjcm9sbE1lbnVCYXIoIC1kZWx0YSApO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHByZXZCdXR0b24ub24oJ3RhcCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRzZWxmLnNjcm9sbE1lbnVCYXIoIC1kZWx0YSApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHR1cGRhdGVTY3JvbGxJbmRpY2F0b3I6IGZ1bmN0aW9uKCAkbGVmdFNjcm9sbCwgJHJpZ2h0U2Nyb2xsKSB7XG5cdFx0XHRcdHZhciAkc2VsZiA9IHRoaXMsXG5cdFx0XHRcdFx0JG1lbnVCYXIgPSAkc2VsZi4kbmF2TGlzdC5nZXQoMCk7XG5cblx0XHRcdFx0JGxlZnRTY3JvbGwucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cdFx0XHRcdCRyaWdodFNjcm9sbC5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmKCAkbWVudUJhci5zY3JvbGxMZWZ0IDw9IDAgKSB7XG5cdFx0XHRcdFx0JGxlZnRTY3JvbGwuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyA1cHggdG9sZXJhbmNlIGJlY2F1c2UgYnJvd3NlcnMhXG5cdFx0XHRcdGlmKCAkbWVudUJhci5zY3JvbGxMZWZ0ICsgJHNlbGYuJG5hdkxpc3QuaW5uZXJXaWR0aCgpICsgNSA+PSAkbWVudUJhci5zY3JvbGxXaWR0aCApIHtcblx0XHRcdFx0XHQkcmlnaHRTY3JvbGwuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzY3JvbGxNZW51QmFyOiBmdW5jdGlvbiggZGVsdGEgKSB7XG5cdFx0XHRcdHZhciAkbWVudUJhciA9IHRoaXMuJG5hdkxpc3QuZ2V0KDApO1xuXHRcdFx0XHQkbWVudUJhci5zY3JvbGxMZWZ0ICs9IGRlbHRhO1xuXHRcdFx0fSxcblx0XHRcdGFuaW1hdGVDb250ZW50SGVpZ2h0OiBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdHRoaXMuJGNvbnRlbnQuY3NzKHtcblx0XHRcdFx0XHQnaGVpZ2h0JzogZWwuaW5uZXJIZWlnaHQoKVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRyZXNpemVIYW5kbGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyICRhY3RpdmVDb250ZW50VGFiID0gdGhpcy4kY29udGVudC5jaGlsZHJlbignc2VjdGlvbicpLmVxKCB0aGlzLl9hY3RpdmVUYWIgKSxcblx0XHRcdFx0XHQkc2VsZiA9IHRoaXM7XG5cblx0XHRcdFx0Ly8gT24gcmVzaXplLCBydW4gdGhlIGZ1bmN0aW9uIGFuZCByZXNldCB0aGUgdGltZW91dFxuXHRcdFx0XHQvLyAyNTAgaXMgdGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gQ2hhbmdlIGFzIHlvdSBzZWUgZml0LlxuXHRcdFx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggdGhpcy5fcmVzaXplVGltZXIgKTtcblx0XHRcdFx0XHR0aGlzLl9yZXNpemVUaW1lciA9IHNldFRpbWVvdXQoICRzZWxmLmFuaW1hdGVDb250ZW50SGVpZ2h0KCAkYWN0aXZlQ29udGVudFRhYiApLCAyNTAgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcdFxuXHRcdH0pO1xuXG5cdFx0Ly8gQSByZWFsbHkgbGlnaHR3ZWlnaHQgcGx1Z2luIHdyYXBwZXIgYXJvdW5kIHRoZSBjb25zdHJ1Y3Rvcixcblx0XHQvLyBwcmV2ZW50aW5nIGFnYWluc3QgbXVsdGlwbGUgaW5zdGFudGlhdGlvbnNcblx0XHQkLmZuWyBwbHVnaW5OYW1lIF0gPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICEkLmRhdGEoIHRoaXMsIFwicGx1Z2luX1wiICsgcGx1Z2luTmFtZSApICkge1xuXHRcdFx0XHRcdFx0JC5kYXRhKCB0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUsIG5ldyBQbHVnaW4oIHRoaXMsIG9wdGlvbnMgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG59KSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICk7Il0sImZpbGUiOiJqcXVlcnkudGFicy5qcyJ9

/*
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
		mainClass: 'mfp-with-zoom mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			verticalFit: true,
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
		},
		midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
	};

	var _init = function( $trigger ) {

		$trigger.each(function() {
			var $this = $(this),
				type = $this.data("modal-type") ? $this.data("modal-type") : "default",
				ajaxSettings = {
					template: $this.data("template") ? $this.data("template") : null,
					id: $this.data("id") ? $this.data("id") : 0
				},
				options,
				isAjax = type === "ajax" && ajaxSettings.template !== null && ajaxSettings.id !== 0,
				isGallery = type === "gallery" ? true : false;


			if( isAjax ) {

				options = {
					removalDelay: 500, //delay removal by X to allow out-animation
					items: {
                        src: "?altTemplate=" + ajaxSettings.template + "&id=" + ajaxSettings.id,
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
*/

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2RhbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxudmFyIE1vZGFsID0gKGZ1bmN0aW9uICgkKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgX2RlZmF1bHRPcHRpb25zID0ge1xuXHRcdHJlbW92YWxEZWxheTogNTAwLCAvL2RlbGF5IHJlbW92YWwgYnkgWCB0byBhbGxvdyBvdXQtYW5pbWF0aW9uXG5cdFx0Y2FsbGJhY2tzOiB7XG5cdFx0XHRiZWZvcmVPcGVuOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5zdC5tYWluQ2xhc3MgPSAnbWZwLXpvb20taW4nO1xuXHRcdFx0fSxcblx0XHR9LFxuXHRcdG92ZXJmbG93WTogJ3Njcm9sbCcsXG5cdFx0bWlkQ2xpY2s6IHRydWUgLy8gYWxsb3cgb3BlbmluZyBwb3B1cCBvbiBtaWRkbGUgbW91c2UgY2xpY2suIEFsd2F5cyBzZXQgaXQgdG8gdHJ1ZSBpZiB5b3UgZG9uJ3QgcHJvdmlkZSBhbHRlcm5hdGl2ZSBzb3VyY2UuXG5cdH07XG5cblx0dmFyIF9nYWxsZXJ5T3B0aW9ucyA9IHtcblx0XHRkZWxlZ2F0ZTogJ2EnLFxuXHRcdHR5cGU6ICdpbWFnZScsXG5cdFx0dExvYWRpbmc6ICdMb2FkaW5nIGltYWdlICMlY3VyciUuLi4nLFxuXHRcdG1haW5DbGFzczogJ21mcC13aXRoLXpvb20gbWZwLWltZy1tb2JpbGUnLFxuXHRcdGdhbGxlcnk6IHtcblx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRuYXZpZ2F0ZUJ5SW1nQ2xpY2s6IHRydWUsXG5cdFx0XHRwcmVsb2FkOiBbMCwxXSAvLyBXaWxsIHByZWxvYWQgMCAtIGJlZm9yZSBjdXJyZW50LCBhbmQgMSBhZnRlciB0aGUgY3VycmVudCBpbWFnZVxuXHRcdH0sXG5cdFx0aW1hZ2U6IHtcblx0XHRcdHZlcnRpY2FsRml0OiB0cnVlLFxuXHRcdFx0dEVycm9yOiAnPGEgaHJlZj1cIiV1cmwlXCI+VGhlIGltYWdlICMlY3VyciU8L2E+IGNvdWxkIG5vdCBiZSBsb2FkZWQuJyxcblx0XHR9LFxuXHRcdG1pZENsaWNrOiB0cnVlIC8vIGFsbG93IG9wZW5pbmcgcG9wdXAgb24gbWlkZGxlIG1vdXNlIGNsaWNrLiBBbHdheXMgc2V0IGl0IHRvIHRydWUgaWYgeW91IGRvbid0IHByb3ZpZGUgYWx0ZXJuYXRpdmUgc291cmNlLlxuXHR9O1xuXG5cdHZhciBfaW5pdCA9IGZ1bmN0aW9uKCAkdHJpZ2dlciApIHtcblxuXHRcdCR0cmlnZ2VyLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0XHR0eXBlID0gJHRoaXMuZGF0YShcIm1vZGFsLXR5cGVcIikgPyAkdGhpcy5kYXRhKFwibW9kYWwtdHlwZVwiKSA6IFwiZGVmYXVsdFwiLFxuXHRcdFx0XHRhamF4U2V0dGluZ3MgPSB7XG5cdFx0XHRcdFx0dGVtcGxhdGU6ICR0aGlzLmRhdGEoXCJ0ZW1wbGF0ZVwiKSA/ICR0aGlzLmRhdGEoXCJ0ZW1wbGF0ZVwiKSA6IG51bGwsXG5cdFx0XHRcdFx0aWQ6ICR0aGlzLmRhdGEoXCJpZFwiKSA/ICR0aGlzLmRhdGEoXCJpZFwiKSA6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0aXNBamF4ID0gdHlwZSA9PT0gXCJhamF4XCIgJiYgYWpheFNldHRpbmdzLnRlbXBsYXRlICE9PSBudWxsICYmIGFqYXhTZXR0aW5ncy5pZCAhPT0gMCxcblx0XHRcdFx0aXNHYWxsZXJ5ID0gdHlwZSA9PT0gXCJnYWxsZXJ5XCIgPyB0cnVlIDogZmFsc2U7XG5cblxuXHRcdFx0aWYoIGlzQWpheCApIHtcblxuXHRcdFx0XHRvcHRpb25zID0ge1xuXHRcdFx0XHRcdHJlbW92YWxEZWxheTogNTAwLCAvL2RlbGF5IHJlbW92YWwgYnkgWCB0byBhbGxvdyBvdXQtYW5pbWF0aW9uXG5cdFx0XHRcdFx0aXRlbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogXCI/YWx0VGVtcGxhdGU9XCIgKyBhamF4U2V0dGluZ3MudGVtcGxhdGUgKyBcIiZpZD1cIiArIGFqYXhTZXR0aW5ncy5pZCxcbiAgICAgICAgICAgICAgICAgICAgfSxcblx0XHRcdFx0XHR0eXBlOiBcImFqYXhcIixcblx0XHRcdFx0XHRhamF4OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0RXJyb3I6ICdUaGUgY29udGVudCBjb3VsZCBub3QgYmUgbG9hZGVkLiA8YSBocmVmPVwiL1wiPlJldHVybiB0byBob21lcGFnZS48L2E+J1xuICAgICAgICAgICAgICAgICAgICB9LFxuXHRcdFx0XHRcdGNhbGxiYWNrczoge1xuXHRcdFx0XHRcdFx0YmVmb3JlT3BlbjogZnVuY3Rpb24oKXtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdC5tYWluQ2xhc3MgPSBcIm1mcC16b29tLWluXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmKCBpc0dhbGxlcnkgKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBfZ2FsbGVyeU9wdGlvbnM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvcHRpb25zID0gX2RlZmF1bHRPcHRpb25zO1xuXHRcdFx0fVxuXG5cdFx0XHQkdGhpcy5tYWduaWZpY1BvcHVwKCBvcHRpb25zICk7XG5cblx0ICAgIH0pO1xuXG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBfaW5pdFxuXHR9O1xuXG59KShqUXVlcnkpO1xuKi9cbiJdLCJmaWxlIjoibW9kYWwuanMifQ==

/*
(function($){
	'use strict';
	
	var $window = window,
		$selector = $('.js-tabs');

	$selector.each(function(){
		var $tabs 		= $(this),
			$nav 		= $tabs.find('nav'),
			$navList	= $nav.find('ul'),
			$navItems	= $navList.find('li'),
			$navLinks	= $navItems.find('a'),
			$content 	= $tabs.find('.c-tabs__content'),
			$contentTabs	= $content.children(),
			tabLength	= $navItems.length;

		$navList.find('li').on('click', function( e ){
			e.preventDefault();
			var $this = $(this);

			if( !$this.hasClass('is-active') ) {
				_setActiveTab( $this.data('index') );
			}

		});

		var _setActiveTab = function( i ) {
			var $activeNavItem 		= $navList.find('[data-index="'+ i +'"]'),
				$activeContentTab 	= $content.find('[data-index="' + i + '"]');

			$navList.find('.is-active').removeClass('is-active');
			$content.find('.is-active').removeClass('is-active');

			$activeNavItem.addClass('is-active');
			$activeContentTab.addClass('is-active');

			_animateContentHeight( $activeContentTab );
		};

		// @todo pass active content element to helper
		var _animateContentHeight = function( el ) {

			$content.animate({
				'height': el.innerHeight()
			}, 200);

		};

		var _setupTabIndexes = function() {

			for( var i = 0; i < tabLength; i++ ) {
				$navItems.eq( i ).attr('data-index', i);
				$contentTabs.eq( i ).attr('data-index', i);
			}
		};

		var _init = function() {
			_setupTabIndexes();

			$navItems.first().addClass('is-active');
			$contentTabs.first().addClass('is-active');
		};
		_init();
	});	
*/	

/* ===========================================================
	# Init
=========================================================== 
	if( $window.IsModern ){

	}

})(jQuery);

/*
jQuery(document).ready(function($){
	var $tabsHandle = $('.js-tabs');
	
	$tabsHandle.each(function(){
		var $tabs = $(this),
			tabItems = $tabs.find('nav'),
			tabContentWrapper = $tabs.find('.js-tabs-content'),
			tabNavigation = $tabs.find('.c-tabs__nav');

		tabItems.on('click', 'a', function(event){
			event.preventDefault();
			var selectedItem = $(this);
			if( !selectedItem.hasClass('selected') ) {
				var selectedTab = selectedItem.data('content'),
					selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]'),
					slectedContentHeight = selectedContent.innerHeight();
				
				tabItems.find('a.selected').removeClass('selected');
				selectedItem.addClass('selected');
				selectedContent.addClass('selected').siblings('li').removeClass('selected');
				//animate tabContentWrapper height when content changes 
				tabContentWrapper.animate({
					'height': slectedContentHeight
				}, 200);
			}
		});

		//hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
		checkScrolling(tabNavigation);
		tabNavigation.on('scroll', function(){ 
			checkScrolling($(this));
		});
	});
	
	$(window).on('resize', function(){
		$tabsHandle.each(function(){
			var $tabs = $(this);
			checkScrolling( $tabs.find('nav') );
			$tabs.find('.cd-tabs-content').css('height', 'auto');
		});
	});

	function checkScrolling($tabs){
		var totalTabWidth = parseInt($tabs.children('.cd-tabs-navigation').width()),
		 	$tabsViewport = parseInt($tabs.width());
		if( $tabs.scrollLeft() >= totalTabWidth - $tabsViewport) {
			$tabs.parent('.cd-tabs').addClass('is-ended');
		} else {
			$tabs.parent('.cd-tabs').removeClass('is-ended');
		}
	}
});
*/
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0YWJzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4oZnVuY3Rpb24oJCl7XG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdHZhciAkd2luZG93ID0gd2luZG93LFxuXHRcdCRzZWxlY3RvciA9ICQoJy5qcy10YWJzJyk7XG5cblx0JHNlbGVjdG9yLmVhY2goZnVuY3Rpb24oKXtcblx0XHR2YXIgJHRhYnMgXHRcdD0gJCh0aGlzKSxcblx0XHRcdCRuYXYgXHRcdD0gJHRhYnMuZmluZCgnbmF2JyksXG5cdFx0XHQkbmF2TGlzdFx0PSAkbmF2LmZpbmQoJ3VsJyksXG5cdFx0XHQkbmF2SXRlbXNcdD0gJG5hdkxpc3QuZmluZCgnbGknKSxcblx0XHRcdCRuYXZMaW5rc1x0PSAkbmF2SXRlbXMuZmluZCgnYScpLFxuXHRcdFx0JGNvbnRlbnQgXHQ9ICR0YWJzLmZpbmQoJy5jLXRhYnNfX2NvbnRlbnQnKSxcblx0XHRcdCRjb250ZW50VGFic1x0PSAkY29udGVudC5jaGlsZHJlbigpLFxuXHRcdFx0dGFiTGVuZ3RoXHQ9ICRuYXZJdGVtcy5sZW5ndGg7XG5cblx0XHQkbmF2TGlzdC5maW5kKCdsaScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCBlICl7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG5cdFx0XHRpZiggISR0aGlzLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSApIHtcblx0XHRcdFx0X3NldEFjdGl2ZVRhYiggJHRoaXMuZGF0YSgnaW5kZXgnKSApO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHR2YXIgX3NldEFjdGl2ZVRhYiA9IGZ1bmN0aW9uKCBpICkge1xuXHRcdFx0dmFyICRhY3RpdmVOYXZJdGVtIFx0XHQ9ICRuYXZMaXN0LmZpbmQoJ1tkYXRhLWluZGV4PVwiJysgaSArJ1wiXScpLFxuXHRcdFx0XHQkYWN0aXZlQ29udGVudFRhYiBcdD0gJGNvbnRlbnQuZmluZCgnW2RhdGEtaW5kZXg9XCInICsgaSArICdcIl0nKTtcblxuXHRcdFx0JG5hdkxpc3QuZmluZCgnLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdCRjb250ZW50LmZpbmQoJy5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cblx0XHRcdCRhY3RpdmVOYXZJdGVtLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdCRhY3RpdmVDb250ZW50VGFiLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRcdFx0X2FuaW1hdGVDb250ZW50SGVpZ2h0KCAkYWN0aXZlQ29udGVudFRhYiApO1xuXHRcdH07XG5cblx0XHQvLyBAdG9kbyBwYXNzIGFjdGl2ZSBjb250ZW50IGVsZW1lbnQgdG8gaGVscGVyXG5cdFx0dmFyIF9hbmltYXRlQ29udGVudEhlaWdodCA9IGZ1bmN0aW9uKCBlbCApIHtcblxuXHRcdFx0JGNvbnRlbnQuYW5pbWF0ZSh7XG5cdFx0XHRcdCdoZWlnaHQnOiBlbC5pbm5lckhlaWdodCgpXG5cdFx0XHR9LCAyMDApO1xuXG5cdFx0fTtcblxuXHRcdHZhciBfc2V0dXBUYWJJbmRleGVzID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdGZvciggdmFyIGkgPSAwOyBpIDwgdGFiTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdCRuYXZJdGVtcy5lcSggaSApLmF0dHIoJ2RhdGEtaW5kZXgnLCBpKTtcblx0XHRcdFx0JGNvbnRlbnRUYWJzLmVxKCBpICkuYXR0cignZGF0YS1pbmRleCcsIGkpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR2YXIgX2luaXQgPSBmdW5jdGlvbigpIHtcblx0XHRcdF9zZXR1cFRhYkluZGV4ZXMoKTtcblxuXHRcdFx0JG5hdkl0ZW1zLmZpcnN0KCkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0JGNvbnRlbnRUYWJzLmZpcnN0KCkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdH07XG5cdFx0X2luaXQoKTtcblx0fSk7XHRcbiovXHRcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0IyBJbml0XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcblx0aWYoICR3aW5kb3cuSXNNb2Rlcm4gKXtcblxuXHR9XG5cbn0pKGpRdWVyeSk7XG5cbi8qXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCQpe1xuXHR2YXIgJHRhYnNIYW5kbGUgPSAkKCcuanMtdGFicycpO1xuXHRcblx0JHRhYnNIYW5kbGUuZWFjaChmdW5jdGlvbigpe1xuXHRcdHZhciAkdGFicyA9ICQodGhpcyksXG5cdFx0XHR0YWJJdGVtcyA9ICR0YWJzLmZpbmQoJ25hdicpLFxuXHRcdFx0dGFiQ29udGVudFdyYXBwZXIgPSAkdGFicy5maW5kKCcuanMtdGFicy1jb250ZW50JyksXG5cdFx0XHR0YWJOYXZpZ2F0aW9uID0gJHRhYnMuZmluZCgnLmMtdGFic19fbmF2Jyk7XG5cblx0XHR0YWJJdGVtcy5vbignY2xpY2snLCAnYScsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgc2VsZWN0ZWRJdGVtID0gJCh0aGlzKTtcblx0XHRcdGlmKCAhc2VsZWN0ZWRJdGVtLmhhc0NsYXNzKCdzZWxlY3RlZCcpICkge1xuXHRcdFx0XHR2YXIgc2VsZWN0ZWRUYWIgPSBzZWxlY3RlZEl0ZW0uZGF0YSgnY29udGVudCcpLFxuXHRcdFx0XHRcdHNlbGVjdGVkQ29udGVudCA9IHRhYkNvbnRlbnRXcmFwcGVyLmZpbmQoJ2xpW2RhdGEtY29udGVudD1cIicrc2VsZWN0ZWRUYWIrJ1wiXScpLFxuXHRcdFx0XHRcdHNsZWN0ZWRDb250ZW50SGVpZ2h0ID0gc2VsZWN0ZWRDb250ZW50LmlubmVySGVpZ2h0KCk7XG5cdFx0XHRcdFxuXHRcdFx0XHR0YWJJdGVtcy5maW5kKCdhLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRcdHNlbGVjdGVkSXRlbS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdFx0c2VsZWN0ZWRDb250ZW50LmFkZENsYXNzKCdzZWxlY3RlZCcpLnNpYmxpbmdzKCdsaScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHQvL2FuaW1hdGUgdGFiQ29udGVudFdyYXBwZXIgaGVpZ2h0IHdoZW4gY29udGVudCBjaGFuZ2VzIFxuXHRcdFx0XHR0YWJDb250ZW50V3JhcHBlci5hbmltYXRlKHtcblx0XHRcdFx0XHQnaGVpZ2h0Jzogc2xlY3RlZENvbnRlbnRIZWlnaHRcblx0XHRcdFx0fSwgMjAwKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vaGlkZSB0aGUgLmNkLXRhYnM6OmFmdGVyIGVsZW1lbnQgd2hlbiB0YWJiZWQgbmF2aWdhdGlvbiBoYXMgc2Nyb2xsZWQgdG8gdGhlIGVuZCAobW9iaWxlIHZlcnNpb24pXG5cdFx0Y2hlY2tTY3JvbGxpbmcodGFiTmF2aWdhdGlvbik7XG5cdFx0dGFiTmF2aWdhdGlvbi5vbignc2Nyb2xsJywgZnVuY3Rpb24oKXsgXG5cdFx0XHRjaGVja1Njcm9sbGluZygkKHRoaXMpKTtcblx0XHR9KTtcblx0fSk7XG5cdFxuXHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCl7XG5cdFx0JHRhYnNIYW5kbGUuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0YWJzID0gJCh0aGlzKTtcblx0XHRcdGNoZWNrU2Nyb2xsaW5nKCAkdGFicy5maW5kKCduYXYnKSApO1xuXHRcdFx0JHRhYnMuZmluZCgnLmNkLXRhYnMtY29udGVudCcpLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcblx0XHR9KTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gY2hlY2tTY3JvbGxpbmcoJHRhYnMpe1xuXHRcdHZhciB0b3RhbFRhYldpZHRoID0gcGFyc2VJbnQoJHRhYnMuY2hpbGRyZW4oJy5jZC10YWJzLW5hdmlnYXRpb24nKS53aWR0aCgpKSxcblx0XHQgXHQkdGFic1ZpZXdwb3J0ID0gcGFyc2VJbnQoJHRhYnMud2lkdGgoKSk7XG5cdFx0aWYoICR0YWJzLnNjcm9sbExlZnQoKSA+PSB0b3RhbFRhYldpZHRoIC0gJHRhYnNWaWV3cG9ydCkge1xuXHRcdFx0JHRhYnMucGFyZW50KCcuY2QtdGFicycpLmFkZENsYXNzKCdpcy1lbmRlZCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGFicy5wYXJlbnQoJy5jZC10YWJzJykucmVtb3ZlQ2xhc3MoJ2lzLWVuZGVkJyk7XG5cdFx0fVxuXHR9XG59KTtcbiovIl0sImZpbGUiOiJ0YWJzLmpzIn0=

var ToggleClass = (function ($) {
	'use strict';
	var $html = $('html');

	// toggle class helper
	var _toggleClass = function(el, className) {
		if (el.hasClass(className + '-open')) {
			el.removeClass(className + '-open');
		} else {
			el.addClass(className + '-open');
		}
	};

	var _init = function() {
		var $trigger = $('[data-toggle]');

		$trigger.on("click", function() {
			var className = $(this).data("toggle");
			_toggleClass($html, className);
		});
	};

	return {
		init: _init
	};

})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0b2dnbGVDbGFzcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgVG9nZ2xlQ2xhc3MgPSAoZnVuY3Rpb24gKCQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgJGh0bWwgPSAkKCdodG1sJyk7XG5cblx0Ly8gdG9nZ2xlIGNsYXNzIGhlbHBlclxuXHR2YXIgX3RvZ2dsZUNsYXNzID0gZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuXHRcdGlmIChlbC5oYXNDbGFzcyhjbGFzc05hbWUgKyAnLW9wZW4nKSkge1xuXHRcdFx0ZWwucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lICsgJy1vcGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsLmFkZENsYXNzKGNsYXNzTmFtZSArICctb3BlbicpO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgX2luaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgJHRyaWdnZXIgPSAkKCdbZGF0YS10b2dnbGVdJyk7XG5cblx0XHQkdHJpZ2dlci5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNsYXNzTmFtZSA9ICQodGhpcykuZGF0YShcInRvZ2dsZVwiKTtcblx0XHRcdF90b2dnbGVDbGFzcygkaHRtbCwgY2xhc3NOYW1lKTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IF9pbml0XG5cdH07XG5cbn0pKGpRdWVyeSk7XG4iXSwiZmlsZSI6InRvZ2dsZUNsYXNzLmpzIn0=

(function($){
	'use strict';
	var $window = window,
		$html	= $('html');

	var enhanceEdgeCaseBrowsers = function() {

		if( !Modernizr.classlist ) {
			$html.removeClass('no-enhance').addClass('enhance');
		}

	};

/* ===========================================================
		# breakpoints
=========================================================== */
/*
	var breakpoints = [{
		context: ['small-max', 'small', 'medium'],
		call_for_each_context: false,
		match: function() {
			//console.log('small');
			mobileNavigation( $('.js-nav') );
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
			compactHeader();
		},
		unmatch: function() {
			// unbind and scripts if possible
			location.reload();
		}
	}];

*/

/* ===========================================================

	# Init

=========================================================== */

	if( $window.IsModern ){

		enhanceEdgeCaseBrowsers();
//		$window.ToggleClass.init();
//		$('select').selectric();
//		scrollTo($('a[href^="#"]:not(".js-no-scroll")'));
//		$('.js-tabs').tabs();

		$window.Carousel.init( $('.js-carousel') );
//		$window.Modal.init( $('.js-modal') );
//		$window.Accordion.init();
//		$window.GMaps.init();
//		$window.ValidateForms.init( $('.js-form') );

	//		MQ.init(breakpoints);
	}

	if (!Modernizr.svg) {
		$('img[src*="svg"]').attr('src', function() {
			return $(this).attr('src').replace('.svg', '.png');
		});
	}

})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKXtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgJHdpbmRvdyA9IHdpbmRvdyxcblx0XHQkaHRtbFx0PSAkKCdodG1sJyk7XG5cblx0dmFyIGVuaGFuY2VFZGdlQ2FzZUJyb3dzZXJzID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiggIU1vZGVybml6ci5jbGFzc2xpc3QgKSB7XG5cdFx0XHQkaHRtbC5yZW1vdmVDbGFzcygnbm8tZW5oYW5jZScpLmFkZENsYXNzKCdlbmhhbmNlJyk7XG5cdFx0fVxuXG5cdH07XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0IyBicmVha3BvaW50c1xuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qXG5cdHZhciBicmVha3BvaW50cyA9IFt7XG5cdFx0Y29udGV4dDogWydzbWFsbC1tYXgnLCAnc21hbGwnLCAnbWVkaXVtJ10sXG5cdFx0Y2FsbF9mb3JfZWFjaF9jb250ZXh0OiBmYWxzZSxcblx0XHRtYXRjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdzbWFsbCcpO1xuXHRcdFx0bW9iaWxlTmF2aWdhdGlvbiggJCgnLmpzLW5hdicpICk7XG5cdFx0fSxcblx0XHR1bm1hdGNoOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIHVuYmluZCBhbmQgc2NyaXB0cyBpZiBwb3NzaWJsZVxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0Y29udGV4dDogWydsYXJnZScsICd4LWxhcmdlJywgJ3h4LWxhcmdlJ10sXG5cdFx0Y2FsbF9mb3JfZWFjaF9jb250ZXh0OiBmYWxzZSxcblx0XHRtYXRjaDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdtZWRpdW0gLSB4eGwnKTtcblx0XHRcdGNvbXBhY3RIZWFkZXIoKTtcblx0XHR9LFxuXHRcdHVubWF0Y2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gdW5iaW5kIGFuZCBzY3JpcHRzIGlmIHBvc3NpYmxlXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHR9XG5cdH1dO1xuXG4qL1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdCMgSW5pdFxuXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cdGlmKCAkd2luZG93LklzTW9kZXJuICl7XG5cblx0XHRlbmhhbmNlRWRnZUNhc2VCcm93c2VycygpO1xuLy9cdFx0JHdpbmRvdy5Ub2dnbGVDbGFzcy5pbml0KCk7XG4vL1x0XHQkKCdzZWxlY3QnKS5zZWxlY3RyaWMoKTtcbi8vXHRcdHNjcm9sbFRvKCQoJ2FbaHJlZl49XCIjXCJdOm5vdChcIi5qcy1uby1zY3JvbGxcIiknKSk7XG4vL1x0XHQkKCcuanMtdGFicycpLnRhYnMoKTtcblxuXHRcdCR3aW5kb3cuQ2Fyb3VzZWwuaW5pdCggJCgnLmpzLWNhcm91c2VsJykgKTtcbi8vXHRcdCR3aW5kb3cuTW9kYWwuaW5pdCggJCgnLmpzLW1vZGFsJykgKTtcbi8vXHRcdCR3aW5kb3cuQWNjb3JkaW9uLmluaXQoKTtcbi8vXHRcdCR3aW5kb3cuR01hcHMuaW5pdCgpO1xuLy9cdFx0JHdpbmRvdy5WYWxpZGF0ZUZvcm1zLmluaXQoICQoJy5qcy1mb3JtJykgKTtcblxuXHQvL1x0XHRNUS5pbml0KGJyZWFrcG9pbnRzKTtcblx0fVxuXG5cdGlmICghTW9kZXJuaXpyLnN2Zykge1xuXHRcdCQoJ2ltZ1tzcmMqPVwic3ZnXCJdJykuYXR0cignc3JjJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gJCh0aGlzKS5hdHRyKCdzcmMnKS5yZXBsYWNlKCcuc3ZnJywgJy5wbmcnKTtcblx0XHR9KTtcblx0fVxuXG59KShqUXVlcnkpO1xuIl0sImZpbGUiOiJtYWluLmpzIn0=

//# sourceMappingURL=main.js.map
