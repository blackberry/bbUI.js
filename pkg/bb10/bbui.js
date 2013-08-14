/*
* Copyright 2010-2012 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* bbUI for BB10 VERSION: 0.9.6.689*/

bb = {
	scroller: null,  
    screens: [],
	dropdownScrollers: [],
	windowListeners: [],
	documentListeners: [],
	transparentPixel: 'data:image/png;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
						
	// Core control variables
	imageList : null,
	activityIndicator : null,
	fileInput : null,
	button : null,
	scrollPanel : null,
	bbmBubble : null,
	dropdown : null,
	textInput : null,
	roundPanel : null,
	grid : null,
	pillButtons : null,
	labelControlContainers : null,	
	slider : null,
	radio : null,
	progress : null,
	checkbox : null,
	toggle : null,

	// Initialize the the options of bbUI
	init : function (options) {
		if (options) {
			for (var i in options) bb.options[i] = options[i];
		}
		
		// Initialize our flags once so that we don't have to run logic in-line for decision making
		bb.device.isRipple = (navigator.userAgent.indexOf('Ripple') >= 0) || window.tinyHippos;
		bb.device.isPlayBook = (navigator.userAgent.indexOf('PlayBook') >= 0) || ((window.innerWidth == 1024 && window.innerHeight == 600) || (window.innerWidth == 600 && window.innerHeight == 1024));
		bb.device.isBB10 = true;
		bb.device.requiresScrollingHack = (navigator.userAgent.toLowerCase().indexOf('version/10.0') >= 0) || (navigator.userAgent.toLowerCase().indexOf('version/10.1') >= 0);
		
		// Get our OS version as a convenience
		bb.device.is10dot2 = (navigator.userAgent.toLowerCase().indexOf('version/10.2') >= 0);
		bb.device.is10dot1 = (navigator.userAgent.toLowerCase().indexOf('version/10.1') >= 0);
		bb.device.is10dot0 = (navigator.userAgent.toLowerCase().indexOf('version/10.0') >= 0);
		bb.device.newerThan10dot0 = bb.device.is10dot1 || bb.device.is10dot2;
		bb.device.newerThan10dot1 = bb.device.is10dot2;
		bb.device.newerThan10dot2 = false;
		
		// Set our resolution flags
		bb.device.is1024x600 = bb.device.isPlayBook;
		bb.device.is1280x768 = (window.innerWidth == 1280 && window.innerHeight == 768) || (window.innerWidth == 768 && window.innerHeight == 1280);
		bb.device.is720x720 = (window.innerWidth == 720 && window.innerHeight == 720);
		bb.device.is1280x720 = (window.innerWidth == 1280 && window.innerHeight == 720) || (window.innerWidth == 720 && window.innerHeight == 1280);
		
		// Check if a viewport tags exist and remove them, We'll add the bbUI friendly one 
		var viewports = document.head.querySelectorAll('meta[name=viewport]'),
			i;
		for (i = 0; i < viewports.length; i++) {
			try {
				document.head.removeChild(viewports[i]);
			} catch (ex) {
				// Throw away the error
			}
		}			
		
		// Set our meta tags for content scaling
		var meta = document.createElement('meta');
		meta.setAttribute('name','viewport');
		if (!bb.device.is1024x600) { 
			meta.setAttribute('content','initial-scale='+ (1/window.devicePixelRatio) +',user-scalable=no');
		} else {
			meta.setAttribute('content','initial-scale=1.0,width=device-width,user-scalable=no,target-densitydpi=device-dpi');
		}
		document.head.appendChild(meta);
		
		// Create our shades of colors
		var R = parseInt((bb.cutHex(bb.options.highlightColor)).substring(0,2),16),
			G = parseInt((bb.cutHex(bb.options.highlightColor)).substring(2,4),16),
			B = parseInt((bb.cutHex(bb.options.highlightColor)).substring(4,6),16);
		bb.options.shades = {
			R : R,
			G : G,
			B : B,
			darkHighlight: 'rgb('+ (R - 120) +', '+ (G - 120) +', '+ (B - 120) +')',
			mediumHighlight: 'rgb('+ (R - 60) +', '+ (G - 60) +', '+ (B - 60) +')',
			darkOutline: 'rgb('+ (R - 32) +', '+ (G - 32) +', '+ (B - 32) +')',
			darkDarkHighlight: 'rgb('+ (R - 140) +', '+ (G - 140) +', '+ (B - 140) +')'
		};
		
		// Create our coloring
		if (document.styleSheets && document.styleSheets.length) {
			try {
				document.styleSheets[0].insertRule('.bb10Highlight {background-color:'+ bb.options.highlightColor +';background-image:none;}', 0);
				document.styleSheets[0].insertRule('.bbProgressHighlight {background-color:#92B43B;background-image:none;}', 0);
				document.styleSheets[0].insertRule('.bb10-button-highlight {color:White;background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.shades.darkHighlight+'), to('+bb.options.highlightColor+'));border-color:#53514F;}', 0);
				document.styleSheets[0].insertRule('.pb-button-light-highlight {color:'+bb.options.shades.darkHighlight+';background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.highlightColor+'), to('+bb.options.shades.darkHighlight+'));}', 0);
				document.styleSheets[0].insertRule('.pb-button-dark-highlight {color:'+bb.options.highlightColor+';background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.highlightColor+'), to('+bb.options.shades.darkHighlight+'));}', 0);
				document.styleSheets[0].insertRule('.bb10Accent {background-color:'+ bb.options.shades.darkHighlight +';}', 0);
				document.styleSheets[0].insertRule('.bb10-title-colored {color:white;border-color: '+bb.options.shades.darkHighlight+';text-shadow: 0px 2px black;background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.highlightColor+'), to('+bb.options.shades.darkHighlight+'));}', 0);
				document.styleSheets[0].insertRule('.bb10-title-button-container-colored {color:white;text-shadow: 0px 2px black;border-color: ' + bb.options.shades.darkDarkHighlight +';background-color: '+bb.options.shades.darkHighlight+';}', 0);
				document.styleSheets[0].insertRule('.bb10-title-button-colored {border-color: ' + bb.options.shades.darkDarkHighlight +';background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.highlightColor+'), to('+bb.options.shades.mediumHighlight+'));}', 0);
				document.styleSheets[0].insertRule('.bb10-title-button-colored-highlight {border-color: ' + bb.options.shades.darkDarkHighlight +';background-color: '+bb.options.shades.darkHighlight+';}', 0);
			}
			catch (ex) {
				console.log(ex.message);
			}
		}
		// Set our coloring
		bb.screen.controlColor = (bb.options.controlsDark) ? 'dark' : 'light';
		bb.screen.listColor = (bb.options.listsDark) ? 'dark' : 'light';
		
		// Set up our pointers to objects for each OS version
		bb.imageList = _bb10_imageList;
		bb.activityIndicator = _bb10_activityIndicator;
		bb.fileInput = _bb10_fileInput;
		bb.button = _bb10_button;
		bb.scrollPanel = _bb_PlayBook_10_scrollPanel;
		bb.bbmBubble = _bb_bbmBubble;
		bb.dropdown = _bb10_dropdown;
		bb.textInput = _bb10_textInput;
		bb.roundPanel = _bb10_roundPanel;
		bb.grid = _bb10_grid;
		bb.pillButtons = _bb10_pillButtons;
		bb.labelControlContainers = _bb10_labelControlContainers;
		bb.slider = _bb10_slider;
		bb.radio = _bb10_radio;
		bb.progress = _bb_progress;
		bb.checkbox = _bb10_checkbox;
		bb.toggle = _bb10_toggle;
		bb.contextMenu = (bb.device.isPlayBook || bb.device.isRipple) ? _PlayBook_contextMenu : _bb10_contextMenu;
		bb.actionOverflow = _PlayBook_contextMenu;
			
		// Add our keyboard listener for BB10
		if (!bb.device.isPlayBook && !bb.device.isRipple) {
			// Hide our action bar when the keyboard is about to pop up
			blackberry.event.addEventListener('keyboardOpening', function() {
				if (bb.screen.currentScreen.actionBar) {
					bb.screen.currentScreen.actionBar.hide();
				} 
			});
			
			// Scroll to our selected input once the keyboard is opened
			blackberry.event.addEventListener('keyboardOpened', function() {
				if (bb.screen.currentScreen.actionBar) {
					if (bb.screen.focusedInput) {
						if (bb.screen.focusedInput.container) {
							bb.screen.focusedInput.container.scrollIntoView(false);
						} else {
							bb.screen.focusedInput.scrollIntoView(false);
						}
					}
				} 
			});
			
			// Show our action bar when the keyboard disappears
			blackberry.event.addEventListener('keyboardClosed', function() {
				if (bb.screen.currentScreen.actionBar) {
					bb.screen.currentScreen.actionBar.show();
				} 
			});
		}
		
		// Initialize our Context Menu via the bbUI Extension for BB10
		if (!bb.device.isPlayBook && !bb.device.isRipple) {
			if (blackberry.ui && blackberry.ui.contextmenu) {
				blackberry.ui.contextmenu.enabled = true;
				if (blackberry.bbui) {
					blackberry.bbui.initContext({highlightColor : bb.options.highlightColor});
				}
			}
		}	
	},

    doLoad: function(element) {
        // Apply our styling
        var root = element || document.body;
        bb.screen.apply(root.querySelectorAll('[data-bb-type=screen]'));
		bb.style(root);
    },
	
	style: function(root) {
		if (bb.scrollPanel) 			bb.scrollPanel.apply(root.querySelectorAll('[data-bb-type=scroll-panel]'));  
	    if (bb.textInput) 				bb.textInput.apply(root.querySelectorAll('input[type=text], [type=password], [type=tel], [type=url], [type=email], [type=number], [type=date], [type=time], [type=datetime], [type=month], [type=datetime-local], [type=color], [type=search]'));
		if (bb.dropdown)				bb.dropdown.apply(root.querySelectorAll('select'));
        if (bb.roundPanel) 				bb.roundPanel.apply(root.querySelectorAll('[data-bb-type=round-panel]'));
        if (bb.imageList) 				bb.imageList.apply(root.querySelectorAll('[data-bb-type=image-list]'));
		if (bb.grid)					bb.grid.apply(root.querySelectorAll('[data-bb-type=grid-layout]'));
        if (bb.bbmBubble)				bb.bbmBubble.apply(root.querySelectorAll('[data-bb-type=bbm-bubble]'));
        if (bb.pillButtons)				bb.pillButtons.apply(root.querySelectorAll('[data-bb-type=pill-buttons]'));
        if (bb.labelControlContainers)	bb.labelControlContainers.apply(root.querySelectorAll('[data-bb-type=label-control-container]'));
        if(bb.button) 					bb.button.apply(root.querySelectorAll('[data-bb-type=button]'));
		if (bb.fileInput) 				bb.fileInput.apply(root.querySelectorAll('input[type=file]'));
		if (bb.slider)					bb.slider.apply(root.querySelectorAll('input[type=range]'));
		if (bb.progress)				bb.progress.apply(root.querySelectorAll('progress'));
		if (bb.radio)					bb.radio.apply(root.querySelectorAll('input[type=radio]'));
		if (bb.activityIndicator) 		bb.activityIndicator.apply(root.querySelectorAll('[data-bb-type=activity-indicator]'));
		if (bb.checkbox)				bb.checkbox.apply(root.querySelectorAll('input[type=checkbox]'));
		if (bb.toggle)					bb.toggle.apply(root.querySelectorAll('[data-bb-type=toggle]'));
	},
	getCurScreen : function(){
		return document.querySelector('[data-bb-type=screen]');
	},
	device: {  
		// Flags
		isBB10: false,
        isPlayBook: false, 
        isRipple: false,
		requiresScrollingHack: false,
		// Resolutions
		is1024x600: false,
		is1280x768: false,
		is720x720: false,
		is1280x720: false,
		// OS versions
		is10dot2: false,
		is10dot1: false,
		is10dot0: false,
		newerThan10dot0: false,
		newerThan10dot1 : false,
		newerThan10dot2: false
    },
	
	// Options for rendering
	options: {
		onscreenready: null,
		ondomready: null,  		
		controlsDark: false, 
		coloredTitleBar: false,
		listsDark: false,
		highlightColor: '#00A8DF'
	},
	
    loadScreen: function(url, id, popping, guid, params, screenRecord) {
        var xhr = new XMLHttpRequest(),
            container = document.createElement('div'),
            _reduce = function (nl, func, start) {
                var result = start;

                Array.prototype.forEach.apply(nl, [function (v) {
                    result = func(result, v);
                }]);

                return result;
            },
            whereScript = function (result, el) {
                if (el.nodeName === "SCRIPT") {
					result.push(el);
                }

                return _reduce(el.childNodes, whereScript, result);
            },
            i,
            scripts = [],
            newScriptTags = [];

        xhr.open("GET", url, false);
        xhr.send();

        container.setAttribute('id', guid);
        container.innerHTML = xhr.responseText;

        // Add any Java Script files that need to be included
        scripts = _reduce(container.childNodes, whereScript, []),
        container.scriptIds = [];

		// Clear out old script id references if we are reloading a screen that was in the stack
		if (screenRecord) {
			screenRecord.scripts = [];
		}
		
        scripts.forEach(function (script) {
            var scriptTag = document.createElement('script'),
				type = script.getAttribute('type');
			
			// First check the type. If the type isn't specified or if it isn't "text/javascript" then skip the script
			if (!type || type.toLowerCase() == 'text/javascript') {
				var scriptGuid = bb.guidGenerator();
				// Either update the old screen in the stack record or add to the new one
				if (screenRecord) {
					screenRecord.scripts.push({'id' : scriptGuid, 'onunload': script.getAttribute('onunload')});
				} else {
					container.scriptIds.push({'id' : scriptGuid, 'onunload': script.getAttribute('onunload')});
				}
				scriptTag.setAttribute('type','text/javascript');
				if (script.text) {
					scriptTag.innerHTML = script.text;
					scriptTag.inline = true;
				} else {
					scriptTag.setAttribute('src', script.getAttribute('src'));
				}
				scriptTag.setAttribute('id', scriptGuid);
				newScriptTags.push(scriptTag);
				// Remove script tag from container because we are going to add it to <head>
				script.parentNode.removeChild(script);
			}
        });

        // Add getElementById for the container so that it can be used in the onscreenready event
        container.getElementById = function(id, node) {
                var result = null;
                if (!node) {
                    node = this;
                }
                if ( node.getAttribute('id') == id )
                    return node;

                for ( var i = 0; i < node.childNodes.length; i++ ) {
                    var child = node.childNodes[i];
                    if ( child.nodeType == 1 ) {
                        result = this.getElementById( id, child );
                        if (result)
                            break;
                    }
                }
                return result;
            };

        // Special handling for inserting script tags
        bb.screen.scriptCounter = 0;
        bb.screen.totalScripts = newScriptTags.length;
		var script;
        for (var i = 0; i < newScriptTags.length; i++) {
			script = newScriptTags[i];
			document.body.appendChild(script);
			script.onload = function() {
				bb.screen.scriptCounter++;
				if(bb.screen.scriptCounter == bb.screen.totalScripts) {
					bb.initContainer(container, id, popping, params);
				}
			};
			// Fire the onload for an inline script
			if (script.inline == true) {
				setTimeout(script.onload, 0);
			}
        }

        // In case there are no scripts at all we simply doLoad().  We do this in
		// a setTimeout() so that it is asynchronous just like if you were loading referenced
		// script tags.  If we don't call this asynchronous, then the screen stack is in different
		// states depending on if you have scripts or not
        if(bb.screen.totalScripts === 0) {
            setTimeout(function() { bb.initContainer(container, id, popping, params) }, 0);
        }
        return container;
    },
	
	// Initialize the container
	initContainer : function(container, id, popping, params) {	
		// Fire the onscreenready and then apply our changes in doLoad()
		if (bb.options.onscreenready) {
			bb.options.onscreenready(container, id, params);
		}
		bb.doLoad(container);
		// Load in the new content
		document.body.appendChild(container);
		
		var screen = container.querySelectorAll('[data-bb-type=screen]'),
			animationScreen,
			effect,
			effectToApply = null,
			overlay;
				
        if (screen.length > 0 ) {
            screen = screen[0];
			// Swap the screen with the animation
			if (popping) {
				var previousContainer = bb.screens[bb.screens.length - 1].container,
					previousEffect;
				animationScreen = previousContainer.querySelectorAll('[data-bb-type=screen]')[0];
				previousEffect = animationScreen.hasAttribute('data-bb-effect') ? animationScreen.getAttribute('data-bb-effect') : undefined;
				// Reverse the animation
				if (previousEffect) {
					screen.style['z-index'] = '-100';
					if (previousEffect.toLowerCase() == 'fade'){
						animationScreen.setAttribute('data-bb-effect','fade-out');
					}else if (previousEffect.toLowerCase() == 'slide-left'){
						animationScreen.setAttribute('data-bb-effect','slide-out-right');
					} else if (previousEffect.toLowerCase() == 'slide-right')  {
						animationScreen.setAttribute('data-bb-effect','slide-out-left');
					} else if (previousEffect.toLowerCase() == 'slide-up')  {
						animationScreen.setAttribute('data-bb-effect','slide-out-down');
					}  else if (previousEffect.toLowerCase() == 'slide-down') {
						animationScreen.setAttribute('data-bb-effect','slide-out-up');
					} 
				}				
			} else {
				animationScreen = screen;
			}
			animationScreen.popping = popping;
			if (animationScreen.hasAttribute('data-bb-effect')) {
				// see if there is a display effect
				effect = animationScreen.getAttribute('data-bb-effect');
				if (effect) {
					effect = effect.toLowerCase();
				
					if (effect == 'fade') {
						effectToApply = bb.screen.fadeIn;
					} else if (effect == 'fade-out') {
						effectToApply = bb.screen.fadeOut;
					} else {
						switch (effect) {
						case 'slide-left':
							effectToApply = bb.screen.slideLeft;
							break;
						case 'slide-out-left':
							effectToApply = bb.screen.slideOutLeft;
							break;
						case 'slide-right':
							effectToApply = bb.screen.slideRight;
							break;
						case 'slide-out-right':
							effectToApply = bb.screen.slideOutRight;
							break;
						case 'slide-up':
							effectToApply = bb.screen.slideUp;
							break;
						case 'slide-out-up':
							effectToApply = bb.screen.slideOutUp;
							break;
						case 'slide-down':
							effectToApply = bb.screen.slideDown;
							break;
						case 'slide-out-down':
							effectToApply = bb.screen.slideOutDown;
							break;
						}
					}

					animationScreen.style.display = 'inline'; // This is a wierd hack
					
					// Listen for when the animation ends so that we can clear the previous screen
					if (effectToApply) {
						// Create our overlay
						overlay = document.createElement('div');
						animationScreen.overlay = overlay;
						overlay.setAttribute('class','bb-transition-overlay');
						document.body.appendChild(overlay);
						// Add our listener and animation state
						bb.screen.animating = true;
						animationScreen.doEndAnimation = function() {
								var s = this.style;
								bb.screen.animating = false;	
								// Remove our overlay
								document.body.removeChild(this.overlay);
								this.overlay = null;
								// Only remove the screen at the end of animation "IF" it isn't the only screen left
								if (bb.screens.length > 1) {
									if (!this.popping) {
										bb.removePreviousScreenFromDom();
										// Clear style changes that may have been made for the animation
										s.left = '';
										s.right = '';
										s.top = '';
										s.bottom = '';
										s.width = '';
										s.height = '';
										s['-webkit-animation-name'] = '';
										s['-webkit-animation-duration'] = '';
										s['-webkit-animation-timing-function'] = ''; 
										s['-webkit-transform'] = '';
									} else {
										this.style.display = 'none';
										this.parentNode.parentNode.removeChild(this.parentNode);
										// Pop it from the stack
										bb.screens.pop();	
										screen.style['z-index'] = '';
										// The container of bb.screens might be destroyed because every time re-creating even when the pop-up screen.
										bb.screens[bb.screens.length-1].container = container;  
									}
								} else if (bb.screens.length <= 1) {
									// Clear style changes that may have been made for the animation
									s.left = '';
									s.right = '';
									s.top = '';
									s.bottom = '';
									s.width = '';
									s.height = '';
									s['-webkit-animation-name'] = '';
									s['-webkit-animation-duration'] = '';
									s['-webkit-animation-timing-function'] = ''; 
									s['-webkit-transform'] = '';
								}
								
								this.removeEventListener('webkitAnimationEnd',this.doEndAnimation);
								bb.createScreenScroller(screen); 
							};
						animationScreen.doEndAnimation = animationScreen.doEndAnimation.bind(animationScreen);
						animationScreen.addEventListener('webkitAnimationEnd',animationScreen.doEndAnimation);
						
						effectToApply.call(this, animationScreen);
					}
				} 
								
			} 
		} 
		
		// Fire the ondomready after the element is added to the DOM and we've set our animation flags
		if (bb.options.ondomready) {
			bb.domready.container = container;
			bb.domready.id = id;
			bb.domready.params = params;
			setTimeout(bb.domready.fire, 1); 
		} else {
			setTimeout(bb.domready.fireEventsOnly, 1);
		}
		
		// If an effect was applied then the popping will be handled at the end of the animation
		if (!effectToApply) {
			if (!popping) {
				if (bb.screens.length > 1) {
					bb.removePreviousScreenFromDom();
				}
			} else if (popping) {
				screen.style['z-index'] = '';
				
				var currentScreen = bb.screens[bb.screens.length-1].container;
				currentScreen.parentNode.removeChild(currentScreen);
				// Pop it from the stack
				bb.screens.pop();	
				// The container of bb.screens might be destroyed because every time re-creating even when the pop-up screen.
				bb.screens[bb.screens.length-1].container = container; 
			}
			bb.createScreenScroller(screen); 
		}
	},
	
	// Function pointer to allow us to asynchronously fire ondomready
	domready : {
	
		container : null,
		id : null,
		params : null,
		
		fire : function() {
			if (bb.screen.animating) {
				setTimeout(bb.domready.fire, 250);
				return;
			}
			
			// Raise an internal event to let the rest of the framework know that the dom is ready
			var evt = document.createEvent('Events');
			evt.initEvent('bbuidomready', true, true);
			document.dispatchEvent(evt);
			// Fire our list event
			evt = document.createEvent('Events');
			evt.initEvent('bbuilistready', true, true);
			document.dispatchEvent(evt);
			// Fire our event
			bb.options.ondomready(bb.domready.container, bb.domready.id, bb.domready.params);
			bb.domready.container = null;
			bb.domready.id = null;	
		    bb.domready.params = null;
			// Raise an internal event to let the rest of the framework know that the dom has been processed
			evt = document.createEvent('Events');
			evt.initEvent('bbuidomprocessed', true, true);
			document.dispatchEvent(evt);
		},
		
		fireEventsOnly : function() {
			if (bb.screen.animating) {
				setTimeout(bb.domready.fireEventsOnly, 250);
				return;
			}
			// Raise an internal event to let the rest of the framework know that the dom is ready
			var evt = document.createEvent('Events');
			evt.initEvent('bbuidomready', true, true);
			document.dispatchEvent(evt);
			// Fire our list event
			evt = document.createEvent('Events');
			evt.initEvent('bbuilistready', true, true);
			document.dispatchEvent(evt);
			// Raise an internal event to let the rest of the framework know that the dom has been processed
			evt = document.createEvent('Events');
			evt.initEvent('bbuidomprocessed', true, true);
			document.dispatchEvent(evt);
		}
	},
	
	// Creates the scroller for the screen
	createScreenScroller : function(screen) {  
		var scrollWrapper = screen.bbUIscrollWrapper;
		if (scrollWrapper) {
			// Only apply iScroll if it is the PlayBook
			if (bb.device.isPlayBook) {
				var scrollerOptions = {hideScrollbar:true,fadeScrollbar:true, onBeforeScrollStart: function (e) {
					var target = e.target;
					// Don't scroll the screen when touching in our drop downs for BB10
					if (target.parentNode && target.parentNode.getAttribute('class') == 'bb-bb10-dropdown-items') {
						return;
					}
					
					while (target.nodeType != 1) target = target.parentNode;

					if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'AUDIO' && target.tagName != 'VIDEO') {
						e.preventDefault();
						// ensure we remove focus from a control if they touch outside the control in order to make the virtual keyboard disappear
						var activeElement = document.activeElement;
						if (activeElement) {
							if (activeElement.tagName == 'SELECT' || activeElement.tagName == 'INPUT' || activeElement.tagName == 'TEXTAREA' || activeElement.tagName == 'AUDIO' || activeElement.tagName == 'VIDEO') {
								activeElement.blur();
							}
						}
					} 
				},
				onScrollEnd: function(e) {
					// Raise an internal event to let the rest of the framework know that content is scrolling
					evt = document.createEvent('Events');
					evt.initEvent('bbuiscrolling', true, true);
					document.dispatchEvent(evt);
				},
				onScrollMove: function(e) {
					if (screen.onscroll) {
						screen.onscroll(e);
					}
					// Raise an internal event to let the rest of the framework know that content is scrolling
					evt = document.createEvent('Events');
					evt.initEvent('bbuiscrolling', true, true);
					document.dispatchEvent(evt);
				}};
				bb.scroller = new iScroll(scrollWrapper, scrollerOptions); 
			} else  {
				// Use the built in inertial scrolling with elastic ends
				bb.scroller = null;
				scrollWrapper.style['-webkit-overflow-scrolling'] = '-blackberry-touch';
				scrollWrapper.onscroll = function(e) {
						if (screen.onscroll) {
							screen.onscroll(e);
						}
					};
			}
		}
	},  

	// Clear the scroller objects
	clearScrollers: function() {
		// first clear our dropdown scrollers
		var scroller;
		for (var i = bb.dropdownScrollers -1; i > -1; i--) {
			scroller = bb.dropdownScrollers[i];
			scroller.destroy();
			scroller = null;
			bb.dropdownScrollers.pop();
		}
	},
	
	// Remove the topmost screen from the dom
	removeTopMostScreenFromDom: function() {
		var numItems = bb.screens.length,
			oldScreen = document.getElementById(bb.screens[numItems -1].guid);	
		document.body.removeChild(oldScreen);
	},
	
	// Remove the previous screen from the dom
	removePreviousScreenFromDom: function() {
		var numItems = bb.screens.length,
			oldScreen,
			stepBack;	
		if (numItems == 1) return; // There is only one screen on the stack
		stepBack = (numItems > 1) ? 2 : 1;
		oldScreen = document.getElementById(bb.screens[numItems - stepBack].guid);
		if (oldScreen) {
			document.body.removeChild(oldScreen);
		}
	},
	
    // Add a new screen to the stack
    pushScreen: function (url, id, params) {
		var i,
			listener;
			
		// Remove our old screen scripts
        bb.removeLoadedScripts();
		
		// Clear any window listeners
		for (i = 0 ; i < bb.windowListeners.length; i++) {
			listener = bb.windowListeners[i];
			window.removeEventListener(listener.name, listener.eventHandler, false);
		}
		bb.windowListeners = [];
		
		// Clear any document listeners
		for (i = 0 ; i < bb.documentListeners.length; i++) {
			listener = bb.documentListeners[i];
			document.removeEventListener(listener.name, listener.eventHandler, false);
		}
		bb.documentListeners = [];
		
		// Clear other screen items
		bb.menuBar.clearMenu();
        var numItems = bb.screens.length,
			currentScreen;
        if (numItems > 0) {
			bb.screen.overlay = null;
			bb.screen.tabOverlay = null;
			bb.clearScrollers();			
			if (bb.screen.contextMenu) {
				bb.screen.contextMenu = null;
			}
        }
		
        // Add our screen to the stack
        var guid = bb.guidGenerator(),
			container = bb.loadScreen(url, id, false, guid, params);
		bb.screens.push({'id' : id, 'url' : url, 'scripts' : container.scriptIds, 'container' : container, 'guid': guid, 'params' : params});    
    },

    // Pop a screen from the stack
    popScreen: function() {
		var numItems = bb.screens.length,
			i,
			listener;
        if (numItems > 1) {
            bb.removeLoadedScripts();
			bb.clearScrollers();
		    bb.menuBar.clearMenu();
			bb.screen.overlay = null;
			bb.screen.tabOverlay = null;
			
			// Clear any window listeners
			for (i = 0 ; i < bb.windowListeners.length; i++) {
				listener = bb.windowListeners[i];
				window.removeEventListener(listener.name, listener.eventHandler, false);
			}
			bb.windowListeners = [];
			
			// Clear any document listeners
			for (i = 0 ; i < bb.documentListeners.length; i++) {
				listener = bb.documentListeners[i];
				document.removeEventListener(listener.name, listener.eventHandler, false);
			}
			bb.documentListeners = [];
			
            // Retrieve our new screen
            var display = bb.screens[numItems-2],
                newScreen = bb.loadScreen(display.url, display.id, true, display.guid, display.params, display);
					
        } else {
            if (blackberry) {
                blackberry.app.exit();
            }
        }
    },

    removeLoadedScripts: function() {
        // pop the old item
        var numItems = bb.screens.length;
        if (numItems > 0) {
            var currentStackItem = bb.screens[numItems-1],
                current = document.getElementById(currentStackItem.guid);

            // Remove any JavaScript files
            for (var i = 0; i < currentStackItem.scripts.length; i++) {
                var bbScript = currentStackItem.scripts[i],
                    scriptTag = document.getElementById(bbScript.id);

				// Call the unload function if any is defined
                if (bbScript.onunload) {
                    eval(bbScript.onunload);
                }
                if (scriptTag) {
					document.body.removeChild(scriptTag);
				}
            }
        }
    },
	
	innerHeight: function() {
		// Orientation is backwards between playbook and BB10 smartphones
		if (bb.device.isPlayBook) {
			// Hack for ripple
			if (!window.orientation) {
				return window.innerHeight;
			} else if (window.orientation == 0 || window.orientation == 180) {
				return 600;
			} else if (window.orientation == -90 || window.orientation == 90) {
				return 1024;
			}
		} else {
			return window.innerHeight;
		}
	},
	
	innerWidth: function() {
		// Orientation is backwards between playbook and BB10 smartphones
		if (bb.device.isPlayBook) {
			// Hack for ripple
			if (!window.orientation) {
				return window.innerWidth;
			} else if (window.orientation == 0 || window.orientation == 180) {
				return 1024;
			} else if (window.orientation == -90 || window.orientation == 90) {
				return 600;
			}
		} else {
			return window.innerWidth;
		}
	},
	
	// returns 'landscape' or 'portrait'
	getOrientation: function() {
		if (bb.device.is720x720) return 'portrait';
		// Orientation is backwards between playbook and BB10 smartphones
		if (bb.device.isPlayBook) {
			// Hack for ripple
			if (!window.orientation) {
				return (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
			} else if (window.orientation == 0 || window.orientation == 180) {
				return 'landscape';
			} else if (window.orientation == -90 || window.orientation == 90) {
				return 'portrait';
			}
		} else {
			if (window.orientation == undefined) {
				return (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
			} else if (window.orientation == 0 || window.orientation == 180) {
				return 'portrait';
			} else if (window.orientation == -90 || window.orientation == 90) {
				return 'landscape';
			}
		}
	},
	
	cutHex : function(h) {
		return (h.charAt(0)=="#") ? h.substring(1,7):h
	},
	
	guidGenerator : function() {
		var S4 = function() {
		   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
	},
	
	refresh : function() {
		if (bb.scroller) {
			bb.scroller.refresh();
		}
	},
	
	isScrolledIntoView : function(element) {
		var offsetTop = 0,
			target = element;
		if (target.offsetParent) {
			do {
				offsetTop  += target.offsetTop;
				if (target.scrollTop) {
					offsetTop -= target.scrollTop;
				}
				// PlayBook calculation
				if (bb.device.isPlayBook) {
					if (target.scroller) {
						offsetTop += target.scroller.y;
					} else if (target.bbUIscrollWrapper) {
						offsetTop += bb.scroller.y;
					}
				}
			} while (target = target.offsetParent);
		}
		return offsetTop < bb.innerHeight();
	}
};

Function.prototype.bind = function(object){ 
  var fn = this; 
  return function(){ 
    return fn.apply(object, arguments); 
  }; 
}; 
// Apply styling to an action bar
bb.actionBar = {

	apply: function(actionBar, screen) {
		
		var actions = actionBar.querySelectorAll('[data-bb-type=action]'),
			mainBarButtons = [],
			overflowButtons = [],
			mainBarTabs = [],
			overflowTabs = [],
			action,
			target,
			caption,
			display,
			style,
			lastStyle,
			tabRightShading,
			backBtn,
			actionContainer = actionBar,
			btnWidth,
			icon,
			j,
			orientation = bb.getOrientation(),
			slideLabel = document.createElement('div'),
			slideText = document.createElement('div');
			
		actionBar.isVisible = true;
		actionBar.setAttribute('class','bb-action-bar bb-action-bar-'+orientation+' bb-action-bar-dark');
		actionBar.mainBarTabs = mainBarTabs;
		actionBar.mainBarButtons = mainBarButtons;
		actionBar.overflowButtons = overflowButtons;
		actionBar.overflowTabs = overflowTabs;
		
		// Create our box shadow above the action bar
		actionBar.dropShadow = document.createElement('div');
		actionBar.dropShadow.setAttribute('class','bb-action-bar-drop-shadow');
		screen.appendChild(actionBar.dropShadow);
		
		// Handle any press-and-hold events
		actionBar.oncontextmenu = function(contextEvent) {
			var node = contextEvent.srcElement,
				parentNode = node.parentNode;
			// Loop up to the parent node.. if it is this action bar then prevent default
			if (!parentNode) return;
			while (parentNode) {
				if (parentNode == this) {
					contextEvent.preventDefault();
					break;
				}
				parentNode = parentNode.parentNode;
			}			
		};
		actionBar.oncontextmenu = actionBar.oncontextmenu.bind(actionBar);
		window.addEventListener('contextmenu', actionBar.oncontextmenu);
		bb.windowListeners.push({name: 'contextmenu', eventHandler: actionBar.oncontextmenu});
		
		// Create our sliding label area for Q10
		slideLabel.setAttribute('class','bb-action-bar-slide-label');
		actionBar.slideLabel = slideLabel;
		slideText.setAttribute('class','bb-action-bar-slide-label-text');
		actionBar.slideText = slideText;
		actionBar.parentNode.appendChild(slideLabel);
		actionBar.parentNode.appendChild(slideText);
		actionBar.slideUpShown = false;
		
		// Timer for the slide up label for Q10
		actionBar.doLabelTimer = function() {
			this.slideUpShown = true;
			this.slideLabel.style.height = '48px';
			this.slideText.style.height = '48px';
			this.slideText.style.visibility = 'visible';
		};
		actionBar.doLabelTimer = actionBar.doLabelTimer.bind(actionBar);
		// Handles the closing of the label bar for Q10
		actionBar.doTouchEnd = function() {
			if (this.timer) clearTimeout(this.timer);
			if (this.slideUpShown) {
				this.slideUpShown = false;
				this.slideLabel.style.height = '0px';
				this.slideText.style.visibility = 'hidden';
				this.slideText.style.height = '0px';
			}
		}
		actionBar.doTouchEnd = actionBar.doTouchEnd.bind(actionBar);
		// Make the label appear on the press and hold for Q10
		actionBar.showLabel = function(actionItem, text) {
			if (bb.device.is720x720) {
				var computedStyle = window.getComputedStyle(actionItem);
				this.slideText.innerHTML = text;
				this.slideText.style.width = parseInt(computedStyle.width)+'px';
				this.slideText.style['margin-left'] = (bb.actionBar.getBackBtnWidth(this.backBtn) + actionItem.offsetLeft) + 'px';
				this.timer = setTimeout(this.doLabelTimer,1000);	
			}
		}
		actionBar.showLabel = actionBar.showLabel.bind(actionBar);
		
					
		// Gather our action bar and action overflow tabs and buttons
		for (j = 0; j < actions.length; j++) {
			action = actions[j];
			if (action.hasAttribute('data-bb-style')) {
				style = action.getAttribute('data-bb-style').toLowerCase();
				if (style == 'button') {
					if (action.hasAttribute('data-bb-overflow') && (action.getAttribute('data-bb-overflow').toLowerCase() == 'true')) {
						overflowButtons.push(action);
					} else {
						mainBarButtons.push(action);
					}
				} else {
					if (action.hasAttribute('data-bb-overflow') && (action.getAttribute('data-bb-overflow').toLowerCase() == 'true')) {
						overflowTabs.push(action);
					} else {
						mainBarTabs.push(action);
					}
				}
			}
		}
					
		// Create the back button if it has one and there are no tabs in the action bar
		if (actionBar.hasAttribute('data-bb-back-caption') && actionBar.querySelectorAll('[data-bb-style=tab]').length == 0) {		
			var chevron,
				backCaption,
				backslash,
				backHighlight;
			backBtn = document.createElement('div');
			backBtn.setAttribute('class','bb-action-bar-back-button bb-action-bar-back-button-dark bb-action-bar-back-button-'+orientation);
			backBtn.onclick = function () {
					window.setTimeout(bb.popScreen,0);
				};
			actionBar.backBtn = backBtn;
			// Create and add the chevron to the back button
			chevron = document.createElement('div');
			chevron.setAttribute('class','bb-action-bar-back-chevron-dark');
			backBtn.appendChild(chevron);
			// Create and add our back caption to the back button
			backCaption = document.createElement('div');
			backCaption.setAttribute('class','bb-action-bar-back-text bb-action-bar-back-text-'+orientation);
			backCaption.innerHTML = actionBar.getAttribute('data-bb-back-caption');
			backBtn.backCaption = backCaption;
			backBtn.appendChild(backCaption);
			// Create our highlight for touch
			backHighlight = document.createElement('div');
			backHighlight.setAttribute('class','bb-action-bar-back-button-highlight');
			backHighlight.style['position'] = 'absolute';
			backHighlight.style['width'] = bb.device.is1024x600 ? '4px' : '8px';
			backHighlight.style['background-color'] = 'transparent';
			
			// Use this to update dimentions on orientation change
			backBtn.updateHighlightDimensions = function(orientation) {
						if (bb.device.is1024x600) {
							backHighlight.style['height'] = orientation == 'portrait' ? '57px' : '57px';
							backHighlight.style['top'] = '8px';
						} else if (bb.device.is720x720) {
							backHighlight.style['height'] = '78px';
							backHighlight.style['top'] = '15px';
						} else {
							backHighlight.style['height'] = orientation == 'portrait' ? '110px' : '70px';
							backHighlight.style['top'] = '15px';
						}				
					};
			backBtn.updateHighlightDimensions = backBtn.updateHighlightDimensions.bind(backBtn);
			backBtn.backHighlight = backHighlight;
			backBtn.updateHighlightDimensions(orientation);
			
			backBtn.appendChild(backHighlight);
			backBtn.ontouchstart = function() {
					this.backHighlight.style['background-color'] = bb.options.highlightColor;				
			}
			backBtn.ontouchend = function() {
					this.backHighlight.style['background-color'] = 'transparent';				
			}
			
			// Create our backslash
			backslash = document.createElement('div');
			backslash.setAttribute('class','bb-action-bar-back-slash-dark bb-action-bar-back-slash-'+orientation); 
			backBtn.backslash = backslash;
			
			// Create a table to hold the back button and our actions
			var table = document.createElement('table'),
				tr = document.createElement('tr'),
				td = document.createElement('td');
			actionBar.appendChild(table);
			table.appendChild(tr);
			table.setAttribute('class','bb-action-bar-table');
			// Set Back Button widths
			if (bb.device.is1024x600) {
				td.style.width = (bb.actionBar.getBackBtnWidth(backBtn) - 16)+'px';
			} else {
				td.style.width = (bb.actionBar.getBackBtnWidth(backBtn) - 33)+'px';
			}
			tr.appendChild(td);
			backBtn.innerChevron = td;
			td.appendChild(backBtn);
			// Create the container for our backslash
			td = document.createElement('td');
			// Set backslash widths
			td.style.width = bb.device.is1024x600 ? 16 + 'px' : 33+'px';
			backslash.style['background-color'] = bb.options.shades.darkOutline;
			tr.appendChild(td);
			td.appendChild(backslash);
			// Create the container for the rest of the actions
			td = document.createElement('td');
			td.style.width = '100%';
			tr.appendChild(td);
			actionContainer = td;
			// Add the rest of the actions to the second column
			for (j = 0; j < actions.length; j++) {
				action = actions[j];
				td.appendChild(action);
			}
		}

		// If we have "tab" actions marked as overflow we need to show the more tab button
		if (overflowTabs.length > 0) {
			actionBar.tabOverflowMenu = bb.tabOverflow.create(screen);
			actionBar.tabOverflowMenu.actionBar = actionBar;
			// Create our action bar overflow button
			action = document.createElement('div');
			action.actionBar = actionBar;
			action.tabOverflowMenu = actionBar.tabOverflowMenu;
			action.setAttribute('data-bb-type','action');
			action.setAttribute('data-bb-style','tab');
			action.setAttribute('data-bb-img','overflow');
			action.onclick = function() {
							this.tabOverflowMenu.show();
						}
			// Assign our tab overflow button
			actionBar.tabOverflowBtn = action;
			// Insert our more button
			actionContainer.insertBefore(action, actionContainer.firstChild);
		}
		
		// If we have "button" actions marked as overflow we need to show the more menu button
		if (overflowButtons.length > 0) {
			actionBar.menu = bb.actionOverflow.create(screen);
			actionBar.appendChild(actionBar.menu);
			// Create our action bar overflow button
			action = document.createElement('div');
			action.menu = actionBar.menu;
			action.menu.actionBar = actionBar;
			
			action.setAttribute('data-bb-type','action');
			action.setAttribute('data-bb-style','button');
			action.setAttribute('data-bb-img','overflow');
			action.onclick = function() {
							this.menu.show();
						}
			// Assign our action overflow button
			actionBar.actionOverflowBtn = action;
			// Insert our action overflow button
			actionContainer.appendChild(action);
		}
		
		// Determines how much width there is to use not including built in system buttons on the bar
		actionBar.getUsableWidth = function() {
				return bb.innerWidth() - bb.actionBar.getBackBtnWidth(this.backBtn) - bb.actionBar.getActionOverflowBtnWidth(this.actionOverflowBtn) - bb.actionBar.getTabOverflowBtnWidth(this.tabOverflowBtn);		
			}
		actionBar.getUsableWidth = actionBar.getUsableWidth.bind(actionBar);
		
		// This function replaces 'portrait' with 'landscape' or vica-versa
		actionBar.switchOrientationCSS = function (value) {
								if (value) {
									var orientation = bb.getOrientation();
									if (orientation == 'portrait') {
										value = value.replace('landscape', 'portrait');
									} else {
										value = value.replace('portrait', 'landscape');
									}
								}
								return value;
							};
		actionBar.switchOrientationCSS = actionBar.switchOrientationCSS.bind(actionBar);
		
		// Make sure we move when the orientation of the device changes
		actionBar.reLayoutActionBar = function(event) {
								var i,
									action,
									tab,
									lastActionType = 'button',
									actionWidth = 0, 
									margins = 2,
									temp,
									max = 5,
									count = 0,
									totalUsedWidth = 0,
									calculatedWidth = 0,
									orientation = bb.getOrientation();
								
								// Re-adjust dropshadow
								this.dropShadow.style.bottom = (bb.screen.getActionBarHeight() - 1) + 'px';
								this.dropShadow.style.display = actionBar.isVisible ? 'block' : '';
									
								// First calculate how many slots on the action bar are shown
								if (this.actionOverflowBtn) max--;
								if (this.backBtn) max--;
								if (this.tabOverflowBtn) {
									max--;
									this.tabOverflowBtn.dropShadow.style.display = '';
									this.tabOverflowBtn.dropShadow.style.height = bb.screen.getActionBarHeight() + 'px';
								}
								// Count our tabs that take priority
								for (i = 0; i < this.mainBarTabs.length; i++) {
									if (count == max) break;
									tab = this.mainBarTabs[i];
									if (tab.visible == true) {
										count++;
									}							
								}
								// Then count out buttons
								for (i = 0; i < this.mainBarButtons.length; i++) {
									if (count == max) break;
									action = this.mainBarButtons[i];
									if (action.visible == true) {
										count++;
									}							
								}
								// Calculate our action width
								count = (count == 0) ? 1 : count;
								actionWidth = Math.floor(this.getUsableWidth()/count);
								
								// Set the style for the action bar
								temp = this.getAttribute('class');
								temp = this.switchOrientationCSS(temp);
								this.setAttribute('class',temp);
								if (this.isVisible) {
									bb.screen.currentScreen.outerScrollArea.style['bottom'] = bb.screen.getActionBarHeight() + 'px';
									if (bb.scroller) {
										bb.scroller.refresh();
									}
								}
								
								// Update our orientation for the back button
								if (this.backBtn) {
									// Back Button
									temp = this.backBtn.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.backBtn.setAttribute('class',temp);
									this.backBtn.updateHighlightDimensions(orientation);
									// Back caption
									temp = this.backBtn.backCaption.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.backBtn.backCaption.setAttribute('class',temp);
									// Back slash
									temp = this.backBtn.backslash.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.backBtn.backslash.setAttribute('class',temp);
									// Inner Chevron
									if (bb.device.is1024x600) {
										this.backBtn.innerChevron.style.width = (bb.actionBar.getBackBtnWidth(this.backBtn) - 16)+'px';
									} else {
										this.backBtn.innerChevron.style.width = (bb.actionBar.getBackBtnWidth(this.backBtn) - 33)+'px';
									}
								}
								
								// Reset our count of available slots
								count = 0;
							
								// Style our visible tabs
								calculatedWidth = actionWidth - 2; // 2 represents the tab margins
								for (i = 0; i < this.mainBarTabs.length; i++) {
									tab = this.mainBarTabs[i];
									if ((count < max) && (tab.visible == true)){
										totalUsedWidth += calculatedWidth + 2;
										tab.style.width = calculatedWidth + 'px'; 
										// Update tab orientation
										tab.normal = this.switchOrientationCSS(tab.normal);
										tab.highlight = this.switchOrientationCSS(tab.highlight);
										temp = tab.tabInner.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										tab.tabInner.setAttribute('class',temp);
										// Update display text orientation
										temp = tab.display.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										tab.display.setAttribute('class',temp);
										// Update our flags
										lastActionType = 'tab';
										count++;
									} else {
										tab.style.display = 'none';
										tab.visible = false;
									};
								}
								
								// Style our visible buttons
								calculatedWidth = actionWidth - 1; // 1 represents the button margins
								for (i = 0; i < this.mainBarButtons.length; i++) {
									action = this.mainBarButtons[i];
									if ((count < max) && (action.visible == true)){
										totalUsedWidth += calculatedWidth + 1;
										action.style.width = calculatedWidth + 'px'; 
										action.highlight.style['width'] = (actionWidth * 0.6) + 'px';
										action.highlight.style['margin-left'] = (actionWidth * 0.2) + 'px';
										if (lastActionType == 'tab') {
											action.normal = 'bb-action-bar-action bb-action-bar-action-' + orientation + ' bb-action-bar-button-dark bb-action-bar-button-tab-left-dark';
										} else {
											action.normal = 'bb-action-bar-action bb-action-bar-action-' + orientation + ' bb-action-bar-button-dark';
										}
										action.setAttribute('class',action.normal);
										// Update button orientation
										action.normal = this.switchOrientationCSS(action.normal);
										temp = action.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										action.setAttribute('class',temp);
										// Update our flags
										lastActionType = 'button';
										count++;
									} else {
										action.style.display = 'none';
										action.visible = false;
									};
								}
								
								// Adjust our tab overflow button
								if (this.tabOverflowBtn) {
									var tempWidth = bb.actionBar.getTabOverflowBtnWidth(this.tabOverflowBtn) -1;
									totalUsedWidth += tempWidth + 2;
									this.tabOverflowBtn.style.width = (tempWidth) + 'px';
									// Update our tab
									this.tabOverflowBtn.normal = this.switchOrientationCSS(this.tabOverflowBtn.normal);
									this.tabOverflowBtn.highlight = this.switchOrientationCSS(this.tabOverflowBtn.highlight);
									temp = this.tabOverflowBtn.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.setAttribute('class',temp);
									temp = this.tabOverflowBtn.tabHighlight.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.tabHighlight.setAttribute('class',temp);
									// Update display text
									temp = this.tabOverflowBtn.display.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.display.setAttribute('class',temp);
									// Update our icon
									this.tabOverflowBtn.icon.normal = this.switchOrientationCSS(this.tabOverflowBtn.icon.normal);
									temp = this.tabOverflowBtn.icon.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.icon.setAttribute('class',temp);
									// See if this is the only tab on the action bar
									if ((this.mainBarTabs.length == 0) && (this.mainBarButtons == 0)) {
										this.tabOverflowBtn.dropShadow.style.display = 'block'
									}
								}
								
								// Adjust our action overflow button
								if (this.actionOverflowBtn) {
									if (lastActionType == 'tab') {
										this.actionOverflowBtn.normal = 'bb-action-bar-action bb-action-bar-action-' + orientation + ' bb-action-bar-button-dark bb-action-bar-button-tab-left-dark';
										this.actionOverflowBtn.style.width = (bb.innerWidth() - totalUsedWidth ) + 'px'; // 1 represents the button margins
									} else {
										this.actionOverflowBtn.normal = 'bb-action-bar-action bb-action-bar-action-' + orientation + ' bb-action-bar-button-dark';
										this.actionOverflowBtn.style.width = (bb.actionBar.getActionOverflowBtnWidth(this.actionOverflowBtn) - 1 ) + 'px'; // 1 represents the button margins
									}	
									
									this.actionOverflowBtn.highlight.style['width'] = (bb.actionBar.getActionOverflowBtnWidth(this.actionOverflowBtn) * 0.6) + 'px';
									this.actionOverflowBtn.highlight.style['margin-left'] = (bb.actionBar.getActionOverflowBtnWidth(this.actionOverflowBtn) * 0.2) + 'px';
									this.actionOverflowBtn.style.float = 'right';
									this.actionOverflowBtn.setAttribute('class',this.actionOverflowBtn.normal);
									// Update the action
									this.actionOverflowBtn.normal = this.switchOrientationCSS(this.actionOverflowBtn.normal);
									temp = this.actionOverflowBtn.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.actionOverflowBtn.setAttribute('class',temp);
									// Update the icon
									temp = this.actionOverflowBtn.icon.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.actionOverflowBtn.icon.setAttribute('class',temp);
								}
							};
		actionBar.reLayoutActionBar = actionBar.reLayoutActionBar.bind(actionBar);	
		window.addEventListener('orientationchange', actionBar.reLayoutActionBar,false);
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'orientationchange', eventHandler: actionBar.reLayoutActionBar});
				
		// Add setBackCaption function
		actionBar.setBackCaption = function(value) {
					this.setAttribute('data-bb-back-caption',value);
					backCaption.innerHTML = value;		
				};
		actionBar.setBackCaption = actionBar.setBackCaption.bind(actionBar);  
		
		// Add setSelectedTab function
		actionBar.setSelectedTab = function(tab) {
					if (tab.getAttribute('data-bb-style') != 'tab') return;
					bb.actionBar.highlightAction(tab);
					if (tab.onclick) {
						tab.onclick();
					}
				};
		actionBar.setSelectedTab = actionBar.setSelectedTab.bind(actionBar);  
		
		// Add our hide function
		actionBar.hide = function(tab) {
					if (!this.isVisible) return;
					this.style.display = 'none';
					this.dropShadow.style.display = 'none';
					this.slideLabel.style.display = 'none';
					// Make the scroll area go right to the bottom of the displayed content
					bb.screen.currentScreen.outerScrollArea.style['bottom'] = '0px';
					this.isVisible = false;
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
		actionBar.hide = actionBar.hide.bind(actionBar); 
		
		// Add our show function
		actionBar.show = function(tab) {
					if (this.isVisible) return;
					this.style.display = '';
					this.dropShadow.style.display = 'block';
					this.slideLabel.style.display = '';
					// Resize the screen scrolling area to stop at the top of the action bar
					bb.screen.currentScreen.outerScrollArea.style['bottom'] = bb.screen.getActionBarHeight() + 'px';
					this.isVisible = true;
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
		actionBar.show = actionBar.show.bind(actionBar);
		
		// Add all our overflow tab actions
		if (overflowTabs.length > 0 ) {
			var clone;
			// Add all our visible tabs if any so they are at the top of the list
			for (j = 0; j < mainBarTabs.length; j++) {
				action = mainBarTabs[j];
				// Don't add the visible overflow tab
				if (action.getAttribute('data-bb-img') != 'overflow') {
					clone = action.cloneNode(true);					
					clone.visibleTab = action;
					clone.actionBar = actionBar;
					actionBar.tabOverflowMenu.add(clone);
				}
			}		
			// Now add all our tabs marked as overflow
			for (j = 0; j < overflowTabs.length; j++) {
				action = overflowTabs[j];
				action.actionBar = actionBar;
				actionBar.tabOverflowMenu.add(action);
			}
		}

		// Add all of our overflow button actions
		for (j = 0; j < overflowButtons.length; j++) {
			action = overflowButtons[j];
			actionBar.menu.add(action);
		}
		
		// Apply all our tab styling
		var tab,
			tabInner;
		for (j = 0; j < mainBarTabs.length; j++) {
			tab = mainBarTabs[j];
			caption = tab.innerHTML;
			tab.actionBar = actionBar;
			tab.visible = true;
			tab.innerHTML = '';
			tabInner = document.createElement('div');
			tab.tabInner = tabInner;
			tab.appendChild(tabInner);
			tab.setAttribute('class','bb-action-bar-tab-outer' );
			tab.normal = 'bb-action-bar-action bb-action-bar-action-' + orientation + ' bb-action-bar-tab-dark bb-action-bar-tab-normal-dark';
			tab.highlight = tab.normal + ' bb-action-bar-tab-selected-dark';
			tabInner.setAttribute('class',tab.normal);
			// Tab initial visibility
			tab.visible = true;
			if (tab.hasAttribute('data-bb-visible') && (tab.getAttribute('data-bb-visible').toLowerCase() == 'false')) {
				tab.visible = false;
			} 
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-action-bar-icon');
			icon.setAttribute('src',tab.getAttribute('data-bb-img'));
			tab.icon = icon;
			tabInner.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-action-bar-action-display bb-action-bar-action-display-'+orientation);
			display.innerHTML = caption;
			tab.display = display;
			tabInner.appendChild(display);
		
			// Get our selected state			
			if (tab.hasAttribute('data-bb-selected') && (tab.getAttribute('data-bb-selected').toLowerCase() == 'true')) {
				bb.actionBar.highlightAction(tab);
			}
			// Add our click listener
			tab.addEventListener('click',function (e) {
				bb.actionBar.highlightAction(this);
			},false);
			// Assign the setCaption function
			tab.setCaption = function(value) {
								this.display.innerHTML = value;
								// Change the associated overflow item if one exists
								if (this.actionBar.tabOverflowMenu) {
									var tabs = this.actionBar.tabOverflowMenu.actions,
										i,
										target;
									for (i = 0; i < tabs.length; i++) {
										target = tabs[i];
										if (target.visibleTab == this)  {
											target.setCaption(value);
										} 
									}
								}
							};
			tab.setCaption = tab.setCaption.bind(tab);
			// Assign the getCaption function
			tab.getCaption = function() {
								return this.display.innerHTML;
							};
			tab.getCaption = tab.getCaption.bind(tab);	
			// Assign the setImage function
			tab.setImage = function(value) {
								this.icon.setAttribute('src', value);
								
								// Change the associated overflow item if one exists
								if (this.actionBar.tabOverflowMenu) {
									var tabs = this.actionBar.tabOverflowMenu.actions,
										i,
										target;
									for (i = 0; i < tabs.length; i++) {
										target = tabs[i];
										if (target.visibleTab == this)  {
											target.setImage(value);
										} 
									}
								}
							};
			tab.setImage = tab.setImage.bind(tab);
			// Assign the getImage function
			tab.getImage = function() {
								return this.icon.getAttribute('src');
							};
			tab.getImage = tab.getImage.bind(tab);	
			
			// Add our hide() function
			tab.hide = bb.actionBar.actionHide;
			tab.hide = tab.hide.bind(tab);
			
			// Add our show() function
			tab.show = bb.actionBar.actionShow;
			tab.show = tab.show.bind(tab);
			
			// Handle press-and-hold on Q10
			tab.ontouchstart = function() {
					this.actionBar.showLabel(this,this.display.innerHTML);				
			}
			// Remove highlight when touch ends
			tab.ontouchend = function() {
					this.actionBar.doTouchEnd();
			}			
		}
		
		// Add our tab overflow buton styling if one exists
		var tabOverflow;
		if (actionBar.tabOverflowBtn) {
			tabOverflow = actionBar.tabOverflowBtn;
			caption = tabOverflow.innerHTML;
			tabOverflow.actionBar = actionBar;
			tabOverflow.visible = true;
			tabOverflow.innerHTML = '';
			tabInner = document.createElement('div');
			tabOverflow.tabInner = tabInner;
			tabOverflow.appendChild(tabInner);
			tabOverflow.setAttribute('class','bb-action-bar-tab-outer' );
			tabOverflow.normal = 'bb-action-bar-action bb-action-bar-action-' + orientation +' bb-action-bar-tab-dark bb-action-bar-tab-normal-dark';
			tabOverflow.highlight = tabOverflow.normal + ' bb-action-bar-tab-selected-dark';
			tabInner.setAttribute('class',tabOverflow.normal);
			// Add our drop shadow to show if only the tab Overflow is shown on the action bar
			tabOverflow.dropShadow = document.createElement('div');
			tabOverflow.dropShadow.setAttribute('class','bb-action-bar-button-tab-left-dark bb-action-bar-button-tab-overflow-only-shadow');
			tabOverflow.parentNode.appendChild(tabOverflow.dropShadow);
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-action-bar-icon');
			// Set our transparent pixel
			icon.setAttribute('src',bb.transparentPixel);
			icon.normal = 'bb-action-bar-icon bb-action-bar-tab-overflow-dark bb-action-bar-tab-overflow-'+orientation;
			icon.highlight = 'bb-action-bar-icon';
			icon.setAttribute('class',icon.normal);
			tabInner.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-action-bar-action-display bb-action-bar-action-display-'+orientation);
			display.innerHTML = caption;
			tabOverflow.display = display;
			tabInner.appendChild(display);
			tabOverflow.icon = icon;
			display.innerHTML = '&nbsp;';
			tabOverflow.display = display;
			// Create our tab highlight div
			tabOverflow.tabHighlight = document.createElement('div');
			tabOverflow.tabHighlight.setAttribute('class','bb-action-bar-tab-overflow-dark bb-action-bar-tab-overflow-highlight bb-action-bar-tab-overflow-highlight-'+ orientation);
			tabInner.appendChild(tabOverflow.tabHighlight);
			tabOverflow.style.width = (bb.actionBar.getTabOverflowBtnWidth(tabOverflow) - 1) + 'px';
			// Set our reset function
			tabOverflow.reset = function() {
						this.icon.setAttribute('src',bb.transparentPixel);
						this.icon.setAttribute('class',this.icon.normal);
						this.tabHighlight.style.display = 'none';
						this.display.innerHTML = '&nbsp;';
					};
			tabOverflow.reset = tabOverflow.reset.bind(tabOverflow);
			
			// Handle press-and-hold on Q10
			tabOverflow.ontouchstart = function() {
					var text = ((this.display.innerHTML == '') || (this.display.innerHTML == '&nbsp;')) ? 'More' : this.display.innerHTML;
					this.actionBar.showLabel(this,text);				
			}
			// Remove highlight when touch ends
			tabOverflow.ontouchend = function() {
					this.actionBar.doTouchEnd();
			}			
		}
		
		// Apply all our button styling
		var button;
		for (j = 0; j < mainBarButtons.length; j++) {
			button = mainBarButtons[j];
			button.actionBar = actionBar;
			caption = button.innerHTML;
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('src',button.getAttribute('data-bb-img'));
			icon.setAttribute('class','bb-action-bar-icon');
			button.normal = 'bb-action-bar-action bb-action-bar-action-' + orientation + ' bb-action-bar-button-dark';
			// Button initial visibility
			button.visible = true;
			if (button.hasAttribute('data-bb-visible') && (button.getAttribute('data-bb-visible').toLowerCase() == 'false')) {
				button.visible = false;
			} 
			// Default settings
			button.icon = icon;
			button.innerHTML = '';
			button.setAttribute('class',button.normal);
			button.appendChild(icon);	
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-action-bar-action-display');
			display.innerHTML = caption;
			button.display = display;
			button.appendChild(display);
			// Set our highlight
			button.highlight = document.createElement('div');
			button.highlight.setAttribute('class','bb-action-bar-action-highlight');
			button.highlight.style['height'] = bb.device.is1024x600 ? '4px' : '8px';
			button.highlight.style['background-color'] = 'transparent';
			button.appendChild(button.highlight);			
			// Assign the setCaption function
			button.setCaption = function(value) {
								this.display.innerHTML = value;
							};
			button.setCaption = button.setCaption.bind(button);	
			// Assign the getCaption function
			button.getCaption = function() {
								return this.display.innerHTML;
							};
			button.getCaption = button.getCaption.bind(button);	
			// Assign the setImage function
			button.setImage = function(value) {
								this.icon.setAttribute('src',value);
							};
			button.setImage = button.setImage.bind(button);
			// Assign the setImage function
			button.getImage = function() {
								return this.icon.getAttribute('src');
							};
			button.getImage = button.getImage.bind(button);
			// Add our hide() function
			button.hide = bb.actionBar.actionHide;
			button.hide = button.hide.bind(button);
			// Add our show() function
			button.show = bb.actionBar.actionShow;
			button.show = button.show.bind(button);
			
			// Highlight on touch
			button.ontouchstart = function() {
					this.highlight.style['background-color'] = bb.options.highlightColor;	
					this.actionBar.showLabel(this,this.display.innerHTML);				
			}
			// Remove highlight when touch ends
			button.ontouchend = function() {
					this.highlight.style['background-color'] = 'transparent';
					this.actionBar.doTouchEnd();
			}
		}
		
		// Style our action overflow button
		if (actionBar.actionOverflowBtn) {
			actionOverflow = actionBar.actionOverflowBtn;
			actionOverflow.actionBar = actionBar;
			actionOverflow.visible = true;
			caption = actionOverflow.innerHTML;
			// Set our transparent icon
			icon = document.createElement('img');
			icon.setAttribute('src',bb.transparentPixel);
			icon.setAttribute('class','bb-action-bar-icon bb-action-bar-overflow-button-dark bb-action-bar-overflow-button-'+orientation);
			actionOverflow.icon = icon;
			// Default settings
			actionOverflow.normal = 'bb-action-bar-action bb-action-bar-action-' + orientation + ' bb-action-bar-button-dark';
			actionOverflow.innerHTML = '';
			actionOverflow.setAttribute('class',actionOverflow.normal);
			actionOverflow.appendChild(icon);
			// Set our caption
			var display = document.createElement('div');
			display.setAttribute('class','bb-action-bar-action-display');
			display.innerHTML = caption;
			actionOverflow.display = display;
			actionOverflow.appendChild(display);
			// Set our highlight
			actionOverflow.highlight = document.createElement('div');
			actionOverflow.highlight.setAttribute('class','bb-action-bar-action-highlight');
			actionOverflow.highlight.style['height'] = bb.device.is1024x600 ? '4px' : '8px';
			actionOverflow.highlight.style['background-color'] = 'transparent';
			actionOverflow.appendChild(actionOverflow.highlight);
			// Highlight on touch
			actionOverflow.ontouchstart = function() {
					this.highlight.style['background-color'] = bb.options.highlightColor;	
					this.actionBar.showLabel(this,'More');						
			}
			// Remove highlight when touch ends
			actionOverflow.ontouchend = function() {
					this.highlight.style['background-color'] = 'transparent';	
					this.actionBar.doTouchEnd();					
			}		
		}
		// Center the action overflow items
		if (actionBar.menu) {
			actionBar.menu.centerMenuItems();
		}
		// Initialize the Tab Overflow
		if (actionBar.tabOverflowMenu) {
			actionBar.tabOverflowMenu.centerMenuItems();
			actionBar.tabOverflowMenu.initSelected();
		}
		// Layout the action bar
		actionBar.reLayoutActionBar();
	},
	
	
	actionShow: function() {
		if (this.visible) return;
		this.style.display = '';
		this.visible = true;
		this.actionBar.reLayoutActionBar();
	},
	
	actionHide: function() {
		if (!this.visible) return;
		this.style.display = 'none';
		this.visible = false;
		this.actionBar.reLayoutActionBar();
	},
	
	// Return the tab overflow button width based on orientation and screen resolution
	getTabOverflowBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 77 : 123;
		} else if (bb.device.is720x720) {
			return 144;
		} else {
			return bb.getOrientation() == 'portrait' ? 154 : 256;
		}
	},
	
	// Return the action overflow button width based on orientation and screen resolution
	getActionOverflowBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 77 : 123;
		} else if (bb.device.is720x720) {
			return 144;
		} else {
			return bb.getOrientation() == 'portrait' ? 154 : 256;
		}
	},
	
	// Return the back button width based on orientation and screen resolution
	getBackBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 93 : 150;
		} else if (bb.device.is720x720) {
			return 174;
		}else {
			return bb.getOrientation() == 'portrait' ? 187 : 300;
		}
	},

	// Apply the proper highlighting for the action
	highlightAction: function (action, overflowAction) {
		var i,
			target,
			tabs = action.actionBar.mainBarTabs;
		
		// First un-highlight the rest
		for (i = 0; i < tabs.length; i++) {
			target = tabs[i];
			if (target != action) { 
				bb.actionBar.unhighlightAction(target);
			}					
		}

		// Un-highlight the overflow menu items
		if (action.actionBar.tabOverflowMenu) {
			tabs = action.actionBar.tabOverflowMenu.actions;
			for (i = 0; i < tabs.length; i++) {
				target = tabs[i];
				if (target != overflowAction)  {
					bb.actionBar.unhighlightAction(target);
				} 
			}
			// Reset the overflow button
			if (action.actionBar.tabOverflowBtn.tabInner) {
				action.actionBar.tabOverflowBtn.tabInner.style['border-top-color'] = '';
				action.actionBar.tabOverflowBtn.tabInner.setAttribute('class',action.actionBar.tabOverflowBtn.normal);
			}
		}
		
		// Now highlight this action
		if (action.tabInner) {
			action.tabInner.style['border-top-color'] = bb.options.highlightColor;
			action.tabInner.setAttribute('class',action.highlight);
		} else {
			action.style['border-top-color'] = bb.options.highlightColor;
			action.setAttribute('class',action.highlight);
		}
		action.selected = true;
		
		if (overflowAction) {
			overflowAction.setAttribute('class', overflowAction.normal + ' bb10Highlight');
			overflowAction.selected = true;
		}
		
		// See if there was a tab overflow
		if (action.actionBar.tabOverflowMenu && !overflowAction) {
			if (action.actionBar.tabOverflowBtn && (action == action.actionBar.tabOverflowBtn)) {
				overflowAction.setAttribute('class', overflowAction.normal + ' bb10Highlight');
			} else {
				tabs = action.actionBar.tabOverflowMenu.actions;
				for (i = 0; i < tabs.length; i++) {
					target = tabs[i];
					if (target.visibleTab == action)  {
						target.setAttribute('class', target.normal + ' bb10Highlight');
					}
				}
			}
		}
		
		// Reset the tab overflow
		if (action.actionBar.tabOverflowBtn && action.actionBar.tabOverflowBtn.reset) {
			action.actionBar.tabOverflowBtn.reset();
		}
	},
	
	// Apply the proper styling for an action that is no longer highlighted
	unhighlightAction: function(action) {
		var target;
		// Check if it is a tab
		if (action.tabInner) {
			action.tabInner.style['border-top-color'] = '';
			action.tabInner.setAttribute('class',action.normal);
		} else {
			action.style['border-top-color'] = '';
			action.setAttribute('class',action.normal);
		}
		// See if there was a tab overflow
		if (action.actionBar && action.actionBar.tabOverflowMenu) {
			tabs = action.actionBar.tabOverflowMenu.actions;
			for (i = 0; i < tabs.length; i++) {
				target = tabs[i];
				if (target.tabInner) {
					target.tabInner.setAttribute('class', target.normal);
				} else {
					target.setAttribute('class', target.normal);
				}
				target.selected = false;
			}
		}
	}
};
_bb_bbmBubble = {
    // Apply our transforms to all BBM Bubbles
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            bb.bbmBubble.style(elements[i]);
        }
    },

    style: function(outerElement) {
		var placeholder, 
			insidepanel, 
			image, 
			innerChildNode,
			details; 
		
		// Style an indiviual item
		outerElement.styleItem = function(innerChildNode) {
			image = document.createElement('img');
			image.setAttribute('src', innerChildNode.getAttribute('data-bb-img'));
			
			details = document.createElement('div');
			details.setAttribute('class','details');
			details.innerHTML = innerChildNode.innerHTML;
			
			innerChildNode.innerHTML = '';
			
			innerChildNode.appendChild(image);
			innerChildNode.appendChild(details);
			
			// Set our variables
			innerChildNode.image = image;
			innerChildNode.details = details;
			innerChildNode.outerElement = outerElement;

			// Get bubble item caption
			innerChildNode.getCaption = function() {
				return this.details.innerText;
			};
			innerChildNode.getCaption = innerChildNode.getCaption.bind(innerChildNode);
			
			// Set bubble item caption
			innerChildNode.setCaption = function(value) {
				this.details.innerHTML = value;
				bb.refresh();
			};
			innerChildNode.setCaption = innerChildNode.setCaption.bind(innerChildNode);
			
			// Get bubble item image
			innerChildNode.getImage = function() {
				return this.image.src;
			};
			innerChildNode.getImage = innerChildNode.getImage.bind(innerChildNode);
			
			// Set bubble item image
			innerChildNode.setImage = function(value) {
				this.image.setAttribute('src', value);
				bb.refresh();
			};
			innerChildNode.setImage = innerChildNode.setImage.bind(innerChildNode);
			
			// Remove item
			innerChildNode.remove = function(value) {
				this.outerHTML = "";
				bb.refresh();
			};
			innerChildNode.remove = innerChildNode.remove.bind(innerChildNode); 
		
			return innerChildNode;
		};
		outerElement.styleItem = outerElement.styleItem.bind(outerElement);
		
        if (outerElement.hasAttribute('data-bb-style')) {
            var style = outerElement.getAttribute('data-bb-style').toLowerCase(), j;
            if (style == 'left') {
                outerElement.setAttribute('class','bb-bbm-bubble-left');
            } else {
                outerElement.setAttribute('class','bb-bbm-bubble-right');
            }

            var innerElements = outerElement.querySelectorAll('[data-bb-type=item]');
            for (j = 0; j > innerElements.length; j++) {
                outerElement.removeChild(innerElements[j]);
            }
            
            // Create our new <div>'s
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','top-left image');
            outerElement.appendChild(placeholder);
			
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','top-right image');
            outerElement.appendChild(placeholder);
			
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','inside');
            outerElement.appendChild(placeholder);
			
            insidePanel = document.createElement('div');
            insidePanel.setAttribute('class','nogap');
            placeholder.appendChild(insidePanel);
			
			outerElement.insidePanel = insidePanel;
			
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','bottom-left image');
            outerElement.appendChild(placeholder);
			
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','bottom-right image');
            outerElement.appendChild(placeholder);
				
            // Add our previous children back to the insidePanel
            for (j = 0; j < innerElements.length; j++) {
                innerChildNode = innerElements[j];
				insidePanel.appendChild(outerElement.styleItem(innerChildNode));
            }
        }
        
        // Add our get Style function
        outerElement.getStyle = function() {
                    return this.getAttribute('data-bb-style');
		};
        outerElement.getStyle = outerElement.getStyle.bind(outerElement);
        
        // Add setStyle function (left or right)
        outerElement.setStyle = function(value) {
            if (value == 'left'){
                this.setAttribute('data-bb-style', value);
                this.setAttribute('class','bb-bbm-bubble-left');
            }
            else if (value == 'right'){
                this.setAttribute('data-bb-style', value);
                this.setAttribute('class','bb-bbm-bubble-right');
            }
            bb.refresh();
        };
        outerElement.setStyle = outerElement.setStyle.bind(outerElement);
        
        // Add show function
        outerElement.show = function() {
            this.style.display = 'block';
            bb.refresh();
        };
        outerElement.show = outerElement.show.bind(outerElement);

        // Add hide function
        outerElement.hide = function() {
            this.style.display = 'none';
            bb.refresh();
        };
        outerElement.hide = outerElement.hide.bind(outerElement);

        // Add remove function
        outerElement.remove = function() {
            this.parentNode.removeChild(this);
            bb.refresh();
        };
        outerElement.remove = outerElement.remove.bind(outerElement);
		
        // Remove all the items in a bubble
        outerElement.clear = function() {
            this.insidePanel.innerHTML = "";
            bb.refresh();
        };
        outerElement.clear = outerElement.clear.bind(outerElement);
    
        // Get all the items in a bubble
        outerElement.getItems = function() {
            return this.querySelectorAll('[data-bb-type=item]');
        };
        outerElement.getItems = outerElement.getItems.bind(outerElement); 
        
        return outerElement;
    }
};
/*! * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org * Released under MIT license, http://cubiq.org/license */(function(){var m = Math,	mround = function (r) { return r >> 0; },	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :		(/firefox/i).test(navigator.userAgent) ? 'Moz' :		(/trident/i).test(navigator.userAgent) ? 'ms' :		'opera' in window ? 'O' : '',    // Browser capabilities    isAndroid = (/android/gi).test(navigator.appVersion),    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),    isPlaybook = (/playbook/gi).test(navigator.appVersion),    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),    hasTouch = 'ontouchstart' in window && !isTouchPad,    hasTransform = vendor + 'Transform' in document.documentElement.style,    hasTransitionEnd = isIDevice || isPlaybook,	nextFrame = (function() {	    return window.requestAnimationFrame			|| window.webkitRequestAnimationFrame			|| window.mozRequestAnimationFrame			|| window.oRequestAnimationFrame			|| window.msRequestAnimationFrame			|| function(callback) { return setTimeout(callback, 1); }	})(),	cancelFrame = (function () {	    return window.cancelRequestAnimationFrame			|| window.webkitCancelAnimationFrame			|| window.webkitCancelRequestAnimationFrame			|| window.mozCancelRequestAnimationFrame			|| window.oCancelRequestAnimationFrame			|| window.msCancelRequestAnimationFrame			|| clearTimeout	})(),	// Events	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',	START_EV = hasTouch ? 'touchstart' : 'mousedown',	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',	END_EV = hasTouch ? 'touchend' : 'mouseup',	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',	WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',	// Helpers	trnOpen = 'translate' + (has3d ? '3d(' : '('),	trnClose = has3d ? ',0)' : ')',	// Constructor	iScroll = function (el, options) {		var that = this,			doc = document,			i;		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);		that.wrapper.style.overflow = 'hidden';		that.scroller = that.wrapper.children[0];		// Default options		that.options = {			hScroll: true,			vScroll: true,			x: 0,			y: 0,			bounce: true,			bounceLock: false,			momentum: true,			lockDirection: true,			useTransform: true,			useTransition: false,			topOffset: 0,			checkDOMChanges: false,		// Experimental			// Scrollbar			hScrollbar: true,			vScrollbar: true,			fixedScrollbar: isAndroid,			hideScrollbar: isIDevice,			fadeScrollbar: isIDevice && has3d,			scrollbarClass: '',			// Zoom			zoom: false,			zoomMin: 1,			zoomMax: 4,			doubleTapZoom: 2,			wheelAction: 'scroll',			// Snap			snap: false,			snapThreshold: 1,			// Events			onRefresh: null,			onBeforeScrollStart: function (e) { e.preventDefault(); },			onScrollStart: null,			onBeforeScrollMove: null,			onScrollMove: null,			onBeforeScrollEnd: null,			onScrollEnd: null,			onTouchEnd: null,			onDestroy: null,			onZoomStart: null,			onZoom: null,			onZoomEnd: null		};		// User defined options		for (i in options) that.options[i] = options[i];				// Set starting position		that.x = that.options.x;		that.y = that.options.y;		// Normalize options		that.options.useTransform = hasTransform ? that.options.useTransform : false;		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;		that.options.zoom = that.options.useTransform && that.options.zoom;		that.options.useTransition = hasTransitionEnd && that.options.useTransition;		// Helpers FIX ANDROID BUG!		// translate3d and scale doesn't work together! 		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom		if ( that.options.zoom && isAndroid ){			trnOpen = 'translate(';			trnClose = ')';		}				// Set some default styles		that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';		that.scroller.style[vendor + 'TransitionDuration'] = '0';		that.scroller.style[vendor + 'TransformOrigin'] = '0 0';		if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';				if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';		if (that.options.useTransition) that.options.fixedScrollbar = true;		that.refresh();		that._bind(RESIZE_EV, window);		that._bind(START_EV);		if (!hasTouch) {			that._bind('mouseout', that.wrapper);			if (that.options.wheelAction != 'none')				that._bind(WHEEL_EV);		}		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {			that._checkDOMChanges();		}, 500);	};// PrototypeiScroll.prototype = {	enabled: true,	x: 0,	y: 0,	steps: [],	scale: 1,	currPageX: 0, currPageY: 0,	pagesX: [], pagesY: [],	aniTime: null,	wheelZoomCount: 0,		handleEvent: function (e) {		var that = this;		switch(e.type) {			case START_EV:				if (!hasTouch && e.button !== 0) return;				that._start(e);				break;			case MOVE_EV: that._move(e); break;			case END_EV:			case CANCEL_EV: that._end(e); break;			case RESIZE_EV: that._resize(); break;			case WHEEL_EV: that._wheel(e); break;			case 'mouseout': that._mouseout(e); break;			case 'webkitTransitionEnd': that._transitionEnd(e); break;		}	},		_checkDOMChanges: function () {		if (this.moved || this.zoomed || this.animating ||			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;		this.refresh();	},		_scrollbar: function (dir) {		var that = this,			doc = document,			bar;		if (!that[dir + 'Scrollbar']) {			if (that[dir + 'ScrollbarWrapper']) {				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = '';				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);				that[dir + 'ScrollbarWrapper'] = null;				that[dir + 'ScrollbarIndicator'] = null;			}			return;		}		if (!that[dir + 'ScrollbarWrapper']) {			// Create the scrollbar wrapper			bar = doc.createElement('div');			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:opacity;-' + vendor + '-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');			that.wrapper.appendChild(bar);			that[dir + 'ScrollbarWrapper'] = bar;			// Create the scrollbar indicator			bar = doc.createElement('div');			if (!that.options.scrollbarClass) {				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.9);-' + vendor + '-background-clip:padding-box;-' + vendor + '-box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';-' + vendor + '-border-radius:3px;border-radius:3px';			}			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:-' + vendor + '-transform;-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-' + vendor + '-transition-duration:0;-' + vendor + '-transform:' + trnOpen + '0,0' + trnClose;			if (that.options.useTransition) bar.style.cssText += ';-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';			that[dir + 'ScrollbarWrapper'].appendChild(bar);			that[dir + 'ScrollbarIndicator'] = bar;		}		if (dir == 'h') {			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;			that.hScrollbarIndicatorSize = m.max(mround(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;		} else {			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;			that.vScrollbarIndicatorSize = m.max(mround(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;		}		// Reset position		that._scrollbarPos(dir, true);	},		_resize: function () {		var that = this;		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);	},		_pos: function (x, y) {		x = this.hScroll ? x : 0;		y = this.vScroll ? y : 0;		if (this.options.useTransform) {			this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';		} else {			x = mround(x);			y = mround(y);			this.scroller.style.left = x + 'px';			this.scroller.style.top = y + 'px';		}		this.x = x;		this.y = y;		this._scrollbarPos('h');		this._scrollbarPos('v');	},	_scrollbarPos: function (dir, hidden) {		var that = this,			pos = dir == 'h' ? that.x : that.y,			size;		if (!that[dir + 'Scrollbar']) return;		pos = that[dir + 'ScrollbarProp'] * pos;		if (pos < 0) {			if (!that.options.fixedScrollbar) {				size = that[dir + 'ScrollbarIndicatorSize'] + mround(pos * 3);				if (size < 8) size = 8;				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';			}			pos = 0;		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {			if (!that.options.fixedScrollbar) {				size = that[dir + 'ScrollbarIndicatorSize'] - mround((pos - that[dir + 'ScrollbarMaxScroll']) * 3);				if (size < 8) size = 8;				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);			} else {				pos = that[dir + 'ScrollbarMaxScroll'];			}		}		that[dir + 'ScrollbarWrapper'].style[vendor + 'TransitionDelay'] = '0';		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';		that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;	},		_start: function (e) {		var that = this,			point = hasTouch ? e.touches[0] : e,			matrix, x, y,			c1, c2;		if (!that.enabled) return;		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);		that.moved = false;		that.animating = false;		that.zoomed = false;		that.distX = 0;		that.distY = 0;		that.absDistX = 0;		that.absDistY = 0;		that.dirX = 0;		that.dirY = 0;		// Gesture start		if (that.options.zoom && hasTouch && e.touches.length > 1) {			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);		}		if (that.options.momentum) {			if (that.options.useTransform) {				// Very lame general purpose alternative to CSSMatrix				matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');				x = matrix[4] * 1;				y = matrix[5] * 1;			} else {				x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;				y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;			}						if (x != that.x || y != that.y) {				if (that.options.useTransition) that._unbind('webkitTransitionEnd');				else cancelFrame(that.aniTime);				that.steps = [];				that._pos(x, y);			}		}		that.absStartX = that.x;	// Needed by snap threshold		that.absStartY = that.y;		that.startX = that.x;		that.startY = that.y;		that.pointX = point.pageX;		that.pointY = point.pageY;		that.startTime = e.timeStamp || Date.now();		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);		that._bind(MOVE_EV);		that._bind(END_EV);		that._bind(CANCEL_EV);	},		_move: function (e) {		var that = this,			point = hasTouch ? e.touches[0] : e,			deltaX = point.pageX - that.pointX,			deltaY = point.pageY - that.pointY,			newX = that.x + deltaX,			newY = that.y + deltaY,			c1, c2, scale,			timestamp = e.timeStamp || Date.now();		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);		// Zoom		if (that.options.zoom && hasTouch && e.touches.length > 1) {			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);			that.touchesDist = m.sqrt(c1*c1+c2*c2);			that.zoomed = true;			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);			that.lastScale = scale / this.scale;			newX = this.originX - this.originX * that.lastScale + this.x,			newY = this.originY - this.originY * that.lastScale + this.y;			this.scroller.style[vendor + 'Transform'] = trnOpen + newX + 'px,' + newY + 'px' + trnClose + ' scale(' + scale + ')';			if (that.options.onZoom) that.options.onZoom.call(that, e);			return;		}		that.pointX = point.pageX;		that.pointY = point.pageY;		// Slow down if outside of the boundaries		if (newX > 0 || newX < that.maxScrollX) {			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;		}		if (newY > that.minScrollY || newY < that.maxScrollY) { 			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;		}		that.distX += deltaX;		that.distY += deltaY;		that.absDistX = m.abs(that.distX);		that.absDistY = m.abs(that.distY);		if (that.absDistX < 6 && that.absDistY < 6) {			return;		}		// Lock direction		if (that.options.lockDirection) {			if (that.absDistX > that.absDistY + 5) {				newY = that.y;				deltaY = 0;			} else if (that.absDistY > that.absDistX + 5) {				newX = that.x;				deltaX = 0;			}		}		that.moved = true;		that._pos(newX, newY);		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;		if (timestamp - that.startTime > 300) {			that.startTime = timestamp;			that.startX = that.x;			that.startY = that.y;		}				if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);	},		_end: function (e) {		if (hasTouch && e.touches.length != 0) return;		var that = this,			point = hasTouch ? e.changedTouches[0] : e,			target, ev,			momentumX = { dist:0, time:0 },			momentumY = { dist:0, time:0 },			duration = (e.timeStamp || Date.now()) - that.startTime,			newPosX = that.x,			newPosY = that.y,			distX, distY,			newDuration,			snap,			scale;		that._unbind(MOVE_EV);		that._unbind(END_EV);		that._unbind(CANCEL_EV);		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);		if (that.zoomed) {			scale = that.scale * that.lastScale;			scale = Math.max(that.options.zoomMin, scale);			scale = Math.min(that.options.zoomMax, scale);			that.lastScale = scale / that.scale;			that.scale = scale;			that.x = that.originX - that.originX * that.lastScale + that.x;			that.y = that.originY - that.originY * that.lastScale + that.y;						that.scroller.style[vendor + 'TransitionDuration'] = '200ms';			that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';						that.zoomed = false;			that.refresh();			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);			return;		}		if (!that.moved) {			if (hasTouch) {				if (that.doubleTapTimer && that.options.zoom) {					// Double tapped					clearTimeout(that.doubleTapTimer);					that.doubleTapTimer = null;					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);					if (that.options.onZoomEnd) {						setTimeout(function() {							that.options.onZoomEnd.call(that, e);						}, 200); // 200 is default zoom duration					}				} else {					that.doubleTapTimer = setTimeout(function () {						that.doubleTapTimer = null;						// Find the last touched element						target = point.target;						while (target.nodeType != 1) target = target.parentNode;						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {							ev = document.createEvent('MouseEvents');							ev.initMouseEvent('click', true, true, e.view, 1,								point.screenX, point.screenY, point.clientX, point.clientY,								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,								0, null);							ev._fake = true;							target.dispatchEvent(ev);						}					}, that.options.zoom ? 250 : 0);				}			}			that._resetPos(200);			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);			return;		}		if (duration < 300 && that.options.momentum) {			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;			newPosX = that.x + momentumX.dist;			newPosY = that.y + momentumY.dist; 			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 }; 			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };		}		if (momentumX.dist || momentumY.dist) {			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);			// Do we need to snap?			if (that.options.snap) {				distX = newPosX - that.absStartX;				distY = newPosY - that.absStartY;				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }				else {					snap = that._snap(newPosX, newPosY);					newPosX = snap.x;					newPosY = snap.y;					newDuration = m.max(snap.time, newDuration);				}			}			that.scrollTo(mround(newPosX), mround(newPosY), newDuration);			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);			return;		}		// Do we need to snap?		if (that.options.snap) {			distX = newPosX - that.absStartX;			distY = newPosY - that.absStartY;			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);			else {				snap = that._snap(that.x, that.y);				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);			}			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);			return;		}		that._resetPos(200);		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);	},		_resetPos: function (time) {		var that = this,			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;		if (resetX == that.x && resetY == that.y) {			if (that.moved) {				that.moved = false;				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end			}			if (that.hScrollbar && that.options.hideScrollbar) {				if (vendor == 'webkit') that.hScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';				that.hScrollbarWrapper.style.opacity = '0';			}			if (that.vScrollbar && that.options.hideScrollbar) {				if (vendor == 'webkit') that.vScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';				that.vScrollbarWrapper.style.opacity = '0';			}			return;		}		that.scrollTo(resetX, resetY, time || 0);	},	_wheel: function (e) {		var that = this,			wheelDeltaX, wheelDeltaY,			deltaX, deltaY,			deltaScale;		if ('wheelDeltaX' in e) {			wheelDeltaX = e.wheelDeltaX / 12;			wheelDeltaY = e.wheelDeltaY / 12;		} else if('wheelDelta' in e) {			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;		} else if ('detail' in e) {			wheelDeltaX = wheelDeltaY = -e.detail * 3;		} else {			return;		}				if (that.options.wheelAction == 'zoom') {			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;						if (deltaScale != that.scale) {				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);				that.wheelZoomCount++;								that.zoom(e.pageX, e.pageY, deltaScale, 400);								setTimeout(function() {					that.wheelZoomCount--;					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);				}, 400);			}						return;		}				deltaX = that.x + wheelDeltaX;		deltaY = that.y + wheelDeltaY;		if (deltaX > 0) deltaX = 0;		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;		if (deltaY > that.minScrollY) deltaY = that.minScrollY;		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;		that.scrollTo(deltaX, deltaY, 0);	},		_mouseout: function (e) {		var t = e.relatedTarget;		if (!t) {			this._end(e);			return;		}		while (t = t.parentNode) if (t == this.wrapper) return;				this._end(e);	},	_transitionEnd: function (e) {		var that = this;		if (e.target != that.scroller) return;		that._unbind('webkitTransitionEnd');				that._startAni();	},	/**	 *	 * Utilities	 *	 */	_startAni: function () {		var that = this,			startX = that.x, startY = that.y,			startTime = Date.now(),			step, easeOut,			animate;		if (that.animating) return;				if (!that.steps.length) {			that._resetPos(400);			return;		}				step = that.steps.shift();				if (step.x == startX && step.y == startY) step.time = 0;		that.animating = true;		that.moved = true;				if (that.options.useTransition) {			that._transitionTime(step.time);			that._pos(step.x, step.y);			that.animating = false;			if (step.time) that._bind('webkitTransitionEnd');			else that._resetPos(0);			return;		}		animate = function () {			var now = Date.now(),				newX, newY;			if (now >= startTime + step.time) {				that._pos(step.x, step.y);				that.animating = false;				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end				that._startAni();				return;			}			now = (now - startTime) / step.time - 1;			easeOut = m.sqrt(1 - now * now);			newX = (step.x - startX) * easeOut + startX;			newY = (step.y - startY) * easeOut + startY;			that._pos(newX, newY);			if (that.animating) that.aniTime = nextFrame(animate);		};		animate();	},	_transitionTime: function (time) {		time += 'ms';		this.scroller.style[vendor + 'TransitionDuration'] = time;		if (this.hScrollbar) this.hScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;		if (this.vScrollbar) this.vScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;	},	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {		var deceleration = 0.0006,			speed = m.abs(dist) / time,			newDist = (speed * speed) / (2 * deceleration),			newTime = 0, outsideDist = 0;		// Proportinally reduce speed if we are outside of the boundaries 		if (dist > 0 && newDist > maxDistUpper) {			outsideDist = size / (6 / (newDist / speed * deceleration));			maxDistUpper = maxDistUpper + outsideDist;			speed = speed * maxDistUpper / newDist;			newDist = maxDistUpper;		} else if (dist < 0 && newDist > maxDistLower) {			outsideDist = size / (6 / (newDist / speed * deceleration));			maxDistLower = maxDistLower + outsideDist;			speed = speed * maxDistLower / newDist;			newDist = maxDistLower;		}		newDist = newDist * (dist < 0 ? -1 : 1);		newTime = speed / deceleration;		return { dist: newDist, time: mround(newTime) };	},	_offset: function (el) {		var left = -el.offsetLeft,			top = -el.offsetTop;					while (el = el.offsetParent) {			left -= el.offsetLeft;			top -= el.offsetTop;		}				if (el != this.wrapper) {			left *= this.scale;			top *= this.scale;		}		return { left: left, top: top };	},	_snap: function (x, y) {		var that = this,			i, l,			page, time,			sizeX, sizeY;		// Check page X		page = that.pagesX.length - 1;		for (i=0, l=that.pagesX.length; i<l; i++) {			if (x >= that.pagesX[i]) {				page = i;				break;			}		}		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;		x = that.pagesX[page];		sizeX = m.abs(x - that.pagesX[that.currPageX]);		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;		that.currPageX = page;		// Check page Y		page = that.pagesY.length-1;		for (i=0; i<page; i++) {			if (y >= that.pagesY[i]) {				page = i;				break;			}		}		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;		y = that.pagesY[page];		sizeY = m.abs(y - that.pagesY[that.currPageY]);		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;		that.currPageY = page;		// Snap with constant speed (proportional duration)		time = mround(m.max(sizeX, sizeY)) || 200;		return { x: x, y: y, time: time };	},	_bind: function (type, el, bubble) {		(el || this.scroller).addEventListener(type, this, !!bubble);	},	_unbind: function (type, el, bubble) {		(el || this.scroller).removeEventListener(type, this, !!bubble);	},	/**	 *	 * Public methods	 *	 */	destroy: function () {		var that = this;		that.scroller.style[vendor + 'Transform'] = '';		// Remove the scrollbars		that.hScrollbar = false;		that.vScrollbar = false;		that._scrollbar('h');		that._scrollbar('v');		// Remove the event listeners		that._unbind(RESIZE_EV, window);		that._unbind(START_EV);		that._unbind(MOVE_EV);		that._unbind(END_EV);		that._unbind(CANCEL_EV);				if (!that.options.hasTouch) {			that._unbind('mouseout', that.wrapper);			that._unbind(WHEEL_EV);		}				if (that.options.useTransition) that._unbind('webkitTransitionEnd');				if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);				if (that.options.onDestroy) that.options.onDestroy.call(that);	},	refresh: function () {		var that = this,			offset,			i, l,			els,			pos = 0,			page = 0;		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;		that.wrapperW = that.wrapper.clientWidth || 1;		that.wrapperH = that.wrapper.clientHeight || 1;		that.minScrollY = -that.options.topOffset || 0;		that.scrollerW = mround(that.scroller.offsetWidth * that.scale);		that.scrollerH = mround((that.scroller.offsetHeight + that.minScrollY) * that.scale);		that.maxScrollX = that.wrapperW - that.scrollerW;		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;		that.dirX = 0;		that.dirY = 0;		if (that.options.onRefresh) that.options.onRefresh.call(that);		that.hScroll = that.options.hScroll && that.maxScrollX < 0;		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);		that.hScrollbar = that.hScroll && that.options.hScrollbar;		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;		offset = that._offset(that.wrapper);		that.wrapperOffsetLeft = -offset.left;		that.wrapperOffsetTop = -offset.top;		// Prepare snap		if (typeof that.options.snap == 'string') {			that.pagesX = [];			that.pagesY = [];			els = that.scroller.querySelectorAll(that.options.snap);			for (i=0, l=els.length; i<l; i++) {				pos = that._offset(els[i]);				pos.left += that.wrapperOffsetLeft;				pos.top += that.wrapperOffsetTop;				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;			}		} else if (that.options.snap) {			that.pagesX = [];			while (pos >= that.maxScrollX) {				that.pagesX[page] = pos;				pos = pos - that.wrapperW;				page++;			}			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];			pos = 0;			page = 0;			that.pagesY = [];			while (pos >= that.maxScrollY) {				that.pagesY[page] = pos;				pos = pos - that.wrapperH;				page++;			}			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];		}		// Prepare the scrollbars		that._scrollbar('h');		that._scrollbar('v');		if (!that.zoomed) {			that.scroller.style[vendor + 'TransitionDuration'] = '0';			that._resetPos(200);		}	},	scrollTo: function (x, y, time, relative) {		var that = this,			step = x,			i, l;		that.stop();		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];				for (i=0, l=step.length; i<l; i++) {			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });		}		that._startAni();	},	scrollToElement: function (el, time) {		var that = this, pos;		el = el.nodeType ? el : that.scroller.querySelector(el);		if (!el) return;		pos = that._offset(el);		pos.left += that.wrapperOffsetLeft;		pos.top += that.wrapperOffsetTop;		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;		that.scrollTo(pos.left, pos.top, time);	},	scrollToPage: function (pageX, pageY, time) {		var that = this, x, y;				time = time === undefined ? 400 : time;		if (that.options.onScrollStart) that.options.onScrollStart.call(that);		if (that.options.snap) {			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;			that.currPageX = pageX;			that.currPageY = pageY;			x = that.pagesX[pageX];			y = that.pagesY[pageY];		} else {			x = -that.wrapperW * pageX;			y = -that.wrapperH * pageY;			if (x < that.maxScrollX) x = that.maxScrollX;			if (y < that.maxScrollY) y = that.maxScrollY;		}		that.scrollTo(x, y, time);	},	disable: function () {		this.stop();		this._resetPos(0);		this.enabled = false;		// If disabled after touchstart we make sure that there are no left over events		this._unbind(MOVE_EV);		this._unbind(END_EV);		this._unbind(CANCEL_EV);	},		enable: function () {		this.enabled = true;	},		stop: function () {		if (this.options.useTransition) this._unbind('webkitTransitionEnd');		else cancelFrame(this.aniTime);		this.steps = [];		this.moved = false;		this.animating = false;	},		zoom: function (x, y, scale, time) {		var that = this,			relScale = scale / that.scale;		if (!that.options.useTransform) return;		that.zoomed = true;		time = time === undefined ? 200 : time;		x = x - that.wrapperOffsetLeft - that.x;		y = y - that.wrapperOffsetTop - that.y;		that.x = x - x * relScale + that.x;		that.y = y - y * relScale + that.y;		that.scale = scale;		that.refresh();		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;		that.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';		that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';		that.zoomed = false;	},		isReady: function () {		return !this.moved && !this.zoomed && !this.animating;	}};if (typeof exports !== 'undefined') exports.iScroll = iScroll;else window.iScroll = iScroll;})();
bb.menuBar = {
	height: 140,
	itemWidth: 143,
	visible: false,
	menu: false,
	screen: false,

	apply: function(menuBar,screen){
		if (bb.device.isPlayBook || bb.device.isBB10) {
			bb.menuBar.createSwipeMenu(menuBar,screen);
			menuBar.parentNode.removeChild(menuBar);
			if (window.blackberry){
				if(bb.device.isPlayBook && blackberry.app.event) {
					blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
				}else if(bb.device.isBB10 && blackberry.app){
					blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
				}
			}
		}else{
			console.log('Unable to create Application/onSwipeDown menu.');
		}
	},
	
	createSwipeMenu: function(menuBar, screen){
		bb.menuBar.screen = screen;
		var bb10Menu = document.createElement('div'),
			maxItems = 5,
			i,
			len,
			type,
			item,
			pinLeft = false,
			pinRight = false,
			menuItems = [],
			img,
			imgPath,
			caption,
			div,
			width,
			margin,
			bb10MenuItem;

		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			bb.menuBar.height = 100;
			bb.menuBar.itemWidth = 96; 
		} else if (bb.device.is720x720) {
			bb.menuBar.height = 110;
			bb.menuBar.itemWidth = 143;
		} else {
			bb.menuBar.height = 140;
			bb.menuBar.itemWidth = 143;
		} 

		// Handle any press-and-hold events
		bb10Menu.oncontextmenu = function(contextEvent) {
			var node = contextEvent.srcElement,
				parentNode = node.parentNode;
			// Loop up to the parent node.. if it is this action bar then prevent default
			if (!parentNode) return;
			while (parentNode) {
				if (parentNode == this) {
					contextEvent.preventDefault();
					break;
				}
				parentNode = parentNode.parentNode;
			}			
		};
		bb10Menu.oncontextmenu = bb10Menu.oncontextmenu.bind(bb10Menu);
		window.addEventListener('contextmenu', bb10Menu.oncontextmenu);
		bb.windowListeners.push({name: 'contextmenu', eventHandler: bb10Menu.oncontextmenu});
		
		bb10Menu.setAttribute('class','bb-menu-bar bb-menu-bar-dark');
		items = menuBar.querySelectorAll('[data-bb-type=menu-item]');
		if(items.length > 0){
			//pre-process and collect valid menu items + identify pinned items
			for(i = 0, len = items.length; i < items.length; i++){
				item = items[i];
				type = item.hasAttribute('data-bb-type') ? item.getAttribute('data-bb-type').toLowerCase() : undefined;
				// Get our menu items
				if (type == 'menu-item') {
					caption = item.innerHTML;
					imgPath = item.getAttribute('data-bb-img');
					if (caption && imgPath) {
						if(item.hasAttribute('data-bb-pin')){
							pinType = item.getAttribute('data-bb-pin').toLowerCase();
							if(pinType === 'left' && !pinLeft){
								pinLeft = item;
								maxItems--;
							} else if(pinType === 'right' && !pinRight){
								pinRight = item;
								maxItems--;
							} else {
								console.log('Unknown value from menu-item data-bb-pin: ' + pinType + ' or value already defined.');
								menuItems.push(item); //add to the regular menu array
							}
						} else {
							menuItems.push(item);
						}
					} else {
						console.log('missing menu item caption or image.');
					}
				} else {
					console.log('invalid menu item type for bb10');
				}
			}

			//trim down items if too many
			if(menuItems.length >= maxItems){
				menuItems = menuItems.slice(0, maxItems);
			}

			//add back left and right pinned items if they exist
			if(pinLeft){
				menuItems.unshift(pinLeft);
			}

			if(pinRight){
				menuItems.push(pinRight);
			}

			width = bb.menuBar.itemWidth + 'px';
			margin = Math.floor((window.innerWidth - (bb.menuBar.itemWidth  * menuItems.length)) / (menuItems.length-1)) + 'px';
			for (i = 0, len = menuItems.length; i < len; i++) {
				item = menuItems[i];
				caption = item.innerHTML;
				imgPath = item.getAttribute('data-bb-img');

				bb10MenuItem = document.createElement("div");
				// Set our item information
				bb10MenuItem.setAttribute('class','bb-menu-bar-item');
				item.innerHTML = '';
				// Add the image
				img = document.createElement('img');
				img.setAttribute('src',imgPath);
				bb10MenuItem.appendChild(img);
				// Add the caption
				div = document.createElement('div');
				div.setAttribute('class','bb-menu-bar-item-caption');
				div.innerHTML = caption;
				bb10MenuItem.appendChild(div);

				// Assign any click handlers
				bb10MenuItem.onclick	= item.onclick;
				//set menu item width
				bb10MenuItem.style.width = width;
				if ((i == menuItems.length - 1 && menuItems.length > 1 ) || (menuItems.length === 1 && !pinLeft))  {
					bb10MenuItem.style.marginRight = 0;
					bb10MenuItem.style.float = 'right';
				} else {
					bb10MenuItem.style.marginRight = margin;
				}
				bb10Menu.appendChild(bb10MenuItem);

				bb10MenuItem.ontouchstart = function() {
					this.style['border-top-color'] = bb.options.highlightColor;
				}
				bb10MenuItem.ontouchend = function() {
					this.style['border-top-color'] = 'transparent';
				}
			}
		} else {
			bb10Menu.style.display = 'none';
			bb.menuBar.menu = null;
		}

		// Set the size of the menu bar and assign the lstener
		bb10Menu.addEventListener('click', bb.menuBar.onMenuBarClicked, false);
		screen.parentNode.appendChild(bb10Menu);
		// Assign the menu
		bb.menuBar.menu	= bb10Menu;	
		bb.menuBar.menu.style['z-index'] = '-100';
		bb.menuBar.menu.style.display = 'none';
		bb.menuBar.menu.style.height = bb.menuBar.menu.height + 'px';

		bb.menuBar.menu.doOrientationChange = function() {
			var i, len,
				menuItems = bb.menuBar.menu.getElementsByClassName('bb-menu-bar-item'),
				margin = Math.floor((window.innerWidth - (bb.menuBar.itemWidth * menuItems.length)) / (menuItems.length-1)) + 'px';
			for(i = 0, len = menuItems.length; i < len; i++){
				if (i == menuItems.length - 1) {
					menuItems[i].style.marginRight = 0;
					menuItems[i].style.float = 'right';
				} else {
					menuItems[i].style.marginRight = margin;
				}
			}
		};
		
		bb.menuBar.menu.doOrientationChange = bb.menuBar.menu.doOrientationChange.bind(bb.menuBar);
		window.addEventListener('resize', bb.menuBar.menu.doOrientationChange,false); 
		bb.windowListeners.push({name: 'resize', eventHandler: bb.menuBar.menu.doOrientationChange});
	
		
		// Add the overlay for trapping clicks on items below
		if (!bb.screen.overlay) {
			bb.screen.overlay = document.createElement('div');
			bb.screen.overlay.setAttribute('class','bb-menu-bar-overlay');
		}
		screen.appendChild(bb.screen.overlay);
		bb.menuBar.menu.overlay = bb.screen.overlay;	
	},

	doEndTransition: function() {
		if (bb.menuBar.visible) {
			bb.menuBar.menu.style['z-index'] = '';
		} else {
			if(typeof bb.menuBar.menu.style !== "undefined"){ //bb.menuBar.menu.style is undefined when new screen is pushed from a menu item
				bb.menuBar.menu.style.display = 'none';
				bb.menuBar.menu.style.height = '0px';
			}
			bb.menuBar.screen.removeEventListener('webkitTransitionEnd',bb.menuBar.doEndTransition);
			bb.menuBar.screen.style['-webkit-transition'] = '';
			bb.menuBar.screen.style['-webkit-transform'] = '';
			bb.menuBar.screen.style['-webkit-backface-visibility'] = '';
		}
	},

	setDimensions: function() {
		bb.menuBar.menu.style.display = '';
		bb.menuBar.menu.style.height = bb.menuBar.height + 'px';
		// Set our screen's parent to have no overflow so the browser doesn't think it needs to scroll
		bb.menuBar.screen.parentNode.style.position = 'absolute';
		bb.menuBar.screen.parentNode.style.left = '0px';
		bb.menuBar.screen.parentNode.style.top = '0px';
		bb.menuBar.screen.parentNode.style.bottom = '0px';
		bb.menuBar.screen.parentNode.style.right = '0px';
		bb.menuBar.screen.parentNode.style.width = '100%';
		bb.menuBar.screen.parentNode.style['overflow'] = 'hidden';
		// Make our overlay visible
		bb.menuBar.menu.overlay.style.display = 'block';
		
		// Slide our screen
		bb.menuBar.screen.style['-webkit-transition'] = '0.2s ease-out';
		bb.menuBar.screen.style['-webkit-transform'] = 'translate3d(0px,' + bb.menuBar.height + 'px,0px)';
		bb.menuBar.screen.style['-webkit-backface-visibility'] = 'hidden';
	},

	showMenuBar: function(){
		if(!bb.menuBar.visible && !bb.screen.animating){
			bb.menuBar.visible = true;
			if(bb.device.isPlayBook){
				blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);
			}else if(bb.device.isBB10){
				blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
				blackberry.event.addEventListener("swipedown", bb.menuBar.hideMenuBar);
			}

			//Use the right transition
			if(bb.device.isBB10){
				bb.menuBar.screen.addEventListener('webkitTransitionEnd',bb.menuBar.doEndTransition);
				bb.menuBar.setDimensions();					
			}else if(bb.device.isPlayBook){
				bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
				bb.menuBar.menu.style['-webkit-transform'] = 'translate3d(0, ' + (bb.menuBar.height + 3) + 'px,0px)';
			}
			bb.menuBar.visible = true;
			bb.menuBar.menu.overlay.addEventListener('touchstart', bb.menuBar.overlayTouchHandler, false);
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.visible){
			bb.menuBar.visible = false;

			if(bb.device.isPlayBook){
				blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
			}else if(bb.device.isBB10){
					blackberry.event.removeEventListener("swipedown", bb.menuBar.hideMenuBar);
					blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
			}
			//Use the right transition
			if(bb.device.isBB10){
				bb.menuBar.menu.style['z-index'] = '-100';
				bb.menuBar.screen.style['-webkit-transform'] = 'translate3d(0px,0px,0px)';
				bb.menuBar.menu.overlay.style.display = 'none';
			}else if(bb.device.isPlayBook){
				bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
				bb.menuBar.menu.style['-webkit-transform'] = 'translate3d(0, -' + (bb.menuBar.height + 3) + 'px,0px)';
			}
			bb.menuBar.menu.overlay.removeEventListener('touchstart', bb.menuBar.overlayTouchHandler, false);
		}
	},

	overlayTouchHandler: function(event){
		event.preventDefault();
		event.stopPropagation();
		bb.menuBar.hideMenuBar();
	},

	onMenuBarClicked: function () {
		bb.menuBar.hideMenuBar();
	},

	clearMenu: function(){
		if(window.blackberry){
			if(bb.menuBar.menu && (bb.device.isPlayBook || bb.device.isBB10)){
				if(bb.menuBar.visible){
					bb.menuBar.hideMenuBar();
				}
				if (bb.device.isPlayBook && blackberry.app.event) {
					blackberry.app.event.onSwipeDown('');
				}else if(bb.device.isBB10 && blackberry.app){
					blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
					blackberry.event.removeEventListener("swipedown", bb.menuBar.hideMenuBar);
				}
				bb.menuBar.menu.parentNode.removeChild(bb.menuBar.menu);
				bb.menuBar.menu = false;
				bb.menuBar.visible = false;
			}
		}
	}
};

_bb_progress = {

	NORMAL : 0,
	PAUSED : 1,
	ERROR : 2,
	
	apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.progress.style(elements[i], true);
		}
	},
	
	// Style individual item
	style: function(progress, offdom) {
		var color = bb.screen.controlColor,
			highlightColor = bb.options.highlightColor,
			accentColor = bb.options.shades.darkHighlight,
			NORMAL = 0,
			PAUSED = 1,
			ERROR = 2;
	
		// Create our container div
		outerElement = document.createElement('div');
		outerElement.progress = progress;
		outerElement.state = bb.progress.NORMAL;
		if (progress.parentNode) {
			progress.parentNode.insertBefore(outerElement, progress);
		}
		progress.style.display = 'none';
		outerElement.appendChild(progress);
		// Get our values
		outerElement.maxValue = progress.hasAttribute('max') ? parseInt(progress.getAttribute('max')) : 0;
		outerElement.value = progress.hasAttribute('value') ? parseInt(progress.getAttribute('value')) : 0;
		// Set our styling and create the inner divs
		outerElement.className = 'bb-progress';
		outerElement.outer = document.createElement('div');
		outerElement.outer.setAttribute('class','outer bb-progress-outer-' + color + ' bb-progress-outer-idle-background-' + color);
		outerElement.appendChild(outerElement.outer);
		outerElement.fill = document.createElement('div');
		outerElement.fill.normal = 'bb-progress-fill bb10Highlight';
		outerElement.fill.setAttribute('class',outerElement.fill.normal);
		outerElement.outer.appendChild(outerElement.fill);
		outerElement.inner = document.createElement('div');
		outerElement.inner.className = 'inner';
		outerElement.outer.appendChild(outerElement.inner);
				
		// Assign our function to set the value for the control
		progress.outerElement = outerElement;
		progress.setValue = function(value) {
						var percent = 0,
							width,
							xpos;
						if ((value && (value < 0)) || (value && (value > parseInt(this.outerElement.maxValue)))) {
							return;
						} else if (value) {
							this.outerElement.value = value;
							this.value = value;
						} else if (value == 0) {
							this.outerElement.value = 0;
							this.value = 0;
						} else {
							value = parseInt(this.outerElement.value);
						}

						// Calculate percentage and styling
						if (value == this.outerElement.maxValue) {
							this.outerElement.fill.style.background = '-webkit-gradient(linear, center top, center bottom, from(' + accentColor+ '), to('+highlightColor+'))';
							percent = 1;
						} else if (value == 0) {
							this.outerElement.outer.setAttribute('class','outer bb-progress-outer-' + color + ' bb-progress-outer-idle-background-' + color);
						} else {
							if (this.outerElement.state == bb.progress.PAUSED) {
								this.outerElement.fill.style.background = '-webkit-gradient(linear, center top, center bottom, from(#EDC842), to(#BA991E))';
							} else if (this.outerElement.state == bb.progress.ERROR) {
								this.outerElement.fill.style.background = '-webkit-gradient(linear, center top, center bottom, from( #E04242), to(#D91111))';
							} else {
								this.outerElement.outer.setAttribute('class','outer bb-progress-outer-' + color);
								this.outerElement.fill.setAttribute('class',this.outerElement.fill.normal);
								this.outerElement.fill.style.background ='';	
							} 
							percent = (this.outerElement.value/parseInt(this.outerElement.maxValue));
						}	
						
						// Determine width by percentage
						xpos = Math.floor(parseInt(window.getComputedStyle(this.outerElement.outer).width) * percent);
						this.outerElement.fill.style.width = xpos + 'px';						
					};
		progress.setValue = progress.setValue.bind(progress);
		
		// Set the state of the control
		progress.setState = function(state) {
						this.outerElement.state = state;
						this.setValue();
					};
		progress.setState = progress.setState.bind(progress);
		
		// Add our show function
		progress.show = function() {
			this.outerElement.style.display = 'block';
			bb.refresh();
				};
		progress.show = progress.show.bind(progress);
		
		// Add our hide function
		progress.hide = function() {
			this.outerElement.style.display = 'none';
			bb.refresh();
				};
		progress.hide = progress.hide.bind(progress);
		
		// Add remove function
		progress.remove = function() {
			this.outerElement.parentNode.removeChild(this.outerElement);
			bb.refresh();
				};
		progress.remove = progress.remove.bind(progress);
		
		// Add setMax function
		progress.setMax = function(value) {
					if (!value || (value < 0) || (value == this.max)) return;
					this.max = value;
					this.outerElement.maxValue = value;
				};
		progress.setMax = progress.setMax.bind(progress);
		
		if (offdom) {
			// Load our image once onbbuidomready 
			progress.onbbuidomready = function() {
						this.setValue();
						document.removeEventListener('bbuidomready', this.onbbuidomready,false);
					};
			progress.onbbuidomready = progress.onbbuidomready.bind(progress);
			document.addEventListener('bbuidomready', progress.onbbuidomready,false);
		} else {
			window.setTimeout(progress.setValue, 0);
		}
		
		// Re-calculate on orientation change
		outerElement.doOrientationChange = function() {
							window.setTimeout(this.progress.setValue, 0);
						};
		outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
		window.addEventListener('resize', outerElement.doOrientationChange,false); 
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'resize', eventHandler: outerElement.doOrientationChange});
			
		return outerElement;
	}
};
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
bb.tabOverflow = {

	create : function(screen) {
		var menu = document.createElement('div'),
			overlay;
		menu.screen = screen;
		menu.itemClicked = false;
		menu.visible = false;
		menu.actions = [];
		menu.tabOverflowState = {
			display : undefined,
			img : undefined,
			style : undefined,
			caption : undefined
		};
		
		menu.setAttribute('class','bb-tab-overflow-menu bb-tab-overflow-menu-dark');
		screen.parentNode.appendChild(menu);
		
		// Set our initial styling
		menu.style['z-index'] = '-100';
		menu.style.display = 'none';
		menu.style.width = menu.width + 'px';
		
		// Handle any press-and-hold events
		menu.oncontextmenu = function(contextEvent) {
			var node = contextEvent.srcElement,
				parentNode = node.parentNode;
			// Loop up to the parent node.. if it is this action bar then prevent default
			if (!parentNode) return;
			while (parentNode) {
				if (parentNode == this) {
					contextEvent.preventDefault();
					break;
				}
				parentNode = parentNode.parentNode;
			}			
		};
		menu.oncontextmenu = menu.oncontextmenu.bind(menu);
		window.addEventListener('contextmenu', menu.oncontextmenu);
		bb.windowListeners.push({name: 'contextmenu', eventHandler: menu.oncontextmenu});
		
		if (!bb.screen.tabOverlay) {
			overlay = document.createElement('div');
			overlay.menu = menu;
			bb.screen.tabOverlay = overlay;
			overlay.setAttribute('class','bb-tab-overflow-menu-overlay ');
			screen.appendChild(overlay);
			
			// Hide the menu on touch
			overlay.ontouchstart = function(e) {
						e.preventDefault();
						e.stopPropagation();
						this.menu.hide();
					};
		}
		menu.overlay = bb.screen.tabOverlay;

		// Apply styling at the begining and end of animation
		menu.doEndTransition = function() {
			if (this.visible) {
				this.style['z-index'] = '';
			} else {
				this.style.display = 'none';
				this.style.width = '0px';
				this.screen.removeEventListener('webkitTransitionEnd',menu.doEndTransition);
				this.screen.style['-webkit-transition'] = '';
				this.screen.style['-webkit-transform'] = '';
				this.screen.style['-webkit-backface-visibility'] = '';
			}
		};
		menu.doEndTransition = menu.doEndTransition.bind(menu);	
			
		menu.show = function() {
					this.itemClicked = false;
					this.visible = true;
					var tabOverflowBtn = this.actionBar.tabOverflowBtn;
					this.tabOverflowState.display = tabOverflowBtn.tabHighlight.style.display;
					this.tabOverflowState.img = tabOverflowBtn.icon.src;
					this.tabOverflowState.caption = tabOverflowBtn.display.innerHTML;
					this.tabOverflowState.style = tabOverflowBtn.icon.getAttribute('class');
					this.screen.addEventListener('webkitTransitionEnd',menu.doEndTransition);
					this.setDimensions();					
					// Reset our overflow menu button
					tabOverflowBtn.reset();
					if(bb.device.isPlayBook){
						blackberry.app.event.onSwipeDown();
					} else {
						blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
					}
				};
		menu.show = menu.show.bind(menu);	
		
		// Adjust the dimensions of the menu and screen
		menu.setDimensions = function() {
					this.style.display = '';
					this.style.width = bb.tabOverflow.getWidth() + 'px';
					// Set our screen's parent to have no overflow so the browser doesn't think it needs to scroll
					this.screen.parentNode.style.position = 'absolute';
					this.screen.parentNode.style.left = '0px';
					this.screen.parentNode.style.top = '0px';
					this.screen.parentNode.style.bottom = '0px';
					this.screen.parentNode.style.right = '0px';
					this.screen.parentNode.style.width = '100%';
					this.screen.parentNode.style['overflow'] = 'hidden';
					// Make our overlay visible
					this.overlay.style.display = 'block';
					
					// Slide our screen
					this.screen.style['-webkit-transition'] = '0.2s ease-out';
					this.screen.style['-webkit-transform'] = 'translate3d(' + bb.tabOverflow.getWidth() + 'px,0px,0px)';
					this.screen.style['-webkit-backface-visibility'] = 'hidden';
				};
		menu.setDimensions = menu.setDimensions.bind(menu);	
		
		menu.hide = function() {
					this.visible = false;
					this.style['z-index'] = '-100';
					this.screen.style['-webkit-transform'] = 'translate3d(0px,0px,0px)';
					
					// Make our overlay invisible
					this.overlay.style.display = 'none';
					
					// Re-apply the old button styling if needed
					if (!this.itemClicked) {
						var tabOverflowBtn = this.actionBar.tabOverflowBtn;
						tabOverflowBtn.icon.setAttribute('src',this.tabOverflowState.img);
						tabOverflowBtn.icon.setAttribute('class',this.tabOverflowState.style);
						tabOverflowBtn.tabHighlight.style.display = this.tabOverflowState.display;
						tabOverflowBtn.display.innerHTML = this.tabOverflowState.caption;
					}
					if(bb.device.isPlayBook){
						blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
					} else {
						blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
					}
				};
		menu.hide = menu.hide.bind(menu);
		
		// Hide the menu
		menu.onclick = function() {
					this.hide();
				};
				
		// Center the items in the list
		menu.centerMenuItems = function() {
								var windowHeight = bb.innerHeight(),
									itemHeight = 111,
									margin;
									
								if (bb.device.is1024x600) {
									itemHeight = 53;
								} else if (bb.device.is720x720) {
									itemHeight = 80;
								} else {
									itemHeight = 111;
								}
								
								margin = windowHeight - Math.floor(windowHeight/2) - Math.floor((this.actions.length * itemHeight)/2) - itemHeight; //itemHeight is the header
								if (margin < 0) margin = 0;
								this.actions[0].style['margin-top'] = margin + 'px';
							};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
		// Initialize any selected items
		menu.initSelected = function() {
								var i,
									action;
								for (i = 0; i < this.actions.length; i++) {
									action = this.actions[i];
									if (action.initialSelected) {
										action.setOverflowTab(true);
										break;
									}
								}
							};
		menu.initSelected = menu.initSelected.bind(menu);

		// Make sure we move when the orientation of the device changes
		menu.orientationChanged = function(event) {
								this.centerMenuItems();
								// Resize the menu if it is currently open
								if (this.visible) {
									this.setDimensions();
								}
							};
		menu.orientationChanged = menu.orientationChanged.bind(menu);	
		window.addEventListener('orientationchange', menu.orientationChanged,false); 
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'orientationchange', eventHandler: menu.orientationChanged});
		
		// Create our add item function
		menu.add = function(action) {
				var normal, 
					caption = action.innerHTML,
					accentTextValue = action.getAttribute('data-bb-accent-text'),
					inner = document.createElement('div'),
					innerClass = 'bb-tab-overflow-menu-item-inner',
					img = document.createElement('img'),
					table, tr, td;
				
				// set our styling
				normal = 'bb-tab-overflow-menu-item bb-tab-overflow-menu-item-dark';
				this.appendChild(action);
				
				// Check for our visibility
				if (action.hasAttribute('data-bb-visible') && action.getAttribute('data-bb-visible').toLowerCase() == 'false') {
					action.visible = false;
					action.style.display = 'none';
				} else {
					action.visible = true;
					this.actions.push(action);
				}
				// If it is the top item it needs a top border
				if (this.actions.length == 1) {
					normal = normal + ' bb-tab-overflow-menu-item-first-dark';
				}
				// Set our inner information
				action.normal = normal;
				action.accentText = null;
				action.menu = this;
				action.caption = caption;
				action.setAttribute('class',action.normal);
				action.innerHTML = '';
				if (!action.visibleTab) {
						action.visibleTab = action.actionBar.tabOverflowBtn;
				}
				// Create our layout
				table = document.createElement('table');
				tr = document.createElement('tr');
				table.appendChild(tr);
				action.appendChild(table);
				// Add our image
				td = document.createElement('td');
				img.setAttribute('src', action.getAttribute('data-bb-img'));
				img.setAttribute('class','bb-tab-overflow-menu-item-image');
				action.img = img;
				td.appendChild(img);
				tr.appendChild(td);
				// Add our caption
				td = document.createElement('td');
				inner.innerHTML = caption;
				action.display = inner;
				td.appendChild(inner);
				// See if there is accent text
				if (accentTextValue) {
					action.accentText = document.createElement('div');
					action.accentText.innerHTML = accentTextValue;
					action.accentText.setAttribute('class','tab-accent-text');
					td.appendChild(action.accentText);	
					innerClass = innerClass + ' bb-tab-overflow-menu-item-double';
				} else {
					innerClass = innerClass + ' bb-tab-overflow-menu-item-single';
				}
				// Set our styling
				inner.setAttribute('class',innerClass);
				tr.appendChild(td);
				
				//Set the overflow tab item
				action.setOverflowTab = function(hightlight) {
							var tabOverflowBtn = this.actionBar.tabOverflowBtn;
							if (hightlight) {
								bb.actionBar.highlightAction(this.visibleTab, this);
							}
							if (this.visibleTab == tabOverflowBtn) {
								tabOverflowBtn.icon.setAttribute('src',this.img.src);
								tabOverflowBtn.icon.setAttribute('class',tabOverflowBtn.icon.highlight);
								tabOverflowBtn.tabHighlight.style.display = 'block';
								tabOverflowBtn.display.innerHTML = this.caption;
							}
						};
				action.setOverflowTab = action.setOverflowTab.bind(action);

				// See if it was selected
				action.initialSelected = (action.hasAttribute('data-bb-selected') && (action.getAttribute('data-bb-selected').toLowerCase() == 'true'));
				action.selected = action.initialSelected;
				
				// Trap the old click so that we can call it later
				action.oldClick = action.onclick;
				action.onclick = function() {
									var tabOverflowBtn = this.actionBar.tabOverflowBtn;
									this.menu.itemClicked = true;
									bb.actionBar.highlightAction(this.visibleTab, this);
									if (this.visibleTab == tabOverflowBtn) {
										this.setOverflowTab(false);
									} 
									if (this.oldClick) {
										this.oldClick();
									}
								};
								
				// Assign the setCaption function
				action.setCaption = function(value) {
									this.display.innerHTML = value;
									this.caption = value;
									
									// Update the overflow button if this tab is selected
									var tabOverflowBtn = this.actionBar.tabOverflowBtn;
									if ((this.visibleTab == tabOverflowBtn) && (this.selected == true)) {
										tabOverflowBtn.display.innerHTML = this.caption;
									}
								};
				action.setCaption = action.setCaption.bind(action);
				
				// Assign the setImage function
				action.setImage = function(value) {
									this.img.setAttribute('src',value);
								};
				action.setImage = action.setImage.bind(action);
				
				// Assign the show function
				action.show = function() {
									if (this.visible) return;
									this.visible = true;
									this.menu.actions.push(this);
									this.style.display = '';
									this.menu.centerMenuItems();
								};
				action.show = action.show.bind(action);
				
				// Assign the hide function
				action.hide = function() {
									if (!this.visible) return;
									this.visible = false;
									var index = this.menu.actions.indexOf(this);
									this.menu.actions.splice(index,1);
									this.style.display = 'none';	
									this.menu.centerMenuItems();
								};
				action.hide = action.hide.bind(action);
		};
		menu.add = menu.add.bind(menu);
		return menu;
	},
	
	// Get the preferred width of the overflow
	getWidth: function() {
		if (bb.device.is1024x600) {
			return (bb.getOrientation() == 'portrait') ? bb.innerWidth() - 77 : 400;
		} else if (bb.device.is720x720) {
			return bb.innerWidth() - 143;
		} else {
			return (bb.getOrientation() == 'portrait') ? bb.innerWidth() - 154 : 700;
		}
	}
};
bb.titleBar = {

	apply: function(titleBar) {	
		var orientation = bb.getOrientation(),
			button,
			caption,
			titleBarClass,
			details,
			topTitleArea = document.createElement('div'),
			img,
			accentText;
		
		// Insert our title area
		titleBar.topTitleArea = topTitleArea;
		titleBar.appendChild(topTitleArea);
		
		// Create our box shadow below the title bar
		if (titleBar.parentNode) {
			titleBar.dropShadow = document.createElement('div');
			titleBar.dropShadow.setAttribute('class','bb-title-bar-drop-shadow');
			titleBar.dropShadow.style.top = (bb.screen.getTitleBarHeight() - 1) + 'px';
			titleBar.parentNode.appendChild(titleBar.dropShadow);
		}
		
		// Style our title bar
		if (bb.options.coloredTitleBar) {
			titleBarClass = 'bb-title-bar bb-title-bar-'+ orientation + ' bb10-title-colored';
		} else {
			titleBarClass = 'bb-title-bar bb-title-bar-'+ orientation + ' bb-title-bar-' + bb.screen.controlColor;
		}
		topTitleArea.setAttribute('class', titleBarClass);
		
		// Set our caption
		caption = document.createElement('div');
		titleBar.caption = caption;
		caption.setAttribute('class','bb-title-bar-caption bb-title-bar-caption-'+ orientation);
		caption.innerHTML = titleBar.getAttribute('data-bb-caption');
		topTitleArea.appendChild(caption);
		
		// Get our back button if provided
		if (titleBar.hasAttribute('data-bb-back-caption')) {
			button = document.createElement('div');
			button.innerHTML = titleBar.getAttribute('data-bb-back-caption');
			topTitleArea.appendChild(button);
			titleBar.backButton = button;
			button.onclick = bb.popScreen;
			bb.titleBar.styleBB10Button(button);
			button.style.left = '0px';
		}
		// Get our action button if provided
		if (titleBar.hasAttribute('data-bb-action-caption')) {
			button = document.createElement('div');
			button.innerHTML = titleBar.getAttribute('data-bb-action-caption');
			if (titleBar.hasAttribute('onactionclick')) {
				button.titleBar = titleBar;
				button.onactionclick = titleBar.getAttribute('onactionclick');
				titleBar.onactionclick = function() {
								eval(this.actionButton.onactionclick);
							};
				button.onclick = function() {
								if (this.titleBar.onactionclick) {
									this.titleBar.onactionclick();
								}
							};
			} else if (titleBar.onactionclick) {
				button.onclick = titleBar.onactionclick;
			}
			bb.titleBar.styleBB10Button(button);
			button.style.right = '0px';
			topTitleArea.appendChild(button);
			titleBar.actionButton = button;
		}
		// Create an adjustment function for the widths
		if (titleBar.actionButton || titleBar.backButton) {
			titleBar.evenButtonWidths = function() {
									var backWidth = this.backButton ? parseInt(window.getComputedStyle(this.backButton).width) : 0,
										actionWidth = this.actionButton ? parseInt(window.getComputedStyle(this.actionButton).width) : 0,
										commonWidth;
									
									if (this.actionButton && this.backButton) {
										commonWidth = (backWidth > actionWidth) ? backWidth : actionWidth;
										this.backButton.style.width = commonWidth +'px';
										this.actionButton.style.width = commonWidth +'px';
										this.caption.style['margin-left'] = (commonWidth + 24) +'px';
										this.caption.style['margin-right'] = (commonWidth + 24) +'px';
									} else if (this.actionButton) {
										this.caption.style['margin-left'] = '0px';
										this.caption.style['margin-right'] = (actionWidth + 24) +'px';
									} else if (this.backButton) {
										this.caption.style['margin-right'] = '0px';
										this.caption.style['margin-left'] = (backWidth + 24) +'px';
									}
								};
			titleBar.evenButtonWidths = titleBar.evenButtonWidths.bind(titleBar);
			window.setTimeout(titleBar.evenButtonWidths,0);
		}
		
		// Display our image ONLY if there are no title bar images
		if ((!titleBar.actionButton && !titleBar.backButton) && (titleBar.hasAttribute('data-bb-img') || titleBar.hasAttribute('data-bb-accent-text'))){
			caption.setAttribute('class','bb-title-bar-caption-left');
			details = document.createElement('div');
			titleBar.details = details;
			topTitleArea.appendChild(details);
			details.appendChild(caption);
			
			// First check for the image
			if (titleBar.hasAttribute('data-bb-img')) {
				img = document.createElement('img');
				//img.src = titleBar.getAttribute('data-bb-img');
				titleBar.img = img;
				topTitleArea.insertBefore(img, details);
				details.setAttribute('class', 'bb-title-bar-caption-details-img');
				
				// Create our display image
				img.style.opacity = '0';
				img.style['-webkit-transition'] = 'opacity 0.5s linear';
				img.style['-webkit-backface-visibility'] = 'hidden';
				img.style['-webkit-perspective'] = 1000;
				img.style['-webkit-transform'] = 'translate3d(0,0,0)';

				// Load our image once onbbuidomready 
				titleBar.onbbuidomready = function() {
							// Animate its visibility once loaded
							this.img.onload = function() {
								this.style.opacity = '1.0';
							}
							this.img.src = this.getAttribute('data-bb-img');
							document.removeEventListener('bbuidomready', this.onbbuidomready,false);
						};
				titleBar.onbbuidomready = titleBar.onbbuidomready.bind(titleBar);
				document.addEventListener('bbuidomready', titleBar.onbbuidomready,false);		
			} 
			// Next check for the accent text
			if (titleBar.hasAttribute('data-bb-accent-text')) {
				if (bb.device.is1024x600) {
					caption.style['line-height'] = '40px';
				} else if (bb.device.is1280x768 || bb.device.is1280x720) {
					caption.style['line-height'] = '70px';
				} else if (bb.device.is720x720) {
					caption.style['line-height'] = '55px';
				}else {
					caption.style['line-height'] = '70px';
				}
				accentText = document.createElement('div');
				accentText.setAttribute('class','bb-title-bar-accent-text');
				if (bb.options.coloredTitleBar) {
					accentText.style.color = 'silver';
				}
				titleBar.accentText = accentText;
				accentText.innerHTML = titleBar.getAttribute('data-bb-accent-text');
				details.appendChild(accentText);
			} 
		
		}

		// Assign the setCaption function
		titleBar.setCaption = function(value) {
				this.caption.innerHTML = value;
			};
		titleBar.setCaption = titleBar.setCaption.bind(titleBar);
		// Assign the getCaption function
		titleBar.getCaption = function() {
				return this.caption.innerHTML;
			};
		titleBar.getCaption = titleBar.getCaption.bind(titleBar);
		// Assign the setBackCaption function
		titleBar.setBackCaption = function(value) {
				this.backButton.firstChild.innerHTML = value;
				if (this.actionButton) {
					this.backButton.style.width = '';
					this.evenButtonWidths();
				}
			};
		titleBar.setBackCaption = titleBar.setBackCaption.bind(titleBar);
		// Assign the getBackCaption function
		titleBar.getBackCaption = function() {
				return this.backButton.firstChild.innerHTML;
			};
		titleBar.getBackCaption = titleBar.getBackCaption.bind(titleBar);
		// Assign the setActionCaption function
		titleBar.setActionCaption = function(value) {
				this.actionButton.firstChild.innerHTML = value;
				if (this.backButton) {
					this.actionButton.style.width = '';
					this.evenButtonWidths();
				}
			};
		titleBar.setActionCaption = titleBar.setActionCaption.bind(titleBar);
		// Assign the getActionCaption function
		titleBar.getActionCaption = function() {
				return this.actionButton.firstChild.innerHTML;
			};
		titleBar.getActionCaption = titleBar.getActionCaption.bind(titleBar);
		// Assign the getAccentText function
		titleBar.getAccentText = function() {
				return this.accentText.innerHTML;
			};
		titleBar.getAccentText = titleBar.getAccentText.bind(titleBar);
	},
	
	styleBB10Button: function(outerElement) {
		var innerElement = document.createElement('div'),
			normal,
			highlight, 
			outerNormal;
		
		if (bb.options.coloredTitleBar) {
			normal = 'bb-titlebar-button bb10-title-button-colored';
			highlight = 'bb-titlebar-button bb10-title-button-colored-highlight';
			outerNormal = 'bb-titlebar-button-container bb10-title-button-container-colored';
		} else {
			normal = 'bb-titlebar-button bb-titlebar-button-' + bb.screen.controlColor;
			highlight = 'bb-titlebar-button bb-titlebar-button-highlight-'+ bb.screen.controlColor;
			outerNormal = 'bb-titlebar-button-container bb-titlebar-button-container-' + bb.screen.controlColor;
		}

		//outerElement.enabled = !disabled;
		outerElement.enabled = true;
		innerElement.innerHTML = outerElement.innerHTML;
		outerElement.innerHTML = '';
		outerElement.appendChild(innerElement);
		innerElement.setAttribute('class',normal);
		
		// Set our variables on the elements
		outerElement.setAttribute('class',outerNormal);
		outerElement.outerNormal = outerNormal;
		outerElement.innerElement = innerElement;
		innerElement.normal = normal;
		innerElement.highlight = highlight;

		outerElement.ontouchstart = function() {
								this.innerElement.setAttribute('class', this.innerElement.highlight);
							};
		outerElement.ontouchend = function() {
								this.innerElement.setAttribute('class', this.innerElement.normal);
							};

						
		// Trap the click and call it only if the button is enabled
		outerElement.trappedClick = outerElement.onclick;
		outerElement.onclick = undefined;
		if (outerElement.trappedClick !== null) {
			outerElement.addEventListener('click',function (e) {
					if (this.enabled) {
						this.trappedClick();
					}
				},false);
		}
        
	
	}
};
_bb10_activityIndicator = {
	apply: function(elements) {
		var i,
			outerElement,
			innerElement,
			indicator, 
			color = bb.screen.controlColor,
			size,
			width,
			swirl;

		if (elements.length > 0) {
			var canvas = document.createElement('canvas'),
				ctx,
				lingrad;
			// Create our color matched swirl
			canvas.setAttribute('height','184px');
			canvas.setAttribute('width', '184px');
			ctx = canvas.getContext('2d');
			ctx.beginPath();    
			ctx.moveTo(92,154);
			ctx.arcTo(154,154,154,92,62);
			ctx.arcTo(154,30,92,30,62);
			ctx.arcTo(81,30,81,20,10);
			ctx.arcTo(81,10,91,10,10);
			ctx.arcTo(173,10,173,92,82);
			ctx.arcTo(173,173,92,173,82);
			ctx.arcTo(81,173,81,164,10);
			ctx.arcTo(81,154,92,154,10);
			ctx.closePath();
			ctx.strokeStyle = 'transparent';
			ctx.stroke();
		 
			// Create our fill color
			var lingrad = ctx.createLinearGradient(0,50,0,154);
			lingrad.addColorStop(0, 'transparent');
			lingrad.addColorStop(1, bb.options.highlightColor);
			ctx.fillStyle = lingrad;
			ctx.fill();
			
			swirl = canvas.toDataURL();
		}
		
		for (i = 0; i < elements.length; i++)  {
			outerElement = elements[i];
			size = (outerElement.hasAttribute('data-bb-size')) ? outerElement.getAttribute('data-bb-size').toLowerCase() : 'medium';
			
			if (size == 'large') {
				if (bb.device.is1024x600) {
					width = '93px';
				} else if (bb.device.is1280x768 || bb.device.is1280x720) {
					width = '184px';
				}  else if (bb.device.is720x720) {
					width = '170px';
				}else {
					width = '184px';
				}
			} else if (size == 'small') {
				if (bb.device.is1024x600) {
					width = '21px';
				} else if (bb.device.is1280x768 || bb.device.is1280x720) {
					width = '41px';
				} else {
					width = '41px';
				}
			} else {
				size = 'medium';
				if (bb.device.is1024x600) {
					width = '46px';
				} else if (bb.device.is1280x768 || bb.device.is1280x720) {
					width = '93px';
				} else if (bb.device.is720x720) {
					width = '88px';
				}else {
					width = '93px';
				}
			}
			
			outerElement.style.width = width;
			// Add another div so that the developers styling on the original div is left untouched
			indicator = document.createElement('div');
			indicator.setAttribute('class',  'bb-activity-margin bb-activity-'+size+' bb-activity-'+color);
			outerElement.appendChild(indicator);
			innerElement = document.createElement('div');
			innerElement.setAttribute('class','bb-activity-'+size);
			innerElement.style['background-image'] = 'url("'+ swirl +'")';
			indicator.appendChild(innerElement);
			
			// Set our animation
			innerElement.style['-webkit-animation-name'] = 'activity-rotate';
			innerElement.style['-webkit-animation-duration'] = '0.8s';
			innerElement.style['-webkit-animation-iteration-count'] = 'infinite';
			innerElement.style['-webkit-animation-timing-function'] = 'linear';
			
						
			// Assign our show function
				outerElement.show = function(){ 
				this.style.display = '';
				bb.refresh();
			};
			outerElement.show = outerElement.show.bind(outerElement);
		
			// Assign our hide function
			outerElement.hide = function(){ 
				this.style.display = 'none';
				bb.refresh();
			};
			outerElement.hide = outerElement.hide.bind(outerElement);	
		
			// Assign our remove function
			outerElement.remove = function(){ 
				this.parentNode.removeChild(this);
				bb.refresh();
			};
			outerElement.remove = outerElement.remove.bind(outerElement);

		}
	}
}
_bb10_button = { 
    // Apply styling for a list of buttons
	apply: function(elements) {	
		for (var i = 0; i < elements.length; i++) {
			bb.button.style(elements[i]);
		}
	},
	// Style an individual button
	style: function(outerElement) {
		var disabledStyle,
			imgSrc,
			caption,
			imgElement,
			outerNormalWithoutImageOnly,
			highlight,
			captionElement = document.createElement('div'),
			innerElement = document.createElement('div');
			disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal = 'bb-button',
			outerNormal = 'bb-button-container bb-button-container-' + bb.screen.controlColor;

		if (bb.device.newerThan10dot1) {
			normal += ' bb-button-10dot2';
			outerNormal += ' bb-button-container-10dot2';
			highlight = 'bb-button bb-button-10dot2 bb-button-'+ bb.screen.controlColor + ' bb-button-'+ bb.screen.controlColor + '-highlight-10dot2';
		} else {
			highlight = 'bb-button bb10-button-highlight';
		}
		outerNormalWithoutImageOnly = outerNormal;	
		outerElement.isImageOnly = false;
		outerElement.enabled = !disabled;
		caption = outerElement.innerHTML;
		captionElement.innerHTML = caption;
		outerElement.innerHTML = '';
		outerElement.stretched = false;
		outerElement.captionElement = captionElement;
		outerElement.appendChild(innerElement);
		outerElement.innerElement = innerElement;
		
		if (outerElement.hasAttribute('data-bb-style')) {
			var style = outerElement.getAttribute('data-bb-style');
			if (style == 'stretch') {
				outerNormal = outerNormal + ' bb-button-stretch';
				outerElement.stretched = true;
			}
		}
		// look for our image
		imgSrc = outerElement.hasAttribute('data-bb-img') ? outerElement.getAttribute('data-bb-img') : undefined;
		if (imgSrc) {
			if (!caption || caption.length == 0) {
				if (bb.device.newerThan10dot1) {
					outerNormal = outerNormal + ' bb-button-container-image-only bb-button-caption-with-image-only_10dot2';
					captionElement.setAttribute('class','bb-button-caption-with-image-only bb-button-caption-with-image-only_10dot2');
				} else {
					outerNormal = outerNormal + ' bb-button-container-image-only';
					captionElement.setAttribute('class','bb-button-caption-with-image-only');
				}
				captionElement.style['background-image'] = 'url("'+imgSrc+'")';
				outerElement.style['line-height'] = '0px';
				
				outerElement.isImageOnly = true;
			} else {
				// Configure our caption element
				captionElement.setAttribute('class','bb-button-caption-with-image');
				imgElement = document.createElement('div');
				outerElement.imgElement = imgElement;
				if (bb.device.newerThan10dot1) {
					imgElement.setAttribute('class','bb-button-image bb-button-image-10dot2');
				} else {
					imgElement.setAttribute('class','bb-button-image');
				}
				
				imgElement.style['background-image'] = 'url("'+imgSrc+'")';
				innerElement.appendChild(imgElement);
			}
		}
		// Insert caption after determining what to do with the image
		innerElement.appendChild(captionElement);
	
		// Set our styles
		disabledStyle = normal + ' bb-button-disabled-'+bb.screen.controlColor;
		normal = normal + ' bb-button-' + bb.screen.controlColor;
		
		if (disabled) {
			outerElement.removeAttribute('data-bb-disabled');
			innerElement.setAttribute('class',disabledStyle);
		} else {
			innerElement.setAttribute('class',normal);
		}
		// Set our variables on the elements
		outerElement.setAttribute('class',outerNormal);
		outerElement.outerNormal = outerNormal;
		outerElement.outerNormalWithoutImageOnly = outerNormalWithoutImageOnly;
		outerElement.innerElement = innerElement;
		innerElement.normal = normal;
		innerElement.highlight = highlight;
		innerElement.disabledStyle = disabledStyle;
		if (!disabled) {
			outerElement.ontouchstart = function() {
									this.innerElement.setAttribute('class', this.innerElement.highlight);
									
								};
			outerElement.ontouchend = function() {
									this.innerElement.setAttribute('class', this.innerElement.normal);
								};
		}
						
		// Trap the click and call it only if the button is enabled
		outerElement.trappedClick = outerElement.onclick;
		outerElement.onclick = undefined;
		if (outerElement.trappedClick !== null) {
			outerElement.addEventListener('click',function (e) {
					if (this.enabled) {
						this.trappedClick();
					}
				},false);
		}
		
		// Assign our set caption function
		outerElement.setCaption = function(value) {
				if (this.isImageOnly && (value.length > 0)) {
					// Configure our caption element
					this.captionElement.setAttribute('class','bb-button-caption-with-image');
					var imgElement = document.createElement('div');
					this.imgElement = imgElement;
					imgElement.setAttribute('class','bb-button-image');
					imgElement.style['background-image'] = this.captionElement.style['background-image'];
					// Remove and re-order the caption element
					this.innerElement.removeChild(this.captionElement);
					this.innerElement.appendChild(imgElement);
					this.innerElement.appendChild(this.captionElement);
					// Reset our image only styling
					this.setAttribute('class',this.outerNormalWithoutImageOnly);
					this.captionElement.style['background-image'] = '';
					this.isImageOnly = false;
				} else if ((value.length == 0) && this.imgElement) {
					this.captionElement.setAttribute('class','bb-button-caption-with-image-only');
					// Reset our image only styling
					this.setAttribute('class',this.outerNormalWithoutImageOnly + ' bb-button-container-image-only');
					this.captionElement.style['background-image'] = this.imgElement.style['background-image'];
					this.isImageOnly = true;
					// Remove the image div
					this.innerElement.removeChild(this.imgElement);
					this.imgElement = null;
				}
				this.captionElement.innerHTML = value;
			};
			
		// Returns the caption of the button
		outerElement.getCaption = function() {
			return this.captionElement.innerHTML;
		};
		outerElement.getCaption = outerElement.getCaption.bind(outerElement);
			
		// Assign our set image function
		outerElement.setImage = function(value) {
				if (this.isImageOnly) {
					this.captionElement.style['background-image'] = 'url("'+value+'")';
				} else if (this.imgElement && (value.length > 0)) {
					this.imgElement.style['background-image'] = 'url("'+value+'")';
				} else if (value.length > 0){
					// Configure our caption element
					this.captionElement.setAttribute('class','bb-button-caption-with-image');
					var imgElement = document.createElement('div');
					this.imgElement = imgElement;
					imgElement.setAttribute('class','bb-button-image');
					imgElement.style['background-image'] = 'url("'+value+'")';
					// Remove and re-order the caption element
					this.innerElement.removeChild(this.captionElement);
					this.innerElement.appendChild(imgElement);
					this.innerElement.appendChild(this.captionElement);
				} else if (this.imgElement && (value.length == 0)){
					// Supplied an empty image value
					this.innerElement.removeChild(this.imgElement);
					this.imgElement = null;
					this.captionElement.setAttribute('class','');
				}
			};
			
		// Returns image url
		outerElement.getImage = function() {
			if (this.isImageOnly) {
				return this.captionElement.style['background-image'].slice(4, -1);
			} else if (this.imgElement) {
				return this.imgElement.style['background-image'].slice(4, -1);
			} else {
				return '';
			}
		};
		outerElement.getImage = outerElement.getImage.bind(outerElement);
		
		// Assign our enable function
		outerElement.enable = function(){ 
				if (this.enabled) return;
				this.innerElement.setAttribute('class', this.innerElement.normal);
				this.ontouchstart = function() {
									this.innerElement.setAttribute('class', this.innerElement.highlight);
									
								};
				this.ontouchend = function() {
									this.innerElement.setAttribute('class', this.innerElement.normal);
								};
				this.enabled = true;
			};
		outerElement.enable = outerElement.enable.bind(outerElement);
		
		// Assign our disable function
		outerElement.disable = function(){ 
				if (!this.enabled) return;
				this.innerElement.setAttribute('class', this.innerElement.disabledStyle);
				this.ontouchstart = null;
				this.ontouchend = null;
				this.enabled = false;
			};
		outerElement.disable = outerElement.disable.bind(outerElement);
		
		// Assign our show function
		outerElement.show = function(){ 
				this.style.display = this.stretched ? 'block' : 'inline-block';
				bb.refresh();
			};
		outerElement.show = outerElement.show.bind(outerElement);
		
		// Assign our hide function
		outerElement.hide = function(){ 
				this.style.display = 'none';
				bb.refresh();
			};
		outerElement.hide = outerElement.hide.bind(outerElement);	
		
		// Assign our remove function
		outerElement.remove = function(){ 
				this.parentNode.removeChild(this);
				bb.refresh();
			};
		outerElement.remove = outerElement.remove.bind(outerElement);

		return outerElement;
    }
};
_bb10_checkbox = {
	apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.checkbox.style(elements[i]);
		}
	},
	
	style: function(input) {
		var touchTarget, 
			outerElement,
			innerElement,
			checkElement,
			color = bb.screen.controlColor;
			
		// Outside touch target
		touchTarget = document.createElement('div');
		touchTarget.setAttribute('class','bb-checkbox-target');
		if (input.parentNode) {
			input.parentNode.insertBefore(touchTarget, input);
		}
		input.style.display = 'none';
		touchTarget.appendChild(input);
		touchTarget.input = input;
		input.touchTarget = touchTarget;
		// Main outer border of the control
		outerElement = document.createElement('div');
		outerElement.setAttribute('class', 'bb-checkbox-outer bb-checkbox-outer-'+color);
		touchTarget.appendChild(outerElement);
		// Inner check area
		innerElement = document.createElement('div');
		innerElement.normal = 'bb-checkbox-inner bb-checkbox-inner-'+color;
		innerElement.setAttribute('class', innerElement.normal);
		outerElement.appendChild(innerElement);
		// Create our check element with the image
		checkElement = document.createElement('div');
		checkElement.hiddenClass = 'bb-checkbox-check-hidden bb-checkbox-check-image';
		checkElement.displayClass = 'bb-checkbox-check-display bb-checkbox-check-image';
		checkElement.setAttribute('class',checkElement.hiddenClass);
		checkElement.style['-webkit-transition-property'] = 'all';
		checkElement.style['-webkit-transition-duration'] = '0.1s';
		innerElement.appendChild(checkElement);
		touchTarget.checkElement = checkElement;
		
		// Set our coloring for later
		touchTarget.innerElement = innerElement;
		touchTarget.highlight = '-webkit-linear-gradient(top,  rgb('+ (bb.options.shades.R + 32) +', '+ (bb.options.shades.G + 32) +', '+ (bb.options.shades.B + 32) +') 0%, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 100%)';
		touchTarget.touchHighlight = '-webkit-linear-gradient(top,  rgba('+ (bb.options.shades.R - 64) +', '+ (bb.options.shades.G - 64) +', '+ (bb.options.shades.B - 64) +',0.25) 0%, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +',0.25) 100%)';

		touchTarget.ontouchstart = function() {
						if (!this.input.checked && !this.input.disabled) {	
							// Do our touch highlight
							this.innerElement.style.background = this.touchHighlight;
						}
					};
		touchTarget.ontouchend = function() {
						if (!this.input.checked && !this.input.disabled) {
							this.innerElement.style.background = '';
						}
					};
		touchTarget.onclick = function() {
						if (!this.input.disabled) {
						var evObj = document.createEvent('HTMLEvents');
						evObj.initEvent('change', false, true );
						// Set our checked state
						this.input.checked = !this.input.checked;
						this.drawChecked();
						this.input.dispatchEvent(evObj);
						}				
					};						
		touchTarget.drawChecked = function() {
						if (this.input.checked) {
							this.checkElement.setAttribute('class',this.checkElement.displayClass);
							this.innerElement.style['background-image'] = touchTarget.highlight;
						} else {
							this.checkElement.setAttribute('class',this.checkElement.hiddenClass);
							this.innerElement.style['background-image'] = '';
						}
						if (this.input.disabled){
							this.innerElement.parentNode.setAttribute('class', 'bb-checkbox-outer bb-checkbox-outer-disabled-'+color);
							this.innerElement.setAttribute('class', 'bb-checkbox-inner bb-checkbox-inner-disabled-'+color);
							this.innerElement.style.background = '#c0c0c0';
						} else{
							this.innerElement.parentNode.setAttribute('class', 'bb-checkbox-outer bb-checkbox-outer-'+color);
							this.innerElement.setAttribute('class', 'bb-checkbox-inner bb-checkbox-inner-'+color);
						}				
					};
		touchTarget.drawChecked = touchTarget.drawChecked.bind(touchTarget);
		
		// Add our set Checked function
		input.setChecked = function(value) {
					if (value == this.checked) return;
					this.checked = value;
					this.touchTarget.drawChecked();
				};
		input.setChecked = input.setChecked.bind(input);
		
		// Add our get Checked function
		input.getChecked = function() {
					return this.checked;
				};
		input.getChecked = input.getChecked.bind(input);
		
		// Add our enable function
		input.enable = function(){ 
			this.removeAttribute('disabled');
			this.enabled = true;
			this.touchTarget.drawChecked();
		};
		input.enable = input.enable.bind(input);
		
		// Add our disable function
		input.disable = function(){ 
			this.enabled = false;
			this.setAttribute('disabled','disabled');	
			this.touchTarget.drawChecked();			
		};
		input.disable = input.disable.bind(input);
		
		// Add our show function
		input.show = function(){ 
			this.touchTarget.style.display = 'block';
			bb.refresh();
		};
		input.show = input.show.bind(input);
		
		// Add our hide function
		input.hide = function(){ 
			this.touchTarget.style.display = 'none';
			bb.refresh();
		};
		input.hide = input.hide.bind(input);
		
		// Add our remove function
		input.remove = function(){ 
			this.touchTarget.parentNode.removeChild(this.touchTarget);
			bb.refresh();
		};
		input.remove = input.remove.bind(input);
		
		// Set our initial state
		touchTarget.drawChecked();	
		
		return touchTarget;
	}
};
// BlackBerry 10 Context Menu
_bb10_contextMenu = {

	actionIds : [],  // Stores all the action ids for the global context menu


	// Create an instance of the menu and pass it back to the caller
	create : function(screen) {
	
		var menu = document.createElement('div');
		menu.style.display = 'none';
		menu.actions = [];
		
		// Handle our context open event
		menu.oncontextmenu = function(contextEvent) {
				this.centerMenuItems();
				
				var node = contextEvent.srcElement,
					found = false,
					bbuiType = '',
					data;
				while (node) {
					if (node.hasAttribute) {
						bbuiType = node.hasAttribute('data-bb-type') ? node.getAttribute('data-bb-type').toLowerCase() : undefined;
						if (bbuiType == 'item') {
							// Make sure it has the webworks attribute
							found = node.hasAttribute('data-webworks-context');
							break;
						} 
					}
					node = node.parentNode;
				}
				// If we found our item then we highlight it
				if (found) {
					node.drawSelected();
					data = node.getAttribute('data-webworks-context');
					data = JSON.parse(data);
					this.selected = {
							title : data.header,
							description : data.subheader,
							selected : node
						};
				} else {
					contextEvent.preventDefault();
				}
				blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);				
			};
		menu.oncontextmenu = menu.oncontextmenu.bind(menu);
		window.addEventListener('contextmenu', menu.oncontextmenu);
		bb.windowListeners.push({name: 'contextmenu', eventHandler: menu.oncontextmenu});

		// Handle our context closed event
		menu.oncontextmenuclosed = function(contextEvent) {
				if (this.selected && this.selected.selected) {
					this.selected.selected.drawUnselected();
				}
				blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
			};
		menu.oncontextmenuclosed = menu.oncontextmenuclosed.bind(menu);
		document.addEventListener('bbui.contextClosed', menu.oncontextmenuclosed);
		bb.documentListeners.push({name: 'bbui.contextClosed', eventHandler: menu.oncontextmenuclosed});
		
		
		// Add a menu item
		menu.add = function(action) {
				this.actions.push(action);
				this.appendChild(action);
				var menuItem = {
						actionId: bb.guidGenerator(),
						label: action.innerHTML,
						icon: action.getAttribute('data-bb-img')
					};
				// Assign a pointer to the menu item
				bb.contextMenu.actionIds.push(menuItem.actionId);
				action.pinned = false;
				action.menuItem = menuItem;
				action.menu = this;
				action.visible = action.hasAttribute('data-bb-visible') ? (action.getAttribute('data-bb-visible').toLowerCase() != 'false') : true;
				
				// Check for the pinned item
				if (action.hasAttribute('data-bb-pin') && (action.getAttribute('data-bb-pin').toLowerCase() == 'true')) {
					action.pinned = true;
				}
				// Handle the click of the menu item
				action.doclick = function(id) {
					var element = document.querySelectorAll('[data-bb-context-menu-id='+ id +']'),
							data;
					if (element.length > 0) {
						element = element[0];
						data = element.getAttribute('data-webworks-context');
						data = JSON.parse(data);
						this.menu.selected = {
							title : data.header,
							description : data.subheader,
							selected : element
						};
						var evt = document.createEvent('MouseEvents'); 
                        evt.initMouseEvent('click', true, true, window,
                            0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        action.dispatchEvent(evt);
					}
				};
				action.doclick = action.doclick.bind(action);
				
				// Handle the show
				action.show = function() {
					if (this.visible) return;
					this.visible = true;
					this.removeAttribute('data-bb-visible');
				}
				action.show = action.show.bind(action);
				
				// Handle the hide
				action.hide = function() {
					if (!this.visible) return;
					this.visible = false;
					this.setAttribute('data-bb-visible','false');
				}
				action.hide = action.hide.bind(action);
			};
		menu.add = menu.add.bind(menu);
		
		// This function refreshes the menu witht the current state
		menu.centerMenuItems = function() {
				var contexts = [blackberry.ui.contextmenu.CONTEXT_ALL],
					i,
					pinnedAction = false,
					action,
					options = {
						includeContextItems: [blackberry.ui.contextmenu.CONTEXT_ALL],
						includePlatformItems: false,
						includeMenuServiceItems: false
					};
					
				// See if we have a pinned action
				for (i = 0; i < this.actions.length; i++) {
					action = this.actions[i];
					if (action.visible && action.pinned) {
						options.pinnedItemId = action.menuItem.actionId;
					}
				}
				// First clear any items that exist
				this.clearWWcontextMenu();
				// Define our custom context
				blackberry.ui.contextmenu.defineCustomContext('bbui-context',options);
				
				// Add our visible context menu items
				for (i = this.actions.length -1; i >= 0;i--) {
					action = this.actions[i];
					if (action.visible) {
						blackberry.ui.contextmenu.addItem(contexts, action.menuItem, action.doclick);
					}
				}
			};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
		// This function clears all the items from the context menu.  Typically
		// called internally when the screen is popped
		menu.clearWWcontextMenu = function() {
				var contexts = [blackberry.ui.contextmenu.CONTEXT_ALL],
					i,
					actionId;
				for (i = 0; i < bb.contextMenu.actionIds.length;i++) {
					blackberry.ui.contextmenu.removeItem(contexts, bb.contextMenu.actionIds[i]);
				}
			};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
		menu.show = function() {
				// Do nothing, just here for compatibility
			};
		menu.show = menu.show.bind(menu);
		
		menu.peek = function() {
				// Do nothing, just here for compatibility
			};
		menu.peek = menu.peek.bind(menu);
		
		return menu;
	}
};
_bb10_dropdown = { 
    // Apply our transforms to all dropdowns passed in
    apply: function(elements) {
		for (i = 0; i < elements.length; i++) {
			bb.dropdown.style(elements[i]);
		}
	},
	// Apply our styling to an individual dropdown
	style: function(select) {
		var img,
			i,j,
			innerElement,
			innerContainer,
			buttonOuter,
			dropdown,
			labelElement,
			captionElement,
			itemsElement,
			focusedHighlight,
			enabled = !select.hasAttribute('disabled'),
			normal = 'bb-dropdown bb-dropdown-' + bb.screen.controlColor,
			highlight = 'bb-dropdown bb-dropdown-highlight-'+ bb.screen.controlColor,  
			outerContainerStyle = 'bb-dropdown-container bb-dropdown-container-' + bb.screen.controlColor,
			innerContainerStyle = 'bb-dropdown-container-inner bb-dropdown-container-inner-'+bb.screen.controlColor,
			innerButtonStyle = 'bb-dropdown-inner bb-dropdown-inner-'+bb.screen.controlColor;

		if (bb.device.newerThan10dot1) {
			outerContainerStyle += ' bb-dropdown-container-10dot2';
			innerContainerStyle += ' bb-dropdown-container-inner-10dot2';
			innerButtonStyle += ' bb-dropdown-inner-10dot2';
			focusedHighlight = highlight + ' bb10Highlight';
			highlight += ' bb-dropdown-' + bb.screen.controlColor + '-highlight-10dot2';
		} else {
			highlight += ' bb10Highlight';
		}
			
		// Make the existing <select> invisible so that we can hide it and create our own display
		select.style.display = 'none';
		select.enabled = enabled;

		// Create the dropdown container and insert it where the select was
		dropdown = document.createElement('div');
		dropdown.select = select;
		dropdown.items = [];
		dropdown.setAttribute('data-bb-type','dropdown');
		select.dropdown = dropdown;
		if (select.parentNode) {
			select.parentNode.insertBefore(dropdown, select);
		}
		// Insert the select as an invisible node in the new dropdown element
		dropdown.appendChild(select);
		
		// Create the innerContainer for the dual border
		innerContainer = document.createElement('div');
		innerContainer.setAttribute('class',innerContainerStyle);
		dropdown.appendChild(innerContainer);
		
		if (select.hasAttribute('data-bb-style')) {
			var style = select.getAttribute('data-bb-style');
			if (style == 'stretch') {
				normal = normal + ' bb-dropdown-stretch';
				highlight = highlight + ' bb-dropdown-stretch';
			}
		}
		
		// Create our button container for the outer part of the dual border
		buttonOuter = document.createElement('div');
		if (select.enabled) {
			buttonOuter.setAttribute('class',normal);
		} else {
			buttonOuter.setAttribute('class',normal + ' bb-dropdown-disabled-'+bb.screen.controlColor);
		}
		innerContainer.appendChild(buttonOuter);
		
		// Create the inner button element
		innerElement = document.createElement('div');
		innerElement.setAttribute('class',innerButtonStyle);
		buttonOuter.appendChild(innerElement);

		// Create the optinal label for the dropdown
		labelElement = document.createElement('div');
		dropdown.labelElement = labelElement;
		labelElement.setAttribute('class','bb-dropdown-label');
		if (select.hasAttribute('data-bb-label')) {
			labelElement.innerHTML = select.getAttribute('data-bb-label');
		}
		innerElement.appendChild(labelElement);
		
		// Create our dropdown arrow
		img = document.createElement('div');
		if (bb.device.newerThan10dot1) {
			img.normal = 'bb-dropdown-arrow-'+bb.screen.controlColor + ' bb-dropdown-arrow-10dot2';
			img.highlight = 'bb-dropdown-arrow-dark bb-dropdown-arrow-10dot2';
		} else {
			img.normal = 'bb-dropdown-arrow-'+bb.screen.controlColor;
		}
		img.setAttribute('class',img.normal);
		innerElement.appendChild(img);
		dropdown.img = img;
		
		// Create the caption for the dropdown
		captionElement = document.createElement('div');
		dropdown.captionElement = captionElement;
		if (bb.device.newerThan10dot1) {
			captionElement.setAttribute('class','bb-dropdown-caption bb-dropdown-caption-10dot2');
		} else {
			captionElement.setAttribute('class','bb-dropdown-caption');
		}
		innerElement.appendChild(captionElement);
		
		// Create the scrolling area
		var scrollArea = document.createElement('div');
		scrollArea.style.position = 'relative';
		scrollArea.style['margin-top'] = '10px';
		scrollArea.style.overflow = 'hidden';
		innerContainer.appendChild(scrollArea);
		var innerScroller = document.createElement('div');
		scrollArea.appendChild(innerScroller);
		
		// Create our drop down items
		itemsElement = document.createElement('div');
		dropdown.itemsElement = itemsElement;
		itemsElement.setAttribute('class','bb-dropdown-items');
		innerScroller.appendChild(itemsElement);
		
		dropdown.refreshOptions = function() {
					var options = select.getElementsByTagName('option'),
						caption = '',
						option,
						item,
						textContainer, textAlign, primaryText, accentText;
						
					// First clear any existing items
					this.itemsElement.innerHTML = '';
					this.items = [];
					this.options = options;
					
					// Grab all the select options
					for (j = 0; j < options.length; j++) {
						option = options[j];
						item = document.createElement('div');
						this.items.push(item);
						item.selectedStyle = 'bb-dropdown-item bb-dropdown-item-'+bb.screen.controlColor+' bb-dropdown-item-selected-'+ bb.screen.controlColor;
						item.normalStyle = 'bb-dropdown-item bb-dropdown-item-'+bb.screen.controlColor;
						item.index = j;
						item.select = this.select;
						item.dropdown = this;
						if (!item.dropdown.selected) {
							item.dropdown.selected = item;
						}
						// Append primary text node
						primaryText = document.createElement('div');
                        primaryText.setAttribute('class', 'primary-text');
                        primaryText.innerHTML = option.innerHTML;
						textContainer = document.createElement('div');
                        textContainer.setAttribute('class', 'text-container');
                        textContainer.appendChild(primaryText);

                        // Needed for vertical alignment to work
                        textAlign = document.createElement('span');
                        textAlign.setAttribute('class', 'text-align');
                        item.appendChild(textAlign);
                        item.appendChild(textContainer);

						this.itemsElement.appendChild(item);
						
                        // Accent text for additional cues about this option
						if (option.hasAttribute('data-bb-accent-text')) {
							accentText = document.createElement('div');
							accentText.setAttribute('class','accent-text');
							accentText.innerHTML = option.getAttribute('data-bb-accent-text');
							item.accentText = accentText;
							textContainer.appendChild(accentText);
						}
						
						// Create the image
						img = document.createElement('div');
						img.setAttribute('class','bb-dropdown-selected-image-'+bb.screen.controlColor);
						item.img = img;
						item.appendChild(img);
						
						// See if it was specified as the selected item
						if (option.hasAttribute('selected') || option.selected) {
							caption = option.innerHTML;
							item.setAttribute('class',item.selectedStyle);
							img.style.visibility = 'visible';
							item.dropdown.selected = item;
						} else {
							item.setAttribute('class',item.normalStyle);
						}
						// Assign our item handlers
						item.ontouchstart = function(event) {
												this.style['background-color'] = bb.options.highlightColor;
												this.style['color'] = 'white';
												if (this.accentText) {
													this.accentText.style['color'] = 'white';
												}
											};
						
						item.ontouchend = function(event) {
												this.style['background-color'] = 'transparent';
												this.style['color'] = '';
												if (this.accentText) {
													this.accentText.style['color'] = '';
												}
											};			
						item.onclick = function() {
											this.select.setSelectedItem(this.index);
									   };
					}
					
					// Get our selected item in case they haven't specified "selected";
					if ((caption == '') && (options.length > 0)) {
						caption = options[0].innerHTML;
					}
					
					if (caption != '') {
						captionElement.innerHTML = caption;
					}
				};
		dropdown.refreshOptions = dropdown.refreshOptions.bind(dropdown);
			
		// Load the options
		dropdown.refreshOptions();
			
		// set our outward styling
		dropdown.setAttribute('class',outerContainerStyle);
		dropdown.buttonOuter = buttonOuter;
		dropdown.isRefreshed = false;
		dropdown.caption = captionElement;
		buttonOuter.dropdown = dropdown;
		dropdown.open = false;
		buttonOuter.normal = normal;
		buttonOuter.highlight = highlight;
		buttonOuter.focusedHighlight = focusedHighlight;

		// Create our scroller
		dropdown.scroller = new iScroll(scrollArea, {vScrollbar: false,
							onBeforeScrollStart: function (e) {
								if (bb.scroller) {
									bb.scroller.disable();
								}
								e.preventDefault();
							}, 
							onBeforeScrollEnd: function(e) {
								if (bb.scroller) {
									bb.scroller.enable();
								}
							}});
		bb.dropdownScrollers.push(dropdown.scroller);
		dropdown.scrollArea = scrollArea;
		
		// Assign our touch handlers to out-most div
		buttonOuter.dotouchstart = function(event) {
								this.setAttribute('class', this.highlight);
							};
		buttonOuter.dotouchend = function(event) {
								this.setAttribute('class', this.normal);
							};
		buttonOuter.doclick = function(event) {
								if (!this.dropdown.open) {
									this.dropdown.internalShow();
								} else {
									this.dropdown.internalHide();
								}
							};
		// Assign our touch handlers if it is enabled					
		if (select.enabled) {
			buttonOuter.ontouchstart = buttonOuter.dotouchstart;
			buttonOuter.ontouchend = buttonOuter.dotouchend;
			buttonOuter.onclick = buttonOuter.doclick;
		}
		
		// Show the combo-box			
		dropdown.internalShow = function() {
								var scrollHeight;
								this.open = true;
								// Figure out how many items to show
								if (bb.device.is720x720 && (this.options.length > 4)) {
									this.numItems = 3;
								} else if (this.options.length > 5) {
									this.numItems = 5;
								} else {
									this.numItems = this.options.length;
								}
								
								if (bb.device.is1024x600) {
									scrollHeight = (this.numItems * 43);
									this.style.height = 45 + scrollHeight +'px';
								} else if (bb.device.is1280x768 || bb.device.is1280x720) {
									scrollHeight = (this.numItems * 99);
									this.style.height = 95 + scrollHeight +'px';
								} else if (bb.device.is720x720) {
									scrollHeight = (this.numItems * 85);
									this.style.height = 77 + scrollHeight +'px';
								}else {
									scrollHeight = (this.numItems * 99);
									this.style.height = 95 + scrollHeight +'px';
								}
								
								// Refresh our scroller based on the height only once
								this.scrollArea.style.height = scrollHeight - 10 + 'px';
								if (!this.isRefreshed) {
									this.scroller.refresh();
									this.isRefreshed = true;
								}
								this.scroller.scrollToElement(this.selected,0);
								
								// Animate our caption change
								this.caption.style.opacity = '0.0';
								this.caption.style['-webkit-transition'] = 'opacity 0.5s linear';
								this.caption.style['-webkit-backface-visibility'] = 'hidden';
								this.caption.style['-webkit-perspective'] = 1000;
								this.caption.style['-webkit-transform'] = 'translate3d(0,0,0)';
								  
								// Animate our arrow
								this.img.style.opacity = '1.0';
								if (bb.device.newerThan10dot1) {
									this.img.setAttribute('class',this.img.highlight);
									this.img.style['-webkit-transition'] = 'all 0.2s linear';
									this.img.style['-webkit-transform'] = 'rotate(-360deg)';
									this.buttonOuter.setAttribute('class',this.buttonOuter.focusedHighlight);
									this.buttonOuter.style.color = 'white';
								} else {
									this.img.style['-webkit-transform'] = 'rotate(-360deg)';
									this.img.style['-webkit-transition'] = 'all 0.5s ease-in-out';
								}
								
								// Refresh our screen srolling height
								if (bb.scroller) {
									bb.scroller.refresh();
								}
								// Scroll the dropdown into view if it's bottom is off the screen
								this.scrollIntoView(false);
								
							};
		dropdown.internalShow = dropdown.internalShow.bind(dropdown);
		// Collapse the combo-box
		dropdown.internalHide = function() {
								this.open = false;
								this.style.height = '59px';
								
								if (bb.device.is1024x600) {
									this.style.height = '43px';
								} else if (bb.device.is1280x768) {
									this.style.height = bb.device.newerThan10dot1 ? '88px' : '95px';
								} else if (bb.device.is720x720) {
									this.style.height = bb.device.newerThan10dot1 ? '70px' : '77px';
								} else if (bb.device.is1280x720 && bb.device.newerThan10dot1 && (window.devicePixelRatio < 1.9)) {
									this.style.height = '76px';
								}else {
									this.style.height = '95px';
								}
								
								// Animate our caption change
								this.caption.style.opacity = '1.0';
								this.caption.style['-webkit-transition'] = 'opacity 0.5s linear';
								this.caption.style['-webkit-backface-visibility'] = 'hidden';
								this.caption.style['-webkit-perspective'] = 1000;
								
								// Animate our arrow
								if (bb.device.newerThan10dot1) {
									this.img.setAttribute('class',this.img.normal);
									this.img.style['-webkit-transform'] = 'rotate(-180deg)';
									this.img.style['-webkit-transition'] = 'all 0.2s linear';
									this.buttonOuter.setAttribute('class',this.buttonOuter.normal);
									this.buttonOuter.style.color = '';
								} else {
									this.img.style.opacity = '0.0';
									this.img.style['-webkit-transform'] = 'rotate(0deg)';
									this.img.style['-webkit-transition'] = 'all 0.5s ease-in-out';
								}
																
								// Refresh our screen srolling height
								if (bb.scroller) {
									bb.scroller.refresh();
								}
							};
		dropdown.internalHide = dropdown.internalHide.bind(dropdown);

		// Assign our functions to be able to set the value
		select.setSelectedItem = function(index) {
			if (this.selectedIndex != index) {
				var item = this.dropdown.items[index];
				if (!item) return;
				// Style the previously selected item as no longer selected
				if (this.dropdown.selected) {
					this.dropdown.selected.setAttribute('class',item.normalStyle);
					this.dropdown.selected.img.style.visibility = 'hidden';
				}
				// Style this item as selected
				item.setAttribute('class',item.selectedStyle);
				item.img.style.visibility = 'visible';
				this.dropdown.selected = item;
				// Set our index and fire the event
				this.selectedIndex = index;
				this.dropdown.caption.innerHTML = this.options[index].text;
				this.dropdown.internalHide();
				window.setTimeout(this.fireEvent,0);
			}
		};
		select.setSelectedItem = select.setSelectedItem.bind(select);
		
		// Assign our setSelectedText function
		select.setSelectedText = function(text) {
			for (var i = 0; i < this.options.length; i++) {
				if (this.options[i].text == text) {
					this.setSelectedItem(i);
					return;
				}
			}
		};
		select.setSelectedText = select.setSelectedText.bind(select);
		
		// Have this function so we can asynchronously fire the change event
		select.fireEvent = function() {
							// Raise the DOM event
							var evObj = document.createEvent('HTMLEvents');
							evObj.initEvent('change', false, true );
							this.dispatchEvent(evObj);
						};
		select.fireEvent = select.fireEvent.bind(select);
		
		// Assign our enable function
		select.enable = function(){ 
				if (this.enabled) return;
				this.dropdown.buttonOuter.ontouchstart = this.dropdown.buttonOuter.dotouchstart;
				this.dropdown.buttonOuter.ontouchend = this.dropdown.buttonOuter.dotouchend;
				this.dropdown.buttonOuter.onclick = this.dropdown.buttonOuter.doclick;
				this.dropdown.buttonOuter.setAttribute('class',normal);
				this.removeAttribute('disabled');
				this.enabled = true;
			};
		select.enable = select.enable.bind(select);
		
		// Assign our disable function
		select.disable = function(){ 
				if (!select.enabled) return;
				this.dropdown.internalHide();
				this.dropdown.buttonOuter.ontouchstart = null;
				this.dropdown.buttonOuter.ontouchend = null;
				this.dropdown.buttonOuter.onclick = null;
				this.dropdown.buttonOuter.setAttribute('class',normal + ' bb-dropdown-disabled-'+bb.screen.controlColor);
				this.enabled = false;
				this.setAttribute('disabled','disabled');
			};
		select.disable = select.disable.bind(select);
		
			
		// Assign our show function
		select.show = function(){ 
				this.dropdown.style.display = 'block';
				bb.refresh();
			};
		select.show = select.show.bind(select);
		
		// Assign our hide function
		select.hide = function(){ 
				this.dropdown.style.display = 'none';
				bb.refresh();
			};
		select.hide = select.hide.bind(select);	
		
		// Assign our remove function
		select.remove = function(){ 
				this.dropdown.parentNode.removeChild(this.dropdown);
				bb.refresh();
			};
		select.remove = select.remove.bind(select);
		
		// Assign our refresh function
		select.refresh = function(){ 
				this.dropdown.internalHide();
				this.dropdown.isRefreshed = false;
				this.dropdown.refreshOptions();
			};
		select.refresh = select.refresh.bind(select);
	  
		// Assign our setCaption function
		select.setCaption = function(value){ 
				this.dropdown.labelElement.innerHTML = value;
				this.setAttribute('data-bb-label',value);
			};
		select.setCaption = select.setCaption.bind(select);
		
		// Assign our setCaption function
		select.getCaption = function(){ 
				return this.dropdown.labelElement.innerHTML;
			};
		select.getCaption = select.getCaption.bind(select);
		
		// Need to return the dropdown instead of the select for dynamic styling
		return dropdown;
    }
};

_bb10_fileInput = {

	apply: function(elements) {
		var i,
			outerElement,
			btn,
			span;
		
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			outerElement.setAttribute('class','bb-file-button');
			btn = document.createElement('div');
			btn.setAttribute('data-bb-type','button');
			btn.innerHTML = outerElement.hasAttribute('data-bb-caption') ? outerElement.getAttribute('data-bb-caption') : 'Choose File';
			btn.origCaption = btn.innerHTML;
			// Apply our styling
			bb.button.apply([btn]);
			btn.input = outerElement;
			// Add the button and insert the file input as an invisible node in the new button element
			outerElement.parentNode.insertBefore(btn, outerElement);
			btn.appendChild(outerElement);
			
			// Handle the file change
			btn.handleChange = function() {
				if ( this.input.value) {
					this.setCaption(this.input.value.replace(/^.*[\\\/]/, ''));
				
				} else {
					this.setCaption(this.origCaption);
				}
			};
			btn.handleChange = btn.handleChange.bind(btn);
			outerElement.addEventListener('change',btn.handleChange,false);
		}
	}
};
_bb10_grid = {  
    apply: function(elements) {
		var solidHeader = false,
			headerJustify;
	
		// Apply our transforms to all grids
		for (var i = 0; i < elements.length; i++) {
			var j,
				items,
				type,
				title,
				innerChildNode,
				contextMenu,
				outerElement = elements[i];
				
			outerElement.setAttribute('class','bb-grid');	
			// See if it is square or landscape layout
			outerElement.isSquare = (outerElement.hasAttribute('data-bb-style') && outerElement.getAttribute('data-bb-style').toLowerCase() == 'square');
			
			// Get our header style
			solidHeader = outerElement.hasAttribute('data-bb-header-style') ? (outerElement.getAttribute('data-bb-header-style').toLowerCase() == 'solid') : false;
			// Get our header justification
			headerJustify = outerElement.hasAttribute('data-bb-header-justify') ? outerElement.getAttribute('data-bb-header-justify').toLowerCase() : 'center';
			
			// Assign our context menu if there is one
			if (outerElement.hasAttribute('data-bb-context') && outerElement.getAttribute('data-bb-context').toLowerCase() == 'true') {
				contextMenu = bb.screen.contextMenu;
			}
			
			// Gather our inner items
			items = outerElement.querySelectorAll('[data-bb-type=group], [data-bb-type=row]');
			for (j = 0; j < items.length; j++) {
				innerChildNode = items[j];
				if (innerChildNode.hasAttribute('data-bb-type')) {
				
					type = innerChildNode.getAttribute('data-bb-type').toLowerCase();
					if (type == 'group' && innerChildNode.hasAttribute('data-bb-title')) {
						title = document.createElement('div');
						title.normal = 'bb-grid-header';
						title.innerHTML = '<p>'+ innerChildNode.getAttribute('data-bb-title') +'</p>';
						
						// Style our header for appearance
						if (solidHeader) {
							title.normal = title.normal +' bb10Accent';
							title.style.color = 'white';
							title.style['border-bottom-color'] = 'transparent';
						} else {
							title.normal = title.normal + ' bb-grid-header-normal-'+bb.screen.listColor;
							title.style['border-bottom-color'] = bb.options.shades.darkOutline;
						}
						
						// Style our header for text justification
						if (headerJustify == 'left') {
							title.normal = title.normal + ' bb-grid-header-left';
						} else if (headerJustify == 'right') {
							title.normal = title.normal + ' bb-grid-header-right';
						} else {
							title.normal = title.normal + ' bb-grid-header-center';
						}
						
						title.setAttribute('class', title.normal);
						
						if (innerChildNode.firstChild) {
							innerChildNode.insertBefore(title, innerChildNode.firstChild);
						} else {
							innerChildNode.appendChild(title);
						}
					}
					else if (type == 'row') {
						var k,
							table,
							columnCount = 0,
							tr,
							td,
							numItems,
							itemNode,
							subtitle,
							image,
							overlay,
							subtitle,
							height,
							width,
							hasOverlay,
							hardCodedColumnNum = -1, // none specified
							rowItems = innerChildNode.querySelectorAll('[data-bb-type=item]'),
							json;
						
						numItems = rowItems.length;
						if (numItems == 0) continue;
						
						// See if they specified the number of items per column
						if (innerChildNode.hasAttribute('data-bb-columns')) {
							hardCodedColumnNum = innerChildNode.getAttribute('data-bb-columns');
						}
						
						table = document.createElement('table');
						table.style.width = '100%';
						innerChildNode.appendChild(table);
						tr = document.createElement('tr');
						table.appendChild(tr);

						// Calculate the width
						if (hardCodedColumnNum > 0) {
							// If there are more items than the number of hardcoded columns then
							// we need to shrink the item size a bit to show that there are available
							// items to the left to scroll to
							if ((rowItems.length > hardCodedColumnNum) && !bb.device.isPlayBook) {
								innerChildNode.style['overflow-y'] = 'hidden';
								innerChildNode.style['overflow-x'] = 'scroll';
								width = (window.innerWidth/(parseInt(hardCodedColumnNum) + 0.5));
							} else {
								width = (window.innerWidth/hardCodedColumnNum) - 6;
							}
						} else {
							width = (window.innerWidth/numItems) - 6;
						}
												
						for (k = 0; k < numItems; k++) {
							itemNode = rowItems[k];
							
							// If it is PlayBook, Don't do the carousel, it doesn't work well
							if (bb.device.isPlayBook && (hardCodedColumnNum >0) && (k > hardCodedColumnNum - 1)) {
								itemNode.style.display = 'none';
								continue;
							}
														
							subtitle = itemNode.innerHTML;
							title = itemNode.getAttribute('data-bb-title');
							hasOverlay = (subtitle || title);
							itemNode.innerHTML = '';
							// Add our cell to the table
							td = document.createElement('td');
							tr.appendChild(td);
							td.appendChild(itemNode);
							columnCount++;							
							
							// Find out how to size the images
							if (outerElement.isSquare) {
								height = width;
							} else {
								height = Math.ceil(width*0.5625);
							}
							// Set our dimensions
							itemNode.style.width = width + 'px';
							itemNode.style.height = height + 'px';

							// Create our display image
							image = document.createElement('img');
							image.style.height = height + 'px';
							image.style.width = width + 'px';
							image.style.opacity = '0';
							image.style['-webkit-transition'] = 'opacity 0.5s linear';
							image.style['-webkit-transform'] = 'translate3d(0,0,0)';
							image.itemNode = itemNode;
							itemNode.image = image;
							itemNode.appendChild(image);
							
							// Load our image once onbbuidomready 
							itemNode.onbbuidomready = function() {
										if (bb.isScrolledIntoView(this)) {
											// Animate its visibility once loaded
											this.image.onload = function() {
												this.style.opacity = '1.0';
											}
											this.image.src = this.getAttribute('data-bb-img');
										} else {
											document.addEventListener('bbuiscrolling', this.onbbuiscrolling,false);
											// Add listener for removal on popScreen
											this.listener = {name: 'bbuiscrolling', eventHandler: this.onbbuiscrolling};
											bb.documentListeners.push(this.listener);
										}
										document.removeEventListener('bbuidomready', this.onbbuidomready,false);
									};
							itemNode.onbbuidomready = itemNode.onbbuidomready.bind(itemNode);
							document.addEventListener('bbuidomready', itemNode.onbbuidomready,false);
							
							// Only have the image appear when it scrolls into view
							itemNode.onbbuiscrolling = function() {
										if (bb.isScrolledIntoView(this)) {
											// Animate its visibility once loaded
											this.image.onload = function() {
												this.style.opacity = '1.0';
											}
											this.image.src = this.getAttribute('data-bb-img');
											document.removeEventListener('bbuiscrolling', this.onbbuiscrolling,false);
											// Remove our listenter from the global list as well
											var index = bb.documentListeners.indexOf(this.listener);
											if (index >= 0) {
												bb.documentListeners.splice(index,1);
											}
										} 
									};
							itemNode.onbbuiscrolling = itemNode.onbbuiscrolling.bind(itemNode);	
							
							// Create our translucent overlay
							if (hasOverlay) {
								overlay = document.createElement('div');
								if (title && subtitle) {
									overlay.setAttribute('class','bb-grid-item-overlay bb-grid-item-overlay-two-rows');
									overlay.innerHTML = '<div><p class="title title-two-rows">' + title + '<br/>' + subtitle +'</p></div>';	
								} else if (title){
									overlay.setAttribute('class','bb-grid-item-overlay bb-grid-item-overlay-one-row');
									overlay.innerHTML = '<div><p class="title title-one-row">' + title + '</p></div>';
								} else if (subtitle) {
									overlay.setAttribute('class','bb-grid-item-overlay bb-grid-item-overlay-one-row');
									overlay.innerHTML = '<div><p class="title title-one-row">' + subtitle + '</p></div>';
								}
								itemNode.appendChild(overlay);
							} else {
								overlay = null;
							}
							
							// Setup our variables
							itemNode.overlay = overlay;
							itemNode.title = title;
							itemNode.description = subtitle;
							itemNode.fingerDown = false;
							itemNode.contextShown = false;
							itemNode.contextMenu = contextMenu;
							
							// See if a context menu needs to be assigned
							if (itemNode.contextMenu) {
								itemNode.guid = 'bbui'+bb.guidGenerator();
								itemNode.setAttribute('data-bb-context-menu-id', itemNode.guid);
								json = new Object();
								json.id = itemNode.guid;
								json.type = 'bbui-context';
								json.header = itemNode.title;
								json.subheader = itemNode.description;
								itemNode.setAttribute('data-webworks-context', JSON.stringify(json));
							}	
							
							itemNode.ontouchstart = function() {
														if (this.overlay) {
															this.overlay.style['opacity'] = '1.0';
							                                this.overlay.style['background-color'] = bb.options.highlightColor;
														}
														itemNode.fingerDown = true;
														itemNode.contextShown = false;
														if (itemNode.contextMenu && (bb.device.isPlayBook || bb.device.isRipple)) {
															window.setTimeout(this.touchTimer, 667);
															var scr = bb.getCurScreen();
															itemNode.touchstartx = scr.bbUIscrollWrapper.scrollTop;
														}
													};
							itemNode.ontouchend = function() {
														if (this.overlay) {
															this.overlay.style['opacity'] = '';
							                                this.overlay.style['background-color'] = '';
														}
														itemNode.fingerDown = false;
														if (itemNode.contextShown) {
															event.preventDefault();
															event.stopPropagation();
														}
													};
							itemNode.touchTimer = function() {
														if (bb.device.isPlayBook || bb.device.isRipple) {
															var scr = bb.getCurScreen();
															var curx = scr.bbUIscrollWrapper.scrollTop;
															if (itemNode.fingerDown && Math.abs(itemNode.touchstartx - curx) < 50) {
																itemNode.contextShown = true;
																itemNode.contextMenu.peek({title:this.title,description:this.description, selected: this});
															}
														}
													};
							itemNode.touchTimer = itemNode.touchTimer.bind(itemNode);
							
							// Draw the selected state based on the BB10 context menu
							itemNode.drawSelected = function() {
														if (this.overlay) {
															this.overlay.style['opacity'] = '1.0';
							                                this.overlay.style['background-color'] = bb.options.highlightColor;
														}
													};
							itemNode.drawSelected = itemNode.drawSelected.bind(itemNode);
							
							// Draw the Unselected state based on the BB10 context menu
							itemNode.drawUnselected = function() {
														if (this.overlay) {
															this.overlay.style['opacity'] = '';
							                                this.overlay.style['background-color'] = '';
														}
													};
							itemNode.drawUnselected = itemNode.drawUnselected.bind(itemNode);
						}
						
						// if there were hardcoded columns and not enough items to fit those columns, add the extra columns
						if ((hardCodedColumnNum > 0) && (columnCount < hardCodedColumnNum)) {
							var diff = hardCodedColumnNum - columnCount;
							innerChildNode.extraColumns = [];
							for (k = 0; k < diff; k++) {
								td = document.createElement('td');
								tr.appendChild(td);
								td.style.width = width + 'px';
								innerChildNode.extraColumns.push(td);
							}
						}
					}
				}
			}
			
			// Make sure we move when the orientation of the device changes
			outerElement.orientationChanged = function(event) {
									var items = this.querySelectorAll('[data-bb-type=row]'),
										i,j,
										rowItems,
										row,
										numItems,
										itemNode,
										width,
										height;
				
									for (i = 0; i < items.length; i++) {
										var hardCodedColumnNum = -1;
										row = items[i];
										rowItems = row.querySelectorAll('[data-bb-type=item]');
										numItems = rowItems.length;
										
										// See if they specified the number of items per column
										if (row.hasAttribute('data-bb-columns')) {
											hardCodedColumnNum = row.getAttribute('data-bb-columns');
										}

										// Calculate the width
										if (hardCodedColumnNum > 0) {
											// If there are more items than the number of hardcoded columns then
											// we need to shrink the item size a bit to show that there are available
											// items to the left to scroll to
											if ((rowItems.length > hardCodedColumnNum) && !bb.device.isPlayBook) {
												width = (window.innerWidth/(parseInt(hardCodedColumnNum) + 0.5));
											} else {
												width = (window.innerWidth/hardCodedColumnNum) - 6;
											}
										} else {
											width = (window.innerWidth/numItems) - 6;
										}
										// Adjust all the items
										for (j = 0; j < numItems; j++ ) {
											itemNode = rowItems[j];
											if (outerElement.isSquare) {
												height = width;
											} else {
												height = Math.ceil(width*0.5625);
											}
											// Animate our image and container
											itemNode.image.style.height = height+'px';
											itemNode.image.style.width = width + 'px';
											itemNode.image.style['-webkit-transition-property'] = 'all';
											itemNode.image.style['-webkit-transition-duration'] = '0.2s';
											itemNode.image.style['-webkit-transition-timing-function'] = 'linear';
											itemNode.image.style['-webkit-transform'] = 'translate3d(0,0,0)';
											itemNode.style.width = width+'px';
											itemNode.style.height = height+'px';
											itemNode.style['-webkit-transition-property'] = 'all';
											itemNode.style['-webkit-transition-duration'] = '0.2s';
											itemNode.style['-webkit-transition-timing-function'] = 'linear';
											itemNode.style['-webkit-transform'] = 'translate3d(0,0,0)';
										}
										
										// Adjust the extra columns if there was hard coded columns that were not filled
										if (row.extraColumns) {
											for (j = 0; j < row.extraColumns.length;j++) {
												row.extraColumns[j].style.width = width + 'px';
											}
										}
									}
								};
			outerElement.orientationChanged = outerElement.orientationChanged.bind(outerElement);	
			window.addEventListener('resize', outerElement.orientationChanged,false); 
			// Add listener for removal on popScreen
			bb.windowListeners.push({name: 'resize', eventHandler: outerElement.orientationChanged});
			
			// Add show function
			outerElement.show = function() {
				this.style.display = 'block';
				bb.refresh();
				};
			outerElement.show = outerElement.show.bind(outerElement);

			// Add hide function
			outerElement.hide = function() {
				this.style.display = 'none';
				bb.refresh();
				};
			outerElement.hide = outerElement.hide.bind(outerElement);
	
			// Add remove function
			outerElement.remove = function() {
				this.parentNode.removeChild(this);
				bb.refresh();
				};
			outerElement.remove = outerElement.remove.bind(outerElement);
		}		
    }
};
_bb10_imageList = {  
    apply: function(elements) {
		var i,j,
			outerElement,
			items;

		// Apply our transforms to all Image Lists
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			outerElement.items = [];
			outerElement.setAttribute('class','bb-image-list');
			outerElement.hideImages = outerElement.hasAttribute('data-bb-images') ? (outerElement.getAttribute('data-bb-images').toLowerCase() == 'none') : false;
			if (!outerElement.hideImages) {
				outerElement.imagePlaceholder = outerElement.hasAttribute('data-bb-image-placeholder') ? outerElement.getAttribute('data-bb-image-placeholder') : undefined;
				outerElement.imageLoading = outerElement.hasAttribute('data-bb-image-loading') ? outerElement.getAttribute('data-bb-image-loading') : undefined;
			}
			
			// See what kind of style they want for this list
			outerElement.listStyle = outerElement.hasAttribute('data-bb-style') ? outerElement.getAttribute('data-bb-style').toLowerCase() : 'default';
			
			// Get our header style
			outerElement.solidHeader = outerElement.hasAttribute('data-bb-header-style') ? (outerElement.getAttribute('data-bb-header-style').toLowerCase() == 'solid') : false;
			// Get our header justification
			outerElement.headerJustify = outerElement.hasAttribute('data-bb-header-justify') ? outerElement.getAttribute('data-bb-header-justify').toLowerCase() : 'center';
			
			// Assign our context menu if there is one
			if (outerElement.hasAttribute('data-bb-context') && outerElement.getAttribute('data-bb-context').toLowerCase() == 'true') {
				outerElement.contextMenu = bb.screen.contextMenu;
			}
			
			// Style an item
			outerElement.styleItem = function(innerChildNode) {
				if (innerChildNode.hasAttribute('data-bb-type')) {
					// Figure out the type of item
					var type = innerChildNode.getAttribute('data-bb-type').toLowerCase(),
						description = innerChildNode.innerHTML,
						title,
						overlay,
						accentText,
						img,
						details,
						detailsClass,
						descriptionDiv,
						btn,
						btnBorder,
						highlight,
						normal,
						btnInner,
						json;
					
					innerChildNode.btn = undefined;

					if (type == 'header') {
						// Set our normal and highlight styling
						normal = 'bb-image-list-header';
						if (this.solidHeader) {
							normal = normal +' bb10Accent';
							innerChildNode.style.color = 'white';
							innerChildNode.style['border-bottom-color'] = 'transparent';
						} else {
							normal = normal + ' bb-image-list-header-normal-'+bb.screen.listColor;
							innerChildNode.style['border-bottom-color'] = bb.options.shades.darkOutline;
						}
						
						// Check for alignment
						if (this.headerJustify == 'left') {
							normal = normal + ' bb-image-list-header-left';
						} else if (this.headerJustify == 'right') {
							normal = normal + ' bb-image-list-header-right';
						} else {
							normal = normal + ' bb-image-list-header-center';
						}
						
						// Set our styling
						innerChildNode.normal = normal;
						innerChildNode.innerHTML = '<p>'+ description +'</p>';
						innerChildNode.setAttribute('class', normal);
					}
					else if (type == 'item') {
						normal = 'bb-image-list-item bb-image-list-item-' + bb.screen.listColor;
						highlight = normal + ' bb-image-list-item-hover bb10Highlight';
						innerChildNode.normal = normal;
						innerChildNode.highlight = highlight;
						innerChildNode.setAttribute('class', normal);
						innerChildNode.innerHTML = '';
						img = undefined;
			
						// Create the details container
						details = document.createElement('div');
						details.innerChildNode = innerChildNode;
						innerChildNode.details = details;
						innerChildNode.appendChild(details);
						detailsClass = 'bb-image-list-item-details';
						if (this.hideImages) {
							detailsClass = detailsClass + ' bb-image-list-item-noimage';
						} else {
							img = new Image();
							innerChildNode.img = img;
							if (this.imagePlaceholder) {
								img.placeholder = this.imagePlaceholder;
								img.path = innerChildNode.hasAttribute('data-bb-img') ? innerChildNode.getAttribute('data-bb-img') : this.imagePlaceholder;
							} else {
								img.path = innerChildNode.getAttribute('data-bb-img');
							}
							// Handle our loaded image
							innerChildNode.onimageload = function() {
									this.details.style['background-image'] = 'url("'+this.img.src+'")';
									innerChildNode.details.style['background-size'] = '';
									// Unassign this image so that it is removed from memory and replace it with its path
									this.img = this.img.src;
								};
							innerChildNode.onimageload = innerChildNode.onimageload.bind(innerChildNode);
							img.onload = innerChildNode.onimageload;
							
							if (this.imagePlaceholder) {
								// Handle our error state
								innerChildNode.onimageerror = function() {
									if (this.img.src == this.img.placeholder) return;
									this.img.src = this.img.placeholder;
								};
								innerChildNode.onimageerror = innerChildNode.onimageerror.bind(innerChildNode);
								img.onerror = innerChildNode.onimageerror;
							}
							// Add our loading image
							if (this.imageLoading) {
								innerChildNode.details.style['background-image'] = 'url("'+this.imageLoading+'")';
								// Hack to adjust background sizes for re-paint issues in webkit
								if (bb.device.is1024x600) {
									innerChildNode.details.style['background-size'] = '64px 65px';
								} else if (bb.device.is1280x768 || bb.device.is1280x720) {
									innerChildNode.details.style['background-size'] = '109px 110px';
								} else if (bb.device.is720x720) {
									innerChildNode.details.style['background-size'] = '92px 93px';
								}else {
									innerChildNode.details.style['background-size'] = '109px 110px';
								}
							}
							img.src = img.path;
						}
						
						// Create our title
						title = document.createElement('div');
						title.setAttribute('class','title');
						title.innerHTML = innerChildNode.getAttribute('data-bb-title');
						details.title = title;
						if (title.innerHTML.length == 0) {
							title.innerHTML = '&nbsp;';
						}
						details.appendChild(title);
						
						// Create our description
						descriptionDiv = document.createElement('div');
						descriptionDiv.setAttribute('class','description bb-image-list-description-'+bb.screen.listColor);
						details.description = descriptionDiv;
						details.appendChild(descriptionDiv);
						
						// Add our highlight overlay
						overlay = document.createElement('div');
						overlay.setAttribute('class','bb-image-list-item-overlay');
						innerChildNode.appendChild(overlay);
						
						// See if we need the button area
						if ((this.listStyle == 'arrowlist') || (this.listStyle == 'arrowbuttons') || (this.listStyle == 'addbuttons') || (this.listStyle == 'removebuttons')) {
							btn = document.createElement('div');
							innerChildNode.appendChild(btn);
							innerChildNode.btn = btn;
							btn.outerElement = this;
							btn.innerChildNode = innerChildNode;
							
							// Assign our event if one exists
							if (innerChildNode.onbtnclick) {
								btn.onbtnclick = innerChildNode.onbtnclick;
							}
							else if (innerChildNode.hasAttribute('onbtnclick')) {
								innerChildNode.onbtnclick = innerChildNode.getAttribute('onbtnclick');
								btn.onbtnclick = function() {
												eval(this.innerChildNode.onbtnclick);
											};
							} 
							
							// Set the margins to show the button area
							detailsClass = detailsClass + ' details-button-margin';
							btn.setAttribute('class','button');
							// Create the button border
							btnBorder = document.createElement('div');
							btnBorder.normal = 'bb-image-list-item-button-border bb-image-list-item-button-'+ bb.screen.listColor;
							btnBorder.setAttribute('class',btnBorder.normal);
							btn.btnBorder = btnBorder;
							btn.appendChild(btnBorder);
							// Create the inner button that has the image
							btnInner = document.createElement('div');
							btnInner.normal = 'bb-image-list-item-button-inner';
							btnInner.highlight = btnInner.normal;
							btn.btnInner = btnInner;
							btnBorder.appendChild(btnInner);
							
							if (this.listStyle !== 'arrowlist') {
								if (this.listStyle == 'arrowbuttons') {
									btnInner.normal = btnInner.normal + ' bb-image-list-item-chevron-'+bb.screen.listColor;
									btnInner.highlight = btnInner.highlight + ' bb-image-list-item-chevron-dark';
								}
								else if (this.listStyle == 'addbuttons') {
									btnInner.normal = btnInner.normal + ' bb-image-list-item-add-'+bb.screen.listColor;
									btnInner.highlight = btnInner.highlight + ' bb-image-list-item-add-dark';
								}
								else if (this.listStyle == 'removebuttons') {
									btnInner.normal = btnInner.normal + ' bb-image-list-item-remove-'+bb.screen.listColor;
									btnInner.highlight = btnInner.highlight + ' bb-image-list-item-remove-dark';
								}		
								
								// Assign our touch handlers
								btn.ontouchstart = function() {
												if (!this.onbtnclick) return;
												this.btnInner.setAttribute('class',this.btnInner.highlight);
												this.btnBorder.style.background = '-webkit-gradient(linear, center top, center bottom, from(rgb(' + (bb.options.shades.R + 32) +',' + (bb.options.shades.G + 32) + ','+ (bb.options.shades.B + 32) +')), to('+bb.options.highlightColor+'))';
											};
											
								btn.ontouchend = function() {
												if (!this.onbtnclick) return;
												this.btnBorder.style.background = '';
												this.btnInner.setAttribute('class',this.btnInner.normal);
											};
								
								// Assign our click handler if one was available
								btn.onclick = function(e) {
												e.stopPropagation();
												if (this.onbtnclick) {
													this.outerElement.selected = this.innerChildNode;
													this.onbtnclick();
												}
											}
								
								
							} else { // Arrow list
								btnInner.normal = btnInner.normal + ' bb-image-list-item-chevron-'+bb.screen.listColor;
								btnBorder.style['background'] = 'transparent';
								btnBorder.style['border-color'] = 'transparent';
							}	
							
							// Set our class
							btnInner.setAttribute('class',btnInner.normal);								
						} else {
							// Create the accent text
							if (innerChildNode.hasAttribute('data-bb-accent-text')) {
								accentText = document.createElement('div');
								accentText.setAttribute('class','accent-text bb-image-list-accent-text-'+bb.screen.listColor);
								accentText.innerHTML = innerChildNode.getAttribute('data-bb-accent-text');
								details.appendChild(accentText);
								details.accentText = accentText;
							}
						}
						
						// Adjust the description 
						if (description.length == 0) {
							description = '&nbsp;';
							descriptionDiv.style.visibilty = 'hidden';
							detailsClass = detailsClass + ' bb-image-list-item-details-nodescription';
							
							// Adjust margins
							if (bb.device.is1024x600) {
								title.style['margin-top'] = '16px';
								title.style['padding-top'] = '28px';
								overlay.style['margin-top'] = '-94px';
								if (innerChildNode.btn) {
									innerChildNode.btn.style['margin-top'] = '-59px';
								}
							} else if (bb.device.is1280x768 || bb.device.is1280x720) {
								title.style['margin-top'] = '-7px';
								title.style['padding-top'] = '20px';
								overlay.style['margin-top'] = '-140px';
								if (innerChildNode.btn) {
									innerChildNode.btn.style['margin-top'] = '-102px';
								}
							} else if (bb.device.is720x720) {
								title.style['margin-top'] = '-14px';
								title.style['padding-top'] = '20px';
								overlay.style['margin-top'] = '-133px';
								if (innerChildNode.btn) {
									innerChildNode.btn.style['margin-top'] = '-89px';
								}
							}else {
								title.style['margin-top'] = '-7px';
								title.style['padding-top'] = '20px';
								overlay.style['margin-top'] = '-121px';
								if (innerChildNode.btn) {
									innerChildNode.btn.style['margin-top'] = '-102px';
								}
							}
							// Adjust accent text
							if (accentText) {
								if (bb.device.is1024x600) {
									accentText.style['margin-top'] = '-52px';
								} else if (bb.device.is1280x768 || bb.device.is1280x720) {
									accentText.style['margin-top'] = '-82px';
								} else if (bb.device.is720x720) {
									accentText.style['margin-top'] = '-75px';
								} else {
									accentText.style['margin-top'] = '-82px';
								}
							}
						}
						descriptionDiv.innerHTML = description;
						
						
						// Apply our details class
						details.setAttribute('class',detailsClass);
						
						// Set up our variables
						innerChildNode.fingerDown = false;
						innerChildNode.contextShown = false;
						innerChildNode.overlay = overlay;
						innerChildNode.contextMenu = this.contextMenu;
						innerChildNode.description = description;
						innerChildNode.title = title.innerHTML;	
						
						innerChildNode.ontouchstart = function () {
														if (bb.device.isPlayBook) {
															if (!innerChildNode.trappedClick && !this.contextMenu) return;
															innerChildNode.fingerDown = true;
															innerChildNode.contextShown = false;
															this.overlay.style['visibility'] = 'visible';
															if (innerChildNode.contextMenu) {
																window.setTimeout(this.touchTimer, 667);
																var scr = bb.getCurScreen();
																innerChildNode.touchstartx = scr.bbUIscrollWrapper.scrollTop;
															}
														}
													};
						innerChildNode.ontouchend = function (event) {
														if (bb.device.isPlayBook) {
															if (!innerChildNode.trappedClick && !this.contextMenu) return;
															this.overlay.style['visibility'] = 'hidden';
															innerChildNode.fingerDown = false;
															if (innerChildNode.contextShown) {
																event.preventDefault();
																event.stopPropagation();
															}
														}
													};
						innerChildNode.touchTimer = function() {
														if (bb.device.isPlayBook) {
															var scr = bb.getCurScreen();
															var curx = scr.bbUIscrollWrapper.scrollTop;
															if (innerChildNode.fingerDown && Math.abs(innerChildNode.touchstartx - curx) < 50) {
																innerChildNode.contextShown = true;
																this.drawSelected();
																innerChildNode.contextMenu.hideEvents.push(this.finishHighlight);
																innerChildNode.contextMenu.peek({title:this.title,description:this.description, selected: this});
															}
														}
													};
						innerChildNode.touchTimer = innerChildNode.touchTimer.bind(innerChildNode);
						// Draw the selected state for the context menu
						innerChildNode.drawSelected = function() {
														this.setAttribute('class',this.highlight);
														this.overlay.style['visibility'] = 'visible';
														this.overlay.style['border-color'] =  bb.options.shades.darkOutline;
													};
						innerChildNode.drawSelected = innerChildNode.drawSelected.bind(innerChildNode);
						// Draw the unselected state for the context menu
						innerChildNode.drawUnselected = function() {
														this.setAttribute('class',this.normal);
														this.overlay.style['visibility'] = 'hidden';
														this.overlay.style['border-color'] =  'transparent';
													};
						innerChildNode.drawUnselected = innerChildNode.drawUnselected.bind(innerChildNode);
						
						// See if a context menu needs to be assigned
						if (this.contextMenu) {
							innerChildNode.guid = 'bbui'+bb.guidGenerator();
							innerChildNode.setAttribute('data-bb-context-menu-id', innerChildNode.guid);
							json = new Object();
							json.id = innerChildNode.guid;
							json.type = 'bbui-context';
							json.header = innerChildNode.title;
							if (innerChildNode.description && (innerChildNode.description != '&nbsp;')) {
								json.subheader = innerChildNode.description;
							}
							innerChildNode.setAttribute('data-webworks-context', JSON.stringify(json));
						}	
						
						// Add our subscription for click events to change highlighting on click
						innerChildNode.trappedClick = innerChildNode.onclick;
						innerChildNode.onclick = undefined;
						innerChildNode.outerElement = this;
						innerChildNode.addEventListener('click',function (e) {
								if (!innerChildNode.trappedClick) return;
								this.outerElement.selected = this;
								if (this.trappedClick) {
									setTimeout(this.trappedClick, 0);
								}
							},false);
							
						// Finish the highlight on a delay
						innerChildNode.finishHighlight = function() {
													if (bb.screen.animating) {
														setTimeout(this.finishHighlight,250);
													} else {
														this.setAttribute('class',this.normal);
													}
												};
						innerChildNode.finishHighlight = innerChildNode.finishHighlight.bind(innerChildNode);	

						// Add the remove function for the item
						innerChildNode.remove = function() {
								this.style.height = '0px';
								this.style.opacity = '0.0';
								this.style['-webkit-transition-property'] = 'all';
								this.style['-webkit-transition-duration'] = '0.1s';
								this.style['-webkit-transition-timing-function'] = 'linear';
								this.style['-webkit-transform'] = 'translate3d(0,0,0)';
								if (bb.scroller) {
									bb.scroller.refresh();
								}
								window.setTimeout(this.details.performRemove,100);
							}
						innerChildNode.remove = innerChildNode.remove.bind(innerChildNode);	
						
						// Perform the final remove after the transition effect
						details.performRemove = function() {
								var listControl = this.innerChildNode.parentNode,
									index = listControl.items.indexOf(this.innerChildNode);
								listControl.removeChild(this.innerChildNode);
								listControl.items.splice(index,1);									
						}
						details.performRemove = details.performRemove.bind(details);	
						
						// Add our getter functions
						innerChildNode.getTitle = function() {
								return this.title;
							}
						innerChildNode.getTitle = innerChildNode.getTitle.bind(innerChildNode);	
						innerChildNode.getDescription = function() {
								return this.details.description.innerHTML;
							}
						innerChildNode.getDescription = innerChildNode.getDescription.bind(innerChildNode);	
						innerChildNode.getAccentText = function() {
								return (this.details.accentText) ? this.details.accentText.innerHTML : undefined;
							}
						innerChildNode.getAccentText = innerChildNode.getAccentText.bind(innerChildNode);	
						innerChildNode.getImage = function() {
								return this.img;
							}
						innerChildNode.getImage = innerChildNode.getImage.bind(innerChildNode);
					}
				}
			}
			outerElement.styleItem = outerElement.styleItem.bind(outerElement);
			
			// Append an item to the end of the list control
			outerElement.appendItem = function(item) {
					this.styleItem(item);
					this.appendChild(item);
					this.items.push(item);
					// Fire our list event
					var evt = document.createEvent('Events');
					evt.initEvent('bbuilistready', true, true);
					document.dispatchEvent(evt);
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
			outerElement.appendItem = outerElement.appendItem.bind(outerElement);
			
			// This is a hack function to do with a 10.0 repaint issue for divs in an overflow with touch scroll
			outerElement.resetPadding = function() {
					this.style['padding-right'] = '0px';
					this.timeout = null;
				};
			outerElement.resetPadding = outerElement.resetPadding.bind(outerElement);
			
			// Refresh all the items in the list control
			outerElement.refresh = function(listItems) {
					if (!listItems || !listItems.length || (listItems.length <=0)) return;
					var i,
						item,
						innerDiv = document.createElement('div');
					this.items = [];
					for (i = 0; i < listItems.length; i++) {
						item = listItems[i];
						this.styleItem(item);
						this.items.push(item);
						innerDiv.appendChild(item);
					}
					// Refresh the 
					this.innerHTML = '';
					this.appendChild(innerDiv);		

					// Fire our list event
					var evt = document.createEvent('Events');
					evt.initEvent('bbuilistready', true, true);
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
					/* ********** END OF THE SCROLLING HACK ************/
				};
			outerElement.refresh = outerElement.refresh.bind(outerElement);
			
			// Insert an item before another item in the list
			outerElement.insertItemBefore = function(newItem, existingItem) {
					this.styleItem(newItem);
					this.insertBefore(newItem,existingItem);
					this.items.splice(this.items.indexOf(existingItem),0,newItem);
					// Fire our list event
					var evt = document.createEvent('Events');
					evt.initEvent('bbuilistready', true, true);
					document.dispatchEvent(evt);
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
			outerElement.insertItemBefore = outerElement.insertItemBefore.bind(outerElement);
			
			// Return the items in the list in a read-only fashion
			outerElement.getItems = function() {
					var i,
						result = [];
						for (i = 0; i < this.items.length;i++) {
							result.push(this.items[i]);
						}	
					return result;
				};
			outerElement.getItems = outerElement.getItems.bind(outerElement);
			
			// Clear items from the list
			outerElement.clear = function() {
					this.items = [];
					outerElement.innerHTML = '';
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
			outerElement.clear = outerElement.clear.bind(outerElement);
			
			// Add our show function
			outerElement.show = function() {
				this.style.display = 'block';
				bb.refresh();
					};
			outerElement.show = outerElement.show.bind(outerElement);
			
			// Add our hide function
			outerElement.hide = function() {
				this.style.display = 'none';
				bb.refresh();
					};
			outerElement.hide = outerElement.hide.bind(outerElement);
			
			// Add remove function
			outerElement.remove = function() {
				this.parentNode.removeChild(this);
				bb.refresh();
					};
			outerElement.remove = outerElement.remove.bind(outerElement);			
			
			// Gather our inner items and style them
			items = outerElement.querySelectorAll('[data-bb-type=item], [data-bb-type=header]');
			var item;
			for (j = 0; j < items.length; j++) {
				item = items[j];
				outerElement.styleItem(item);
				outerElement.items.push(item);
			}
		}	
	}
};
_bb10_labelControlContainers = {
    apply: function(elements) {
		var i,
			outerElement,
			items,
			table,
			j,
			row,
			tr,
			tdLabel,
			label,
			tdControl,
			control,
			bbType;
		
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			// Fetch all our rows
			items = outerElement.querySelectorAll('[data-bb-type=row]');
			if (items.length > 0 ) {
				// Create our containing table
				table = document.createElement('table');
				table.setAttribute('class','bb-label-control-rows');
				outerElement.insertBefore(table,items[0]);
				
				for (j = 0; j < items.length; j++) {
					row = items[j];
					tr = document.createElement('tr');
					tr.setAttribute('class','bb-label-control-label-row');
					table.appendChild(tr);
					
					// Get the label
					tdLabel = document.createElement('td');
					tr.appendChild(tdLabel);
					label = row.querySelectorAll('[data-bb-type=label]')[0];
					label.setAttribute('class','bb-label-control-label');
					row.removeChild(label);
					tdLabel.appendChild(label);
					
					// Get the control
					tr = document.createElement('tr');
					table.appendChild(tr);
					tdControl = document.createElement('td');
					tr.appendChild(tdControl);
					control = row.querySelectorAll('[data-bb-type=button],[data-bb-type=input],[data-bb-type=dropdown],textarea,input[type=file]')[0];
					if (control) {
						row.removeChild(control);
						tdControl.appendChild(control);
					}
					outerElement.removeChild(row);
				}
			}
			// Add show function
			outerElement.show = function() {
				this.style.display = 'block';
				bb.refresh();
				};
			outerElement.show = outerElement.show.bind(outerElement);

			// Add hide function
			outerElement.hide = function() {
				this.style.display = 'none';
				bb.refresh();
				};
			outerElement.hide = outerElement.hide.bind(outerElement);
	
			// Add remove function
			outerElement.remove = function() {
				this.parentNode.removeChild(this);
				bb.refresh();
				};
			outerElement.remove = outerElement.remove.bind(outerElement);
		}	
    }
};
_bb10_pillButtons = {  
    apply: function(elements) {
		var i,
			outerElement;
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			bb.pillButtons.style(outerElement, true);
		}
	},
	
	style: function(outerElement, offdom) {
		var i,
			containerStyle = 'bb-pill-buttons-container bb-pill-buttons-container-' + bb.screen.controlColor,
			buttonStyle = 'bb-pill-button',
			containerDiv,
			innerBorder,
			items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
			percentWidth = Math.floor(100 / items.length),
			sidePadding = 10,
			innerChildNode,
			table,
			tr,
			td,
			j;
		
		outerElement.sidePadding = sidePadding;
		outerElement.setAttribute('class','bb-pill-buttons');
		containerDiv = document.createElement('div');
		outerElement.appendChild(containerDiv);
		containerDiv.setAttribute('class',containerStyle);
		// Set our selected color
		outerElement.selectedColor = (bb.screen.controlColor == 'dark') ? '#909090' : '#555555';
		
		// Create our selection pill
		pill = document.createElement('div');
		pillInner = document.createElement('div');
		pill.appendChild(pillInner);
		pill.setAttribute('class',buttonStyle + ' bb-pill-button-selected-'+ bb.screen.controlColor + ' bb-pill-buttons-pill');
		pillInner.setAttribute('class','bb-pill-button-inner bb-pill-button-inner-selected-'+bb.screen.controlColor);
		pill.style.opacity = '0';
		outerElement.pill = pill;
		containerDiv.appendChild(pill);
					
		// Set our left and right padding
		outerElement.style['padding-left'] = sidePadding + 'px';
		outerElement.style['padding-right'] = sidePadding + 'px';
		
		// create our containing table
		table = document.createElement('table');
		outerElement.table = table;
		tr = document.createElement('tr');
		table.tr = tr;
		table.appendChild(tr);
		table.setAttribute('class','bb-pill-buttons-table');
		table.style.opacity = '0';
		containerDiv.appendChild(table);				
		
		// Style an indiviual button
		outerElement.styleButton = function(innerChildNode) {
				innerChildNode.isSelected = false;
				// Create our inner container to have double borders
				innerBorder = document.createElement('div');
				innerBorder.innerHTML = innerChildNode.innerHTML;
				innerChildNode.innerHTML = '';
				innerChildNode.appendChild(innerBorder);
				// Set our variables
				innerChildNode.border = innerBorder;
				innerChildNode.outerElement = outerElement;
				if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
					innerChildNode.isSelected = true;
					outerElement.selected = innerChildNode;
					innerChildNode.style.color = outerElement.selectedColor;
				} 
				// Set our styling
				innerChildNode.setAttribute('class',buttonStyle);
				innerBorder.setAttribute('class','bb-pill-button-inner');
				innerChildNode.style['z-index'] = 4;
				innerChildNode.style.width = '100%';
				// Set our touch start					
				innerChildNode.dotouchstart = function(e) {
											if (this.isSelected) return;
											// Turn of the selected state of the last item
											var lastSelected = this.outerElement.selected;
											lastSelected.style.color = '';	
											// change color of the pill if it is light coloring
											if (bb.screen.controlColor == 'light') {
												this.outerElement.pill.style['background-color'] = '#DDDDDD';
											}
											this.outerElement.setPillLeft(this);
										};
				innerChildNode.dotouchstart = innerChildNode.dotouchstart.bind(innerChildNode);
				// Set our touch end					
				innerChildNode.dotouchend = function(e) {
											if (this.isSelected) return;
											
											// Reset the old selected
											var lastSelected = this.outerElement.selected;
											lastSelected.isSelected = false;
											
											// Select this item's state
											this.isSelected = true;
											this.outerElement.selected = this;
											this.style.color = this.outerElement.selectedColor;
											
											// Remove color styling from pill if light
											if (bb.screen.controlColor == 'light') {
												this.outerElement.pill.style['background-color'] = '';
											}
											
											// Raise the click event. Need to do it this way to match the
											// Cascades selection style in pill buttons
											var ev = document.createEvent('MouseEvents');
											ev.initMouseEvent('click', true, true);
											ev.doClick = true;
											this.dispatchEvent(ev);
										};
				innerChildNode.dotouchend = innerChildNode.dotouchend.bind(innerChildNode);
				// Tie it to mouse events in ripple, and touch events on devices
				if (bb.device.isRipple) {
					innerChildNode.onmousedown = innerChildNode.dotouchstart;	
					innerChildNode.onmouseup = innerChildNode.dotouchend;
				} else {
					innerChildNode.ontouchstart = innerChildNode.dotouchstart;	
					innerChildNode.ontouchend = innerChildNode.dotouchend;
				}
				// Prevent the default click unless we want it to happen
				innerChildNode.addEventListener('click',function (e) { 
							e.stopPropagation();
						}, true);
						
				// setCaption function
				innerChildNode.setCaption = function(value){ 
					this.border.innerHTML = value;
			    };
				innerChildNode.setCaption = innerChildNode.setCaption.bind(innerChildNode);
				
				// getCaption function, returns null if no button
				innerChildNode.getCaption = function(){ 
					return this.border.innerHTML;
			    };
				innerChildNode.getCaption = innerChildNode.getCaption.bind(innerChildNode); 
						
				return innerChildNode;
			};
		outerElement.styleButton = outerElement.styleButton.bind(outerElement);
		
		// Loop through all our buttons
		for (j = 0; j < items.length; j++) {
			innerChildNode = items[j];
			innerChildNode = outerElement.styleButton(innerChildNode);
			// Create our cell
			td = document.createElement('td');
			tr.appendChild(td);
			td.appendChild(innerChildNode);
			td.style.width = percentWidth + '%';
		}
		// Determine our pill widths based on size
		outerElement.recalculateSize = function() {
					var items = this.table.querySelectorAll('td'),
						totalWidth = parseInt(window.getComputedStyle(this).width) - this.sidePadding,
						itemWidth = Math.floor((totalWidth - (items.length * 4)) /items.length) + 'px', // Accounting for margins
						i;
					for (i = 0; i < items.length; i++) {
						items[i].style.width = itemWidth;
					}
					// Size our table and pill
					this.table.style.width = totalWidth + 'px';
					this.pill.style.width = itemWidth;
				};
		outerElement.recalculateSize = outerElement.recalculateSize.bind(outerElement);	
		
		// Set our pill left
		outerElement.setPillLeft = function(element) {
					if (!element) {
						element = this.selected;
						// Nothing was marked as selected so select the first button
						if (!element) {
							var items = this.table.querySelectorAll('[data-bb-type=pill-button]');
							if (items.length > 0) {
								element = items[0];
								this.selected = element;
							}
						}
					}
					if (element) {
						this.pill.style['-webkit-transform'] = 'translate3d(' + element.parentNode.offsetLeft + 'px,0px,0px)';
					}
				};
		outerElement.setPillLeft = outerElement.setPillLeft.bind(outerElement);	
		
		// Initialize the control
		outerElement.initialize = function() {
					this.recalculateSize();
					this.setPillLeft();
					// Fade in our sized elements
					this.table.style.opacity = '1';
					this.table.style['-webkit-transition'] = 'opacity 0.1s linear';
					this.pill.style.opacity = '1';
				};
		outerElement.initialize = outerElement.initialize.bind(outerElement);	
		
		if (offdom) {
			// Create our event handler for when the dom is ready
			outerElement.onbbuidomready = function() {
						this.initialize();
						document.removeEventListener('bbuidomprocessed', this.onbbuidomready,false);
					};
			outerElement.onbbuidomready = outerElement.onbbuidomready.bind(outerElement);
			/* Add our event listener for the domready to move our selected item.  We want to
		      do it this way because it will ensure the screen transition animation is finished before
		      the pill button move transition happens. This will help for any animation stalls/delays */
			document.addEventListener('bbuidomprocessed', outerElement.onbbuidomready,false);
		} else {
			window.setTimeout(outerElement.initialize, 0);
		}

		// Handle pill sizing on orientation change
		outerElement.doOrientationChange = function() {
					this.recalculateSize();
					this.setPillLeft();
				};
		outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
		window.addEventListener('resize', outerElement.doOrientationChange,false); 
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'resize', eventHandler: outerElement.doOrientationChange});
		
		// Add our show function
		outerElement.show = function() {
			this.style.display = 'block';
			this.recalculateSize();
			this.setPillLeft();
			bb.refresh();
		};
		outerElement.show = outerElement.show.bind(outerElement);
		
		// Add our hide function
		outerElement.hide = function() {
			this.style.display = 'none';
			bb.refresh();
		};
		outerElement.hide = outerElement.hide.bind(outerElement);
		
		// Add remove function
		outerElement.remove = function() {
			this.parentNode.removeChild(this);
			bb.refresh();
		};
		outerElement.remove = outerElement.remove.bind(outerElement);
		
		// Add clear function
		outerElement.clear = function() {
			var items = this.table.querySelectorAll('td'),
				i;
			for (i = 0; i < items.length; i++) {
				this.table.tr.removeChild(items[i]);
			}
			this.pill.style.opacity = '0';
		};
		outerElement.clear = outerElement.clear.bind(outerElement);
		
		// Add appendButton function
		outerElement.appendButton = function(button) {
			button = outerElement.styleButton(button);
			// Create our cell
			var td = document.createElement('td');
			this.table.tr.appendChild(td);
			td.appendChild(button);
			this.initialize();
		};
		outerElement.appendButton = outerElement.appendButton.bind(outerElement);
		
		// Add getButtons function
		outerElement.getButtons = function() {
			var items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
			var buttonArray = new Array();
			for (var j = 0; j < items.length; j++) {
				buttonArray[j] = items[j].firstChild.innerHTML;					
			}				
			return buttonArray;
				};
		outerElement.getButtons = outerElement.getButtons.bind(outerElement);
		
		return outerElement;
    } 
};
_bb10_radio = {
	apply: function(elements) {
		// Apply our transforms to all Radio buttons
		for (var i = 0; i < elements.length; i++) {
			bb.radio.style(elements[i]);
		};
	},
	
	style: function(outerElement) {
		var outerElement,
			containerDiv,
			dotDiv,
			centerDotDiv,
			radio,
			color = bb.screen.controlColor,	
			input = outerElement;
		
		outerElement = document.createElement('div');
		outerElement.setAttribute('class','bb-radio-container-'+color);
		outerElement.input = input;
		input.outerElement = outerElement;

		// Make the existing <input[type=radio]> invisible so that we can hide it and create our own display
		input.style.display = 'none';
		
		// Create the dropdown container and insert it where the select was
		input.radio = outerElement;
		if (input.parentNode) {
			input.parentNode.insertBefore(outerElement, input);
		}
		// Insert the select as an invisible node in the new radio element
		outerElement.appendChild(input);
		
		// Create our colored dot
		dotDiv = document.createElement('div');
		dotDiv.setAttribute('class','bb-radio-dot');
		dotDiv.highlight = '-webkit-linear-gradient(top,  rgb('+ (bb.options.shades.R + 32) +', '+ (bb.options.shades.G + 32) +', '+ (bb.options.shades.B + 32) +') 0%, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 100%)';
		dotDiv.touchHighlight = '-webkit-linear-gradient(top,  rgba('+ (bb.options.shades.R - 64) +', '+ (bb.options.shades.G - 64) +', '+ (bb.options.shades.B - 64) +',0.25) 0%, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +',0.25) 100%)';
		if (input.checked) {
			dotDiv.style.background = dotDiv.highlight;
		}
		outerElement.dotDiv = dotDiv;
		outerElement.appendChild(dotDiv);
		
		// Set up our center dot
		centerDotDiv = document.createElement('div');
		centerDotDiv.setAttribute('class','bb-radio-dot-center');
		if (!input.checked) {
			bb.radio.resetDot(centerDotDiv);
		}
		dotDiv.appendChild(centerDotDiv);
		dotDiv.centerDotDiv = centerDotDiv;
		
		dotDiv.slideOutUp = function() {
							if (bb.device.is1024x600) {
								this.style.height = '0px';
								this.style.width = '10px';
								this.style.top = '9px';
								this.style.left = '15px';
							} else {
								this.style.height = '0px';
								this.style.width = '20px';
								this.style.top = '18px';
								this.style.left = '30px';
							}
							bb.radio.resetDot(this.centerDotDiv);
							this.style['-webkit-transition-property'] = 'all';
							this.style['-webkit-transition-duration'] = '0.1s';
							this.style['-webkit-transition-timing-function'] = 'linear';
							this.style['-webkit-backface-visibility'] = 'hidden';
							this.style['-webkit-perspective'] = 1000;
							this.style['-webkit-transform'] = 'translate3d(0,0,0)';
						};
		dotDiv.slideOutUp = dotDiv.slideOutUp.bind(dotDiv);
		
		dotDiv.slideOutDown = function() {
							if (bb.device.is1024x600) {
								this.style.height = '0px';
								this.style.width = '10px';
								this.style.top = '30px';
								this.style.left = '15px';
							} else {
								this.style.height = '0px';
								this.style.width = '20px';
								this.style.top = '60px';
								this.style.left = '30px';
							}
							bb.radio.resetDot(this.centerDotDiv);
							this.style['-webkit-transition-property'] = 'all';
							this.style['-webkit-transition-duration'] = '0.1s';
							this.style['-webkit-transition-timing-function'] = 'linear';
							this.style['-webkit-backface-visibility'] = 'hidden';
							this.style['-webkit-perspective'] = 1000;
							this.style['-webkit-transform'] = 'translate3d(0,0,0)';
						};
		dotDiv.slideOutDown = dotDiv.slideOutDown.bind(dotDiv);
		
		dotDiv.slideIn = function() {
							if (bb.device.is1024x600) {
								this.style.height = '20px';
								this.style.width = '20px';
								this.style.top = '10px';
								this.style.left = '9px';
								this.centerDotDiv.style.height = '10px';
								this.centerDotDiv.style.width = '10px';
								this.centerDotDiv.style.top = '5px';
								this.centerDotDiv.style.left = '5px';
							} else {
								this.style.height = '40px';
								this.style.width = '40px';
								this.style.top = '19px';
								this.style.left = '19px';
								this.centerDotDiv.style.height = '18px';
								this.centerDotDiv.style.width = '18px';
								this.centerDotDiv.style.top = '11px';
								this.centerDotDiv.style.left = '11px';
							}
							this.style['-webkit-transition-property'] = 'all';
							this.style['-webkit-transition-duration'] = '0.1s';
							this.style['-webkit-transition-timing-function'] = 'ease-in';
							this.style['-webkit-backface-visibility'] = 'hidden';
							this.style['-webkit-perspective'] = 1000;
							this.style['-webkit-transform'] = 'translate3d(0,0,0)';
							// Make our center white dot visible
							this.centerDotDiv.style['-webkit-transition-delay'] = '0.1s';
							this.centerDotDiv.style['-webkit-transition-property'] = 'all';
							this.centerDotDiv.style['-webkit-transition-duration'] = '0.1s';
							this.centerDotDiv.style['-webkit-transition-timing-function'] = 'ease-in';
							this.centerDotDiv.style['-webkit-perspective'] = 1000;
							this.centerDotDiv.style['-webkit-transform'] = 'translate3d(0,0,0)';
							
						};
		dotDiv.slideIn = dotDiv.slideIn.bind(dotDiv);
		
		// Set up properties
		outerElement.selectedRadio = undefined;		
		outerElement.slideFromTop = true;
		outerElement.ontouchstart = function() {
										if (!this.input.checked) {	
											this.slideFromTop = true;
											// See if it should slide from top or bottom
											this.selectedRadio = this.getCurrentlyChecked();
											if (this.selectedRadio) {
												if (this.getTop(this.selectedRadio.radio) >= this.getTop(this)) {
													this.slideFromTop = false;
												}
											} 
											// Reset for our highlights
											this.dotDiv.style['-webkit-transition'] = 'none';
											if (bb.device.is1024x600) {
												this.dotDiv.style.height = '20px';
												this.dotDiv.style.width = '20px';
												this.dotDiv.style.top = '10px';
												this.dotDiv.style.left = '9px';
											} else {
												this.dotDiv.style.height = '40px';
												this.dotDiv.style.width = '40px';
												this.dotDiv.style.top = '19px';
												this.dotDiv.style.left = '19px';
											}
											// Reset our center white dot
											bb.radio.resetDot(this.dotDiv.centerDotDiv);
											// Do our touch highlight
											this.dotDiv.style.background = this.dotDiv.touchHighlight;
										}
									};
		outerElement.ontouchend = function() {
										if (!this.input.checked) {
											this.dotDiv.style['-webkit-transition'] = 'none';
											if (bb.device.is1024x600) {
												this.dotDiv.style.height = '0px';
												this.dotDiv.style.width = '9px';
												this.dotDiv.style.left = '16px';
											} else {
												this.dotDiv.style.height = '0px';
												this.dotDiv.style.width = '18px';
												this.dotDiv.style.left = '32px';
											}
											// Reset top position
											if (this.slideFromTop) {
												this.dotDiv.style.top = bb.device.is1024x600 ? '9px' : '18px';
											} else {
												this.dotDiv.style.top = bb.device.is1024x600 ? '30px' : '60px';
											}
											
											// Fire our click
											window.setTimeout(this.doclick,0);
										}
									};
		outerElement.doclick = function() {
										if ((!this.input.checked) && (!this.input.disabled)) {
											var evObj = document.createEvent('HTMLEvents');
											evObj.initEvent('change', false, true );
											this.dotDiv.style.background = this.dotDiv.highlight;
											this.dotDiv.slideIn();
											if (this.selectedRadio) {
												this.selectedRadio.removeAttribute('checked');
												// fire the changed event for the previously checked radio
												this.selectedRadio.dispatchEvent(evObj);
												if (this.slideFromTop) {
													this.selectedRadio.radio.dotDiv.slideOutDown();
												} else {
													this.selectedRadio.radio.dotDiv.slideOutUp();
												}
											}
											this.input.setAttribute('checked','true');
											this.input.dispatchEvent(evObj);
										}
									};
		outerElement.doclick = outerElement.doclick.bind(outerElement);
		
		outerElement.getCurrentlyChecked = function() {
										var inputs = document.querySelectorAll('input[type=radio][name='+ this.input.name +'][checked=true]');
										if (inputs.length > 0) {
											return inputs[0];
										} else {
											return undefined;
										}
									};
		outerElement.getCurrentlyChecked = outerElement.getCurrentlyChecked.bind(outerElement);
		
		outerElement.getTop = function(element) {
							var top = 0;
							while (element) {
								top = top + element.offsetTop;
								element = element.offsetParent;
							}
							return top;
						};	
						
		// Add our set Checked function
		input.setChecked = function() {							
					if (!this.checked) {
						// Emulate Touch Start
						this.slideFromTop = true;
						this.outerElement.selectedRadio = this.outerElement.getCurrentlyChecked();
						if (this.outerElement.selectedRadio) {
							if (this.outerElement.getTop(this.outerElement.selectedRadio.radio) >= this.outerElement.getTop(this.outerElement)) {
								this.outerElement.slideFromTop = false;
							}
						} 
						// Emulate TouchEnd
						this.outerElement.dotDiv.style['-webkit-transition'] = 'none';
						if (bb.device.is1024x600) {
							this.outerElement.dotDiv.style.height = '0px';
							this.outerElement.dotDiv.style.width = '9px';
							this.outerElement.dotDiv.style.left = '16px';
						} else {
							this.outerElement.dotDiv.style.height = '0px';
							this.outerElement.dotDiv.style.width = '18px';
							this.outerElement.dotDiv.style.left = '32px';
						}
						// Reset top position
						if (this.outerElement.slideFromTop) {
							this.outerElement.dotDiv.style.top = bb.device.is1024x600 ? '9px' : '18px';
						} else {
							this.outerElement.dotDiv.style.top = bb.device.is1024x600 ? '30px' : '60px';
						}
						// Fire our click
						window.setTimeout(this.outerElement.doclick,0);
					}
					
				};
		input.setChecked = input.setChecked.bind(input);
		// Add our get Checked function
		input.getChecked = function() {
					return this.checked;
				};
		input.setChecked = input.setChecked.bind(input);
		
		// Add our function to enable a radio button
		input.enable = function() {
				if (!this.disabled) return;
				this.disabled = false;
				this.outerElement.dotDiv.setAttribute('class', 'bb-radio-dot');
			};
		input.enable = input.enable.bind(input);
			
		// Add our function to disable a radio button
		input.disable = function() {
				if (this.disabled) return;
				this.disabled = true;
				this.outerElement.dotDiv.setAttribute('class', 'bb-radio-dot-disabled');
			};
		input.disable = input.disable.bind(input);
		
		//Add our function to check if an individual radio buttons in enabled
		input.isEnabled = function() {
				return (!this.disabled);
			}
		input.isEnabled = input.isEnabled.bind(input);
		
		// Add our show function
		input.show = function() {
			this.outerElement.style.display = 'block';
			bb.refresh();
			};
		input.show = input.show.bind(input);
		
		// Add our hide function
		input.hide = function() {
			this.outerElement.style.display = 'none';
			bb.refresh();
			};
		input.hide = input.hide.bind(input);
		
		// Add our remove function
		input.remove = function() {
			this.outerElement.parentNode.removeChild(this.outerElement);
			bb.refresh();
			};
		input.remove = input.remove.bind(input);
			
		return outerElement;		
	},
	
	resetDot : function(dot) {
		dot.style['-webkit-transition'] = 'none';
		if (bb.device.is1024x600) {
			dot.style.height = '0px';
			dot.style.width = '0px';
			dot.style.top = '10px';
			dot.style.left = '9px';
		} else {
			dot.style.height = '0px';
			dot.style.width = '0px';
			dot.style.top = '20px';
			dot.style.left = '20px';
		}
	},
	
	//Function to enable a group of radio buttons
	enableGroup : function(groupName) {
		var radios = document.getElementsByName( groupName );
		for( i = 0; i < radios.length; i++ ) {
			if (radios[i].type === 'radio') radios[i].enable();
		}
	},
	
	//Function to disable a group of radio buttons
	disableGroup : function(groupName) {
		var radios = document.getElementsByName( groupName );
		for( i = 0; i < radios.length; i++ ) {
			if (radios[i].type === 'radio') radios[i].disable();
		}
	}
	
};
_bb10_roundPanel = {  
    apply: function(elements) {	
		var i,
			j,
			outerElement,
			items,
			header,
			color = bb.screen.listColor;	
			
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			outerElement.setAttribute('class','bb-round-panel');
			items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
			for (j = 0; j < items.length; j++) {
				 header = items[j];
				 header.setAttribute('class','bb-panel-header bb-panel-header-'+color);
				 header.style['border-bottom-color'] = bb.options.shades.darkOutline;
			}
		// Add our show function
		outerElement.show = function() {
			this.style.display = 'block';
			bb.refresh();
				};
		outerElement.show = outerElement.show.bind(outerElement);
		
		// Add our hide function
		outerElement.hide = function() {
			this.style.display = 'none';
			bb.refresh();
				};
		outerElement.hide = outerElement.hide.bind(outerElement);
		
		// Add remove function
		outerElement.remove = function() {
			this.parentNode.removeChild(this);
			bb.refresh();
				};
		outerElement.remove = outerElement.remove.bind(outerElement);
		}
    }
};
_bb10_slider = {

	apply: function(elements) {
		var i, 
			range,
			color = bb.screen.controlColor;
			
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
			outerElement.className = 'bb-slider';
			outerElement.outer = document.createElement('div');
			outerElement.outer.setAttribute('class','outer bb-slider-outer-' + color);
			outerElement.appendChild(outerElement.outer);
			outerElement.fill = document.createElement('div');
			outerElement.fill.className = 'fill';
			outerElement.fill.active = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
			outerElement.fill.dormant = '-webkit-linear-gradient(top, '+ bb.options.highlightColor +' 0%, '+ bb.options.shades.darkHighlight +' 100%)';
			outerElement.fill.style.background = outerElement.fill.dormant;
			outerElement.outer.appendChild(outerElement.fill);
			outerElement.inner = document.createElement('div');
			outerElement.inner.className = 'inner';
			outerElement.inner.outerElement = outerElement;
			outerElement.outer.appendChild(outerElement.inner);
			outerElement.halo = document.createElement('div');
			outerElement.halo.className = 'halo';
			outerElement.halo.style.background = '-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 43, from(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), color-stop(0.8, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), to(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.7)))';
			outerElement.inner.appendChild(outerElement.halo);
			outerElement.indicator = document.createElement('div');
			outerElement.indicator.setAttribute('class','indicator bb-slider-indicator-' + color);
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
							this.outerElement.currentXPos = Math.floor(parseInt(window.getComputedStyle(this.outerElement.outer).width) * percent);
							this.outerElement.fill.style.width = this.outerElement.currentXPos + 'px';
							this.outerElement.inner.style['-webkit-transform'] = 'translate3d(' + this.outerElement.currentXPos + 'px,0px,0px)';
						};
			range.setValue = range.setValue.bind(range);
			// Set our value on a timeout so that it can calculate width once in the DOM
			window.setTimeout(range.setValue, 0);
			// Setup our touch events
			outerElement.inner.animateBegin = function(event) {
									if (this.outerElement.isActivated === false) {
										this.outerElement.isActivated = true;
										this.outerElement.initialXPos = event.touches[0].pageX;	
										this.outerElement.halo.style['-webkit-transform'] = 'scale(1)';
										this.outerElement.halo.style['-webkit-animation-name'] = 'explode';
										this.outerElement.indicator.setAttribute('class','indicator bb-slider-indicator-' + color+ ' indicator-hover-'+color);
										this.outerElement.indicator.style.background = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
										this.outerElement.fill.style.background = this.outerElement.fill.active;
									}
								};
			outerElement.inner.animateBegin = outerElement.inner.animateBegin.bind(outerElement.inner);
			outerElement.inner.addEventListener("touchstart", outerElement.inner.animateBegin, false);
			outerElement.inner.animateEnd = function () {
									if (this.outerElement.isActivated === true) {
										this.outerElement.isActivated = false;
										this.outerElement.currentXPos = this.outerElement.transientXPos;
										this.outerElement.value = parseInt(this.outerElement.range.value);
										this.outerElement.halo.style['-webkit-transform'] = 'scale(0)';
										this.outerElement.halo.style['-webkit-animation-name'] = 'implode';
										this.outerElement.indicator.setAttribute('class','indicator bb-slider-indicator-' + color);   
										this.outerElement.indicator.style.background = '';	
										this.outerElement.fill.style.background = this.outerElement.fill.dormant;
									}
								};
			outerElement.inner.animateEnd = outerElement.inner.animateEnd.bind(outerElement.inner);
			outerElement.inner.addEventListener("touchend", outerElement.inner.animateEnd, false);
			// Handle moving the slider
			outerElement.moveSlider = function (event) {
								if (this.isActivated === true) {
									event.stopPropagation();
									event.preventDefault();
									this.transientXPos = this.currentXPos + event.touches[0].pageX - this.initialXPos;
									this.transientXPos = Math.max(0, Math.min(this.transientXPos, parseInt(window.getComputedStyle(this.outer).width)));
									this.notifyUpdated();
									this.fill.style.width = this.transientXPos + 'px';
									this.inner.style['-webkit-transform'] = 'translate3d(' + this.transientXPos + 'px,0px,0px)';
								}
							};
			outerElement.moveSlider = outerElement.moveSlider.bind(outerElement);
			// Handle sending event to person trapping
			outerElement.notifyUpdated = function() {
								var percent = this.transientXPos/parseInt(window.getComputedStyle(this.outer).width),
									newValue = Math.ceil((parseInt(this.minValue) + parseInt(this.maxValue))*percent);
								// Fire our events based on the step provided
								if (Math.abs(newValue - parseInt(this.range.value)) > this.step) {
									this.range.value = newValue;
									var evObj = document.createEvent('HTMLEvents');
									evObj.initEvent('change', false, true );
									this.range.dispatchEvent(evObj);
								}
							};
			outerElement.notifyUpdated = outerElement.notifyUpdated.bind(outerElement);
			outerElement.doOrientationChange = function() {
								window.setTimeout(outerElement.range.setValue, 0);
							};
			outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
			// Assign our document & windows event listeners
			document.addEventListener('touchmove', outerElement.moveSlider, false);
			bb.documentListeners.push({name: 'touchmove', eventHandler: outerElement.moveSlider});
			
			document.addEventListener('touchend', outerElement.inner.animateEnd, false);
			bb.documentListeners.push({name: 'touchend', eventHandler: outerElement.inner.animateEnd});
			
			window.addEventListener('resize', outerElement.doOrientationChange,false); 
			bb.windowListeners.push({name: 'resize', eventHandler: outerElement.doOrientationChange});
		}
	}
};
_bb10_textInput = { 
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.textInput.style(elements[i]);
		}
	},
	
	style: function(outerElement) {
		var css = '',
			container = document.createElement('div');
		
		// Keep the developers existing styling
		if (outerElement.hasAttribute('class')) {
			css = outerElement.getAttribute('class');
		}
	  
		// Insert the input inside the new div
		if (outerElement.parentNode) {
			outerElement.parentNode.insertBefore(container, outerElement);
		}
		container.appendChild(outerElement);
		container.input = outerElement;
		container.setAttribute('data-bb-type','input');
		container.normal = 'bb-input-container';
		
		// Set our input styling
		outerElement.normal = css + ' bb-input';
		outerElement.focused = css + ' bb-input bb-input-focused';
		if (outerElement.disabled) {
			outerElement.setAttribute('class', outerElement.normal + ' bb-input-disabled');
		} else {
			outerElement.setAttribute('class', outerElement.normal);
		}
		outerElement.isFocused = false;
		outerElement.clickCount = 0;
		outerElement.container = container;
		outerElement.clearBtn = outerElement.getAttribute('data-bb-clear') != 'none';
		outerElement.hasClearBtn = false;
		
		// Don't show the clear button on some input types
		if (outerElement.type) {
			var type = outerElement.type.toLowerCase();
			if ((type == 'date') || (type == 'time') || (type == 'datetime') || (type == 'month') || (type == 'datetime-local') || (type == 'color') || (type == 'search')) {
				outerElement.clearBtn = false;
			}
		}
		
		// Set our container class
		if (outerElement.disabled) {
			container.setAttribute('class',container.normal + ' bb-input-container-disabled');
		} else {
			container.setAttribute('class',container.normal);
		}
		
		outerElement.doFocus = function() {
								if(this.readOnly == false) {
									this.container.setAttribute('class',this.container.normal + ' bb-input-cancel-button bb-input-container-focused');
									if (this.clearBtn && this.value) {
										this.setAttribute('class', this.focused);
										this.hasClearBtn = true;
									} else {
										this.setAttribute('class', this.normal);
										this.hasClearBtn = false;
									}
									this.container.style['border-color'] = bb.options.highlightColor;
									this.isFocused = true;
									this.clickCount = 0;
									bb.screen.focusedInput = this;
								}
							};
		outerElement.doFocus = outerElement.doFocus.bind(outerElement);
		outerElement.addEventListener('focus', outerElement.doFocus, false);
			
		outerElement.doBlur = function() {
								this.container.setAttribute('class',this.container.normal);	
								if (this.clearBtn) {
									this.setAttribute('class',this.normal);
								}
								this.container.style['border-color'] = '';
								this.isFocused = false;
								bb.screen.focusedInput = null;
							};
		outerElement.doBlur = outerElement.doBlur.bind(outerElement);	
		outerElement.addEventListener('blur', outerElement.doBlur, false);
		
		// Monitor input to add or remove clear button
		outerElement.updateClearButton = function() {
											if (this.clearBtn) {
												if ((this.value.length == 0 && this.hasClearBtn) || (this.value.length > 0 && !this.hasClearBtn))
													outerElement.doFocus();
											}
		};
		outerElement.updateClearButton = outerElement.updateClearButton.bind(outerElement);  
		outerElement.addEventListener("input", outerElement.updateClearButton, false);
				
		// Add the clear button handler
		if (outerElement.clearBtn) {
			outerElement.container.ontouchstart = function(event) {
									if (event.target == this) {
										event.preventDefault();
										event.stopPropagation();
										this.input.value = '';
										outerElement.doFocus();
									}
								};
		}

		// Add our Show funtion
		outerElement.show = function() {
					this.container.style.display = '';
				};
		outerElement.show = outerElement.show.bind(outerElement);	
		
		// Add our hide funtion
		outerElement.hide = function() {
					this.container.style.display = 'none';
				};
		outerElement.hide = outerElement.hide.bind(outerElement);
		
		// Add our remove funtion
		outerElement.remove = function() {
					if (this.container.parentNode) {
						this.container.parentNode.removeChild(this.container);
					}
				};
		outerElement.remove = outerElement.remove.bind(outerElement);
		
		// Add our enable funtion
		outerElement.enable = function() {
					if (!this.disabled) return;
					this.disabled = false;
					this.container.setAttribute('class',this.container.normal);
					this.setAttribute('class', this.normal);
				};
		outerElement.enable = outerElement.enable.bind(outerElement);
		
		// Add our disable funtion
		outerElement.disable = function() {
					if (this.disabled) return;
					this.disabled = true;
					this.container.setAttribute('class',this.container.normal + ' bb-input-container-disabled');
					this.setAttribute('class', this.normal + ' bb-input-disabled');
				};
		outerElement.disable = outerElement.disable.bind(outerElement);
		
		return container;
    }
};
_bb10_toggle = {

	apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.toggle.style(elements[i],true);
		}
	},
	
	style: function(outerElement,offdom) {
		var table,
			tr,
			td,
			color = bb.screen.controlColor;
		
		outerElement.checked = false;
		outerElement.enabled = true;
		outerElement.buffer = (bb.device.is1024x600) ? 35 : 70;
		outerElement.isActivated = false;
		outerElement.initialXPos = 0;
		outerElement.currentXPos = 0;
		outerElement.transientXPos = 0;
		outerElement.movedWithSlider = false;
		outerElement.startValue = false;
		
		// See if the toggle button is disabled
		if (outerElement.hasAttribute('data-bb-disabled')) {
			outerElement.enabled = !(outerElement.getAttribute('data-bb-disabled').toLowerCase() == 'true');
		}
		
		// Set our styling and create the inner divs
		outerElement.className = 'bb-toggle';
		outerElement.outer = document.createElement('div');
		if (outerElement.enabled) {
			if (bb.device.newerThan10dot1) {
				outerElement.normal = 'outer bb-toggle-outer-'+ color +'-10dot2 bb-toggle-outer-enabled-'+color;
			} else {
				outerElement.normal = 'outer bb-toggle-outer-'+color + ' bb-toggle-outer-enabled-'+color;
			}
		} else {
			outerElement.normal = 'outer bb-toggle-outer-'+color + ' bb-toggle-outer-disabled';
		}
		outerElement.outer.setAttribute('class',outerElement.normal);
		outerElement.appendChild(outerElement.outer);
		outerElement.fill = document.createElement('div');
		outerElement.fill.className = 'fill';
		outerElement.fill.style.background = outerElement.fill.dormant;
		outerElement.outer.appendChild(outerElement.fill);
		// Our inner area that will contain the text
		outerElement.inner = document.createElement('div');
		outerElement.inner.className = 'inner';
		outerElement.inner.outerElement = outerElement;
		outerElement.fill.appendChild(outerElement.inner);
		// Create our table holder for the captions
		table = document.createElement('table');
		table.className = 'table';
		tr = document.createElement('tr');
		table.appendChild(tr);
		outerElement.inner.appendChild(table);
		// The yes option
		td = document.createElement('td');
		td.className = 'left';
		tr.appendChild(td);
		outerElement.yes = document.createElement('div');
		outerElement.yes.className = 'yes';
		outerElement.yes.innerHTML = outerElement.getAttribute('data-bb-on');
		td.appendChild(outerElement.yes);
		// Center section where the indicator will hover over
		td = document.createElement('td');
		td.className = 'center';
		tr.appendChild(td);
		// The no option
		td = document.createElement('td');
		td.className = 'right';
		tr.appendChild(td);
		outerElement.no = document.createElement('div');
		outerElement.no.className = 'no';
		outerElement.no.innerHTML = outerElement.getAttribute('data-bb-off');
		td.appendChild(outerElement.no);
		// Indicator container
		outerElement.container = document.createElement('div');
		outerElement.container.className = 'indicator-container';
		outerElement.appendChild(outerElement.container);
		// Create the Halo
		outerElement.halo = document.createElement('div');
		outerElement.halo.className = 'halo';
		outerElement.halo.style.background = '-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 43, from(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), color-stop(0.8, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), to(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.7)))';
		outerElement.container.appendChild(outerElement.halo);
		// Create the indicator
		outerElement.indicator = document.createElement('div');
		if (outerElement.enabled) {
			outerElement.indicator.normal = 'indicator bb-toggle-indicator-enabled-' + color;
		} else {
			outerElement.indicator.normal = 'indicator bb-toggle-indicator-disabled-' + color;
		}
		outerElement.indicator.setAttribute('class',outerElement.indicator.normal);
		outerElement.container.appendChild(outerElement.indicator);
		// Get our onchange event if any
		if (outerElement.hasAttribute('onchange')) {
			outerElement.onchangeEval = outerElement.getAttribute('onchange');
			outerElement.onchange = function() {
							eval(this.onchangeEval);
						};
		}			
		
		// Setup our touch events
		outerElement.inner.animateBegin = function(event) {
								if (!this.outerElement.enabled) return;
								if (this.outerElement.isActivated === false) {
									this.outerElement.startValue = this.outerElement.checked;
									this.outerElement.movedWithSlider = false;
									this.outerElement.isActivated = true;
									this.outerElement.initialXPos = event.touches[0].pageX;	
									this.outerElement.halo.style['-webkit-transform'] = 'scale(1)';
									this.outerElement.halo.style['-webkit-animation-name'] = 'explode';
									this.outerElement.indicator.setAttribute('class','indicator bb-toggle-indicator-enabled-' + color+ ' indicator-hover-'+color);
									this.outerElement.indicator.style.background = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
								}
							};
		outerElement.inner.animateBegin = outerElement.inner.animateBegin.bind(outerElement.inner);
		outerElement.inner.addEventListener("touchstart", outerElement.inner.animateBegin, false);
		outerElement.container.addEventListener("touchstart", outerElement.inner.animateBegin, false);
		outerElement.inner.animateEnd = function () {
								if (!this.outerElement.enabled) return;
								if (this.outerElement.isActivated === true) {
									this.outerElement.isActivated = false;
									this.outerElement.currentXPos = this.outerElement.transientXPos;
									this.outerElement.halo.style['-webkit-transform'] = 'scale(0)';
									this.outerElement.halo.style['-webkit-animation-name'] = 'implode';
									this.outerElement.indicator.setAttribute('class','indicator bb-toggle-indicator-enabled-' + color);   
									this.outerElement.indicator.style.background = '';	
									this.outerElement.positionButton();
									if (this.outerElement.movedWithSlider) {
										if (this.outerElement.startValue != this.outerElement.checked) {
											if (this.outerElement.onchange) {
												this.outerElement.onchange();
											}
										}
									}
								}
							};
		outerElement.inner.animateEnd = outerElement.inner.animateEnd.bind(outerElement.inner);
		outerElement.addEventListener('touchend', outerElement.inner.animateEnd, false);
		
		// Handle moving the toggle
		outerElement.moveToggle = function (event) {
							if (!this.enabled) return;
							if (this.isActivated === true) {
								this.movedWithSlider = true;
								event.stopPropagation();
								event.preventDefault();
								var endPos = parseInt(window.getComputedStyle(this.fill).width) - this.buffer,
									percent;
								this.transientXPos = this.currentXPos + event.touches[0].pageX - this.initialXPos;
								this.transientXPos = Math.max(0, Math.min(this.transientXPos, endPos));
								this.inner.style['-webkit-transform'] = 'translate3d(' + this.transientXPos + 'px,0px,0px)';
								this.container.style['-webkit-transform'] = 'translate3d(' + this.transientXPos + 'px,0px,0px)';
								
								// Set our checked state
								percent = this.transientXPos/endPos;
								this.checked = (percent > 0.5);
							}
						};
		outerElement.moveToggle = outerElement.moveToggle.bind(outerElement);
		
		// Handle the click of a toggle
		outerElement.doClick = function() {
							if (!this.enabled) return;
							if (!this.movedWithSlider) {
								this.setChecked(!this.checked);
							} 
						};
		outerElement.doClick = outerElement.doClick.bind(outerElement);
		outerElement.addEventListener('click', outerElement.doClick, false);
		
		// Position the button
		outerElement.positionButton = function() {
					var location = (this.checked) ? parseInt(window.getComputedStyle(this.fill).width) - this.buffer : 0;
				
					// Set our animations
					this.inner.style['-webkit-transform'] = 'translate3d(' + location + 'px,0px,0px)';
					this.inner.style['-webkit-transition-duration'] = '0.1s';
					this.inner.style['-webkit-transition-timing-function'] = 'linear';
					this.inner.addEventListener('webkitTransitionEnd', function() { 
								this.style['-webkit-transition'] = '';
							});
					this.container.style['-webkit-transform'] = 'translate3d(' + location + 'px,0px,0px)';
					this.container.style['-webkit-transition-duration'] = '0.1s';
					this.container.style['-webkit-transition-timing-function'] = 'linear';
					this.container.addEventListener('webkitTransitionEnd', function() { 
								this.style['-webkit-transition'] = '';
							});
							
					if (this.checked && this.enabled) {
						this.indicator.style['background-image'] = '-webkit-linear-gradient(top, '+ bb.options.highlightColor +' 0%, '+ bb.options.shades.darkHighlight +' 100%)';
					} else {
						this.indicator.style['background-image'] = '';
					}
					
					this.currentXPos = location;
				};
		outerElement.positionButton = outerElement.positionButton.bind(outerElement);
		
		// Add our setChecked function
		outerElement.setChecked = function(value) {
					if (value != this.checked) {
						this.checked = value;
						if (this.onchange) {
							this.onchange();
						}
					}
					this.positionButton();
				};
		outerElement.setChecked = outerElement.setChecked.bind(outerElement);
		
		// Add our getChecked function
		outerElement.getChecked = function() {
					return this.checked;
				};
		outerElement.getChecked = outerElement.getChecked.bind(outerElement);
		
		// Add our show function
		outerElement.show = function() {
			this.style.display = 'block';
			bb.refresh();
				};
		outerElement.show = outerElement.show.bind(outerElement);
		
		// Add our hide function
		outerElement.hide = function() {
			this.style.display = 'none';
			bb.refresh();
				};
		outerElement.hide = outerElement.hide.bind(outerElement);
		
		// Add remove function
		outerElement.remove = function() {
			this.parentNode.removeChild(this);
			bb.refresh();
				};
		outerElement.remove = outerElement.remove.bind(outerElement);
		
		// Add setOnCaption function
		outerElement.setOnCaption = function(value) {
			this.yes.innerHTML = value;				
				};
		outerElement.setOnCaption = outerElement.setOnCaption.bind(outerElement);
		
		// Add setOffCaption function
		outerElement.setOffCaption = function(value) {
			this.no.innerHTML = value;				
				};
		outerElement.setOffCaption = outerElement.setOffCaption.bind(outerElement);
		
		// Add getOnCaption function
		outerElement.getOnCaption = function() {
			return this.yes.innerHTML;				
				};
		outerElement.getOnCaption = outerElement.getOnCaption.bind(outerElement);
		
		// Add getOffCaption function
		outerElement.getOffCaption = function() {
			return this.no.innerHTML;				
				};
		outerElement.getOffCaption = outerElement.getOffCaption.bind(outerElement);
		
		// Add enable function
		outerElement.enable = function() {
				if (this.enabled) return;
				this.enabled = true;
				// change our styles
				this.indicator.normal = 'indicator bb-toggle-indicator-enabled-' + color;
				this.indicator.setAttribute('class',this.indicator.normal);
				if (bb.device.newerThan10dot1) {
					this.normal = 'outer bb-toggle-outer-'+ color +'-10dot2 bb-toggle-outer-enabled-'+color;
				} else {
					this.normal = 'outer bb-toggle-outer-'+color + ' bb-toggle-outer-enabled-'+color;
				}
				this.outer.setAttribute('class',this.normal);
				// update the button
				this.positionButton();
			};
		outerElement.enable = outerElement.enable.bind(outerElement);
		
		// Add disable function
		outerElement.disable = function() {
				if (!this.enabled) return;
				this.enabled = false;
				// change our styles
				this.indicator.normal = 'indicator bb-toggle-indicator-disabled-' + color;
				this.indicator.setAttribute('class',this.indicator.normal);
				this.normal = 'outer bb-toggle-outer-'+color + ' bb-toggle-outer-disabled';
				this.outer.setAttribute('class',this.normal);
				// Update the button
				this.positionButton();
			};
		outerElement.disable = outerElement.disable.bind(outerElement);
		
		// set our checked state
		outerElement.checked = (outerElement.hasAttribute('data-bb-checked')) ? outerElement.getAttribute('data-bb-checked').toLowerCase() == 'true' : false;
		
		if (offdom) {
			// Create our event handler for when the dom is ready
			outerElement.onbbuidomready = function() {
						this.positionButton();
						document.removeEventListener('bbuidomready', this.onbbuidomready,false);
					};
			outerElement.onbbuidomready = outerElement.onbbuidomready.bind(outerElement);
			/* Add our event listener for the domready to move our selected item.  We want to
		   do it this way because it will ensure the screen transition animation is finished before
		   the toggle button move transition happens. This will help for any animation stalls/delays */
			document.addEventListener('bbuidomready', outerElement.onbbuidomready,false);
		} else {
			// Use a simple timeout to trigger the animation once inserted into the DOM
			setTimeout(outerElement.positionButton,0);
		}

		// Assign our document event listeners
		document.addEventListener('touchmove', outerElement.moveToggle, false);
		bb.documentListeners.push({name: 'touchmove', eventHandler: outerElement.moveToggle});
		document.addEventListener('touchend', outerElement.inner.animateEnd, false);
		bb.documentListeners.push({name: 'touchend', eventHandler: outerElement.inner.animateEnd});
		
		return outerElement;
	}
};
_bb_PlayBook_10_scrollPanel = {
	apply: function(elements) {
		var i,j,
			outerElement,
			childNode,
			scrollArea,
			tempHolder;
		
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			tempHolder = [];			
			// Inner Scroll Area
			scrollArea = document.createElement('div');
			outerElement.appendChild(scrollArea); 
			
			// Copy all nodes in the screen that are not the action bar
			for (j = 0; j < outerElement.childNodes.length - 1; j++) {
				tempHolder.push(outerElement.childNodes[j]);
			}
			// Add them into the scrollable area
			for (j = 0; j < tempHolder.length; j++) {
				scrollArea.appendChild(tempHolder[j]);
			}
			
			if (bb.device.isPlayBook) {
				outerElement.scroller = new iScroll(outerElement, {vScrollbar: true,hideScrollbar:true,fadeScrollbar:true,
									onBeforeScrollStart: function (e) {
										if (bb.scroller) {
											bb.scroller.disable();
										}
										e.preventDefault();
									}, 
									onBeforeScrollEnd: function(e) {
										if (bb.scroller) {
											bb.scroller.enable();
										}
									},
									onScrollEnd : function(e) {
										// Raise an internal event to let the rest of the framework know that content is scrolling
										evt = document.createEvent('Events');
										evt.initEvent('bbuiscrolling', true, true);
										document.dispatchEvent(evt);
									},
									onScrollMove: function(e) {
										if (outerElement.onscroll) {
											outerElement.onscroll(e);
										}
										// Raise an internal event to let the rest of the framework know that content is scrolling
										evt = document.createEvent('Events');
										evt.initEvent('bbuiscrolling', true, true);
										document.dispatchEvent(evt);
									}
									});
			} else {
				outerElement.scroller = null;
				outerElement.style['-webkit-overflow-scrolling'] = '-blackberry-touch';
				outerElement.addEventListener('scroll', function() {
						// Raise an internal event to let the rest of the framework know that content is scrolling
						evt = document.createEvent('Events');
						evt.initEvent('bbuiscrolling', true, true);
						document.dispatchEvent(evt);	

						/* This is a major hack to fix an issue in webkit where it doesn't always
						   understand when to re-paint the screen when scrolling a <div> with overflow
						   and using the inertial scrolling */
						if (this.timeout) {
							clearTimeout(this.timeout);
						} else {
							this.style['padding-right'] = '1px';
						}
						// Set our new timeout for resetting
						this.timeout = setTimeout(this.resetPadding,20);
						
						/* ************* END OF THE SCROLLING HACK *******************/
						
					},false);
					
				/* ********** PART OF THE SCROLLING HACK ************/
				outerElement.resetPadding = function() {
						this.style['padding-right'] = '0px';
						this.timeout = null;
					};
				outerElement.resetPadding = outerElement.resetPadding.bind(outerElement);
				/* ********** END OF THE SCROLLING HACK ************/
			}
			
			// Add show function
			outerElement.show = function() {
				this.style.display = 'block';
				bb.refresh();
				};
			outerElement.show = outerElement.show.bind(outerElement);

			// Add hide function
			outerElement.hide = function() {
				this.style.display = 'none';
				bb.refresh();
				};
			outerElement.hide = outerElement.hide.bind(outerElement);
	
			// Add remove function
			outerElement.remove = function() {
				this.parentNode.removeChild(this);
				bb.refresh();
				};
			outerElement.remove = outerElement.remove.bind(outerElement);
			
			// Set refresh
			outerElement.refresh = function() {
					if (this.scroller) {
						this.scroller.refresh();
					}
				};
			outerElement.refresh = outerElement.refresh.bind(outerElement);
			setTimeout(outerElement.refresh,0);
			// Set ScrollTo
			outerElement.scrollTo = function(x, y) {
					if (this.scroller) {
						this.scroller.scrollTo(x, y);
					} else {
						this.scrollTop = x;
					}
				};
			outerElement.scrollTo = outerElement.scrollTo.bind(outerElement);
			// Set ScrollToElement
			outerElement.scrollToElement = function(element) {
					if (this.scroller) {
						this.scroller.scrollToElement(element);
					} else {
						if (!element) return;
						var offsetTop = 0,
							target = element;
						if (target.offsetParent) {
							do {
								offsetTop  += target.offsetTop;
							} while (target = target.offsetParent);
						}
						this.scrollTo(offsetTop,0);
					}
				};
			outerElement.scrollToElement = outerElement.scrollToElement.bind(outerElement);
			outerElement.setAttribute('class','bb-scroll-panel');
		}
	}	
};
// BlackBerry 10 Context Menu for PlayBook
// Also acts as the action overflow menu for BlackBerry 10 Action Bar
_PlayBook_contextMenu = {
	// Create an instance of the menu and pass it back to the caller
	create : function(screen) {
		var swipeThreshold = 300;
				
		// Set our swipeThreshold for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			swipeThreshold = 100;
		} else if (bb.device.is720x720) {
			swipeThreshold = 300;
		}
		
		// Create the oveflow menu container
		var menu = document.createElement('div'), 
			title = document.createElement('div'),
			description = document.createElement('div'),
			header;
		menu.setAttribute('class','bb-context-menu bb-context-menu-dark');
	
		menu.actions = [];
		menu.hideEvents = [];
		menu.threshold = swipeThreshold;
		menu.visible = false;
		
		// Create our overlay for touch events
		menu.overlay = document.createElement('div');
		menu.overlay.threshold = swipeThreshold;
		menu.overlay.setAttribute('class','bb-context-menu-overlay');
		menu.overlay.menu = menu;
		screen.appendChild(menu.overlay);
		
		menu.overlay.ontouchmove = function(event) {
										// Only care about moves if peeking
										if (!this.menu.peeking) return;
										var touch = event.touches[0];
										if (this.startPos && (this.startPos - touch.pageX > this.threshold)) {
											this.menu.show(this.menu.selected);
											this.closeMenu = false;
										}
									};
		menu.overlay.ontouchend = function() {
										if (this.closeMenu) {
											this.menu.hide();
											event.preventDefault();
										}
									};
		menu.overlay.ontouchstart = function(event) {
											this.closeMenu = true;
											if (!this.menu.peeking && this.menu.visible) {
												event.preventDefault();
											} else if (!this.menu.peeking) return;
											
											var touch = event.touches[0];
											this.startPos = touch.pageX;
											event.preventDefault();
										};
		
		// Create the menu header
		header = document.createElement('div');
		header.setAttribute('class','bb-context-menu-item bb-context-menu-header-dark');
		menu.header = header;
		menu.appendChild(header);
		
		// Create our title container
		title.setAttribute('class','bb-context-menu-header-title bb-context-menu-header-title-dark');
		title.style.width = _PlayBook_contextMenu.getWidth() - 20 + 'px';
		menu.topTitle = title;
		header.appendChild(title);
		
		// Create our description container
		description.setAttribute('class','bb-context-menu-header-description');
		description.style.width = _PlayBook_contextMenu.getWidth() - 20 + 'px';
		menu.description = description;
		header.appendChild(description);
		
		// Create our scrolling container
		menu.scrollContainer = document.createElement('div');
		menu.scrollContainer.setAttribute('class', 'bb-context-menu-scroller');
		menu.appendChild(menu.scrollContainer);

		// Set our first left position
		menu.style.left = _PlayBook_contextMenu.getLeft();
		
		// Display the menu
		menu.show = function(data){
						if (data) {
							this.header.style.display = '';
							this.header.style.visibility = '';
							if (data.title) {
								this.topTitle.innerHTML = data.title;
							}
							if (data.description) {
								this.description.innerHTML = data.description;
							}
							this.selected = data;
							// Adjust our scroll container top
							menu.scrollContainer.style.top = (bb.device.isPlayBook) ? '64px' : '130px';
						} else {
							this.header.style.display = 'none';	
							this.selected = undefined;
							// Adjust our scroll container top
							menu.scrollContainer.style.top = '0px';							
						}
						// Set our scroller
						menu.scrollContainer.style['overflow-y'] = 'scroll';
						menu.scrollContainer.style['overflow-x'] = 'hidden'
						menu.scrollContainer.style['-webkit-overflow-scrolling'] = '-blackberry-touch';
						
						this.peeking = false;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + _PlayBook_contextMenu.getWidth() + 'px, 0)';
						this.style['-webkit-backface-visibility'] = 'hidden';
						this.style['-webkit-perspective'] = '1000';
						this.addEventListener("touchstart", this.touchHandler, false);	
						this.onclick = function() {	this.hide();}
						// Remove the header click handling while peeking
						this.header.addEventListener("click", this.hide, false);
						this.style.visibility = 'visible';
						this.visible = true;
						if(bb.device.isPlayBook){
							blackberry.app.event.onSwipeDown('');
						} else {
							blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
						}
					};
		menu.show = menu.show.bind(menu);
		// Hide the menu
		menu.hide = function(){
						
						this.overlay.style.display = 'none';
						this.removeEventListener("touchstart", this.touchHandler, false);
						this.removeEventListener("touchmove", this.touchMoveHandler, false);
						this.style['-webkit-transition'] = 'all 0.5s ease-in-out';
						this.style['-webkit-transform'] = 'translate(' + _PlayBook_contextMenu.getWidth() + 'px, 0px)';
						this.style['-webkit-backface-visibility'] = 'hidden';
						this.style['-webkit-perspective'] = '1000';
						if (!this.peeking) {
							// Remove the header click handling 
							this.header.removeEventListener("click", this.hide, false);	
						}
						this.peeking = false;
						this.visible = false;
						
						// Remove our scroller
						menu.scrollContainer.style['overflow-y'] = '';
						menu.scrollContainer.style['overflow-x'] = ''
						menu.scrollContainer.style['-webkit-overflow-scrolling'] = '';
						
						// See if there was anyone listenting for hide events and call them
						// starting from the last one registered and pop them off
						for (var i = menu.hideEvents.length-1; i >= 0; i--) {
							menu.hideEvents[i]();
							menu.hideEvents.pop();
						}
						
						// Hack because PlayBook doesn't seem to get all the touch end events
						if (bb.device.isPlayBook) {
							for (var i = 0; i < this.actions.length; i++) {
								this.actions[i].ontouchend();
							}
						}
						if(bb.device.isPlayBook){
							blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
						} else {
							blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
						}
					};
		menu.hide = menu.hide.bind(menu);
		// Peek the menu
		menu.peek = function(data){
						if (data) {
							this.header.style.display = '';
							if (data.title) {
								this.topTitle.innerHTML = data.title;
							}
							if (data.description) {
								this.description.innerHTML = data.description;
							}
							this.selected = data;
							// Adjust our scroller top
							menu.scrollContainer.style.top = (bb.device.isPlayBook) ? '64px' : '130px';
						} else {
							// Adjust our scroller top
							menu.scrollContainer.style.top = '0px';
						}
						
						this.header.style.visibility = 'hidden';	
						this.header.style['margin-bottom'] = '-'+ Math.floor(this.header.offsetHeight/2) + 'px';
						this.peeking = true;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + _PlayBook_contextMenu.getPeekWidth() + ', 0)';	
						this.style['-webkit-backface-visibility'] = 'hidden';
						this.style['-webkit-perspective'] = '1000';
						this.addEventListener("touchstart", this.touchHandler, false);	
						this.addEventListener("touchmove", this.touchMoveHandler, false);		
						this.onclick = function(event) {
									if ((event.target == this) || (event.target == this.scrollContainer)){;
										this.show(this.selected);
									}
								};
						// Remove the header click handling while peeking
						this.header.removeEventListener("click", this.hide, false);		
						this.style.visibility = 'visible';
						this.visible = true;
						if(bb.device.isPlayBook){
							blackberry.app.event.onSwipeDown('');
						} else {
							blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
						}
					};
		menu.peek = menu.peek.bind(menu);
		
		menu.clearWWcontextMenu = function() {
				// Here because the interface is needed on BB10 WebWorks context menu
			};
		menu.clearWWcontextMenu = menu.clearWWcontextMenu.bind(menu);
		
		// Trap touch start events in a way that we can add and remove the handler
		menu.touchHandler = function(event) {
								if (this.peeking) {
									var touch = event.touches[0];
									this.startPos = touch.pageX;
									if (event.target == this.scrollContainer) {
										//event.stopPropagation();
									} else if (event.target.parentNode == this.scrollContainer && event.target != this.header)  {
										event.preventDefault();
										event.stopPropagation();
									} 						
								} 
							};
		menu.touchHandler = menu.touchHandler.bind(menu);
		
		// Trap touch move events in a way that we can add and remove the handler
		menu.touchMoveHandler = function(event) {
								// Only care about moves if peeking
								if (!this.peeking) return;
								var touch = event.touches[0];
								if (this.startPos && (this.startPos - touch.pageX > this.threshold)) {
									this.show(this.selected);
									
								}
							};
		menu.touchMoveHandler = menu.touchMoveHandler.bind(menu);
		
		// Handle the case of clicking the context menu while peeking
		menu.onclick = function(event) {
			if (this.peeking) {
				this.show(this.selected);
				event.stopPropagation();
			}
		}
		
		// Center the items in the list
		menu.centerMenuItems = function() {
								var windowHeight = bb.innerHeight(),
									itemHeight = 111,
									margin,
									numActions = 0,
									headerHeight = 0,
									i,
									isFirst = true,
									action;
									
								if (bb.device.isPlayBook) {
									itemHeight = 53;
								} else if (bb.device.is720x720) {
									itemHeight = 80;
								} 								
								headerHeight = (this.actionBar == undefined) ? itemHeight : 0;
							
								// See how many actions to use for calculations
								
								for (i = 0; i < this.actions.length; i++) {
									action = this.actions[i];
									if (action.visible == true) {
										numActions++;
										if (isFirst && (this.pinnedAction != action)) {
											isFirst = false;
											action.setAttribute('class',action.normal + ' bb-context-menu-item-first-dark');
											action.isFirst = true;
										} else if (this.pinnedAction != action){
											action.setAttribute('class',action.normal);
										}
									}
								}
								numActions = (this.pinnedAction) ? numActions - 1 : numActions;
								margin = windowHeight - Math.floor(windowHeight/2) - Math.floor((numActions * itemHeight)/2) - headerHeight;
								if (margin < 0) margin = 0;
								this.scrollContainer.style['padding-top'] = margin +'px';
							};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
		
		// Make sure we move when the orientation of the device changes
		menu.orientationChanged = function(event) {
								this.style['-webkit-transition'] = '';
								this.style.left = bb.innerWidth() + 'px';
								this.style.height = bb.innerHeight() + 'px';
								this.centerMenuItems();
							};
		menu.orientationChanged = menu.orientationChanged.bind(menu);	
		window.addEventListener('orientationchange', menu.orientationChanged,false); 
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'orientationchange', eventHandler: menu.orientationChanged});
		
		// Listen for when the animation ends so that we can make it invisible to avoid orientation change artifacts
		menu.addEventListener('webkitTransitionEnd', function() { 
						if (!this.visible) {
							this.style.visibility = 'hidden';
						}
					});
		
		// Create our add item function
		menu.add = function(action) {
				var normal, 
					highlight,
					caption = action.innerHTML,
					pin = false;
				
				// set our styling
				normal = 'bb-context-menu-item bb-context-menu-item-dark';

				// Check for our visibility
				if (action.hasAttribute('data-bb-visible') && action.getAttribute('data-bb-visible').toLowerCase() == 'false') {
					action.visible = false;
					action.style.display = 'none';
				} else {
					action.visible = true;
				}
				this.actions.push(action);
				
				// See if this item should be pinned to the bottom
				pin = (action.hasAttribute('data-bb-pin') && action.getAttribute('data-bb-pin').toLowerCase() == 'true');
				if (pin && !this.pinnedAction) {
					normal = normal + ' bb-context-menu-item-first-dark';
					action.style['bottom'] = '-2px';
					action.style.position = 'absolute';
					action.style.width = '100%';
					this.pinnedAction = action;
					this.appendChild(action);
					if (bb.device.isPlayBook) {
						this.scrollContainer.style.bottom = '64px';
					} else if (bb.device.is720x720) {
						this.scrollContainer.style.bottom = '95px';
					} else {
						this.scrollContainer.style.bottom = '130px';
					}
				} else {
					this.scrollContainer.appendChild(action);
				}

				highlight = normal + ' bb-context-menu-item-hover';
				action.normal = normal;
				action.highlight = highlight;
				// Set our inner information
				action.innerHTML = '';
				var inner = document.createElement('div'),
					img = document.createElement('img');
				img.setAttribute('src', action.getAttribute('data-bb-img'));
				img.setAttribute('class','bb-context-menu-item-image');
				action.img = img;
				action.appendChild(img);
				inner.setAttribute('class','bb-context-menu-item-inner');
				action.appendChild(inner);
				inner.innerHTML = caption;
				action.display = inner;
				action.menu = this;
				
				action.setAttribute('class',normal);
				action.ontouchstart = function (e) {
										if (this.menu.peeking) {
											this.style['border-left-color'] = bb.options.highlightColor;
										} else {
											this.style['background-color'] = bb.options.highlightColor;
										}
										
										e.stopPropagation();
										// Hack because PlayBook doesn't seem to get all the touch end events
										if (bb.device.isPlayBook) {
											var existingAction, 
												i;
											for (i = 0; i < this.menu.actions.length; i++) {
												existingAction = this.menu.actions[i];
												if (existingAction != this) {
													existingAction.ontouchend();
												}
											}
										}
									}
				action.ontouchend = function () {
										if (this.menu.peeking) {
											this.style['border-left-color'] = 'transparent';
										} else {
											this.style['background-color'] = '';
										}
									}
				action.addEventListener("click", this.hide, false);
				
				// Assign the setCaption function
				action.setCaption = function(value) {
									this.display.innerHTML = value;
								};
				action.setCaption = action.setCaption.bind(action);
				
				// Assign the setImage function
				action.setImage = function(value) {
									this.img.setAttribute('src',value);
								};
				action.setImage = action.setImage.bind(action);
				
				// Assign the hide function
				action.hide = function() {
									if (!this.visible) return;
									this.visible = false;
									// Change style
									this.style.display = 'none';
									this.menu.centerMenuItems();
								};
				action.hide = action.hide.bind(action);
				
				// Assign the show function
				action.show = function() {
									if (this.visible) return;
									this.visible = true;   
									// Change style
									this.style.display = '';
									this.menu.centerMenuItems();
								};
				action.show = action.show.bind(action);
				
		};
		menu.add = menu.add.bind(menu);
		return menu;
	},
	
	// Calculate the proper width of the context menu
	getWidth : function() {
		if (bb.device.isPlayBook) {
			return '300';
		} else {
			return '563';		
		}
	},
	
	// Calculate the proper width of the context menu when peeking
	getPeekWidth : function() {
		if (bb.device.isPlayBook) {
			return '55px';
		} else {
			return '121px';		
		}
	},
	
	// Calculate the proper left of the context menu
	getLeft : function() {
		return window.innerWidth + 3 + 'px';	
	}
};
