bb.screen = {  
    scriptCounter:  0,
    totalScripts: 0,
	controlColor: 'light',
	listColor: 'light',
	overlay : null,
	tabOverlay : null,
	contextMenu : null,
    
    apply: function(elements) {
		var screenRes,
			outerElement;
		// Reset our context Menu
		bb.screen.contextMenu = null;
		
		if (bb.device.isBB10 && bb.device.isPlayBook) {
			screenRes = 'bb-bb10-lowres-screen';
		} else if (bb.device.isBB10) {
			screenRes = 'bb-bb10-hires-screen';
		} else if (bb.device.isHiRes) {
			screenRes = 'bb-hires-screen';
		}
		
        for (var i = 0; i < elements.length; i++) {
            outerElement = elements[i];
            
			// Set our screen resolution
			outerElement.setAttribute('class', screenRes);
            		
			//check to see if a menu/menuBar needs to be created
			var menuBar = outerElement.querySelectorAll('[data-bb-type=menu]');
			if (menuBar.length > 0) {
				menuBar = menuBar[0];
				bb.menuBar.apply(menuBar,outerElement);
			}
           
            if (bb.device.isBB10) {
                var titleBar = outerElement.querySelectorAll('[data-bb-type=title]'),
					actionBar = outerElement.querySelectorAll('[data-bb-type=action-bar]'),
					context = outerElement.querySelectorAll('[data-bb-type=context-menu]'),
					outerScrollArea,
					scrollArea,
					tempHolder = [],
					childNode = null, 
					j,
					height = (bb.device.isPlayBook) ? 73 : 140;
				
				// Figure out what to do with the title bar
                if (titleBar.length > 0) {
					titleBar = titleBar[0];
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
				for (j = 0; j < tempHolder.length -1; j++) {
					scrollArea.appendChild(tempHolder[j]);
				}
				
				// Set our outer scroll area dimensions
				if (titleBar && actionBar) {
					outerScrollArea.setAttribute('style','overflow:auto;position:absolute;bottom:'+height+'px;top:'+height+'px;left:0px;right:0px;');
				} else if (titleBar) {
					outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:'+height+'px;left:0px;right:0px;');
				} else if (actionBar) {
					outerScrollArea.setAttribute('style','overflow:auto;position:absolute;bottom:'+height+'px;top:0px;left:0px;right:0px;');
				} else {
					outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:0px;left:0px;right:0px;');
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
			} 
			else if (bb.device.isPlayBook) {
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
				for (j = 0; j < tempHolder.length -1; j++) {
					scrollArea.appendChild(tempHolder[j]);
				}
                   
				if (titleBar) {
					outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:55px;left:0px;right:0px;');					
                    bb.titleBar.apply(titleBar);
                }
				else {
					outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:0px;left:0px;right:0px;');
				}
            }
            else {
                // See if there is a title bar
                var titleBar = outerElement.querySelectorAll('[data-bb-type=title]'),
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
                    titleBar = titleBar[0];
                    bb.titleBar.apply(titleBar);
                }
            }
        }
    },
	
	// Process all of the context menu code
	processContext : function (context, screen) {
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
        var duration = 1.0,
            timing = 'ease-out',
			s = screen.style;
		s['-webkit-animation-name']            = 'bbUI-fade-in';
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
	
    
    reAdjustHeight: function() {
        // perform device specific formatting
        if (bb.device.isBB5) {
            document.body.style.height = screen.height - 27 + 'px';
        }
        else if (bb.device.isBB6) {
            document.body.style.height = screen.height - 17 + 'px';
        }
        else if (bb.device.isBB7 && (navigator.appVersion.indexOf('Ripple') < 0)) {
            document.body.style.height = screen.height + 'px';
        }
    }
};

bb.slider = {

	apply: function(elements) {
		if (bb.device.isBB10) {
			var i, 
				range,
				res,
				color = bb.options.bb10ControlsDark ? 'dark' : 'light',
				res = (bb.device.isPlayBook) ? 'lowres' : 'hires';

			for (i = 0; i < elements.length; i++) {
				range = elements[i];
				// Create our container div
				outerElement = document.createElement('div');
				outerElement.range = range;
				range.parentNode.insertBefore(outerElement, range);
				range.style.display = 'none';
				outerElement.appendChild(range);
				// Get our values
				outerElement.minValue = range.hasAttribute('min') ? parseInt(range.getAttribute('min')) : 0;
				outerElement.maxValue = range.hasAttribute('max') ? parseInt(range.getAttribute('max')) : 0;
				outerElement.value = range.hasAttribute('value') ? parseInt(range.getAttribute('value')) : 0;
				outerElement.step = range.hasAttribute('step') ? parseInt(range.getAttribute('step')) : 0;
				outerElement.isActivated = false;
				outerElement.initialXPos = 0;
				outerElement.currentXPos = 0;
				outerElement.transientXPos = 0;
				// Set our styling and create the inner divs
				outerElement.className = 'bb-bb10-slider-'+res;
				outerElement.outer = document.createElement('div');
				outerElement.outer.setAttribute('class','outer bb-bb10-slider-outer-' + color);
				outerElement.appendChild(outerElement.outer);
				outerElement.fill = document.createElement('div');
				outerElement.fill.className = 'fill';
				outerElement.fill.active = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
				outerElement.fill.dormant = '-webkit-linear-gradient(top, '+ bb.options.bb10HighlightColor +' 0%, '+ bb.options.shades.darkHighlight +' 100%)';
				outerElement.fill.style.background = outerElement.fill.dormant;
				outerElement.outer.appendChild(outerElement.fill);
				outerElement.inner = document.createElement('div');
				outerElement.inner.className = 'inner';
				outerElement.outer.appendChild(outerElement.inner);
				outerElement.halo = document.createElement('div');
				outerElement.halo.className = 'halo';
				outerElement.halo.style.background = '-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 43, from(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), color-stop(0.8, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), to(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.7)))';
				outerElement.inner.appendChild(outerElement.halo);
				outerElement.indicator = document.createElement('div');
				outerElement.indicator.setAttribute('class','indicator bb-bb10-slider-indicator-' + color);
				outerElement.inner.appendChild(outerElement.indicator);
				// Assign our function to set the value for the control
				range.outerElement = outerElement;
				range.setValue = function(value) {
								var percent = 0,
									width,
									evObj;
								if (value && (value < parseInt(this.outerElement.minValue) || value > parseInt(this.outerElement.maxValue))) {
									return;
								} else if (value) {
									this.outerElement.value = value;
									this.value = value;
									evObj = document.createEvent('HTMLEvents');
									evObj.initEvent('change', false, true );
									this.dispatchEvent(evObj);
								}
								// Calculate our percentage
								if (this.outerElement.value == this.outerElement.maxValue) {
									percent = 1;
								} else {
									percent = this.outerElement.value/(parseInt(this.outerElement.maxValue) + parseInt(this.outerElement.minValue));								
								}	
								// Determine width by percentage
								range.outerElement.currentXPos = Math.floor(parseInt(window.getComputedStyle(this.outerElement.outer).width) * percent);
								this.outerElement.fill.style.width = outerElement.currentXPos + 'px';
								this.outerElement.inner.style['-webkit-transform'] = 'translate3d(' + range.outerElement.currentXPos + 'px,0px,0px)';
							};
				range.setValue = range.setValue.bind(range);
				// Set our value on a timeout so that it can calculate width once in the DOM
				window.setTimeout(range.setValue, 0);
				// Setup our touch events
				outerElement.inner.animateBegin = function(event) {
										if (outerElement.isActivated === false) {
											outerElement.isActivated = true;
											outerElement.initialXPos = event.touches[0].pageX;	
											outerElement.halo.style['-webkit-transform'] = 'scale(1)';
											outerElement.halo.style['-webkit-animation-name'] = 'explode';
											outerElement.indicator.setAttribute('class','indicator bb-bb10-slider-indicator-' + color+ ' indicator-hover-'+color);
											outerElement.indicator.style.background = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
											outerElement.fill.style.background = outerElement.fill.active;
										}
									};
				outerElement.inner.animateBegin = outerElement.inner.animateBegin.bind(outerElement.inner);
				outerElement.inner.addEventListener("touchstart", outerElement.inner.animateBegin, false);
				outerElement.inner.animateEnd = function () {
										if (outerElement.isActivated === true) {
											outerElement.isActivated = false;
											outerElement.currentXPos = outerElement.transientXPos;
											outerElement.value = parseInt(outerElement.range.value);
											outerElement.halo.style['-webkit-transform'] = 'scale(0)';
											outerElement.halo.style['-webkit-animation-name'] = 'implode';
											outerElement.indicator.setAttribute('class','indicator bb-bb10-slider-indicator-' + color);   
											outerElement.indicator.style.background = '';	
											outerElement.fill.style.background = outerElement.fill.dormant;
										}
									};
				outerElement.inner.animateEnd = outerElement.inner.animateEnd.bind(outerElement.inner);
				outerElement.inner.addEventListener("touchend", outerElement.inner.animateEnd, false);
				// Handle moving the slider
				outerElement.moveSlider = function (event) {
									if (outerElement.isActivated === true) {
										event.stopPropagation();
										event.preventDefault();
										outerElement.transientXPos = outerElement.currentXPos + event.touches[0].pageX - outerElement.initialXPos;
										outerElement.transientXPos = Math.max(0, Math.min(outerElement.transientXPos, parseInt(window.getComputedStyle(outerElement.outer).width)));
										this.notifyUpdated();
										this.fill.style.width = outerElement.transientXPos + 'px';
										this.inner.style['-webkit-transform'] = 'translate3d(' + outerElement.transientXPos + 'px,0px,0px)';
									}
								};
				outerElement.moveSlider = outerElement.moveSlider.bind(outerElement);
				// Handle sending event to person trapping
				outerElement.notifyUpdated = function() {
									var percent = outerElement.transientXPos/parseInt(window.getComputedStyle(outerElement.outer).width),
										newValue = Math.ceil((parseInt(outerElement.minValue) + parseInt(outerElement.maxValue))*percent);
									// Fire our events based on the step provided
									if (Math.abs(newValue - parseInt(outerElement.range.value)) > outerElement.step) {
										outerElement.range.value = newValue;
										var evObj = document.createEvent('HTMLEvents');
										evObj.initEvent('change', false, true );
										outerElement.range.dispatchEvent(evObj);
									}
								};
				outerElement.doOrientationChange = function() {
									window.setTimeout(outerElement.range.setValue, 0);
								};
				outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
				// Assign our document event listeners
				document.addEventListener('touchmove', outerElement.moveSlider, false);
				document.addEventListener('touchend', outerElement.inner.animateEnd, false);
				window.addEventListener('resize', outerElement.doOrientationChange,false); 
			}
		}	
	}
};
