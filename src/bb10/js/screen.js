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
		var outerElement;
		// Reset our context Menu
		bb.screen.contextMenu = null;
		
        for (var i = 0; i < elements.length; i++) {
            outerElement = elements[i];
            bb.screen.currentScreen = outerElement;
			// Set our screen resolution
			outerElement.setAttribute('class', 'bb-screen');
            		
			//check to see if a menu/menuBar needs to be created
			var menuBar = outerElement.querySelectorAll('[data-bb-type=menu]'),
				titleBar = outerElement.querySelectorAll('[data-bb-type=title]'),
				actionBar = outerElement.querySelectorAll('[data-bb-type=action-bar]'),
				context = outerElement.querySelectorAll('[data-bb-type=context-menu]'),
				outerScrollArea,
				scrollArea,
				tempHolder = [],
				childNode = null, 
				j,
				menuBarHeight = bb.screen.getMenuBarHeight(),
				actionBarHeight = bb.screen.getActionBarHeight(),
				titleBarHeight = bb.screen.getTitleBarHeight();
			
			if (menuBar.length > 0) {
				menuBar = menuBar[0];
				outerElement.menuBar = menuBar;
			}else{
				menuBar = null;
			}
			// Figure out what to do with the title bar
			if (titleBar.length > 0) {
				titleBar = titleBar[0];
				outerElement.titleBar = titleBar;
			} else {
				titleBar = null;
			}
			
			// Assign our action bar
			if (actionBar.length > 0) {
				actionBar = actionBar[0]; 
				outerElement.actionBar = actionBar;
			} else {
				actionBar = null;
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
			
			// Copy all nodes in the screen that are not the action bar
			for (j = 0; j < outerElement.childNodes.length - 1; j++) {
				childNode = outerElement.childNodes[j];
				if ((childNode != actionBar) && (childNode != menuBar) && (childNode != titleBar)) {
					tempHolder.push(childNode);
				}
			}
			// Add them into the scrollable area
			for (j = 0; j < tempHolder.length; j++) {
				scrollArea.appendChild(tempHolder[j]);
			}
			
			// Set our variables for showing/hiding action bars
			outerElement.menuBarHeight = menuBarHeight
			outerElement.actionBarHeight = actionBarHeight;
			outerElement.titleBarHeight = titleBarHeight;
			outerElement.outerScrollArea = outerScrollArea;
			
			// Raise an internal event to let the rest of the framework know that content is scrolling
			outerScrollArea.addEventListener('scroll', function() {
					
					evt = document.createEvent('Events');
					evt.initEvent('bbuiscrolling', true, true);
					document.dispatchEvent(evt);
					/* This is a major hack to fix an issue in webkit where it doesn't always
					   understand when to re-paint the screen when scrolling a <div> with overflow
					   and using the inertial scrolling for 10.0*/
					if (bb.device.requiresScrollingHack) {
						if (this.timeout) {
							clearTimeout(this.timeout);
						} else {
							this.style['padding-right'] = '1px';
						}
						// Set our new timeout for resetting
						this.timeout = setTimeout(this.resetPadding,20);
					}
					/* ************* END OF THE SCROLLING HACK *******************/
				},false);
			
			/* ********** PART OF THE SCROLLING HACK ************/
			outerScrollArea.resetPadding = function() {
					this.style['padding-right'] = '0px';
					this.timeout = null;
				};
			outerScrollArea.resetPadding = outerScrollArea.resetPadding.bind(outerScrollArea);
			/* ********** END OF THE SCROLLING HACK ************/
			
			
			if (outerElement.getAttribute('data-bb-indicator')) { 
				// Now add our iframe to load the sandboxed content
				var overlay = document.createElement('div'),
					indicator = document.createElement('div');
				outerScrollArea.scrollArea = scrollArea;
				outerScrollArea.overlay = overlay;
				// Create our overlay
				overlay.style['position'] = 'absolute';
				overlay.style['bottom'] = '0px';
				overlay.style['top'] = '0px';
				overlay.style['left'] = '0px';
				overlay.style['right'] = '0px';
				overlay.touchstart = function(e) {
							e.preventDefault();
							e.stopPropagation();
						};
				overlay.touchend = function(e) {
							e.preventDefault();
							e.stopPropagation();
						};
				overlay.click = function(e) {
							e.preventDefault();
							e.stopPropagation();
						};
				outerScrollArea.appendChild(overlay);
				scrollArea.style.display = 'none';
					
				// Add our indicator
				indicator.setAttribute('data-bb-type', 'activity-indicator');
				indicator.setAttribute('data-bb-size', 'large');
				if (bb.device.is720x720) {
					indicator.style.margin = '30% auto 0px auto';
				} else if (bb.getOrientation().toLowerCase() == 'landscape') {
					indicator.style.margin = '20% auto 0px auto';
				} else {
					indicator.style.margin = '60% auto 0px auto';
				}
				overlay.appendChild(indicator);
				
				// Create our event handler for when the dom is ready
				outerScrollArea.bbuidomprocessed = function() {
							this.scrollArea.style.display = '';
							this.removeChild(this.overlay);
							document.removeEventListener('bbuidomprocessed', this.bbuidomprocessed,false);
							if (bb.device.isPlayBook && bb.scroller) {
								bb.scroller.refresh();
							}
						};
				outerScrollArea.bbuidomprocessed = outerScrollArea.bbuidomprocessed.bind(outerScrollArea);
				
				/* Add our event listener for the domready to move our selected item.  We want to
				   do it this way because it will ensure the screen transition animation is finished before
				   the pill button move transition happens. This will help for any animation stalls/delays */
				document.addEventListener('bbuidomprocessed', outerScrollArea.bbuidomprocessed,false);
			}
			
			// Set our outer scroll area dimensions
			if (titleBar && actionBar) {
				outerScrollArea.style['overflow'] = 'auto'; 
				outerScrollArea.style['position'] = 'absolute';
				outerScrollArea.style['bottom'] = actionBarHeight+ 'px';
				outerScrollArea.style['top'] = titleBarHeight + 'px';
				outerScrollArea.style['left'] = '0px';
				outerScrollArea.style['right'] = '0px';
			} else if (titleBar) {
				outerScrollArea.style['overflow'] = 'auto'; 
				outerScrollArea.style['position'] = 'absolute';
				outerScrollArea.style['bottom'] = '0px';
				outerScrollArea.style['top'] = titleBarHeight + 'px';
				outerScrollArea.style['left'] = '0px';
				outerScrollArea.style['right'] = '0px';
			} else if (actionBar) {
				outerScrollArea.style['overflow'] = 'auto'; 
				outerScrollArea.style['position'] = 'absolute';
				outerScrollArea.style['bottom'] = actionBarHeight+ 'px';
				outerScrollArea.style['top'] = '0px';
				outerScrollArea.style['left'] = '0px';
				outerScrollArea.style['right'] = '0px';
			} else {
				outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:0px;left:0px;right:0px;');
				outerScrollArea.style['overflow'] = 'auto'; 
				outerScrollArea.style['position'] = 'absolute';
				outerScrollArea.style['bottom'] = '0px';
				outerScrollArea.style['top'] = '0px';
				outerScrollArea.style['left'] = '0px';
				outerScrollArea.style['right'] = '0px';
			}
			
			if(menuBar) {
				bb.menuBar.apply(menuBar, outerElement);
			}

			// Apply any title bar styling
			if (titleBar) {		
				bb.titleBar.apply(titleBar);
			}
			
			// Apply any action Bar styling
			if (actionBar) {
				bb.actionBar.apply(actionBar,outerElement);
			}
			
			// Assign our context
			if (context.length > 0) {
				bb.screen.processContext(context[0], outerElement);
			} else {
				context = null;
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
	
	// Process all of the context menu code
	processContext: function (context, screen) {
		if (!bb.device.isPlayBook && !bb.device.isRipple) {
			if (blackberry.ui && blackberry.ui.contextmenu) {
				blackberry.ui.contextmenu.enabled = true;
			}
		}	
		screen.appendChild(context);
		context.menu = bb.contextMenu.create(screen);
		context.appendChild(context.menu);
		bb.screen.contextMenu = context.menu;
		// Add the actions
		var actions = context.querySelectorAll('[data-bb-type=action]'),
			i;
		for (i = 0; i < actions.length; i++) {
			context.menu.add(actions[i]);
		}
		context.menu.centerMenuItems();
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
        var duration = 0.2,
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
        var duration = 0.3,
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
        var duration = 0.3,
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
        var duration = 0.3,
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
        var duration = 0.3,
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
        var duration = 0.3,
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
        var duration = 0.3,
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
        var duration = 0.3,
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
		if (bb.device.is1024x600) {
			return (bb.getOrientation().toLowerCase() == 'portrait') ? 73 : 73;
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			return (bb.getOrientation().toLowerCase() == 'portrait') ? 140 : 111; 
		} else {
			return (bb.getOrientation().toLowerCase() == 'portrait') ? 140 : 111;
		}
	},
	
	getActionBarHeight: function() {
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			return (bb.getOrientation().toLowerCase() == 'portrait') ? 73 : 73;
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			return (bb.getOrientation().toLowerCase() == 'portrait') ? 139 : 99; 
		} else if (bb.device.is720x720) {
			return 109;
		} else {
			return (bb.getOrientation().toLowerCase() == 'portrait') ? 139 : 99;
		}
	},
	
	getTitleBarHeight: function() {
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			return 65;
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			return 111;
		} else if (bb.device.is720x720) {
			return 92;
		}else {
			return 111;
		}
	}
		
};