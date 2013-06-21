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

/* bbUI for PlayBook VERSION: 0.9.6.170*/

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
		meta.setAttribute('content','initial-scale=1.0,width=device-width,user-scalable=no,target-densitydpi=device-dpi');
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
		bb.imageList = _bbPlayBook_imageList;
		bb.button = _bbPlayBook_button;
		bb.bbmBubble = _bb_bbmBubble;
		bb.dropdown = _bbPlayBook_dropdown;
		bb.textInput = _bbPlayBook_textInput;
		bb.pillButtons = _bb_PlayBook_pillButtons;
		bb.labelControlContainers = _bb_PlayBook_labelControlContainers;
		bb.progress = _bb_progress;
		bb.scrollPanel = _bb_PlayBook_scrollPanel;
		bb.roundPanel = _bbPlayBook_roundPanel;
		bb.activityIndicator = _bbPlayBook_activityIndicator;
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
        if (bb.bbmBubble)				bb.bbmBubble.apply(root.querySelectorAll('[data-bb-type=bbm-bubble]'));
        if (bb.pillButtons)				bb.pillButtons.apply(root.querySelectorAll('[data-bb-type=pill-buttons]'));
        if (bb.labelControlContainers)	bb.labelControlContainers.apply(root.querySelectorAll('[data-bb-type=label-control-container]'));
        if (bb.button) 					bb.button.apply(root.querySelectorAll('[data-bb-type=button]'));
		if (bb.fileInput) 				bb.fileInput.apply(root.querySelectorAll('input[type=file]'));
		if (bb.slider)					bb.slider.apply(root.querySelectorAll('input[type=range]'));
		if (bb.progress)				bb.progress.apply(root.querySelectorAll('progress'));
		if (bb.radio)					bb.radio.apply(root.querySelectorAll('input[type=radio]'));
		if (bb.activityIndicator) 		bb.activityIndicator.apply(root.querySelectorAll('[data-bb-type=activity-indicator]'));
		if (bb.checkbox)				bb.checkbox.apply(root.querySelectorAll('input[type=checkbox]'));
	},
	getCurScreen : function(){
		return document.querySelector('[data-bb-type=screen]');
	},
	device: {  
        isRipple: false,
		is1024x600: true
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
				if (script.text) {
					//if there is text, just eval it since they probably don't have a src.
					eval(script.text);
					return;
				}
				var scriptGuid = bb.guidGenerator();
				// Either update the old screen in the stack record or add to the new one
				if (screenRecord) {
					screenRecord.scripts.push({'id' : scriptGuid, 'onunload': script.getAttribute('onunload')});
				} else {
					container.scriptIds.push({'id' : scriptGuid, 'onunload': script.getAttribute('onunload')});
				}
				scriptTag.setAttribute('type','text/javascript');
				scriptTag.setAttribute('src', script.getAttribute('src'));
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
        for (var i = 0; i < newScriptTags.length; i++) {
                document.body.appendChild(newScriptTags[i]);
                newScriptTags[i].onload = function() {
                    bb.screen.scriptCounter++;
                    if(bb.screen.scriptCounter == bb.screen.totalScripts) {
						bb.initContainer(container, id, popping, params);
                    }
                };
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
		// Remove our old screen
        bb.removeLoadedScripts();
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
			bb.windowListners = [];
			
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
		// Hack for ripple
		if (!window.orientation) {
			return window.innerHeight;
		} else if (window.orientation == 0 || window.orientation == 180) {
			return 600;
		} else if (window.orientation == -90 || window.orientation == 90) {
			return 1024;
		}
	},
	
	innerWidth: function() {
		// Orientation is backwards between playbook and BB10 smartphones
		// Hack for ripple
		if (!window.orientation) {
			return window.innerWidth;
		} else if (window.orientation == 0 || window.orientation == 180) {
			return 1024;
		} else if (window.orientation == -90 || window.orientation == 90) {
			return 600;
		}
	},
	
	// returns 'landscape' or 'portrait'
	getOrientation: function() {
		// Orientation is backwards between playbook and BB10 smartphones
		// Hack for ripple
		if (!window.orientation) {
			return (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
		} else if (window.orientation == 0 || window.orientation == 180) {
			return 'landscape';
		} else if (window.orientation == -90 || window.orientation == 90) {
			return 'portrait';
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
				if (target.scroller) {
					offsetTop += target.scroller.y;
				} else if (target.bbUIscrollWrapper) {
					offsetTop += bb.scroller.y;
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
	height: 100,
	itemWidth: 143,
	visible: false,
	menu: false,
	screen: false,

	apply: function(menuBar,screen){
		bb.menuBar.createSwipeMenu(menuBar,screen);
		menuBar.parentNode.removeChild(menuBar);
		if (window.blackberry){
			if(blackberry.app.event) {
				blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
			}
		}
		
	},

	createSwipeMenu: function(menuBar, screen){
		var pbMenu = document.createElement('div'), 
			items, 
			pbMenuInner, 
			j,
			item,
			img, 
			title, 
			div, 
			br, 
			pbMenuItem;

		pbMenu.setAttribute('class','pb-menu-bar');
		// See if there are any items declared
		items = menuBar.getElementsByTagName('div');
		if(items.length > 0){
			pbMenuInner	= document.createElement("ul");
			pbMenu.appendChild(pbMenuInner);				
			// Loop through our menu items
			for (j = 0; j < items.length; j++) {
				item = items[j];
				if(item.getAttribute('data-bb-type') === "menu-item"){
					// Assign our values
					title = item.innerHTML
					iconPath = item.getAttribute('data-bb-img');

					// If they don't hav both an icon and a title ignore the item
					if (title && iconPath) {
						// Create our item
						pbMenuItem = document.createElement("li");
						item.innerHTML = '';
						
						// Get our image
						img	= new Image();
						img.src	= iconPath;
						pbMenuItem.appendChild(img);
							
						// Add our caption
						div = document.createElement('div');
						div.setAttribute('class','pb-menu-bar-caption');
						div.innerText = title;
						pbMenuItem.appendChild(div);
						
						// Assign any click handlers
						pbMenuItem.onclick	= item.onclick;
						pbMenuInner.appendChild(pbMenuItem);
					}
				} else if(item.getAttribute('data-bb-type') === "menu-separator"){
					pbMenuInner	= document.createElement('ul');
					pbMenu.appendChild(pbMenuInner);
				} else{
					console.log('invalid menu item type');
				}
			}
		}
		// Set the size of the menu bar and assign the lstener
		pbMenu.style['-webkit-transform']	= 'translate(0,0)';
		pbMenu.addEventListener('click', bb.menuBar.onMenuBarClicked, false);
		document.body.appendChild(pbMenu);
		// Assign the menu
		bb.menuBar.menu	= pbMenu;	
		
		// Add the overlay for trapping clicks on items below
		if (!bb.screen.overlay) {
			bb.screen.overlay = document.createElement('div');
			bb.screen.overlay.setAttribute('class','bb-bb10-menu-bar-overlay');
		}
		screen.appendChild(bb.screen.overlay);
		bb.menuBar.menu.overlay = bb.screen.overlay;	
	},

	showMenuBar: function(){
		if(!bb.menuBar.visible && !bb.screen.animating){
			bb.menuBar.visible = true;
			blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);

			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate3d(0, ' + (bb.menuBar.height + 3) + 'px,0px)';

			bb.menuBar.visible = true;
			bb.menuBar.menu.overlay.addEventListener('touchstart', bb.menuBar.overlayTouchHandler, false);
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.visible){
			bb.menuBar.visible = false;
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);

			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate3d(0, -' + (bb.menuBar.height + 3) + 'px,0px)';

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
			if(bb.menuBar.menu){
				if(bb.menuBar.visible){
					bb.menuBar.hideMenuBar();
				}

				blackberry.app.event.onSwipeDown('');
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
		var color = 'light',
			highlightColor = bb.options.highlightColor,
			accentColor = '#8FB03B',
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
		if (bb.device.isBB10) {
			outerElement.fill.normal = 'bb-progress-fill bb10Highlight';
		} else {
			outerElement.fill.normal = 'bb-progress-fill bbProgressHighlight';
		}
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
bb.titleBar = {

	apply: function(titleBar) {
		titleBar.setAttribute('class', 'pb-title-bar');
		titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
		if (titleBar.hasAttribute('data-bb-back-caption')) {
			var button = document.createElement('div'), 
				buttonInner = document.createElement('div');
			button.setAttribute('class', 'pb-title-bar-back');
			button.onclick = bb.popScreen;
			buttonInner.setAttribute('class','pb-title-bar-back-inner');
			buttonInner.innerHTML = titleBar.getAttribute('data-bb-back-caption'); 
			button.appendChild(buttonInner);
			titleBar.appendChild(button);
		}
	}
};
_bbPlayBook_activityIndicator = {
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
				width = '93px';
			} else if (size == 'small') {
				width = '21px';
			} else {
				size = 'medium';
				width = '46px';
			}
			
			outerElement.style.width = width;
			// Add another div so that the developers styling on the original div is left untouched
			indicator = document.createElement('div');
			indicator.setAttribute('class',  'bb-pb-activity-margin bb-pb-activity-'+size+' bb-activity-'+color);
			outerElement.appendChild(indicator);
			innerElement = document.createElement('div');
			innerElement.setAttribute('class','bb-pb-activity-'+size);
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

		return outerElement;
		}
	}
}

_bbPlayBook_button = { 
    // Style a list of buttons
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
			captionElement = document.createElement('div'),
			innerElement = document.createElement('div');
			disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal = 'bb-pb-button',
			highlight = 'bb-pb-button-container bb-pb-button-container-' + bb.screen.controlColor + ' pb-button-'+bb.screen.controlColor+'-highlight'; 
			outerNormal = 'bb-pb-button-container bb-pb-button-container-' + bb.screen.controlColor +' bb-pb-button-font-'+ bb.screen.controlColor,
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
				outerElement.stretched = true;
				outerNormal = outerNormal + ' bb-pb-button-stretch';
				highlight = highlight + ' bb-pb-button-stretch';
			}
		}
		// look for our image
		imgSrc = outerElement.hasAttribute('data-bb-img') ? outerElement.getAttribute('data-bb-img') : undefined;
		if (imgSrc) {
			if (!caption || caption.length == 0) {
				outerNormal = outerNormal + ' bb-pb-button-container-image-only';
				highlight = highlight + ' bb-pb-button-container-image-only';
				captionElement.style['background-image'] = 'url("'+imgSrc+'")';
				outerElement.style['line-height'] = '0px';
				captionElement.setAttribute('class','bb-pb-button-caption-with-image-only');
				outerElement.isImageOnly = true;
			} else {
				// Configure our caption element
				captionElement.setAttribute('class','bb-pb-button-caption-with-image');
				imgElement = document.createElement('div');
				outerElement.imgElement = imgElement;
				imgElement.setAttribute('class','bb-pb-button-image');
				imgElement.style['background-image'] = 'url("'+imgSrc+'")';
				innerElement.appendChild(imgElement);
			}
		}
		// Insert caption after determining what to do with the image
		innerElement.appendChild(captionElement);
	
		// Set our styles
		disabledStyle = normal + ' bb-pb-button-disabled-'+bb.screen.controlColor;
		normal = normal + ' bb-pb-button-' + bb.screen.controlColor;
		
		if (disabled) {
			outerElement.removeAttribute('data-bb-disabled');
			innerElement.setAttribute('class',disabledStyle);
		} else {
			innerElement.setAttribute('class',normal);
		}
		// Set our variables on the elements
		outerElement.setAttribute('class',outerNormal);
		outerElement.outerNormal = outerNormal;
		outerElement.highlight = highlight;
		outerElement.outerNormalWithoutImageOnly = outerNormalWithoutImageOnly;
		outerElement.innerElement = innerElement;
		innerElement.normal = normal;
		innerElement.disabledStyle = disabledStyle;
		if (!disabled) {
			outerElement.ontouchstart = function() {
									this.setAttribute('class', this.highlight);
								};
			outerElement.ontouchend = function() {
									this.setAttribute('class', this.outerNormal);
									this.style.color = '';
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
					this.captionElement.setAttribute('class','bb-pb-button-caption-with-image');
					var imgElement = document.createElement('div');
					this.imgElement = imgElement;
					imgElement.setAttribute('class','bb-pb-button-image');
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
					this.captionElement.setAttribute('class','bb-pb-button-caption-with-image-only');
					// Reset our image only styling
					this.setAttribute('class',this.outerNormalWithoutImageOnly + ' bb-pb-button-container-image-only');
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
					this.captionElement.setAttribute('class','bb-pb-button-caption-with-image');
					var imgElement = document.createElement('div');
					this.imgElement = imgElement;
					imgElement.setAttribute('class','bb-pb-button-image');
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
									this.setAttribute('class', this.highlight);
									
								};
				this.ontouchend = function() {
									this.setAttribute('class', this.outerNormal);
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
_bbPlayBook_dropdown = { 
    // Style a list of items
	apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.dropdown.style(elements[i]);
		}
	},
	// Style an individual item
	style: function(select) {
		var options = select.getElementsByTagName('option'),
			caption = '',
			inEvent = 'ontouchstart',
			outEvent = 'ontouchend',
			enabled = !select.hasAttribute('disabled');
	
		select.style.display = 'none';
		select.stretch = false;
		select.enabled = enabled;
		
		// Get our selected item
		if (options.length > 0) {
			caption = options[0].innerHTML;
		}
		for (var j = 0; j < options.length; j++) {
			if (options[j].hasAttribute('selected')) {
				caption = options[j].innerHTML;
				break;
			}
		}

		// Create our new dropdown button
		var dropdown = document.createElement('div');
		dropdown.innerHTML = '<div data-bb-type="caption"><span>' + caption + '</span></div>';
		select.dropdown = dropdown;

		var normal = 'pb-dropdown',
			highlight = 'pb-dropdown-highlight pb-dropdown';
	
		if (select.hasAttribute('data-bb-style')) {
			var style = select.getAttribute('data-bb-style');
			if (style == 'stretch') {
				select.stretch = true;
				normal = normal + ' dropdown-stretch';
				highlight = highlight + ' dropdown-stretch';
			}
		}
		dropdown.setAttribute('data-bb-type','dropdown');
		if (select.enabled) {
			dropdown.setAttribute('class',normal);
		} else {
			dropdown.setAttribute('class',normal + ' pb-dropdown-disabled');
		}
		dropdown.inEvent = "this.setAttribute('class','" + highlight +"')";
		dropdown.outEvent = "this.setAttribute('class','" + normal + "')"
		
		if (select.parentNode) {
			select.parentNode.insertBefore(dropdown, select);
		}
		dropdown.appendChild(select);

		// Set our click handler
		dropdown.doclick = function() {
				var select = this.getElementsByTagName('select')[0];

				// Create the overlay to trap clicks on the screen
				var overlay = document.createElement('div');
				overlay.setAttribute('id', 'ripple-dropdown-overlay');
				overlay.style['position'] = 'absolute';
				overlay.style['left'] = '0px';	
				overlay.style['top'] = document.body.scrollTop + 'px';
				overlay.style['width'] = '100%';
				overlay.style['height'] = '100%';
				overlay.style['z-index'] = '1000000';
				// Close the overlay if they click outside of the select box
				overlay.onclick = function () {
					if (this.parentNode !== null) {
						this.parentNode.removeChild(this);
					}
				};

				// Create our dialog
				var dialog = document.createElement('div');
				dialog.setAttribute('class', 'ripple-dropdown-dialog bb-hires-screen');
				overlay.appendChild(dialog);
				dialog.onclick = function() {
					this.parentNode.parentNode.removeChild(this.parentNode);
				};

				// Add our options
				for (var i = 0; i < select.options.length; i++) {
					var item = select.options[i],
						highlight = document.createElement('div');

					dialog.appendChild(highlight);
					var option = document.createElement('div');
					if (item.selected) {
						option.setAttribute('class', 'item selected');
						highlight.setAttribute('class','backgroundHighlight backgroundSelected');
					} else {
						option.setAttribute('class', 'item');
						highlight.setAttribute('class','backgroundHighlight');
					}

					option.innerHTML = '<span>' + item.text + '</span>';
					option.setAttribute('x-blackberry-focusable','true');
					option.setAttribute('data-bb-index', i);
					// Assign our dropdown for when the item is clicked
					option.dropdown = this;
					option.onclick = function() {
						var index = this.getAttribute('data-bb-index');
						// Retrieve our select
						var select = this.dropdown.getElementsByTagName('select')[0];
						if (select) {
							select.setSelectedItem(index);
						}
					};
					// Add to the DOM
					highlight.appendChild(option);
				}

				var height = (select.options.length * 45) + 20,
					maxHeight = window.innerHeight - 80;
				if (height > maxHeight) {
					height = maxHeight;
					dialog.style.height = maxHeight + 'px';
				}

				var top = (window.innerHeight/2) - (height/2);
				dialog.style.top = top + 'px';

				// Add the overlay to the DOM now that we are done
				document.body.appendChild(overlay);
			};
			
		// Enable the clicking of the control if it is enabled
		if (select.enabled) {
			dropdown.onclick = dropdown.doclick;
			dropdown.setAttribute(inEvent, dropdown.inEvent);
			dropdown.setAttribute(outEvent,dropdown.outEvent);
		}
		
		// Assign our setSelectedItem function
		select.setSelectedItem = function(index) {
			var select = this.dropdown.getElementsByTagName('select')[0];
			if (select && select.selectedIndex != index) {
				select.selectedIndex = index;
				// Change our button caption
				var caption = this.dropdown.querySelectorAll('[data-bb-type=caption]')[0];
				if (caption) {
					caption.innerHTML = '<span>' + select.options[index].text + '</span>';
				}
				// Raise the DOM event
				var evObj = document.createEvent('HTMLEvents');
				evObj.initEvent('change', false, true );
				select.dispatchEvent(evObj);
			}
		};
		
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
				this.dropdown.onclick = this.dropdown.doclick;
				this.dropdown.setAttribute(inEvent, dropdown.inEvent);
				this.dropdown.setAttribute(outEvent,dropdown.outEvent);
				this.dropdown.setAttribute('class',normal);
				this.removeAttribute('disabled');
				this.enabled = true;
			};
		select.enable = select.enable.bind(select);
		
		// Assign our disable function
		select.disable = function(){ 
				if (!select.enabled) return;
				//this.dropdown.internalHide();
				this.dropdown.onclick = null;
				this.dropdown.removeAttribute(inEvent);
				this.dropdown.removeAttribute(outEvent);
				this.dropdown.setAttribute('class',normal + ' pb-dropdown-disabled');
				this.enabled = false;
				this.setAttribute('disabled','disabled');
			};
		select.disable = select.disable.bind(select);
		
			
		// Assign our show function
		select.show = function(){ 
				this.dropdown.style.display = this.stretch ? 'block' : 'table-cell';
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
				var options = this.getElementsByTagName('option'),
					captionElement,
					caption = '';
					
				if (options.length > 0) {
					caption = options[0].innerHTML;
				}
				for (var j = 0; j < options.length; j++) {
					if (options[j].hasAttribute('selected')) {
						caption = options[j].innerHTML;
						break;
					}
				}
				// Change our button caption
				 captionElement = this.dropdown.querySelectorAll('[data-bb-type=caption]')[0];
				if (captionElement) {
					captionElement.innerHTML = '<span>' + caption + '</span>';
				}
			};
		select.refresh = select.refresh.bind(select);
	  
		// Assign our setCaption function
		select.setCaption = function(value){ 
				if (console) {
					console.log('WARNING: setCaption is not supported on BlackBerry 5/6/7/PlayBook');
				}
			};
		select.setCaption = select.setCaption.bind(select);

		// Need to return the dropdown instead of the select for dynamic styling
		return dropdown;
    }
};

_bbPlayBook_imageList = {  
    apply: function(elements) {
		var i,j,
			outerElement,
			items;
				
		// Apply our transforms to all Image Lists
		for (var i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			outerElement.items = [];
			outerElement.hideImages = outerElement.hasAttribute('data-bb-images') ? (outerElement.getAttribute('data-bb-images').toLowerCase() == 'none') : false
			if (!outerElement.hideImages) {
				outerElement.imagePlaceholder = outerElement.hasAttribute('data-bb-image-placeholder') ? outerElement.getAttribute('data-bb-image-placeholder') : undefined;
			}
			// Get our header justification
			outerElement.headerJustify = outerElement.hasAttribute('data-bb-header-justify') ? outerElement.getAttribute('data-bb-header-justify').toLowerCase() : 'center';
			// See what kind of style they want for this list
			outerElement.listStyle = outerElement.hasAttribute('data-bb-style') ? outerElement.getAttribute('data-bb-style').toLowerCase() : 'default';
			// Get our header style
			outerElement.headerStyle = outerElement.hasAttribute('data-bb-header-style') ? outerElement.getAttribute('data-bb-header-style').toLowerCase() : 'default';

			outerElement.setAttribute('class','bb-pb-image-list');	
			outerElement.styleItem = function (innerChildNode) {
				// Gather our inner items
				var innerChildNode,
					type,
					description,
					accentText,
					normal,
					highlight,
					details,
					titleDiv,
					descriptionDiv,
					accentDiv,
					img,
					btn,
					btnBorder,
					btnInner;
							
				if (innerChildNode.hasAttribute('data-bb-type')) {
					type = innerChildNode.getAttribute('data-bb-type').toLowerCase();
					description = innerChildNode.innerHTML;
					accentText = '';
					
					// Grab the accent-text if it is there
					if (innerChildNode.hasAttribute('data-bb-accent-text')) {
						accentText = innerChildNode.getAttribute('data-bb-accent-text');
					}
					
					if (type == 'header') {
						// Initialize our styling
						normal = 'bb-pb-image-list-header';
						highlight = 'bb-pb-image-list-header-hover bb10Highlight';
						
						if (outerElement.headerStyle == 'solid') {
							normal = normal + ' bb-pb-image-list-header-solid bb10Accent';
						} else {
							normal = normal + ' bb-pb-image-list-header-default';
						}
						// Check for alignment
						if (this.headerJustify == 'left') {
							normal = normal + ' bb-pb-image-list-header-left';
							highlight = highlight + ' bb-pb-image-list-header-left';
						} else if (this.headerJustify == 'right') {
							normal = normal + ' bb-pb-image-list-header-right';
							highlight = highlight + ' bb-pb-image-list-header-right';
						} else {
							normal = normal + ' bb-'+res+'-image-list-header-center';
							highlight = highlight + ' bb-pb-image-list-header-center';
						}
						// Set our styling
						innerChildNode.normal = normal;
						innerChildNode.highlight = highlight;
						innerChildNode.innerHTML = '<p>'+ description +'</p>';
						innerChildNode.setAttribute('class', normal);
						innerChildNode.ontouchstart = function() {
														this.setAttribute('class',this.highlight);
													}
						innerChildNode.ontouchend = function() {
														this.setAttribute('class',this.normal);
													}
					} 
					else if (type == 'item') {
						innerChildNode.normal = 'bb-pb-image-list-item';
						innerChildNode.highlight = 'bb-pb-image-list-item bb-pb-image-list-item-hover bb10Highlight';
						innerChildNode.innerHTML = '';
						innerChildNode.setAttribute('class', 'bb-pb-image-list-item');
						innerChildNode.ontouchstart = function() {
														this.setAttribute('class',this.highlight);
													}
						innerChildNode.ontouchend = function() {
														this.setAttribute('class',this.normal);
													}
						
						if (!this.hideImages) {
							img = document.createElement('img');
							innerChildNode.img = img;
							if (this.imagePlaceholder) {
								img.placeholder = this.imagePlaceholder;
								img.src = innerChildNode.hasAttribute('data-bb-img') ? innerChildNode.getAttribute('data-bb-img') : this.imagePlaceholder;
								img.onerror = function() {
												if (this.src == this.placeholder) return;
												this.src = this.placeholder;
											};
							} else {
								img.setAttribute('src',innerChildNode.getAttribute('data-bb-img') );
							}
							innerChildNode.appendChild(img);
						}
						
						details = document.createElement('div');
						innerChildNode.appendChild(details);
						if (this.hideImages) {
							details.normal = 'bb-pb-image-list-details bb-pb-image-list-noimage';
						} else {
							details.normal = 'bb-pb-image-list-details';
						}
						
						titleDiv = document.createElement('div');
						titleDiv.innerHTML = innerChildNode.getAttribute('data-bb-title');
						titleDiv.className = 'title';
						innerChildNode.titleDiv = titleDiv;
						details.appendChild(titleDiv);
						
						// Add our arrows if needed
						if (this.listStyle == 'arrowlist') {
							// Add the margin to details
							details.normal = details.normal + ' details-button-margin';
							btn = document.createElement('div');
							innerChildNode.appendChild(btn);
							innerChildNode.btn = btn;
							btn.setAttribute('class','button');
							// Create the button border
							btnBorder = document.createElement('div');
							btnBorder.normal = 'bb-pb-image-list-item-button-border';
							btnBorder.setAttribute('class',btnBorder.normal);
							btn.appendChild(btnBorder);
							// Create the inner button that has the image
							btnInner = document.createElement('div');
							btnInner.setAttribute('class','bb-pb-image-list-item-button-inner bb-image-list-item-chevron-light');
							btnBorder.appendChild(btnInner);
						} else {
							// Only add accent text if there are no arrows
							accentDiv = document.createElement('div');
							accentDiv.innerHTML = accentText;
							accentDiv.className = 'accent-text';
							innerChildNode.accentDiv = accentDiv;
							details.appendChild(accentDiv);
						}
						
						details.setAttribute('class', details.normal);
						
						// Add the description
						descriptionDiv = document.createElement('div');
						descriptionDiv.className = 'description';
						innerChildNode.descriptionDiv = descriptionDiv;
						details.appendChild(descriptionDiv);
						
						// Adjust the description description
						if (description.length == 0) {
							description = '&nbsp;';
							descriptionDiv.style.visibilty = 'hidden';
							// Center the title if no description is given
							titleDiv.style['margin-top'] =  '19px';
							// Adjust accent text
							if (accentDiv) {
								accentDiv.style['margin-top'] = '-23px';
							}
							// Adjust any arrows
							if (this.listStyle == 'arrowlist') {
								btn.style['margin-top'] =  '-69px';
							}
						}
						descriptionDiv.innerHTML = description;
						
						// Add the remove function for the item
						innerChildNode.remove = function() {
								var listControl = this.parentNode,
									index = listControl.items.indexOf(this);
								this.parentNode.removeChild(this);
								listControl.items.splice(index,1);	
								if (bb.scroller) {
									bb.scroller.refresh();
								}
							}
						innerChildNode.remove = innerChildNode.remove.bind(innerChildNode);	
						
						// Add our subscription for click events to set selected
						innerChildNode.trappedClick = innerChildNode.onclick;
						innerChildNode.onclick = undefined;
						innerChildNode.outerElement = this;
						innerChildNode.addEventListener('click',function (e) {
								this.outerElement.selected = this;
								if (this.trappedClick) {
									this.trappedClick();
								}
							},false);
							
						// Add our getter functions
						innerChildNode.getTitle = function() {
								return this.titleDiv.innerHTML;
							}
						innerChildNode.getTitle = innerChildNode.getTitle.bind(innerChildNode);	
						innerChildNode.getDescription = function() {
								return this.descriptionDiv.innerHTML;
							}
						innerChildNode.getDescription = innerChildNode.getDescription.bind(innerChildNode);	
						innerChildNode.getAccentText = function() {
								return (this.accentDiv) ? this.accentDiv.innerHTML : undefined;
							}
						innerChildNode.getAccentText = innerChildNode.getAccentText.bind(innerChildNode);	
						innerChildNode.getImage = function() {
								return (this.img) ? this.img.getAttribute('src') : undefined;
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
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
			outerElement.appendItem = outerElement.appendItem.bind(outerElement);
			
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
				};
			outerElement.refresh = outerElement.refresh.bind(outerElement);
			
			// Insert an item before another item in the list
			outerElement.insertItemBefore = function(newItem, existingItem) {
					this.styleItem(newItem);
					this.insertBefore(newItem,existingItem);
					this.items.splice(this.items.indexOf(existingItem),0,newItem);
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
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
			outerElement.show = outerElement.show.bind(outerElement);
			
			// Add our hide function
			outerElement.hide = function() {
				this.style.display = 'none';
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
			outerElement.hide = outerElement.hide.bind(outerElement);
			
			// Add remove function
			outerElement.remove = function() {
				this.parentNode.removeChild(this);
					if (bb.scroller) {
						bb.scroller.refresh();
					}
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
_bbPlayBook_roundPanel = {  
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			outerElement.setAttribute('class','pb-round-panel');
			var items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
			for (var j = 0; j < items.length; j++) {
				items[j].setAttribute('class','pb-panel-header');
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
_bbPlayBook_textInput = { 
    apply: function(elements) {
		var i,
			outerElement,
			css;
			
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			css = '';
			// Keep the developers existing styling
			if (outerElement.hasAttribute('class')) {
				css = outerElement.getAttribute('class');
			}
		  
			outerElement.normal = css + ' bb-pb-input';
			outerElement.focused = css + ' bb-pb-input-focused bb-pb-input';
			outerElement.setAttribute('class', outerElement.normal);
			outerElement.isFocused = false;
			outerElement.clickCount = 0;
			outerElement.addEventListener('focus', function() {
														if(this.readOnly == false) {
															this.setAttribute('class',this.focused);
															this.isFocused = true;
															this.clickCount = 0;
														}
													}, false);
													
			outerElement.addEventListener('blur', function() {
														this.setAttribute('class',this.normal);	
														this.isFocused = false;
														this.removeEventListener('click',outerElement.handleDeleteClick , false);
													}, false);
													
			outerElement.addEventListener('click',function (event) {
												// Don't handle the first click which is the focus
											
												if (this.clickCount == 0) {
													this.clickCount++;
													return;
												}
												if (event.target == this && this.isFocused) {
													var deleteClicked = false;
													if (event.clientX > (this.clientWidth - 40) && this.readOnly == false) {
														deleteClicked = true;
													} 
													if (deleteClicked) {
														this.value = '';
													}
												}
											} , false);
		}
    }
};
_bb_PlayBook_labelControlContainers = {
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			
			// Fetch all our rows
			var items = outerElement.querySelectorAll('[data-bb-type=row]');
			if (items.length > 0 ) {
				// Create our containing table
				var table = document.createElement('table');
				table.setAttribute('class','pb-label-control-rows');
				outerElement.insertBefore(table,items[0]);
				
				for (var j = 0; j < items.length; j++) {
					var row = items[j],
						tr = document.createElement('tr');
					table.appendChild(tr);
					// Get the label
					var tdLabel = document.createElement('td');
					tr.appendChild(tdLabel);
					var label = row.querySelectorAll('[data-bb-type=label]')[0];
					row.removeChild(label);
					tdLabel.appendChild(label);
					// Get the control
					var tdControl = document.createElement('td');
					tr.appendChild(tdControl);
					var control = row.querySelectorAll('[data-bb-type=button],input,[data-bb-type=dropdown],textarea')[0];
					row.removeChild(control);
					tdControl.appendChild(control);
					outerElement.removeChild(row);
					var bbType = control.getAttribute('data-bb-type');
					if (bbType == 'button' || bbType == 'dropdown') {
						control.style.float = 'right';
					} else if (control.tagName == 'INPUT') {
						control.style.width = '100%';
					}
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
_bb_PlayBook_pillButtons = {  
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i],
				containerStyle = 'pb-pill-buttons pb-pill-buttons',
				buttonStyle = 'pb-pill-button';	
			
			outerElement.setAttribute('class',containerStyle);	
			// Gather our inner items
			var inEvent = 'ontouchstart', 
				outEvent = 'ontouchend', 
				items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
				percentWidth = Math.floor(98 / items.length),
				sidePadding = 102-(percentWidth * items.length);

			outerElement.style['padding-left'] = sidePadding + '%';
			outerElement.style['padding-right'] = sidePadding + '%';
			for (var j = 0; j < items.length; j++) {
				var innerChildNode = items[j];
				if (j === 0) {  // First button
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','pb-pill-button-highlight pb-pill-button-left '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','pb-pill-button pb-pill-button-left '+ buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight pb-pill-button-left " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button pb-pill-button-left " + buttonStyle +"')");
					}
				} else if (j == items.length -1) { // Right button
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','pb-pill-button-highlight pb-pill-button-right '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','pb-pill-button pb-pill-button-right ' + buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight pb-pill-button-right " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button pb-pill-button-right " + buttonStyle +"')");
					}
				} else { // Middle Buttons
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','pb-pill-button-highlight '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','pb-pill-button ' + buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button " + buttonStyle +"')");
					}
				}
				// Set our width
				innerChildNode.style.width = percentWidth + '%';
				// Add our subscription for click events to change highlighting
				innerChildNode.addEventListener('click',function (e) {
						var inEvent = 'ontouchstart', 
							outEvent = 'ontouchend', 
							items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
						
						for (var j = 0; j < items.length; j++) {
							var innerChildNode = items[j];
							
							if (j === 0) {  // First button
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','pb-pill-button-highlight pb-pill-button-left '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','pb-pill-button pb-pill-button-left '+ buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight pb-pill-button-left " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button pb-pill-button-left " + buttonStyle +"')");
								}
							} else if (j == items.length -1) { // Right button
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','pb-pill-button-highlight pb-pill-button-right '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','pb-pill-button pb-pill-button-right ' + buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight pb-pill-button-right " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button pb-pill-button-right " + buttonStyle +"')");
								}
							} else { // Middle Buttons
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','pb-pill-button-highlight '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','pb-pill-button ' + buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button " + buttonStyle +"')");
								}
							}
						}
						
					},false);
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
			
			// Add getButtons function
			outerElement.getButtons = function() {
						var items = this.querySelectorAll('[data-bb-type=pill-button]');
						var buttonArray = new Array();
						for (var j = 0; j < items.length; j++) {
							buttonArray[j] = items[j].innerHTML;					
						}				
						return buttonArray;
					};
			outerElement.getButtons = outerElement.getButtons.bind(outerElement);
		}
    } 
};

_bb_PlayBook_scrollPanel = {
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
					this.scroller.refresh();
				};
			outerElement.refresh = outerElement.refresh.bind(outerElement);
			setTimeout(outerElement.refresh,0);
			// Set ScrollTo
			outerElement.scrollTo = function(x, y) {
					this.scroller.scrollTo(x, y);
				};
			outerElement.scrollTo = outerElement.scrollTo.bind(outerElement);
			// Set ScrollToElement
			outerElement.scrollToElement = function(element) {
					this.scroller.scrollToElement(element);
				};
			outerElement.scrollToElement = outerElement.scrollToElement.bind(outerElement);
			outerElement.setAttribute('class','bb-scroll-panel');
		}
	}	
};
