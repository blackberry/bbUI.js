bb = {
	scroller: null,  
    screens: [],
	dropdownScrollers: [],
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
		bb.device.isRipple = (navigator.userAgent.indexOf('Ripple') >= 0);
		bb.device.isPlayBook = (navigator.userAgent.indexOf('PlayBook') >= 0) || ((window.innerWidth == 1024 && window.innerHeight == 600) || (window.innerWidth == 600 && window.innerHeight == 1024));
		if (bb.device.isPlayBook && bb.options.bb10ForPlayBook) {
			bb.device.isBB10 = true;
		} else {
			bb.device.isBB10 = (navigator.userAgent.indexOf('Version/10.0') >= 0);
		}
		bb.device.isBB7 = (navigator.userAgent.indexOf('7.0.0') >= 0) || (navigator.userAgent.indexOf('7.1.0') >= 0) || bb.device.isRipple;
		bb.device.isBB6 = navigator.userAgent.indexOf('6.0.0') >= 0;
		bb.device.isBB5 = navigator.userAgent.indexOf('5.0.0') >= 0;
		
		// Determine HiRes
		if (bb.device.isRipple) {
			bb.device.isHiRes = window.innerHeight > 480 || window.innerWidth > 480; 
		} else {
			bb.device.isHiRes = screen.width > 480 || screen.height > 480;
		}
		
		// Create our shades of colors
		var R = parseInt((bb.cutHex(bb.options.highlightColor)).substring(0,2),16),
			G = parseInt((bb.cutHex(bb.options.highlightColor)).substring(2,4),16),
			B = parseInt((bb.cutHex(bb.options.highlightColor)).substring(4,6),16);
		bb.options.shades = {
			R : R,
			G : G,
			B : B,
			darkHighlight: 'rgb('+ (R - 120) +', '+ (G - 120) +', '+ (B - 120) +')',
			darkOutline: 'rgb('+ (R - 32) +', '+ (G - 32) +', '+ (B - 32) +')'		
		};
		
		// Create our coloring
		if (document.styleSheets && document.styleSheets.length) {
			try {
				document.styleSheets[0].insertRule('.bb10Highlight {background-color:'+ bb.options.highlightColor +';background-image:none;}', 0);
				document.styleSheets[0].insertRule('.bbProgressHighlight {background-color:#92B43B;background-image:none;}', 0);
				document.styleSheets[0].insertRule('.bb10-button-highlight {color:White;background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.shades.darkHighlight+'), to('+bb.options.highlightColor+'));border-color:#53514F;}', 0);
				document.styleSheets[0].insertRule('.pb-button-light-highlight {color:'+bb.options.shades.darkHighlight+';background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.highlightColor+'), to('+bb.options.shades.darkHighlight+'));border-:color:'+bb.options.shades.darkHighlight+';}', 0);
				document.styleSheets[0].insertRule('.pb-button-dark-highlight {color:'+bb.options.highlightColor+';background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.highlightColor+'), to('+bb.options.shades.darkHighlight+'));border-:color:'+bb.options.shades.darkHighlight+';}', 0);
				document.styleSheets[0].insertRule('.bb10Accent {background-color:'+ bb.options.shades.darkHighlight +';}', 0);
			}
			catch (ex) {
				console.log(ex.message);
			}
		}
		// Set our coloring
		bb.actionBar.color = (bb.options.actionBarDark) ? 'dark' : 'light';
		bb.screen.controlColor = (bb.options.controlsDark) ? 'dark' : 'light';
		bb.screen.listColor = (bb.options.listsDark) ? 'dark' : 'light';
		
		// Set up our pointers to objects for each OS version
		if (bb.device.isBB10) {
			bb.imageList = _bb10_imageList
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
	},

    doLoad: function(element) {
        // Apply our styling
        var root = element || document.body;
        bb.screen.apply(root.querySelectorAll('[data-bb-type=screen]'));
		if (bb.scrollPanel) 			bb.scrollPanel.apply(root.querySelectorAll('[data-bb-type=scroll-panel]'));  
	    if (bb.textInput) 				bb.textInput.apply(root.querySelectorAll('input[type=text], [type=password], [type=tel], [type=url], [type=email], [type=number], [type=date], [type=time], [type=datetime], [type=month], [type=datetime-local], [type=color]'));
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
        // perform device specific formatting
        bb.screen.reAdjustHeight();	
    },
	
	device: {  
        isHiRes: false, 
        isBB5: false,
		isBB6: false,
		isBB7: false,
		isBB10: false,
        isPlayBook: false,
        isRipple: false
    },
	
	// Options for rendering
	options: {
		onbackkey: null,
		onscreenready: null,
		ondomready: null,  	
		actionBarDark: true, 	
		controlsDark: false, 
		listsDark: false,
		highlightColor: '#00A8DF',
		bb10ForPlayBook: false
	},
	
    loadScreen: function(url, id, popping) {
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

        container.setAttribute('id', id);
        container.innerHTML = xhr.responseText;

        // Add any Java Script files that need to be included
        scripts = _reduce(container.childNodes, whereScript, []),
        container.scriptIds = [];

        scripts.forEach(function (script) {
            var scriptTag = document.createElement('script');

            if (script.text) {
                //if there is text, just eval it since they probably don't have a src.
                eval(script.text);
                return;
            }
            container.scriptIds.push({'id' : script.getAttribute('id'), 'onunload': script.getAttribute('onunload')});
            scriptTag.setAttribute('type','text/javascript');
            scriptTag.setAttribute('src', script.getAttribute('src'));
            scriptTag.setAttribute('id', script.getAttribute('id'));
            newScriptTags.push(scriptTag);
            // Remove script tag from container because we are going to add it to <head>
            script.parentNode.removeChild(script);
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
						bb.initContainer(container, id, popping);
                    }
                };
        }

        // In case there are no scripts at all we simply doLoad() now
        if(bb.screen.totalScripts === 0) {
            bb.initContainer(container, id, popping);
        }
        return container;
    },
	
	// Initialize the container
	initContainer : function(container, id, popping) {
		// Fire the onscreenready and then apply our changes in doLoad()
		if (bb.options.onscreenready) {
			bb.options.onscreenready(container, id);
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
											// The container of bb.screens might be destroyed because every time re-creating even when the pop-up screen.
											bb.screens[bb.screens.length-1].container = container;  
										}
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
			setTimeout(bb.domready.fire, 1); 
		}
		
		// If an effect was applied then the popping will be handled at the end of the animation
		if (!effectToApply) {
			if (!popping && (bb.screens.length > 0)) {
				//bb.removeTopMostScreenFromDom();
				bb.removePreviousScreenFromDom();
			} else if (popping) {
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
		
		fire : function() {
			if (bb.screen.animating) {
				setTimeout(bb.domready.fire, 250);
				return;
			}
			bb.options.ondomready(bb.domready.container, bb.domready.id);
			bb.domready.container = null;
			bb.domready.id = null;		
		}
	
	},
	
	// Creates the scroller for the screen
	createScreenScroller : function(screen) {  
		var scrollWrapper = screen.bbUIscrollWrapper;
		if (scrollWrapper) {
			bb.scroller = new iScroll(scrollWrapper, {hideScrollbar:true,fadeScrollbar:true, onBeforeScrollStart: function (e) {
				var target = e.target;
				
				// Don't scroll the screen when touching in our drop downs for BB10
				if (target.parentNode && target.parentNode.getAttribute('class') == 'bb-bb10-dropdown-items') {
					return;
				}
				
				while (target.nodeType != 1) target = target.parentNode;

				if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
					e.preventDefault();
				} 
			}}); 
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
		/*if (bb.scroller) { // Not sure that we need to do this?
			bb.scroller.destroy();
			bb.scroller = null;
		}*/
	},
	
	// Remove the topmost screen from the dom
	removeTopMostScreenFromDom: function() {
		var numItems = bb.screens.length,
			oldScreen = document.getElementById(bb.screens[numItems -1].id);	
		document.body.removeChild(oldScreen);
	},
	
	// Remove the previous screen from the dom
	removePreviousScreenFromDom: function() {
		var numItems = bb.screens.length,
			oldScreen;	
		if (numItems > 1) {
			oldScreen = document.getElementById(bb.screens[numItems -2].id);
			document.body.removeChild(oldScreen);
		}
	},
	
    // Add a new screen to the stack
    pushScreen: function (url, id) {
        // Remove our old screen
        bb.removeLoadedScripts();
		bb.menuBar.clearMenu();
        var numItems = bb.screens.length,
			currentScreen;
        if (numItems > 0) {
			bb.clearScrollers();
			// Quirk with displaying with animations
			if (bb.device.isBB5 || bb.device.isBB6 || bb.device.isBB7) {
				currentScreen = document.getElementById(bb.screens[numItems -1].id);
				currentScreen.style.display = 'none';
				window.scroll(0,0);
			}
        }
		
        // Add our screen to the stack
        var container = bb.loadScreen(url, id, false);
		bb.screens.push({'id' : id, 'url' : url, 'scripts' : container.scriptIds, 'container' : container});    
    },

    // Pop a screen from the stack
    popScreen: function() {
		var numItems = bb.screens.length;
        if (numItems > 1) {
            bb.removeLoadedScripts();
			bb.clearScrollers();
		    bb.menuBar.clearMenu();
			bb.screen.overlay = null;
			bb.screen.tabOverlay = null;

            // Retrieve our new screen
            var display = bb.screens[numItems-2],
                newScreen = bb.loadScreen(display.url, display.id, true);
					
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
                current = document.getElementById(currentStackItem.id);

            // Remove any JavaScript files
            for (var i = 0; i < currentStackItem.scripts.length; i++) {
                var bbScript = currentStackItem.scripts[i],
                    scriptTag = document.getElementById(bbScript.id);
                // Call the unload function if any is defined
                if (bbScript.onunload) {
                    eval(bbScript.onunload);
                }
                
                document.body.removeChild(scriptTag);
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
			if (!window.orientation) {
				return window.innerHeight;
			} else if (window.orientation == 0 || window.orientation == 180) {
				return 1280;
			} else if (window.orientation == -90 || window.orientation == 90) {
				return 768;
			}
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
			if (!window.orientation) {
				return window.innerWidth;
			} else if (window.orientation == 0 || window.orientation == 180) {
				return 768;
			} else if (window.orientation == -90 || window.orientation == 90) {
				return 1280;
			}
		}
	},
	
	cutHex : function(h) {
		return (h.charAt(0)=="#") ? h.substring(1,7):h
	}
};

Function.prototype.bind = function(object){ 
  var fn = this; 
  return function(){ 
    return fn.apply(object, arguments); 
  }; 
}; 