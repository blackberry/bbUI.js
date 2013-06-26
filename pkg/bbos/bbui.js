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

/* bbUI for BBOS VERSION: 0.9.6.153*/

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
		
		// Assign our back handler if provided otherwise assign the default
		if (window.blackberry && blackberry.system && blackberry.system.event && blackberry.system.event.onHardwareKey) {	
			if (bb.options.onbackkey) {
				blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, bb.options.onbackkey);
			} else { // Use the default 
				blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, bb.popScreen);
			}
		}
		
		// Initialize our flags once so that we don't have to run logic in-line for decision making
		bb.device.isRipple = (navigator.userAgent.indexOf('Ripple') >= 0) || window.tinyHippos;
		bb.device.isPlayBook = (navigator.userAgent.indexOf('PlayBook') >= 0) || ((window.innerWidth == 1024 && window.innerHeight == 600) || (window.innerWidth == 600 && window.innerHeight == 1024));
		
		if (bb.device.isPlayBook && bb.options.bb10ForPlayBook) {
			bb.device.isBB10 = true;
		} else {
			bb.device.isBB10 = (navigator.userAgent.indexOf('BB10') >= 0);
		}
		bb.device.isBB7 = (navigator.userAgent.indexOf('7.0.0') >= 0) || (navigator.userAgent.indexOf('7.1.0') >= 0);
		bb.device.isBB6 = navigator.userAgent.indexOf('6.0.0') >= 0;
		bb.device.isBB5 = navigator.userAgent.indexOf('5.0.0') >= 0;
		
		// Set our resolution flags
		bb.device.is1024x600 = bb.device.isPlayBook;
		bb.device.is1280x768 = (window.innerWidth == 1280 && window.innerHeight == 768) || (window.innerWidth == 768 && window.innerHeight == 1280);
		bb.device.is720x720 = (window.innerWidth == 720 && window.innerHeight == 720);
		bb.device.is1280x720 = (window.innerWidth == 1280 && window.innerHeight == 720) || (window.innerWidth == 720 && window.innerHeight == 1280);
		
		// Determine HiRes
		if (bb.device.isRipple) {
			bb.device.isHiRes = window.innerHeight > 480 || window.innerWidth > 480; 
		} else {
			bb.device.isHiRes = screen.width > 480 || screen.height > 480;
		}
		
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
		if (bb.device.isBB10 && !bb.device.is1024x600) { 
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
		if (bb.device.isBB10) {
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
		} else if (bb.device.isBB5) {
			bb.imageList = _bb_5_6_7_imageList;
			bb.button = _bb5_button;
			bb.bbmBubble = _bb_bbmBubble;
			bb.roundPanel = _bb_5_6_7_roundPanel;
			bb.pillButtons = _bb5_pillButtons;
			bb.labelControlContainers = _bb5_labelControlContainers;
			bb.progress = _bb_progress;
		} else if (bb.device.isPlayBook) {
			bb.imageList = _bbPlayBook_imageList;
			bb.button = _bbPlayBook_button;
			bb.bbmBubble = _bb_bbmBubble;
			bb.dropdown = _bb_6_7_PlayBook_dropdown;
			bb.textInput = _bbPlayBook_textInput;
			bb.pillButtons = _bb_6_7_PlayBook_pillButtons;
			bb.labelControlContainers = _bb_6_7_PlayBook_labelControlContainers;
			bb.progress = _bb_progress;
			bb.scrollPanel = _bb_PlayBook_10_scrollPanel;
			bb.roundPanel = _bbPlayBook_roundPanel;
			bb.activityIndicator = _bbPlayBook_activityIndicator;
		} else { //BB6 & BB7
			bb.imageList = _bb_5_6_7_imageList;
			bb.button = _bb_6_7_button;
			bb.bbmBubble = _bb_bbmBubble;
			bb.dropdown = _bb_6_7_PlayBook_dropdown;
			bb.textInput = _bb_6_7_textInput;
			bb.pillButtons = _bb_6_7_PlayBook_pillButtons;
			bb.labelControlContainers = _bb_6_7_PlayBook_labelControlContainers;
			bb.progress = _bb_progress;
			bb.roundPanel = _bb_5_6_7_roundPanel;
		}
		
		// Add our keyboard listener for BB10
		if (bb.device.isBB10 && !bb.device.isPlayBook && !bb.device.isRipple && !bb.device.is720x720) {
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
		if (bb.device.isBB10 && !bb.device.isPlayBook && !bb.device.isRipple) {
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
        // perform device specific formatting
        bb.screen.reAdjustHeight();	
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
        isHiRes: false, 
        isBB5: false,
		isBB6: false,
		isBB7: false,
		isBB10: false,
        isPlayBook: false, 
        isRipple: false,
		// Resolutions
		is1024x600: false,
		is1280x768: false,
		is720x720: false,
		is1280x720: false		
    },
	
	// Options for rendering
	options: {
		onbackkey: null,
		onscreenready: null,
		ondomready: null,  		
		controlsDark: false, 
		coloredTitleBar: false,
		listsDark: false,
		highlightColor: '#00A8DF',
		bb10ForPlayBook: false
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
				if (!bb.device.isBB5 && !bb.device.isBB6) {
					effect = animationScreen.getAttribute('data-bb-effect');
					if (effect) {
						effect = effect.toLowerCase();
					
						if (effect == 'fade') {
							effectToApply = bb.screen.fadeIn;
						} else if (effect == 'fade-out') {
							effectToApply = bb.screen.fadeOut;
						} else if (!bb.device.isBB7) {
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
				if ((bb.device.isBB5 || bb.device.isBB6 || bb.device.isBB7) && (bb.screens.length > 0)) {
					bb.removePreviousScreenFromDom();
				} else if (bb.screens.length > 1) {
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
					// LEAVING THESE HERE INCASE WE NEED TO FALL BACK TO ISCROLL OVERRIDES
					/*if (bb.options.screen && bb.options.screen.onBeforeScrollStart) {
						bb.options.screen.onBeforeScrollStart(e);
					}*/
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
				// LEAVING THESE HERE INCASE WE NEED TO FALL BACK TO ISCROLL OVERRIDES
				/*if (bb.options.screen) {
					var excluded = ['onBeforeScrollStart','hideScrollbar','fadeScrollbar'];
					for (var i in bb.options.screen) {
						if (excluded.indexOf(i) === -1) {
							scrollerOptions[i] = bb.options.screen[i];
						}
					}
				}*/
				bb.scroller = new iScroll(scrollWrapper, scrollerOptions); 
			} else if (bb.device.isBB10) {
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
		// Remove our old screen
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
			
			// Quirk with displaying with animations
			if (bb.device.isBB5 || bb.device.isBB6 || bb.device.isBB7) {
				currentScreen = document.getElementById(bb.screens[numItems -1].guid);
				currentScreen.style.display = 'none';
				window.scroll(0,0);
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
					
            // Quirky BrowserField2 bug on BBOS
			if (bb.device.isBB5 || bb.device.isBB6 || bb.device.isBB7) {
				window.scroll(0,0);
			}
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
bb.menuBar = {
	menu: false,

	apply: function(menuBar,screen){
		if(window.blackberry && blackberry.ui.menu){
			bb.menuBar.createBlackberryMenu(menuBar);
			menuBar.parentNode.removeChild(menuBar);
		}else{
			console.log('Unable to create Blackberry menu.');
		}
	},

	createBlackberryMenu: function(menuBar){
		var items, 
			item, 
			title,
			div;
		items = menuBar.getElementsByTagName('div');
		for (var j = 0; j < items.length; j++) {
			div = items[j];
			if(div.getAttribute('data-bb-type') === "menu-item"){
				title = div.innerHTML;
				if(title){
					item = new blackberry.ui.menu.MenuItem(false, j, title, div.onclick);
					blackberry.ui.menu.addMenuItem(item);
					if(div.hasAttribute('data-bb-selected') && div.getAttribute('data-bb-selected') === "true"){
						blackberry.ui.menu.setDefaultMenuItem(item);
					}
				}else{
					console.log("can't add menu item without data-bb-caption");
				}
			}else if(div.getAttribute('data-bb-type') === "menu-separator"){
				item = new blackberry.ui.menu.MenuItem(true, j);
				blackberry.ui.menu.addMenuItem(item);
			}else{
				console.log('invalid menu item type');
			}
		}		
	},

	clearMenu: function(){
		if(window.blackberry){
			if(blackberry.ui && blackberry.ui.menu){
				blackberry.ui.menu.clearMenuItems();
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
		var color,
			highlightColor,
			accentColor,
			NORMAL = 0,
			PAUSED = 1,
			ERROR = 2;

		if (bb.device.isBB10) {
			color = bb.screen.controlColor;
			highlightColor = bb.options.highlightColor;
			accentColor = bb.options.shades.darkHighlight;
		} else {
			color = 'light';
			highlightColor = (bb.device.isPlayBook) ? bb.options.highlightColor : '#92B43B';
			accentColor = '#8FB03B';
		}
		
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
		var screenRes,
			outerElement;
		// Reset our context Menu
		bb.screen.contextMenu = null;
		
		if (bb.device.isBB10 && bb.device.isPlayBook) {
			screenRes = 'bb-bb10-1024x600-screen';
		} else if (bb.device.isBB10 && (bb.device.is1280x768 || bb.device.is1280x720)) {
			screenRes = 'bb-bb10-1280x768-1280x720-screen';
		} else if (bb.device.isBB10 && bb.device.is720x720) {
			screenRes = 'bb-bb10-720x720-screen';
		} else if (bb.device.isHiRes) {
			screenRes = 'bb-hires-screen';
		}
		
        for (var i = 0; i < elements.length; i++) {
            outerElement = elements[i];
            bb.screen.currentScreen = outerElement;
			// Set our screen resolution
			outerElement.setAttribute('class', screenRes);
            		
			//check to see if a menu/menuBar needs to be created
           
            if (bb.device.isBB10) {
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
			} 
			else if (bb.device.isPlayBook) {
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
            }
            else {
				var menuBar = outerElement.querySelectorAll('[data-bb-type=menu]');
				if (menuBar.length > 0) {
					menuBar = menuBar[0];
					bb.menuBar.apply(menuBar,outerElement);
				}
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
			return 95;
		}else {
			return 111;
		}
	}
		
};
bb.titleBar = {

	apply: function(titleBar) {
		
		if (bb.device.isBB10) {
			var res = '1280x768-1280x720',
				orientation = bb.getOrientation(),
				button,
				caption,
				titleBarClass,
				details,
				topTitleArea = document.createElement('div'),
				img,
				accentText;
			
			// Set our 'res' for known resolutions, otherwise use the default
			if (bb.device.is1024x600) {
				res = '1024x600';
			} else if (bb.device.is1280x768 || bb.device.is1280x720) {
				res = '1280x768-1280x720';
			} else if (bb.device.is720x720) {
				res = '720x720';
			}
			
			// Insert our title area
			titleBar.topTitleArea = topTitleArea;
			titleBar.appendChild(topTitleArea);
			
			// Style our title bar
			
			if (bb.options.coloredTitleBar) {
				titleBarClass = 'bb-bb10-title-bar-'+res +' bb-bb10-title-bar-'+ orientation + '-' +res +' bb10-title-colored';
			} else {
				titleBarClass = 'bb-bb10-title-bar-'+res +' bb-bb10-title-bar-'+ orientation + '-' +res +' bb-bb10-title-bar-' + bb.screen.controlColor;
			}
			topTitleArea.setAttribute('class', titleBarClass);
			
			// Set our caption
			caption = document.createElement('div');
			titleBar.caption = caption;
			caption.setAttribute('class','bb-bb10-title-bar-caption-'+res+ ' bb-bb10-title-bar-caption-'+ orientation+ '-'+res);
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
				caption.setAttribute('class','bb-bb10-title-bar-caption-left-'+res);
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
					details.setAttribute('class', 'bb-bb10-title-bar-caption-details-img-'+res);
					
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
					accentText.setAttribute('class','bb-bb10-title-bar-accent-text-'+ res);
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
			
			
		} else if (bb.device.isPlayBook) {
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
		} else {
			//device is legacy

            // assign a setCaption function
            titleBar.setCaption = function(value) {

                if(!value) {
                    // if no value specified, pull from attribute

                    value = this.getAttribute('data-bb-caption');
                    this.innerHTML = value;
                    return;
                }

                // update the innerHTML and the attribute to be through
                this.setAttribute('data-bb-caption', value);
                this.innerHTML = value;
            };

            titleBar.setCaption = titleBar.setCaption.bind(titleBar);

            // Assign the getCaption function
            titleBar.getCaption = function() {
                return this.innerHTML;
            };

            titleBar.getCaption = titleBar.getCaption.bind(titleBar);


			if (titleBar.hasAttribute('data-bb-caption')) {
				if (bb.device.isHiRes) {
					titleBar.setAttribute('class', 'bb-hires-screen-title');
				} else {
					titleBar.setAttribute('class', 'bb-lowres-screen-title');
				}
				titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
			}
		}
	},
	
	styleBB10Button: function(outerElement) {
		var res = '1280x768-1280x720',
			//disabledStyle,
			innerElement = document.createElement('div'),
			//disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal,
			highlight, 
			outerNormal;
		
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			res = '1024x600';
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			res = '1280x768-1280x720';
		} else if (bb.device.is720x720) {
			res = '720x720';
		}
		
		if (bb.options.coloredTitleBar) {
			normal = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb10-title-button-colored';
			highlight = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb10-title-button-colored-highlight';
			outerNormal = 'bb-bb10-titlebar-button-container-'+res+' bb10-title-button-container-colored';
			// Set our styles
			//disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
		} else {
			normal = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb-bb10-titlebar-button-' + bb.screen.controlColor;
			highlight = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb-bb10-titlebar-button-highlight-'+ bb.screen.controlColor;
			outerNormal = 'bb-bb10-titlebar-button-container-'+res+' bb-bb10-titlebar-button-container-' + bb.screen.controlColor;
			// Set our styles
			//disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
		}

		//outerElement.enabled = !disabled;
		outerElement.enabled = true;
		innerElement.innerHTML = outerElement.innerHTML;
		outerElement.innerHTML = '';
		outerElement.appendChild(innerElement);
		
		/*if (disabled) {
			outerElement.removeAttribute('data-bb-disabled');
			innerElement.setAttribute('class',disabledStyle);
		} else {*/
			innerElement.setAttribute('class',normal);
		//}
		// Set our variables on the elements
		outerElement.setAttribute('class',outerNormal);
		outerElement.outerNormal = outerNormal;
		outerElement.innerElement = innerElement;
		innerElement.normal = normal;
		innerElement.highlight = highlight;
		//innerElement.disabledStyle = disabledStyle;
		//if (!disabled) {
			outerElement.ontouchstart = function() {
									this.innerElement.setAttribute('class', this.innerElement.highlight);
								};
			outerElement.ontouchend = function() {
									this.innerElement.setAttribute('class', this.innerElement.normal);
								};
		//}
						
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
		
		// Assign our enable function
	  /*  outerElement.enable = function(){ 
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
		// Assign our disable function
		outerElement.disable = function(){ 
				if (!this.enabled) return;
				this.innerElement.setAttribute('class', this.innerElement.disabledStyle);
				this.ontouchstart = null;
				this.ontouchend = null;
				this.enabled = false;
			};*/
        
	
	}
};
_bb5_button = {
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i],
				caption = outerElement.innerHTML,
				normal = 'bb5-button',
				highlight = 'bb5-button-highlight';

			outerElement.innerHTML = '';
			outerElement.setAttribute('class','bb-bb5-button');
			var button = document.createElement('a');
			button.setAttribute('class',normal);
			button.setAttribute('x-blackberry-focusable','true');
			button.setAttribute('onmouseover',"this.setAttribute('class','" + highlight +"')");
			button.setAttribute('onmouseout',"this.setAttribute('class','" + normal + "')");
			outerElement.appendChild(button);
			var span = document.createElement('span');
			span.innerHTML = caption;
			button.appendChild(span);
		}
	}
}
_bb5_labelControlContainers = {
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			outerElement.setAttribute('class','bb-label-control-horizontal-row');
			// Gather our inner items
			var items = outerElement.querySelectorAll('[data-bb-type=label]');
			for (var j = 0; j < items.length; j++) {
				var label = items[j];
				label.setAttribute('class', 'bb-label');
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
_bb5_pillButtons = {  
    // Apply our transforms to all pill buttons passed in
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			outerElement.setAttribute('class','bb-pill-buttons');

			// Gather our inner items
			var items = outerElement.querySelectorAll('[data-bb-type=pill-button]');
			for (var j = 0; j < items.length; j++) {
				var innerChildNode = items[j];
				innerChildNode.setAttribute('x-blackberry-focusable','true');
				var text = innerChildNode.innerHTML;
				innerChildNode.innerHTML = '<span>' + text + '</span>';
				
				if (j === 0) {
					innerChildNode.setAttribute('class','buttonLeft');
				}
				else if (j == items.length -1) {
					innerChildNode.setAttribute('class','buttonRight');
				}
				else {
					innerChildNode.setAttribute('class','buttonMiddle');
				}
				
				// See if the item is marked as selected
				if (innerChildNode.hasAttribute('data-bb-selected') && innerChildNode.getAttribute('data-bb-selected').toLowerCase() == 'true') {
					bb.pillButtons.selectButton(innerChildNode);
				}
				
				// Change the selected state when a user presses the button
				innerChildNode.onmousedown = function() {
					bb.pillButtons.selectButton(this);
					var buttons = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
					for (var i = 0; i < buttons.length; i++) {
						var button = buttons[i];
						if (button != this) {
							bb.pillButtons.deSelectButton(button);
						}
					}
				};
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
_bb_5_6_7_imageList = {  
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
			
			if (bb.device.isHiRes) {
					outerElement.setAttribute('class','bb-hires-image-list');
			} else {
				outerElement.setAttribute('class','bb-lowres-image-list');
			}
			
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
					btnInner,
					res = (bb.device.isHiRes) ? 'hires' : 'lowres';
							
				if (innerChildNode.hasAttribute('data-bb-type')) {
					type = innerChildNode.getAttribute('data-bb-type').toLowerCase();
					description = innerChildNode.innerHTML;
					accentText = '';
					
					// Grab the accent-text if it is there
					if (innerChildNode.hasAttribute('data-bb-accent-text')) {
						accentText = innerChildNode.getAttribute('data-bb-accent-text');
					}
					
					if (type == 'header') {
						normal = 'bb-'+res+'-image-list-header';
						highlight = 'bb-'+res+'-image-list-header-hover';
						// Check for alignment
						if (this.headerJustify == 'left') {
							normal = normal + ' bb-'+res+'-image-list-header-left';
							highlight = highlight + ' bb-'+res+'-image-list-header-left';
						} else if (this.headerJustify == 'right') {
							normal = normal + ' bb-'+ res+'-image-list-header-right';
							highlight = highlight + ' bb-'+res+'-image-list-header-right';
						} else {
							normal = normal + ' bb-'+res+'-image-list-header-center';
							highlight = highlight + ' bb-'+res+'-image-list-header-center';
						}
						// Set our styling
						innerChildNode.normal = normal;
						innerChildNode.highlight = highlight;
						innerChildNode.innerHTML = '<p>'+ description +'</p>';
						innerChildNode.setAttribute('x-blackberry-focusable','true');
						innerChildNode.setAttribute('class', normal);
						innerChildNode.setAttribute('onmouseover', "this.setAttribute('class',this.highlight)");
						innerChildNode.setAttribute('onmouseout', "this.setAttribute('class',this.normal)");
					} 
					else if (type == 'item') {
						innerChildNode.innerHTML = '';
						innerChildNode.setAttribute('class', 'bb-'+res+'-image-list-item');
						innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-"+res+"-image-list-item bb-"+res+"-image-list-item-hover')");
						innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-"+res+"-image-list-item')");
						innerChildNode.setAttribute('x-blackberry-focusable','true');
						
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
							details.normal = 'bb-'+res+'-image-list-details bb-'+res+'-image-list-noimage';
						} else {
							details.normal = 'bb-'+res+'-image-list-details';
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
							btnBorder.normal = 'bb-'+res+'-image-list-item-button-border';
							btnBorder.setAttribute('class',btnBorder.normal);
							btn.appendChild(btnBorder);
							// Create the inner button that has the image
							btnInner = document.createElement('div');
							btnInner.setAttribute('class','bb-'+res+'-image-list-item-button-inner bb-image-list-item-chevron-light');
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
							titleDiv.style['margin-top'] = (bb.device.isHiRes) ? '14px' : '18px';
							// Adjust accent text
							if (accentDiv) {
								accentDiv.style['margin-top'] = (bb.device.isHiRes) ? '-32px' : '-25px';
							}
							// Adjust any arrows
							if (this.listStyle == 'arrowlist') {
								btn.style['margin-top'] = (bb.device.isHiRes) ? '-73px' : '-70px';
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
_bb_5_6_7_roundPanel = {  
    apply: function(elements) {
		// Apply our transforms to all the panels
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			outerElement.setAttribute('class','bb-round-panel');
			if (outerElement.hasChildNodes()) {
				var innerElements = [],
					innerCount = outerElement.childNodes.length;
				// Grab the internal contents so that we can add them
				// back to the massaged version of this div
				for (var j = 0; j < innerCount; j++) {
					innerElements.push(outerElement.childNodes[j]);
				}
				for (var j = innerCount - 1; j >= 0; j--) {
					outerElement.removeChild(outerElement.childNodes[j]);
				}
				// Create our new <div>'s
				var placeholder = document.createElement('div');
				placeholder.setAttribute('class','bb-round-panel-top-left bb-round-panel-background ');
				outerElement.appendChild(placeholder);
				placeholder = document.createElement('div');
				placeholder.setAttribute('class','bb-round-panel-top-right bb-round-panel-background ');
				outerElement.appendChild(placeholder);
				var insidePanel = document.createElement('div');
				insidePanel.setAttribute('class','bb-round-panel-inside');
				outerElement.appendChild(insidePanel);
				placeholder = document.createElement('div');
				placeholder.setAttribute('class','bb-round-panel-bottom-left bb-round-panel-background ');
				outerElement.appendChild(placeholder);
				placeholder = document.createElement('div');
				placeholder.setAttribute('class','bb-round-panel-bottom-right bb-round-panel-background ');
				outerElement.appendChild(placeholder);
				// Add our previous children back to the insidePanel
				for (var j = 0; j < innerElements.length; j++) {
					insidePanel.appendChild(innerElements[j]); 
				}
			}
			// Handle the headers
			var items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
			for (var j = 0; j < items.length; j++) {
				items[j].setAttribute('class','bb-lowres-panel-header');
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
_bb_6_7_button = { 
    apply: function(elements) {  
		for (var i = 0; i < elements.length; i++) {
			bb.button.style(elements[i]);
		}
	},
	
	style: function(outerElement) {
		var disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal = 'bb-bb7-button',
			highlight = 'bb-bb7-button-highlight';

		outerElement.stretched = false;
		outerElement.enabled = !disabled;
		if (disabled) {
			normal = 'bb-bb7-button-disabled';
			outerElement.removeAttribute('data-bb-disabled');
		}	
		if (bb.device.isHiRes) {
			normal = normal + ' bb-bb7-button-hires';
			highlight = highlight + ' bb-bb7-button-hires';
		} else {
			normal = normal + ' bb-bb7-button-lowres';
			highlight = highlight + ' bb-bb7-button-lowres';
		}
		if (outerElement.hasAttribute('data-bb-style')) {
			var style = outerElement.getAttribute('data-bb-style');
			if (style == 'stretch') {
				outerElement.stretched = true;
				normal = normal + ' button-stretch';
				highlight = highlight + ' button-stretch';
			}
		}
		outerElement.highlight = highlight;
		outerElement.normal = normal;
		outerElement.setAttribute('class',normal);
		if (!disabled) {
			outerElement.setAttribute('x-blackberry-focusable','true');
			outerElement.onmouseover = function() {
								this.setAttribute('class',this.highlight);
							}
			outerElement.onmouseout = function() {
								this.setAttribute('class',this.normal);
							}
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
				this.innerHTML = value;
			};
		outerElement.setCaption = outerElement.setCaption.bind(outerElement);
		
		// Assign our get caption function
		outerElement.getCaption = function(value) {
				return this.innerHTML;
			};
		outerElement.getCaption = outerElement.getCaption.bind(outerElement);
		
		// Assign our set image function
		outerElement.setImage = function(value) {
				// Not yet implemented
			};
		outerElement.setImage = outerElement.setImage.bind(outerElement);
		
		// Assign our get image function
		outerElement.getImage = function(value) {
				return '';
			};
		outerElement.getImage = outerElement.getImage.bind(outerElement);
		
		// Assign our enable function
		outerElement.enable = function(){
				if (this.enabled) return;
			/*	var normal = 'bb-bb7-button',
					highlight = 'bb-bb7-button-highlight';
				
				if (bb.device.isHiRes) {
					normal = normal + ' bb-bb7-button-hires';
					highlight = highlight + ' bb-bb7-button-hires';
				} else {
					normal = normal + ' bb-bb7-button-lowres';
					highlight = highlight + ' bb-bb7-button-lowres';
				}

				if (this.hasAttribute('data-bb-style')) {
					var style = this.getAttribute('data-bb-style');
					if (style == 'stretch') {
						normal = normal + ' button-stretch';
						highlight = highlight + ' button-stretch';
					}
				}
				this.setAttribute('class',normal);
				this.setAttribute('x-blackberry-focusable','true');
				this.setAttribute('onmouseover',"this.setAttribute('class','" + highlight +"')");
				this.setAttribute('onmouseout',"this.setAttribute('class','" + normal + "')");*/
				this.setAttribute('class',normal);
				this.setAttribute('x-blackberry-focusable','true');
				this.onmouseover = function() {
								this.setAttribute('class',this.highlight);
							}
				this.onmouseout = function() {
								this.setAttribute('class',this.normal);
							}
				this.enabled = true;
			};
		outerElement.enable = outerElement.enable.bind(outerElement);
		
		// Assign our disable function
		outerElement.disable = function(){
				if (!this.enabled) return;
				var normal = 'bb-bb7-button-disabled';
				
				if (bb.device.isHiRes) {
					normal = normal + ' bb-bb7-button-hires';
				} else {
					normal = normal + ' bb-bb7-button-lowres';
				}

				if (this.hasAttribute('data-bb-style')) {
					var style = this.getAttribute('data-bb-style');
					if (style == 'stretch') {
						normal = normal + ' button-stretch';
						highlight = highlight + ' button-stretch';
					}
				}
				this.setAttribute('class',normal);
				this.removeAttribute('x-blackberry-focusable');
				this.onmouseover = null;
				this.onmouseout = null;
				this.enabled = false;
			};
		outerElement.disable = outerElement.disable.bind(outerElement);

		// Assign our show function
		outerElement.show = function(){ 
				this.style.display = this.stretched ? 'block' : 'inline-block';
			};
		outerElement.show = outerElement.show.bind(outerElement);
		
		// Assign our hide function
		outerElement.hide = function(){ 
				this.style.display = 'none';
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
_bb_6_7_PlayBook_dropdown = { 
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
			inEvent,
			outEvent,
			enabled = !select.hasAttribute('disabled');
			
		// Set our highlight events
		if (bb.device.isPlayBook) {
			inEvent = 'ontouchstart';
			outEvent = 'ontouchend';
		} else {
			inEvent = 'onmouseover';
			outEvent = 'onmouseout';
		}

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

		var normal = 'bb-bb7-dropdown',
			highlight = 'bb-bb7-dropdown-highlight';

		if (bb.device.isHiRes) {
			normal = normal + ' bb-bb7-dropdown-hires';
			highlight = highlight + ' bb-bb7-dropdown-hires';
		} else {
			normal = normal + ' bb-bb7-dropdown-lowres';
			highlight = highlight + ' bb-bb7-dropdown-lowres';
		}

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
			dropdown.setAttribute('class',normal + ' bb-bb7-dropdown-disabled');
		}
		dropdown.setAttribute('x-blackberry-focusable','true');
		dropdown.inEvent = "this.setAttribute('class','" + highlight +"')";
		dropdown.outEvent = "this.setAttribute('class','" + normal + "')"
		
		if (select.parentNode) {
			select.parentNode.insertBefore(dropdown, select);
		}
		dropdown.appendChild(select);

		// Set our click handler
		dropdown.doclick = function() {
				var select = this.getElementsByTagName('select')[0];
				// Add our emulation for Ripple
				if (bb.device.isPlayBook || bb.device.isRipple) {
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
					if (bb.device.isHiRes) {
						dialog.setAttribute('class', 'ripple-dropdown-dialog bb-hires-screen');
					} else {
						dialog.setAttribute('class', 'ripple-dropdown-dialog');
					}
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
				} else {
					//On Smartphones, use the new Select Asynch dialog in blackberry.ui.dialog
					var inputs = [];
					for (var i = 0; i < select.options.length; i++) {
						inputs[i] = { label : select.options[i].text, selected : i == select.selectedIndex, enabled : true, type : "option"};
					}
					try {
						blackberry.ui.dialog.selectAsync(false, inputs,
							function (indices) {
								if (indices.length > 0 && indices[0] < select.options.length) {
									select.setSelectedItem(indices[0]);
								}
							}
						);
					} catch (e) {
						console.log("Exception in selectAsync: " + e);
					}
				}
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
				this.dropdown.setAttribute('class',normal + ' bb-bb7-dropdown-disabled');
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
				//this.dropdown.internalHide();
				//this.dropdown.refreshOptions();
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

_bb_6_7_PlayBook_labelControlContainers = {
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			
			// Fetch all our rows
			var items = outerElement.querySelectorAll('[data-bb-type=row]');
			if (items.length > 0 ) {
				// Create our containing table
				var table = document.createElement('table');
				table.setAttribute('class','bb-bb7-label-control-rows');
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
_bb_6_7_PlayBook_pillButtons = {  
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i],
				containerStyle = 'bb-bb7-pill-buttons',
				buttonStyle = '';	
			// Set our container style
			if (bb.device.isHiRes) {
				containerStyle = containerStyle + ' bb-bb7-pill-buttons-hires';
				buttonStyle = 'bb-bb7-pill-button-hires';
			} else {
				containerStyle = containerStyle + ' bb-bb7-pill-buttons-lowres';
				buttonStyle = 'bb-bb7-pill-button-lowres';
			}
			outerElement.setAttribute('class',containerStyle);	
			// Gather our inner items
			var inEvent, 
				outEvent, 
				items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
				percentWidth = Math.floor(98 / items.length),
				sidePadding = 102-(percentWidth * items.length);
				
			if (bb.device.isPlayBook) {
				inEvent = 'ontouchstart';
				outEvent = 'ontouchend';
			} else {
				inEvent = 'onmouseover';
				outEvent = 'onmouseout';
			}
				
			outerElement.style['padding-left'] = sidePadding + '%';
			outerElement.style['padding-right'] = sidePadding + '%';
			for (var j = 0; j < items.length; j++) {
				var innerChildNode = items[j];
				innerChildNode.setAttribute('x-blackberry-focusable','true');
				if (j === 0) {  // First button
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left '+ buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left " + buttonStyle +"')");
					}
				} else if (j == items.length -1) { // Right button
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right ' + buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right " + buttonStyle +"')");
					}
				} else { // Middle Buttons
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','bb-bb7-pill-button ' + buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button " + buttonStyle +"')");
					}
				}
				// Set our width
				innerChildNode.style.width = percentWidth + '%';
				// Add our subscription for click events to change highlighting
				innerChildNode.addEventListener('click',function (e) {
						var inEvent, outEvent, items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
						
						if (bb.device.isPlayBook) {
							inEvent = 'ontouchstart';
							outEvent = 'ontouchend';
						} else {
							inEvent = 'onmouseover';
							outEvent = 'onmouseout';
						}
						
						for (var j = 0; j < items.length; j++) {
							var innerChildNode = items[j];
							
							if (j === 0) {  // First button
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left '+ buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left " + buttonStyle +"')");
								}
							} else if (j == items.length -1) { // Right button
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right ' + buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right " + buttonStyle +"')");
								}
							} else { // Middle Buttons
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','bb-bb7-pill-button ' + buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button " + buttonStyle +"')");
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

_bb_6_7_textInput = { 
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			var style = outerElement.getAttribute('class');
			style = style + ' bb-bb7-input';
			
			if (bb.device.isHiRes) {
				style = style + ' bb-bb7-input-hires';
			} else {
				style = style + ' bb-bb7-input-lowres';
			}
			// Apply our style
			outerElement.setAttribute('class', style);
		}
    }
};
