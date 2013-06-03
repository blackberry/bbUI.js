bb.screen = {  
    scriptCounter:  0,
    totalScripts: 0,
	controlColor: 'light',
	listColor: 'light',
	overlay : null,
	tabOverlay : null,
	contextMenu : null,
	currentScreen : null,
	focusedInput : null,
	animating : false,
    
    apply: function(elements) {
		var screenRes = 'bb-hires-screen',
			outerElement;
		// Reset our context Menu
		bb.screen.contextMenu = null;
		
        for (var i = 0; i < elements.length; i++) {
            outerElement = elements[i];
            bb.screen.currentScreen = outerElement;
			// Set our screen resolution
			outerElement.setAttribute('class', screenRes);
            		
			//check to see if a menu/menuBar needs to be created
			var menuBar = outerElement.querySelectorAll('[data-bb-type=menu]');
			if (menuBar.length > 0) {
				menuBar = menuBar[0];
				bb.menuBar.apply(menuBar,outerElement);
			}

			var titleBar = outerElement.querySelectorAll('[data-bb-type=title]'),
				outerScrollArea,
				scrollArea,
				tempHolder = [],
				childNode = null, 
				j,
				actionBar = outerElement.querySelectorAll('[data-bb-type=action-bar]'),
				context = outerElement.querySelectorAll('[data-bb-type=context-menu]');				
			
			// Remove any BB10 context menus or action bars from sight
			for (j = 0; j < actionBar.length; j++) {
				actionBar[j].style.display = 'none';
			}
			for (j = 0; j < context.length; j++) {
				context[j].style.display = 'none';
			}
			
			if (titleBar.length > 0) {
				titleBar = titleBar[0]; }
			else {
				titleBar = null;
			}
			
			// Create our scrollable <div>
			outerScrollArea = document.createElement('div'); 
			outerElement.appendChild(outerScrollArea);
			// Turn off scrolling effects if they don't want them
			if (!outerElement.hasAttribute('data-bb-scroll-effect') || outerElement.getAttribute('data-bb-scroll-effect').toLowerCase() != 'off') {
				outerElement.bbUIscrollWrapper = outerScrollArea;
			}
			// Inner Scroll Area
			scrollArea = document.createElement('div');
			outerScrollArea.appendChild(scrollArea); 
			
			// Copy all nodes that are not the title bar
			for (j = 0; j < outerElement.childNodes.length - 1; j++) {
				childNode = outerElement.childNodes[j];
				if (childNode != titleBar) {
					tempHolder.push(childNode);
				}
			}
			// Add them into the scrollable area
			for (j = 0; j < tempHolder.length; j++) {
				scrollArea.appendChild(tempHolder[j]);
			}
			   
			if (titleBar) {
				outerScrollArea.style['overflow'] = 'auto';
				outerScrollArea.style['bottom'] = '0px';	
				outerScrollArea.style['position'] = 'absolute';	
				outerScrollArea.style['top'] = '55px';	
				outerScrollArea.style['left'] = '0px';	
				outerScrollArea.style['right'] = '0px'; 					
				bb.titleBar.apply(titleBar);
			}
			else {
				outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:0px;left:0px;right:0px;');
				outerScrollArea.style['overflow'] = 'auto';
				outerScrollArea.style['bottom'] = '0px';	
				outerScrollArea.style['position'] = 'absolute';	
				outerScrollArea.style['top'] = '0px';	
				outerScrollArea.style['left'] = '0px';	
				outerScrollArea.style['right'] = '0px';
			}

			// Set refresh
			outerElement.refresh = function() {
					if (!bb.scroller) return;
					bb.scroller.refresh();
				};
			outerElement.refresh = outerElement.refresh.bind(outerElement);
			// Set ScrollTo
			outerElement.scrollTo = function(x, y) {
					if (bb.scroller) {
						bb.scroller.scrollTo(x, y);
					} else if (bb.device.isBB10) {
						this.bbUIscrollWrapper.scrollTop = x;
					}
				};
			outerElement.scrollTo = outerElement.scrollTo.bind(outerElement);
			// Set ScrollToElement
			outerElement.scrollToElement = function(element) {
					if (bb.scroller) {
						bb.scroller.scrollToElement(element);
					} else if (bb.device.isBB10) {
						if (!element) return;
						var offsetTop = 0,
							target = element;
						if (target.offsetParent) {
							do {
								offsetTop  += target.offsetTop;
							} while (target = target.offsetParent);
						}
						// Adjust for title bar
						if (bb.screen.currentScreen.titleBar) {
							offsetTop -= bb.screen.currentScreen.titleBarHeight;
						}
						// Adjust for action bar
						if (bb.screen.currentScreen.actionBar) {
							offsetTop -= bb.screen.getActionBarHeight();
						}
						this.scrollTo(offsetTop);
					}
				};
			outerElement.scrollToElement = outerElement.scrollToElement.bind(outerElement);
        }
    },
	 
    fadeIn: function (screen) {
        // set default values
        var duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
		s['-webkit-animation-name']            = 'bbUI-fade-in';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	fadeOut: function (screen) {
        // set default values
        var duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
		s['-webkit-animation-name']            = 'bbUI-fade-out';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	slideLeft: function (screen) {
        // set default values
        var r = 0,
            duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
			
		s.width = bb.innerWidth()+'px';
		s['-webkit-animation-name']            = 'bbUI-slide-left';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	slideOutLeft: function (screen) {
        // set default values
        var r = 0,
            duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
			
		s.width = bb.innerWidth()+'px';
		s['-webkit-animation-name']            = 'bbUI-slide-out-left';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	slideRight: function (screen) {
        // set default values
        var r = 0,
            duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
			
		s.width = bb.innerWidth()+'px';
		s['-webkit-animation-name']            = 'bbUI-slide-right';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	slideOutRight: function (screen) {
        // set default values
        var r = 0,
            duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
			
		s.width = bb.innerWidth()+'px';
		s['-webkit-animation-name']            = 'bbUI-slide-out-right';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	slideUp: function (screen) {
        // set default values
        var r = 0,
            duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
			
		s.height = bb.innerHeight()+'px';
		s['-webkit-animation-name']            = 'bbUI-slide-up';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	slideOutUp: function (screen) {
        // set default values
        var r = 0,
            duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
			
		s.height = bb.innerHeight()+'px';
		s['-webkit-animation-name']            = 'bbUI-slide-out-up';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	slideDown: function (screen) {
        // set default values
        var r = 0,
            duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
			
		s.height = bb.innerHeight()+'px';
		s['-webkit-animation-name']            = 'bbUI-slide-down';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
	
	slideOutDown: function (screen) {
        // set default values
        var r = 0,
            duration = 0.3,
            timing = 'ease-out',
			s = screen.style;
			
		s.height = bb.innerHeight()+'px';
		s['-webkit-animation-name']            = 'bbUI-slide-out-down';
		s['-webkit-animation-duration']        = duration + 's';
		s['-webkit-animation-timing-function'] = timing; 
		s['-webkit-transform'] = 'translate3d(0,0,0)';
		s['-webkit-backface-visibility'] = 'hidden';
    },
		
	getMenuBarHeight: function() {
		// Set our 'res' for known resolutions, otherwise use the default
		return (bb.getOrientation().toLowerCase() == 'portrait') ? 73 : 73;
	},
	
	getTitleBarHeight: function() {
		// Set our 'res' for known resolutions, otherwise use the default
		return 65;
	}
		
};