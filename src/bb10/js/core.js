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