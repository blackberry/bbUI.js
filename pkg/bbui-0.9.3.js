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


bb = {
	scroller: null,  
    screens: [],
	dropdownScrollers: [],
	transparentPixel: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'+
						'/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wEFxQXKc14qEQAAAAZdEVYdENv'+
						'bW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADUlEQVQI12NgYGBgAAAABQABXvMqOgAAAABJ'+
						'RU5ErkJggg==',

    	
	// Initialize the the options of bbUI
	init : function (options) {
		if (options) {
			var i;
			// User defined options
			for (i in options) bb.options[i] = options[i];
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
		var R = parseInt((bb.cutHex(bb.options.bb10HighlightColor)).substring(0,2),16),
			G = parseInt((bb.cutHex(bb.options.bb10HighlightColor)).substring(2,4),16),
			B = parseInt((bb.cutHex(bb.options.bb10HighlightColor)).substring(4,6),16);
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
				document.styleSheets[0].insertRule('.bb10Highlight {background-color:'+ bb.options.bb10HighlightColor +';background-image:none;}', 0);
				document.styleSheets[0].insertRule('.bbProgressHighlight {background-color:#92B43B;background-image:none;}', 0);
				document.styleSheets[0].insertRule('.bb10-button-highlight {color:White;background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.shades.darkHighlight+'), to('+bb.options.bb10HighlightColor+'));border-color:#53514F;}', 0);
				document.styleSheets[0].insertRule('.bb10Accent {background-color:'+ bb.options.shades.darkHighlight +';}', 0);
			}
			catch (ex) {
				console.log(ex.message);
			}
		}
		// Set our action bar coloring
		if (bb.options.bb10ActionBarDark) {
			bb.actionBar.color = 'dark';
		} else {
			bb.actionBar.color = 'light';
		}
		
		// Set our control coloring
		if (bb.options.bb10ControlsDark) {
			bb.screen.controlColor = 'dark';
		} else {
			bb.screen.controlColor = 'light';
		}
		
		// Set our list coloring
		if (bb.options.bb10ListsDark) {
			bb.screen.listColor = 'dark';
		} else {
			bb.screen.listColor = 'light';
		}
		
	},

    doLoad: function(element) {
		
        // Apply our styling
        var root = element || document.body;
        bb.screen.apply(root.querySelectorAll('[data-bb-type=screen]'));
		bb.scrollPanel.apply(root.querySelectorAll('[data-bb-type=scroll-panel]'));  
	    bb.textInput.apply(root.querySelectorAll('input[type=text], [type=password], [type=tel], [type=url], [type=email], [type=number], [type=date], [type=time], [type=datetime], [type=month], [type=datetime-local], [type=color]'));
		bb.dropdown.apply(root.querySelectorAll('select'));
        bb.roundPanel.apply(root.querySelectorAll('[data-bb-type=round-panel]'));
        bb.imageList.apply(root.querySelectorAll('[data-bb-type=image-list]'));
		bb.grid.apply(root.querySelectorAll('[data-bb-type=grid-layout]'));
        bb.bbmBubble.apply(root.querySelectorAll('[data-bb-type=bbm-bubble]'));
        bb.pillButtons.apply(root.querySelectorAll('[data-bb-type=pill-buttons]'));
        bb.labelControlContainers.apply(root.querySelectorAll('[data-bb-type=label-control-container]'));
        bb.button.apply(root.querySelectorAll('[data-bb-type=button]'));
		bb.fileInput.apply(root.querySelectorAll('input[type=file]'));
		bb.slider.apply(root.querySelectorAll('input[type=range]'));
		bb.progress.apply(root.querySelectorAll('progress'));
		bb.radio.apply(root.querySelectorAll('input[type=radio]'));
		bb.activityIndicator.apply(root.querySelectorAll('[data-bb-type=activity-indicator]'));
		bb.checkbox.apply(root.querySelectorAll('input[type=checkbox]'));
		bb.toggle.apply(root.querySelectorAll('[data-bb-type=toggle]'));
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
		bb10ActionBarDark: true, 	
		bb10ControlsDark: false, 
		bb10ListsDark: false,
		bb10ForPlayBook: false,
		bb10HighlightColor: '#00A8DF'
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
				// However, if it isn't JS, don't eval it
				if (!('type' in script) || script.type === 'text/javascript') {
					eval(script.text);
				}
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
			effect,
			effectApplied = false,
			overlay;
				
        if (screen.length > 0 ) {
            screen = screen[0];
			screen.popping = popping;
			if (screen.hasAttribute('data-bb-effect')) {
				// see if there is a display effect
				if (!bb.device.isBB5 && !bb.device.isBB6) {
					effect = screen.getAttribute('data-bb-effect');
					if (effect) {
						if (effect.toLowerCase() == 'fade') {
							effectApplied = true;
							bb.screen.fadeIn(screen);
						} else if ((effect.toLowerCase() == 'slide-left') && !bb.device.isBB7) {
							effectApplied = true;
							bb.screen.slideLeft(screen);
						} else if ((effect.toLowerCase() == 'slide-right') && !bb.device.isBB7) {
							effectApplied = true;
							bb.screen.slideRight(screen);
						} else if ((effect.toLowerCase() == 'slide-up') && !bb.device.isBB7) {
							effectApplied = true;
							bb.screen.slideUp(screen);
						}  else if ((effect.toLowerCase() == 'slide-down') && !bb.device.isBB7) {
							effectApplied = true;
							bb.screen.slideDown(screen);
						} 
						screen.style.display = 'inline'; // This is a wierd hack
						
						// Listen for when the animation ends so that we can clear the previous screen
						if (effectApplied) {
							// Create our overlay
							overlay = document.createElement('div');
							screen.overlay = overlay;
							overlay.setAttribute('class','bb-transition-overlay');
							document.body.appendChild(overlay);
							// Add our listener and animation state
							bb.screen.animating = true;
							screen.addEventListener('webkitAnimationEnd', function() { 
									var s = this.style;
									bb.screen.animating = false;	
									// Remove our overlay
									document.body.removeChild(this.overlay);
									this.overlay = null;
									// Only remove the screen at the end of animation "IF" it isn't the only screen left
									if (bb.screens.length > 1) {
										if (!this.popping) {
											bb.removePreviousScreenFromDom();
										} else {
											bb.removeTopMostScreenFromDom();
										}
									}
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
								});
						}
					} 
				}				
			} 
			bb.createScreenScroller(screen); 
		} 
		
		// Fire the ondomready after the element is added to the DOM and we've set our animation flags
		if (bb.options.ondomready) {
			bb.domready.container = container;
			bb.domready.id = id;
			setTimeout(bb.domready.fire, 1); 
		}
		
		// If an effect was applied then the popping will be handled at the end of the animation
		if (!effectApplied) {
			if (!popping && (bb.screens.length > 0)) {
				bb.removeTopMostScreenFromDom();
			}
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
		bb.screens.push({'id' : id, 'url' : url, 'scripts' : container.scriptIds});    
    },

    // Pop a screen from the stack
    popScreen: function() {

        var numItems = bb.screens.length;
        if (numItems > 1) {
            bb.removeLoadedScripts();
			bb.clearScrollers();
			bb.removeTopMostScreenFromDom();
		    bb.menuBar.clearMenu();
			bb.screen.overlay = null;
			bb.screen.tabOverlay = null;

            // Retrieve our new screen
            var display = bb.screens[numItems-2],
                container = bb.loadScreen(display.url, display.id, true);
				
			bb.screens.pop();	
			
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

// Apply styling to an action bar
bb.actionBar = {

	color: '',
	
	apply: function(actionBar, screen) {
		
		var actions = actionBar.querySelectorAll('[data-bb-type=action]'),
			visibleButtons = [],
			overflowButtons = [],
			visibleTabs = [],
			overflowTabs = [],
			shownActions = [],
			action,
			target,
			caption,
			style,
			lastStyle,
			tabRightShading,
			backBtn,
			actionContainer = actionBar,
			btnWidth,
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			icon,
			color = bb.actionBar.color,
			j;
			
		actionBar.backBtnWidth = 0;
		actionBar.actionOverflowBtnWidth = 0;
		actionBar.tabOverflowBtnWidth = 0;
		actionBar.setAttribute('class','bb-bb10-action-bar-'+res+' bb-bb10-action-bar-' + bb.actionBar.color);
		actionBar.visibleTabs = visibleTabs;
		actionBar.visibleButtons = visibleButtons;
		actionBar.overflowButtons = overflowButtons;
		actionBar.shownActions = shownActions;
		actionBar.overflowTabs = overflowTabs;
		
		// Gather our visible and overflow tabs and buttons
		for (j = 0; j < actions.length; j++) {
			action = actions[j];
			if (action.hasAttribute('data-bb-style')) {
				style = action.getAttribute('data-bb-style').toLowerCase();
				if (style == 'button') {
					if (action.hasAttribute('data-bb-overflow') && (action.getAttribute('data-bb-overflow').toLowerCase() == 'true')) {
						overflowButtons.push(action);
					} else {
						visibleButtons.push(action);
					}
				} else {
					if (action.hasAttribute('data-bb-overflow') && (action.getAttribute('data-bb-overflow').toLowerCase() == 'true')) {
						overflowTabs.push(action);
					} else {
						visibleTabs.push(action);
					}
				}
			}
		}
					
		// Create the back button if it has one and there are no tabs in the action bar
		if (actionBar.hasAttribute('data-bb-back-caption') && actionBar.querySelectorAll('[data-bb-style=tab]').length == 0) {		
			var chevron,
				backCaption,
				backslash;
			backBtn = document.createElement('div');
			backBtn.setAttribute('class','bb-bb10-action-bar-back-button-'+res+' bb-bb10-action-bar-back-button-'+res+'-' + color);
			backBtn.onclick = bb.popScreen;
			actionBar.backBtn = backBtn;
			// Create and add the chevron to the back button
			chevron = document.createElement('div');
			chevron.setAttribute('class','bb-bb10-action-bar-back-chevron-'+res+'-'+color);
			backBtn.appendChild(chevron);
			// Create and add our back caption to the back button
			backCaption = document.createElement('div');
			backCaption.setAttribute('class','bb-bb10-action-bar-back-text-'+res);
			backCaption.innerHTML = actionBar.getAttribute('data-bb-back-caption');
			backBtn.appendChild(backCaption);
			// Create our backslash
			backslash = document.createElement('div');
			backslash.setAttribute('class','bb-bb10-action-bar-back-slash-'+res+'-'+color); 
			
			// Create a table to hold the back button and our actions
			var table = document.createElement('table'),
				tr = document.createElement('tr'),
				td = document.createElement('td');
			actionBar.appendChild(table);
			table.appendChild(tr);
			table.setAttribute('class','bb-bb10-action-bar-table');
			// Set Back Button widths
			if (bb.device.isPlayBook) {
				actionBar.backBtnWidth = 93;
				td.style.width = 77+'px';
			} else {
				actionBar.backBtnWidth = 187;
				td.style.width = 154+'px';
			}
			tr.appendChild(td);
			td.appendChild(backBtn);
			// Create the container for our backslash
			td = document.createElement('td');
			// Set backslash widths
			td.style.width = bb.device.isPlayBook ? 16 + 'px' : 33+'px';
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
			actionBar.tabOverflowBtnWidth = (bb.device.isPlayBook) ? 77: 154;
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
			actionBar.tabOverflowBtn = action;
			// Insert our more button
			actionContainer.insertBefore(action, actionContainer.firstChild);
			visibleTabs.push(action);
		}
		
		// If we have "button" actions marked as overflow we need to show the more menu button
		if (overflowButtons.length > 0) {
			actionBar.actionOverflowBtnWidth = (bb.device.isPlayBook) ? 77: 154;
			actionBar.menu = bb.contextMenu.create(screen);
			actionBar.appendChild(actionBar.menu);
			// Create our action bar overflow button
			action = document.createElement('div');
			action.menu = actionBar.menu;
			actionBar.moreBtn = action;
			action.setAttribute('data-bb-type','action');
			action.setAttribute('data-bb-style','button');
			action.setAttribute('data-bb-img','overflow');
			action.onclick = function() {
							this.menu.show();
						}
			// Insert our action overflow button
			actionContainer.appendChild(action);
			visibleButtons.push(action);
		}
		
		// Determines how much width there is to use not including built in system buttons on the bar
		actionBar.getUsableWidth = function() {
				return bb.innerWidth() - this.backBtnWidth - this.actionOverflowBtnWidth - this.tabOverflowBtnWidth;		
			}
		actionBar.getUsableWidth = actionBar.getUsableWidth.bind(actionBar);
		
		// Create our function to calculate the widths of the inner action items 
		actionBar.calculateActionWidths = function() {
							var result,
								numUserActions,
								numSystemActions = 0,
								totalWidth = this.getUsableWidth(),
								visibleActions = this.visibleButtons.length + this.visibleTabs.length;
							
							// Get our non system actions
							numUserActions = (this.moreBtn) ? visibleActions - 1 : visibleActions; // Remove the more button from the equation
							numUserActions = (this.tabOverflowBtn) ? numUserActions - 1 : numUserActions; // Remove the tab overflow button from the equation
							
							// Count our visible system actions
							numSystemActions = (this.moreBtn) ? numSystemActions + 1 : numSystemActions;
							numSystemActions = (this.tabOverflowBtn) ? numSystemActions + 1 : numSystemActions;
							numSystemActions = (this.backBtn) ? numSystemActions + 1 : numSystemActions;
							
							if ((numSystemActions + numUserActions) < 5) {
								result = Math.floor(totalWidth/numUserActions);
							} else {
								result = Math.floor(totalWidth/(5-numSystemActions));
							}
							
							return result;
						};
		actionBar.calculateActionWidths = actionBar.calculateActionWidths.bind(actionBar);
		// Get our button width
		btnWidth = actionBar.calculateActionWidths();
		
		// Make sure we move when the orientation of the device changes
		actionBar.orientationChanged = function(event) {
								var actionWidth = actionBar.calculateActionWidths(),
									i,
									action,
									actionType,
									length = this.shownActions.length,
									margins = 2;
								for (i = 0; length; i++) {
									action = this.shownActions[i];
									actionType = (action.hasAttribute('data-bb-style')) ? action.getAttribute('data-bb-style').toLowerCase() : 'button';
									// Compute margins
									margins = (actionType == 'tab') ? 2 : 0;
									action.style.width = (actionWidth - margins) + 'px'; 
								}
								// Adjust our more button
								if (this.moreBtn && (this.shownActions.length > 0)) {
									if (actionType == 'tab') {
										// Stretch the last button if all tabs are before the overflow button  
										this.moreBtn.style.width = (bb.innerWidth() - (this.shownActions.length * actionWidth)) + 'px';
									} else {
										this.moreBtn.style.width = this.actionOverflowBtnWidth + 'px'; 
									}
								}
							};
		actionBar.orientationChanged = actionBar.orientationChanged.bind(actionBar);	
		window.addEventListener('orientationchange', actionBar.orientationChanged,false); 
		
		// Add all our overflow tab actions
		if (overflowTabs.length > 0 ) {
			var clone;
			// Add all our visible tabs if any so they are at the top of the list
			for (j = 0; j < visibleTabs.length; j++) {
				action = visibleTabs[j];
				// Don't add the visible overflow tab
				if (action.getAttribute('data-bb-img') != 'overflow') {
					clone = action.cloneNode(true);
					clone.onclick = undefined;
					clone.visibleTab = action;
					clone.res = res;
					clone.actionBar = actionBar;
					actionBar.tabOverflowMenu.add(clone);
				}
			}			
		
			// Now add all our tabs marked as overflow
			for (j = 0; j < overflowTabs.length; j++) {
				action = overflowTabs[j];
				action.res = res;
				action.actionBar = actionBar;
				actionBar.tabOverflowMenu.add(action);
			}
		}

		// Add all of our overflow button actions
		for (j = 0; j < overflowButtons.length; j++) {
			action = overflowButtons[j];
			action.res = res;
			actionBar.menu.add(action);
		}
		
		// Apply all our tab styling
		var tabMargins = 2,
			numVisibleTabs = visibleTabs.length,
			display;
		for (j = 0; j < numVisibleTabs; j++) {
			action = visibleTabs[j];
			// Don't add any more than 5 items on the action bar
			if (j > 4) {
				action.style.display = 'none';
				continue;			
			}
			action.res = res;
			caption = action.innerHTML;
			// Size our last visible tab differently
			if ((j == visibleTabs.length -1) && (j == 4)) {
				// Stretch the last tab if actionbar only has tabs in case of any kind of rounding errors based on division  
				action.style.width = (actionBar.getUsableWidth() - (4 * btnWidth) - tabMargins) + 'px';
			} else {
				action.style.width = (btnWidth - tabMargins) + 'px'; 
			}
			action.actionBar = actionBar;
			action.innerHTML = '';
			action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-tab-'+color+' bb-bb10-action-bar-tab-normal-'+color;
			action.highlight = action.normal + ' bb-bb10-action-bar-tab-selected-'+color;
			action.setAttribute('class',action.normal);

			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
			action.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
			display.innerHTML = caption;
			action.appendChild(display);
			
			// See if it is our overflow tab
			if (action.getAttribute('data-bb-img') == 'overflow') {
				action.style.width = actionBar.tabOverflowBtnWidth + 'px'; 
				action.icon = icon;
				display.innerHTML = '&nbsp;';
				action.display = display;
				// Set our transparent pixel
				icon.setAttribute('src',bb.transparentPixel);
				icon.normal = 'bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-tab-overflow-'+res+'-'+color;
				icon.highlight = 'bb-bb10-action-bar-icon-'+res;
				icon.setAttribute('class',icon.normal);
				// Crete our tab highlight div
				action.tabHighlight = document.createElement('div');
				action.tabHighlight.setAttribute('class','bb-bb10-action-bar-tab-overflow-'+res+'-'+color+' bb-bb10-action-bar-tab-overflow-highlight-'+res);
				action.appendChild(action.tabHighlight);
				action.style.width = (actionBar.tabOverflowBtnWidth - 1) + 'px';
				// Set our reset function
				action.reset = function() {
							this.icon.setAttribute('src',bb.transparentPixel);
							this.icon.setAttribute('class',this.icon.normal);
							this.tabHighlight.style.display = 'none';
							this.display.innerHTML = '&nbsp;';
						};
				action.reset = action.reset.bind(action);	
			} // See if it was a selected tab
			else {
				shownActions.push(action);
				// Set our image
				icon.setAttribute('src',action.getAttribute('data-bb-img'));
				
				if (action.hasAttribute('data-bb-selected') && (action.getAttribute('data-bb-selected').toLowerCase() == 'true')) {
					bb.actionBar.highlightAction(action);
				}
				// Add our click listener
				action.addEventListener('click',function (e) {
					bb.actionBar.highlightAction(this);
				},false);
			}
			
			// Make the last tab have a smaller border and insert the shading
			if ((j == visibleTabs.length-1) && (j < 4)) {
				action.style['border-right-width'] = '1px';
			} 	
		}
		
		// Apply all our button styling
		lastStyle = (visibleTabs.length > 0) ? 'tab' : 'button';
		for (j = 0; j < visibleButtons.length; j++) {
			action = visibleButtons[j];
			action.res = res;
			caption = action.innerHTML;
			// Don't add any more than 5 items on the action bar
			if ((((numVisibleTabs + j) > 4)) || (actionBar.backBtn && (j > 3))) {
				action.style.display = 'none';
				continue;			
			}
			// See if the last action was a tab
			if (lastStyle == 'tab') {
				action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-button-'+color+' bb-bb10-action-bar-button-tab-left-'+res+'-'+color;
			} else {
				action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-button-'+color;
			}
			action.innerHTML = '';
			action.setAttribute('class',action.normal);
			// Add the icon
			icon = document.createElement('img');
			if (action.getAttribute('data-bb-img') == 'overflow') {
				// Set our transparent pixel
				icon.setAttribute('src',bb.transparentPixel);
				icon.setAttribute('class','bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-overflow-button-'+res+'-'+color);
				// If it is next to a tab, stretch it so that the right shading lines up
				if (lastStyle == 'tab') {
					// Stretch the last button if all tabs are before the overflow button  
					action.style.width = (bb.innerWidth() - (numVisibleTabs * btnWidth)) + 'px';
				} else {
					action.style.width = (actionBar.actionOverflowBtnWidth - 1) + 'px'; 
					action.style.float = 'right';
				}
			} else {
				shownActions.push(action);
				icon.setAttribute('src',action.getAttribute('data-bb-img'));
				icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
				action.style.width = btnWidth + 'px'; 
			}
			action.appendChild(icon);
			lastStyle = 'button';
			
			// Set our caption
			var display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
			display.innerHTML = caption;
			action.appendChild(display);	
		}
		// Center the action overflow items
		if (actionBar.menu) {
			actionBar.menu.centerMenuItems();
		}
		// Center the tab overflow items
		if (actionBar.tabOverflowMenu) {
			actionBar.tabOverflowMenu.centerMenuItems();
		}
	},

	// Apply the proper highlighting for the action
	highlightAction: function (action, overflowAction) {
		var i,
			target,
			tabs = action.actionBar.visibleTabs;
		
		// First un-highlight the rest
		for (i = 0; i < tabs.length; i++) {
			target = tabs[i];
			if (target != action) { 
				bb.actionBar.unhighlightAction(target);
			}					
		}
		// Now highlight this action
		action.style['border-top-color'] = bb.options.bb10HighlightColor;
		action.setAttribute('class',action.highlight);
		
		// See if there was a tab overflow
		if (action.actionBar.tabOverflowMenu) {
			
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
		action.style['border-top-color'] = '';
		action.setAttribute('class',action.normal);
		// See if there was a tab overflow
		if (action.actionBar && action.actionBar.tabOverflowMenu) {
			tabs = action.actionBar.tabOverflowMenu.actions;
			for (i = 0; i < tabs.length; i++) {
				target = tabs[i];
				target.setAttribute('class', target.normal);
			}
		}
	}
};
bb.activityIndicator = {
	
	apply: function(elements) {
		var i,
			outerElement,
			innerElement,
			indicator, 
			color = bb.screen.controlColor,
			res,
			size,
			width,
			swirl;
			
		if (bb.device.isBB10) {
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires';

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
				lingrad.addColorStop(1, bb.options.bb10HighlightColor);
				ctx.fillStyle = lingrad;
				ctx.fill();
				
				swirl = canvas.toDataURL();
				//alert(swirl);
			}
			
			for (i = 0; i < elements.length; i++)  {
				outerElement = elements[i];
				size = (outerElement.hasAttribute('data-bb-size')) ? outerElement.getAttribute('data-bb-size').toLowerCase() : 'medium';
				
				if (size == 'large') {
					width = (bb.device.isPlayBook) ? '93px' : '184px';
				} else if (size == 'small') {
					width = (bb.device.isPlayBook) ? '21px' : '41px';
				} else {
					size = 'medium';
					width = (bb.device.isPlayBook) ? '46px' : '93px';
				}
				
				outerElement.style.width = width;
				// Add another div so that the developers styling on the original div is left untouched
				indicator = document.createElement('div');
				indicator.setAttribute('class',  'bb-bb10-activity-margin-'+res+' bb-bb10-activity-'+size+'-'+res+' bb-bb10-activity-'+color);
				outerElement.appendChild(indicator);
				innerElement = document.createElement('div');
				innerElement.setAttribute('class','bb-bb10-activity-'+size+'-'+res);
				innerElement.style['background-image'] = 'url("'+ swirl +'")';
				indicator.appendChild(innerElement);
				
				
				
				// Set our animation
				innerElement.style['-webkit-animation-name'] = 'activity-rotate';
				innerElement.style['-webkit-animation-duration'] = '0.8s';
				innerElement.style['-webkit-animation-iteration-count'] = 'infinite';
				innerElement.style['-webkit-animation-timing-function'] = 'linear';
			}
		}
	}


}
bb.bbmBubble = {
    // Apply our transforms to all BBM Bubbles
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var outerElement = elements[i];
                
            if (outerElement.hasAttribute('data-bb-style')) {
                var style = outerElement.getAttribute('data-bb-style').toLowerCase();
                if (style == 'left')
                    outerElement.setAttribute('class','bb-bbm-bubble-left');
                else
                    outerElement.setAttribute('class','bb-bbm-bubble-right');
                    
                var innerElements = outerElement.querySelectorAll('[data-bb-type=item]');
                for (var j = 0; j > innerElements.length; j++) {
                    outerElement.removeChild(innerElements[j]);
                }
                
                // Create our new <div>'s
                var placeholder = document.createElement('div');
                placeholder.setAttribute('class','top-left image');
                outerElement.appendChild(placeholder);
                placeholder = document.createElement('div');
                placeholder.setAttribute('class','top-right image');
                outerElement.appendChild(placeholder);
                
                placeholder = document.createElement('div');
                placeholder.setAttribute('class','inside');
                outerElement.appendChild(placeholder);
                
                var insidePanel = document.createElement('div');
                insidePanel.setAttribute('class','nogap');
                placeholder.appendChild(insidePanel);
                
                placeholder = document.createElement('div');
                placeholder.setAttribute('class','bottom-left image');
                outerElement.appendChild(placeholder);
                placeholder = document.createElement('div');
                placeholder.setAttribute('class','bottom-right image');
                outerElement.appendChild(placeholder);
                // Add our previous children back to the insidePanel
                for (var j = 0; j < innerElements.length; j++) {
                    var innerChildNode = innerElements[j],
                        description = innerChildNode.innerHTML;
                    innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n' +
                            '<div class="details">'+ description +'</div>\n';
                    insidePanel.appendChild(innerChildNode); 
                }
                
            }
        }   
    }
};

bb.button = { 
    
    // Apply our transforms to all arrow buttons passed in
    apply: function(elements) {
		
        if (bb.device.isBB5) {
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
        } else if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? res = 'lowres' : 'hires';
			for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
					disabledStyle,
					imgSrc,
					caption,
					imgElement,
					captionElement = document.createElement('div'),
					innerElement = document.createElement('div');
                    disabled = outerElement.hasAttribute('data-bb-disabled'),
                    normal = 'bb-bb10-button bb-bb10-button-'+res,
                    highlight = 'bb-bb10-button bb-bb10-button-'+res+' bb10-button-highlight',
					outerNormal = 'bb-bb10-button-container-'+res+' bb-bb10-button-container-' + bb.screen.controlColor,
					outerNormalWithoutImageOnly = outerNormal;
					
                outerElement.isImageOnly = false;
				outerElement.enabled = !disabled;
				caption = outerElement.innerHTML;
				captionElement.innerHTML = caption;
				outerElement.innerHTML = '';
				outerElement.captionElement = captionElement;
				outerElement.appendChild(innerElement);
				outerElement.innerElement = innerElement;
				
                if (outerElement.hasAttribute('data-bb-style')) {
                    var style = outerElement.getAttribute('data-bb-style');
                    if (style == 'stretch') {
					    outerNormal = outerNormal + ' bb-bb10-button-stretch';
                    }
                }
				// look for our image
				imgSrc = outerElement.hasAttribute('data-bb-img') ? outerElement.getAttribute('data-bb-img') : undefined;
				if (imgSrc) {
					if (!caption || caption.length == 0) {
						outerNormal = outerNormal + ' bb-bb10-button-container-image-only-'+res;
						captionElement.style['background-image'] = 'url("'+imgSrc+'")';
						outerElement.style['line-height'] = '0px';
						captionElement.setAttribute('class','bb-bb10-button-caption-with-image-only-'+res);
						outerElement.isImageOnly = true;
					} else {
						// Configure our caption element
						captionElement.setAttribute('class','bb-bb10-button-caption-with-image-'+res);
						imgElement = document.createElement('div');
						outerElement.imgElement = imgElement;
						imgElement.setAttribute('class','bb-bb10-button-image-'+res);
						imgElement.style['background-image'] = 'url("'+imgSrc+'")';
						innerElement.appendChild(imgElement);
					}
				}
				// Insert caption after determining what to do with the image
				innerElement.appendChild(captionElement);
			
				// Set our styles
				disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
				normal = normal + ' bb-bb10-button-' + bb.screen.controlColor;
				
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
							this.captionElement.setAttribute('class','bb-bb10-button-caption-with-image-'+res);
							var imgElement = document.createElement('div');
							this.imgElement = imgElement;
							imgElement.setAttribute('class','bb-bb10-button-image-'+res);
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
							this.captionElement.setAttribute('class','bb-bb10-button-caption-with-image-only-'+res);
							// Reset our image only styling
							this.setAttribute('class',this.outerNormalWithoutImageOnly + ' bb-bb10-button-container-image-only-'+res);
							this.captionElement.style['background-image'] = this.imgElement.style['background-image'];
							this.isImageOnly = true;
							// Remove the image div
							this.innerElement.removeChild(this.imgElement);
							this.imgElement = null;
						}
						this.captionElement.innerHTML = value;
					};
					
				// Assign our set image function
				outerElement.setImage = function(value) {
						if (this.isImageOnly) {
							this.captionElement.style['background-image'] = 'url("'+value+'")';
						} else if (this.imgElement && (value.length > 0)) {
							this.imgElement.style['background-image'] = 'url("'+value+'")';
						} else if (value.length > 0){
							// Configure our caption element
							this.captionElement.setAttribute('class','bb-bb10-button-caption-with-image-'+res);
							var imgElement = document.createElement('div');
							this.imgElement = imgElement;
							imgElement.setAttribute('class','bb-bb10-button-image-'+res);
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
                // Assign our disable function
                outerElement.disable = function(){ 
                        if (!this.enabled) return;
                        this.innerElement.setAttribute('class', this.innerElement.disabledStyle);
						this.ontouchstart = null;
                        this.ontouchend = null;
                        this.enabled = false;
                    };
            }
		} else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    disabled = outerElement.hasAttribute('data-bb-disabled'),
                    normal = 'bb-bb7-button',
                    highlight = 'bb-bb7-button-highlight',
					inEvent,
					outEvent;
					
				// Set our highlight events
				if (bb.device.isPlayBook) {
					inEvent = 'ontouchstart';
					outEvent = 'ontouchend';
				} else {
					inEvent = 'onmouseover';
					outEvent = 'onmouseout';
				}
                    
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
                        normal = normal + ' button-stretch';
                        highlight = highlight + ' button-stretch';
                    }
                }
                outerElement.setAttribute('class',normal);
                if (!disabled) {
                    outerElement.setAttribute('x-blackberry-focusable','true');
					outerElement.setAttribute(inEvent,"this.setAttribute('class','" + highlight +"')");
					outerElement.setAttribute(outEvent,"this.setAttribute('class','" + normal + "')");
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
				
                // Assign our enable function
                outerElement.enable = function(){
                        if (this.enabled) return;
                        var normal = 'bb-bb7-button',
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
						this.setAttribute(inEvent,"this.setAttribute('class','" + highlight +"')");
						this.setAttribute(outEvent,"this.setAttribute('class','" + normal + "')");
                        this.enabled = true;
                    };
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
                        this.removeAttribute('onmouseover');
                        this.removeAttribute('onmouseout');
						this.removeAttribute('ontouchstart');
                        this.removeAttribute('ontouchend');
                        this.enabled = false;
                    };
            }
        }
    }
};
bb.checkbox = {

	apply: function(elements) {
	
		if (bb.device.isBB10) {
			var i,
				input,
				touchTarget, 
				outerElement,
				innerElement,
				checkElement,
				res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				color = bb.options.bb10ControlsDark ? 'dark' : 'light';
				
				
			
			for (i = 0; i < elements.length; i++) {
				input = elements[i];
				// Outside touch target
				touchTarget = document.createElement('div');
				touchTarget.setAttribute('class','bb-bb10-checkbox-target-'+res);
				input.parentNode.insertBefore(touchTarget, input);
				input.style.display = 'none';
				touchTarget.appendChild(input);
				touchTarget.input = input;
				input.touchTarget = touchTarget;
				// Main outer border of the control
				outerElement = document.createElement('div');
				outerElement.setAttribute('class', 'bb-bb10-checkbox-outer-'+res+' bb-bb10-checkbox-outer-'+color);
				touchTarget.appendChild(outerElement);
				// Inner check area
				innerElement = document.createElement('div');
				innerElement.normal = 'bb-bb10-checkbox-inner-'+res+' bb-bb10-checkbox-inner-'+color;
				innerElement.setAttribute('class', innerElement.normal);
				outerElement.appendChild(innerElement);
				// Create our check element with the image
				checkElement = document.createElement('div');
				checkElement.hiddenClass = 'bb-bb10-checkbox-check-hidden-'+res+' bb-bb10-checkbox-check-image';
				checkElement.displayClass = 'bb-bb10-checkbox-check-display-'+res+' bb-bb10-checkbox-check-image';
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
								if (!this.input.checked) {	
									// Do our touch highlight
									this.innerElement.style.background = this.touchHighlight;
								}
							};
				touchTarget.ontouchend = function() {
								if (!this.input.checked) {
									this.innerElement.style.background = '';
								}
							};
				touchTarget.onclick = function() {
								var evObj = document.createEvent('HTMLEvents');
								evObj.initEvent('change', false, true );
								// Set our checked state
								this.input.checked = !this.input.checked;
								this.drawChecked();
								this.input.dispatchEvent(evObj);
							};
							
				touchTarget.drawChecked = function() {
								if (this.input.checked) {
									this.checkElement.setAttribute('class',this.checkElement.displayClass);
									this.innerElement.style['background-image'] = touchTarget.highlight;
								} else {
									this.checkElement.setAttribute('class',this.checkElement.hiddenClass);
									this.innerElement.style['background-image'] = '';
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
				input.setChecked = input.setChecked.bind(input);
				
				// Set our initial state
				touchTarget.drawChecked();
			}
		}	
	}
};
// BlackBerry 10 Context Menu
bb.contextMenu = {
	
	// Create an instance of the menu and pass it back to the caller
	create : function(screen) {
		var res,
			swipeThreshold;
		if (bb.device.isPlayBook) {
			res = 'lowres';
			swipeThreshold = 100;
		} else {
			res = 'hires';
			swipeThreshold = 300;
		}
		
		// Create the oveflow menu container
		var menu = document.createElement('div'), 
			title = document.createElement('div'),
			description = document.createElement('div'),
			header;
		menu.setAttribute('class','bb-bb10-context-menu bb-bb10-context-menu-' + res + '-' + bb.actionBar.color);
		menu.actions = [];
		menu.hideEvents = [];
		menu.res = res;
		menu.visible = false;
		// Add the overlay for trapping clicks on items below
		if (!bb.screen.overlay) {
			bb.screen.overlay = document.createElement('div');
			bb.screen.overlay.threshold = swipeThreshold;
			bb.screen.overlay.setAttribute('class','bb-bb10-context-menu-overlay');
			bb.screen.overlay.menu = menu;
			screen.appendChild(bb.screen.overlay);
			
			bb.screen.overlay.ontouchmove = function(event) {
											// Only care about moves if peeking
											if (!this.menu.peeking) return;
											var touch = event.touches[0];
											if (this.startPos && (this.startPos - touch.pageX > this.threshold)) {
												this.menu.show(this.menu.selected);
												this.closeMenu = false;
											}
										};
			bb.screen.overlay.ontouchend = function() {
											if (this.closeMenu) {
												this.menu.hide();
											}
										};
			bb.screen.overlay.ontouchstart = function(event) {
												this.closeMenu = true;
												if (!this.menu.peeking) return;
												
												var touch = event.touches[0];
												this.startPos = touch.pageX;
												event.preventDefault();
											};
		}
		menu.overlay = bb.screen.overlay;
		// Create the menu header
		header = document.createElement('div');
		header.setAttribute('class','bb-bb10-context-menu-item-'+res+' bb-bb10-context-menu-header-'+bb.actionBar.color);
		menu.header = header;
		menu.appendChild(header);
		
		// Create our title container
		title.setAttribute('class','bb-bb10-context-menu-header-title-'+res+' bb-bb10-context-menu-header-title-'+bb.actionBar.color);
		title.style.width = bb.contextMenu.getWidth() - 20 + 'px';
		menu.topTitle = title;
		header.appendChild(title);
		
		// Create our description container
		description.setAttribute('class','bb-bb10-context-menu-header-description-'+res);
		description.style.width = bb.contextMenu.getWidth() - 20 + 'px';
		menu.description = description;
		header.appendChild(description);

		// Set our first left position
		menu.style.left = bb.contextMenu.getLeft();
		
		// Display the menu
		menu.show = function(data){
						if (data) {
							this.header.style.display = '';
							if (data.title) {
								this.topTitle.innerHTML = data.title;
							}
							if (data.description) {
								this.description.innerHTML = data.description;
							}
							this.selected = data;
						} else {
							this.header.style.display = 'none';	
							this.selected = undefined;							
						}
						this.peeking = false;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + bb.contextMenu.getWidth() + 'px, 0)';	
						this.addEventListener("touchstart", this.touchHandler, false);		
						// Remove the header click handling while peeking
						this.header.addEventListener("click", this.hide, false);
						this.style.visibility = 'visible';
						this.visible = true;
					};
		menu.show = menu.show.bind(menu);
		// Hide the menu
		menu.hide = function(){
						this.overlay.style.display = 'none';
						this.removeEventListener("touchstart", this.touchHandler, false);
						this.style['-webkit-transition'] = 'all 0.5s ease-in-out';
						this.style['-webkit-transform'] = 'translate(' + bb.contextMenu.getWidth() + 'px, 0px)';
						if (!this.peeking) {
							// Remove the header click handling 
							this.header.removeEventListener("click", this.hide, false);	
						}
						this.peeking = false;
						this.visible = false;
						
						// See if there was anyone listenting for hide events and call them
						// starting from the last one registered and pop them off
						for (var i = menu.hideEvents.length-1; i >= 0; i--) {
							menu.hideEvents[i]();
							menu.hideEvents.pop();
						}
					};
		menu.hide = menu.hide.bind(menu);
		// Peek the menu
		menu.peek = function(data){
						if (data) {
							if (data.title) {
								this.topTitle.innerHTML = data.title;
							}
							if (data.description) {
								this.description.innerHTML = data.description;
							}
							this.selected = data;
						}
						this.header.style.display = '';
						this.header.style['margin-bottom'] = '-'+ Math.floor(this.header.offsetHeight/2) + 'px';
						this.peeking = true;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + bb.contextMenu.getPeekWidth() + ', 0)';	
						this.addEventListener("touchstart", this.touchHandler, false);	
						// Remove the header click handling while peeking
						this.header.removeEventListener("click", this.hide, false);		
						this.style.visibility = 'visible';
						this.visible = true;
					};
		menu.peek = menu.peek.bind(menu);
		
		// Trap the events
		menu.touchHandler = function(event) {
								if (this.peeking) {
									if (event.target == this) {
										event.preventDefault();
										event.stopPropagation();
									} else if (event.target.parentNode == this && event.target != this.header)  {
										event.preventDefault();
										event.stopPropagation();
									} 						
								} else {
									if (event.target == this) {
										this.hide();
									} 
								}
							};
		menu.touchHandler = menu.touchHandler.bind(menu);
		
		// Center the items in the list
		menu.centerMenuItems = function() {
								var windowHeight = bb.innerHeight(),
									itemHeight = (bb.device.isPlayBook) ? 53 : 111,
									margin,
									numActions;
								// See how many actions to use for calculations
								numActions = (this.pinnedAction) ? this.actions.length - 1 : this.actions.length;
								margin = windowHeight - Math.floor(windowHeight/2) - Math.floor((numActions * itemHeight)/2) - itemHeight; //itemHeight is the header
								this.actions[0].style['margin-top'] = margin + 'px';
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
				normal = 'bb-bb10-context-menu-item-'+this.res+' bb-bb10-context-menu-item-'+this.res+'-' + bb.actionBar.color;
				this.appendChild(action);
				this.actions.push(action);
				// See if this item should be pinned to the bottom
				pin = (action.hasAttribute('data-bb-pin') && action.getAttribute('data-bb-pin').toLowerCase() == 'true');
				if (pin && !this.pinnedAction) {
					normal = normal + ' bb-bb10-context-menu-item-first-' + this.res + '-' + bb.actionBar.color;
					action.style['bottom'] = '-2px';
					action.style.position = 'absolute';
					action.style.width = '100%';
					this.pinnedAction = action;
				}				
				// If it is the top item it needs a top border
				if (this.actions.length == 1) {
					normal = normal + ' bb-bb10-context-menu-item-first-' + this.res + '-' + bb.actionBar.color;
				}
				highlight = normal + ' bb-bb10-context-menu-item-hover-'+this.res;
				action.normal = normal;
				action.highlight = highlight;
				// Set our inner information
				action.innerHTML = '';
				var inner = document.createElement('div'),
					img = document.createElement('img');
				img.setAttribute('src', action.getAttribute('data-bb-img'));
				img.setAttribute('class','bb-bb10-context-menu-item-image-'+this.res);
				action.appendChild(img);
				inner.setAttribute('class','bb-bb10-context-menu-item-inner-'+this.res);
				action.appendChild(inner);
				inner.innerHTML = caption;

				action.setAttribute('class',normal);
				action.ontouchstart = function () {
										this.setAttribute('class',this.highlight);
										this.style['border-left-color'] = bb.options.bb10HighlightColor;
									}
				action.ontouchend = function () {
										this.setAttribute('class',this.normal);
										this.style['border-left-color'] = 'transparent';
									}
				action.addEventListener("click", this.hide, false);
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

bb.dropdown = { 
    // Apply our transforms to all dropdowns passed in
    apply: function(elements) {
        if (bb.device.isBB5) {

        } else if (bb.device.isBB10) {
            var res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}			
			var options,
				option,
                caption,
				img,
				i,j,
				innerElement,
				select,
				innerContainer,
				buttonOuter,
				dropdown,
				labelElement,
				captionElement,
				itemsElement,
				item,
				normal = 'bb-bb10-dropdown bb-bb10-dropdown-'+res+' bb-bb10-dropdown-' + bb.screen.controlColor + ' bb-bb10-dropdown-'+res,
				highlight = 'bb-bb10-dropdown bb-bb10-dropdown-'+res+' bb10-button-highlight bb-bb10-dropdown-'+res,  //********************************* TODO: currently using Button highlight ********************
				outerContainerStyle = 'bb-bb10-dropdown-container-'+res+' bb-bb10-dropdown-container-' + bb.screen.controlColor + ' bb-bb10-dropdown-container-'+res,
				innerContainerStyle = 'bb-bb10-dropdown-container-inner-'+res+' bb-bb10-dropdown-container-inner-'+bb.screen.controlColor,
				innerButtonStyle = 'bb-bb10-dropdown-inner-'+res+' bb-bb10-dropdown-inner-'+bb.screen.controlColor;

			for (i = 0; i < elements.length; i++) {
                select = elements[i]
				caption = '';
				options = select.getElementsByTagName('option')
				// Make the existing <select> invisible so that we can hide it and create our own display
				select.style.display = 'none';
				 // Get our selected item in case they haven't specified "selected";
                if (options.length > 0) {
                    caption = options[0].innerHTML;
                }

				// Create the dropdown container and insert it where the select was
				dropdown = document.createElement('div');
				dropdown.items = [];
				dropdown.setAttribute('data-bb-type','dropdown');
				select.dropdown = dropdown;
				select.parentNode.insertBefore(dropdown, select);
				// Insert the select as an invisible node in the new dropdown element
                dropdown.appendChild(select);
				
				// Create the innerContainer for the dual border
				innerContainer = document.createElement('div');
				innerContainer.setAttribute('class',innerContainerStyle);
				dropdown.appendChild(innerContainer);
				
				if (select.hasAttribute('data-bb-style')) {
                    var style = select.getAttribute('data-bb-style');
                    if (style == 'stretch') {
                        normal = normal + ' bb-bb10-dropdown-stretch';
                        highlight = highlight + ' bb-bb10-dropdown-stretch';
                    }
                }
				
				// Create our button container for the outer part of the dual border
				buttonOuter = document.createElement('div');
				buttonOuter.setAttribute('class',normal);
				innerContainer.appendChild(buttonOuter);
				
				// Create the inner button element
				innerElement = document.createElement('div');
				innerElement.setAttribute('class',innerButtonStyle);
				buttonOuter.appendChild(innerElement);

				// Create the optinal label for the dropdown
				labelElement = document.createElement('div');
				labelElement.setAttribute('class','bb-bb10-dropdown-label');
				if (select.hasAttribute('data-bb-label')) {
					labelElement.innerHTML = select.getAttribute('data-bb-label');
				}
				innerElement.appendChild(labelElement);
				
				// Create our dropdown arrow
				img = document.createElement('div');
				img.setAttribute('class','bb-bb10-dropdown-arrow-'+res+'-'+bb.screen.controlColor);
				innerElement.appendChild(img);
				dropdown.img = img;
				
				// Create the caption for the dropdown
				captionElement = document.createElement('div');
				captionElement.setAttribute('class','bb-bb10-dropdown-caption-'+res);
				captionElement.innerHTML = caption;
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
				itemsElement.setAttribute('class','bb-bb10-dropdown-items');
				innerScroller.appendChild(itemsElement);
                for (j = 0; j < options.length; j++) {
					option = options[j];
					item = document.createElement('div');
					dropdown.items.push(item);
					item.slectedStyle = 'bb-bb10-dropdown-item-'+res+' bb-bb10-dropdown-item-'+bb.screen.controlColor+' bb-bb10-dropdown-item-selected-'+ bb.screen.controlColor;
					item.normalStyle = 'bb-bb10-dropdown-item-'+res+' bb-bb10-dropdown-item-'+bb.screen.controlColor;
					item.index = j;
					item.select = select;
					item.dropdown = dropdown;
					if (!item.dropdown.selected) {
						item.dropdown.selected = item;
					}
					item.innerHTML = option.innerHTML;
					itemsElement.appendChild(item);
					// Create the image
					img = document.createElement('div');
					img.setAttribute('class','bb-bb10-dropdown-selected-image-'+res+'-'+bb.screen.controlColor);
					item.img = img;
					item.appendChild(img);
					
					// See if it was specified as the selected item
                    if (option.hasAttribute('selected')) {
                        captionElement.innerHTML = option.innerHTML;
						item.setAttribute('class',item.slectedStyle);
						img.style.visibility = 'visible';
						item.dropdown.selected = item;
                    } else {
						item.setAttribute('class',item.normalStyle);
					}
					// Assign our item handlers
					item.ontouchstart = function(event) {
											this.style['background-color'] = bb.options.bb10HighlightColor;
											this.style['color'] = 'white';
										};
					
					item.ontouchend = function(event) {
											this.style['background-color'] = 'transparent';
											this.style['color'] = '';
										};			
					item.onclick = function() {
										this.select.setSelectedItem(this.index);
								   };
                }
				
				// set our outward styling
				dropdown.setAttribute('class',outerContainerStyle);
				dropdown.buttonOuter = buttonOuter;
				dropdown.isRefreshed = false;
				dropdown.select = select;
				dropdown.caption = captionElement;
				dropdown.options = options;
				buttonOuter.dropdown = dropdown;
				dropdown.open = false;
				buttonOuter.normal = normal;
				buttonOuter.highlight = highlight;

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
				buttonOuter.ontouchstart = function(event) {
										this.setAttribute('class', this.highlight);
									};
				buttonOuter.ontouchend = function(event) {
										this.setAttribute('class', this.normal);
									};
				buttonOuter.onclick = function(event) {
										if (!this.dropdown.open) {
											this.dropdown.show();
										} else {
											this.dropdown.hide();
										}
									};
				// Show the combo-box			
				dropdown.show = function() {
										var scrollHeight;
										this.open = true;
										// Figure out how many items to show
										if (this.options.length > 5) {
											this.numItems = 5;
										} else {
											this.numItems = this.options.length;
										}
										// Set the open height
										if (bb.device.isPlayBook) {
											scrollHeight = (this.numItems * 43);
											this.style.height = 45 + scrollHeight +'px';
										} else {
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
										this.img.style['-webkit-transition'] = 'all 0.5s ease-in-out';
										this.img.style['-webkit-transform'] = 'rotate(-720deg)';
										
										// Refresh our screen srolling height
										if (bb.scroller) {
											bb.scroller.refresh();
										}
									};
				dropdown.show = dropdown.show.bind(dropdown);
				// Collapse the combo-box
				dropdown.hide = function() {
										this.open = false;
										this.style.height = '59px';
										
										if (bb.device.isPlayBook) {
											this.style.height = '43px';
										} else {
											this.style.height = '95px';
										}
											
										// Animate our caption change
										this.caption.style.opacity = '1.0';
										this.caption.style['-webkit-transition'] = 'opacity 0.5s linear';
										this.caption.style['-webkit-backface-visibility'] = 'hidden';
										this.caption.style['-webkit-perspective'] = 1000;
										
										// Animate our arrow
										this.img.style.opacity = '0.0';
										this.img.style['-webkit-transition'] = 'all 0.5s ease-in-out';
										this.img.style['-webkit-transform'] = 'rotate(0deg)';
										// Refresh our screen srolling height
										if (bb.scroller) {
											bb.scroller.refresh();
										}
									};
				dropdown.hide = dropdown.hide.bind(dropdown);

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
						item.setAttribute('class',item.slectedStyle);
						item.img.style.visibility = 'visible';
						this.dropdown.selected = item;
						// Set our index and fire the event
						this.selectedIndex = index;
						this.dropdown.caption.innerHTML = this.options[index].text;
						this.dropdown.hide();
                        window.setTimeout(this.fireEvent,0);
                    }
                };
				select.setSelectedItem = select.setSelectedItem.bind(select);
				
				// Have this function so we can asynchronously fire the change event
				select.fireEvent = function() {
									// Raise the DOM event
									var evObj = document.createEvent('HTMLEvents');
									evObj.initEvent('change', false, true );
									this.dispatchEvent(evObj);
								};
				select.fireEvent = select.fireEvent.bind(select);
			}
		} else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    options = outerElement.getElementsByTagName('option'),
                    caption = '',
					inEvent,
					outEvent;
					
				// Set our highlight events
				if (bb.device.isPlayBook) {
					inEvent = 'ontouchstart';
					outEvent = 'ontouchend';
				} else {
					inEvent = 'onmouseover';
					outEvent = 'onmouseout';
				}

                outerElement.style.display = 'none';
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

                var normal = 'bb-bb7-dropdown',
                    highlight = 'bb-bb7-dropdown-highlight';

                if (bb.device.isHiRes) {
                    normal = normal + ' bb-bb7-dropdown-hires';
                    highlight = highlight + ' bb-bb7-dropdown-hires';
                } else {
                    normal = normal + ' bb-bb7-dropdown-lowres';
                    highlight = highlight + ' bb-bb7-dropdown-lowres';
                }

                if (outerElement.hasAttribute('data-bb-style')) {
                    var style = outerElement.getAttribute('data-bb-style');
                    if (style == 'stretch') {
                        normal = normal + ' dropdown-stretch';
                        highlight = highlight + ' dropdown-stretch';
                    }
                }
                dropdown.setAttribute('data-bb-type','dropdown');
                dropdown.setAttribute('class',normal);
                dropdown.setAttribute('x-blackberry-focusable','true');
				dropdown.setAttribute(inEvent,"this.setAttribute('class','" + highlight +"')");
				dropdown.setAttribute(outEvent,"this.setAttribute('class','" + normal + "')");
                outerElement.parentNode.insertBefore(dropdown, outerElement);
                dropdown.appendChild(outerElement);

                // Assign our functions to be able to set the value
                outerElement.dropdown = dropdown;
                outerElement.setSelectedItem = function(index) {
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

                // Set our click handler
                dropdown.onclick = function() {
                        var select = this.getElementsByTagName('select')[0];
                        // Add our emulation for Ripple
                        if (bb.device.isPlayBook || bb.device.isRipple) {
                            // Create the overlay to trap clicks on the screen
                            var overlay = document.createElement('div');
                            overlay.setAttribute('id', 'ripple-dropdown-overlay');
                            overlay.setAttribute('style', 'position: absolute;left: 0px;top: ' + document.body.scrollTop + 'px;width:100%;height:100%;z-index: 1000000;');
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
            }
        }
    }
};
bb.fileInput = {

	apply: function(elements) {
		var i,
			outerElement,
			btn,
			span,
			res;
		if (bb.device.isBB10) {
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires';
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.setAttribute('class','bb-bb10-file-button-'+res);
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
	}
};
bb.grid = {  
    apply: function(elements) {
		if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				solidHeader = false,
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
					
				outerElement.setAttribute('class','bb-bb10-grid-'+res);	
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
							title.normal = 'bb-bb10-grid-header-'+res;
							title.innerHTML = '<p>'+ innerChildNode.getAttribute('data-bb-title') +'</p>';
							
							// Style our header for appearance
							if (solidHeader) {
								title.normal = title.normal +' bb10Accent';
								title.style.color = 'white';
								title.style['border-bottom-color'] = 'transparent';
							} else {
								title.normal = title.normal + ' bb-bb10-grid-header-normal-'+bb.screen.listColor;
								title.style['border-bottom-color'] = bb.options.shades.darkOutline;
							}
							
							// Style our header for text justification
							if (headerJustify == 'left') {
								title.normal = title.normal + ' bb-bb10-grid-header-left-'+res;
							} else if (headerJustify == 'right') {
								title.normal = title.normal + ' bb-bb10-grid-header-right-'+res;
							} else {
								title.normal = title.normal + ' bb-bb10-grid-header-center';
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
								rowItems = innerChildNode.querySelectorAll('[data-bb-type=item]');
							
							numItems = rowItems.length;
							if (numItems == 0) continue;
							
							table = document.createElement('table');
							table.style.width = '100%';
							innerChildNode.appendChild(table);
							tr = document.createElement('tr');
							table.appendChild(tr);

							for (k = 0; k < numItems; k++) {
								itemNode = rowItems[k];
								subtitle = itemNode.innerHTML;
								title = itemNode.getAttribute('data-bb-title');
								hasOverlay = (subtitle || title);
								itemNode.innerHTML = '';
								// Add our cell to the table
								td = document.createElement('td');
								tr.appendChild(td);
								td.appendChild(itemNode);
								// deal with our margins
								width = (window.innerWidth/numItems) - 5;
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
								image.setAttribute('src',itemNode.getAttribute('data-bb-img'));
								image.style.height = height + 'px';
								image.style.width = width + 'px';
								itemNode.image = image;
								itemNode.appendChild(image);
								// Create our translucent overlay
								if (hasOverlay) {
									overlay = document.createElement('div');
									overlay.setAttribute('class','bb-bb10-grid-item-overlay-'+res);
									overlay.innerHTML = '<div><p class="title">' + title + '<br/>' + subtitle +'</p></div>';								
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
								itemNode.ontouchstart = function() {
															if (this.overlay) {
																this.overlay.setAttribute('style','opacity:1.0;background-color:' + bb.options.bb10HighlightColor +';');
															}
															itemNode.fingerDown = true;
															itemNode.contextShown = false;
															if (itemNode.contextMenu) {
																window.setTimeout(this.touchTimer, 667);
															}
														};
								itemNode.ontouchend = function() {
															if (this.overlay) {
																this.overlay.setAttribute('style','');
															}
															itemNode.fingerDown = false;
															if (itemNode.contextShown) {
																event.preventDefault();
																event.stopPropagation();
															}
														};
								itemNode.touchTimer = function() {
																if (itemNode.fingerDown) {
																	itemNode.contextShown = true;
																	itemNode.contextMenu.peek({title:this.title,description:this.description, selected: this});
																}
															};
								itemNode.touchTimer = itemNode.touchTimer.bind(itemNode);
							}
						}
					}
				}
				
				// Make sure we move when the orientation of the device changes
				outerElement.orientationChanged = function(event) {
										var items = this.querySelectorAll('[data-bb-type=row]'),
											i,j,
											rowItems,
											numItems,
											itemNode,
											width,
											height;
					
										for (i = 0; i < items.length; i++) {
											rowItems = items[i].querySelectorAll('[data-bb-type=item]');
											numItems = rowItems.length;
											for (j = 0; j < numItems; j++ ) {
												itemNode = rowItems[j];
												width = (window.innerWidth/numItems) - 5;
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
										}
									};
				outerElement.orientationChanged = outerElement.orientationChanged.bind(outerElement);	
				window.addEventListener('resize', outerElement.orientationChanged,false); 
			}		
		} else {
			// Make the grids invisible if it isn't BB10
			for (var i = 0; i < elements.length; i++) {
				elements[i].style.display = 'none';
			}
		}
    }
};
bb.imageList = {  
    apply: function(elements) {
		if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				i,j,
				outerElement,
				items;
		
			// Apply our transforms to all Image Lists
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.items = [];
				outerElement.setAttribute('class','bb-bb10-image-list');
				outerElement.hideImages = outerElement.hasAttribute('data-bb-images') ? (outerElement.getAttribute('data-bb-images').toLowerCase() == 'none') : false;
				if (!outerElement.hideImages) {
					outerElement.imageEffect = outerElement.hasAttribute('data-bb-image-effect') ? outerElement.getAttribute('data-bb-image-effect').toLowerCase() : undefined;
					outerElement.imagePlaceholder = outerElement.hasAttribute('data-bb-image-placeholder') ? outerElement.getAttribute('data-bb-image-placeholder') : undefined;
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
							btnInner;
						
						if (type == 'header') {
							// Set our normal and highlight styling
							normal = 'bb-bb10-image-list-header bb-bb10-image-list-header-'+res;
							if (this.solidHeader) {
								normal = normal +' bb10Accent';
								innerChildNode.style.color = 'white';
								innerChildNode.style['border-bottom-color'] = 'transparent';
							} else {
								normal = normal + ' bb-bb10-image-list-header-normal-'+bb.screen.listColor;
								innerChildNode.style['border-bottom-color'] = bb.options.shades.darkOutline;
							}
							
							// Check for alignment
							if (this.headerJustify == 'left') {
								normal = normal + ' bb-bb10-image-list-header-left-'+res;
							} else if (this.headerJustify == 'right') {
								normal = normal + ' bb-bb10-image-list-header-right-'+res;
							} else {
								normal = normal + ' bb-bb10-image-list-header-center';
							}
							
							// Set our styling
							innerChildNode.normal = normal;
							innerChildNode.innerHTML = '<p>'+ description +'</p>';
							innerChildNode.setAttribute('class', normal);
						}
						else if (type == 'item') {
							normal = 'bb-bb10-image-list-item bb-bb10-image-list-item-' + bb.screen.listColor + ' bb-bb10-image-list-item-' + res;
							highlight = normal + ' bb-bb10-image-list-item-hover bb10Highlight';
							innerChildNode.normal = normal;
							innerChildNode.highlight = highlight;
							innerChildNode.setAttribute('class', normal);
							innerChildNode.innerHTML = '';
							// Create our image
							if (!this.hideImages) {
								img = document.createElement('img');
								img.outerElement = this;
								innerChildNode.img = img;
								if (this.imagePlaceholder) {
									img.placeholder = this.imagePlaceholder;
									img.src = innerChildNode.hasAttribute('data-bb-img') ? innerChildNode.getAttribute('data-bb-img') : this.imagePlaceholder;
								} else {
									img.setAttribute('src',innerChildNode.getAttribute('data-bb-img'));
								}
								innerChildNode.appendChild(img);
								
								if (this.imageEffect) {
									img.style.opacity = '0.0';
									img.even = (j%2 == 0)
									img.onload = function() {
													this.show();
												};
									img.show = function() {
													this.style.opacity = '1.0';
													if (this.even) { // Change timing based on even and odd numbers for some randomness
														this.style['-webkit-transition'] = 'opacity 0.5s linear';
													} else {
														this.style['-webkit-transition'] = 'opacity 1.0s linear';
													}
													this.style['-webkit-backface-visibility'] = 'hidden';
													this.style['-webkit-perspective'] = 1000;
													this.style['-webkit-transform'] = 'translate3d(0,0,0)';
												};
									img.show = img.show.bind(img);
								}
								// Handle the error scenario
								if (this.imagePlaceholder) {
									img.onerror = function() {
													if (this.src == this.placeholder) return;
													this.src = this.placeholder;
													if (this.outerElement.imageEffect) {
														this.show();
													}
												};
								}
							}
							// Create the details container
							details = document.createElement('div');
							details.innerChildNode = innerChildNode;
							innerChildNode.details = details;
							innerChildNode.appendChild(details);
							detailsClass = 'bb-bb10-image-list-item-details-'+res;
							if (this.hideImages) {
								detailsClass = detailsClass + ' bb-bb10-image-list-item-noimage-'+res;
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
							descriptionDiv.setAttribute('class','description');
							details.description = descriptionDiv;
							details.appendChild(descriptionDiv);
							
							// Add our highlight overlay
							overlay = document.createElement('div');
							overlay.setAttribute('class','bb-bb10-image-list-item-overlay-'+res);
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
								btnBorder.normal = 'bb-bb10-image-list-item-button-border-'+res+' bb-bb10-image-list-item-button-'+ bb.screen.listColor;
								btnBorder.setAttribute('class',btnBorder.normal);
								btn.btnBorder = btnBorder;
								btn.appendChild(btnBorder);
								// Create the inner button that has the image
								btnInner = document.createElement('div');
								btnInner.normal = 'bb-bb10-image-list-item-button-inner-'+res;
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
													this.btnInner.setAttribute('class',this.btnInner.highlight);
													this.btnBorder.style.background = '-webkit-gradient(linear, center top, center bottom, from(rgb(' + (bb.options.shades.R + 32) +',' + (bb.options.shades.G + 32) + ','+ (bb.options.shades.B + 32) +')), to('+bb.options.bb10HighlightColor+'))';
												};
												
									btn.ontouchend = function() {
													this.btnBorder.style.background = '';
													this.btnInner.setAttribute('class',this.btnInner.normal);
												};
									
									// Assign our click handler if one was available
									if (btn.onbtnclick) {
										btn.onclick = function(e) {
														e.stopPropagation();
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
									accentText.setAttribute('class','accent-text');
									accentText.innerHTML = innerChildNode.getAttribute('data-bb-accent-text');
									details.appendChild(accentText);
									details.accentText = accentText;
								}
							}
							
							// Adjust the description description
							if (description.length == 0) {
								description = '&nbsp;';
								descriptionDiv.style.visibilty = 'hidden';
								// Center the title if no description is given
								title.style['margin-top'] = (bb.device.isPlayBook) ? '17px' : '32px';
								// Adjust highlight overlay
								overlay.style['margin-top'] = (bb.device.isPlayBook) ? '-73px' : '-136px';
								// Adjust accent text
								if (accentText) {
									accentText.style['margin-top'] = (bb.device.isPlayBook) ? '-52px' : '-90px';
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
															//this.setAttribute('class',this.highlight);
															this.overlay.style['border-color'] =  bb.options.shades.darkOutline;
															innerChildNode.fingerDown = true;
															innerChildNode.contextShown = false;
															if (innerChildNode.contextMenu) {
																window.setTimeout(this.touchTimer, 667);
															}
														};
							innerChildNode.ontouchend = function (event) {
															//this.setAttribute('class',this.normal);
															this.overlay.style['border-color'] = 'transparent';
															innerChildNode.fingerDown = false;
															if (innerChildNode.contextShown) {
																event.preventDefault();
																event.stopPropagation();
															}
														};
							innerChildNode.touchTimer = function() {
															if (innerChildNode.fingerDown) {
																innerChildNode.contextShown = true;
																this.setAttribute('class',this.highlight);
																innerChildNode.contextMenu.hideEvents.push(this.finishHighlight);
																innerChildNode.contextMenu.peek({title:this.title,description:this.description, selected: this});
															}
														};
							innerChildNode.touchTimer = innerChildNode.touchTimer.bind(innerChildNode);
							
							// Add our subscription for click events to change highlighting on click
							innerChildNode.trappedClick = innerChildNode.onclick;
							innerChildNode.onclick = undefined;
							innerChildNode.outerElement = this;
							innerChildNode.addEventListener('click',function (e) {
									this.setAttribute('class',this.highlight);
									this.outerElement.selected = this;
									if (this.trappedClick) {
										setTimeout(this.trappedClick, 0);
									}
									setTimeout(this.finishHighlight, 250);
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
		else {
		
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
						inEvent, 
						outEvent,
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
						
					// Set our highlight events
					if (bb.device.isPlayBook) {
						inEvent = 'ontouchstart';
						outEvent = 'ontouchend';
					} else {
						inEvent = 'onmouseover';
						outEvent = 'onmouseout';
					}
								
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
							innerChildNode.setAttribute(inEvent, "this.setAttribute('class',this.highlight)");
							innerChildNode.setAttribute(outEvent, "this.setAttribute('class',this.normal)");
						} 
						else if (type == 'item') {
							innerChildNode.innerHTML = '';
							innerChildNode.setAttribute('class', 'bb-'+res+'-image-list-item');
							innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-"+res+"-image-list-item bb-"+res+"-image-list-item-hover')");
							innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-"+res+"-image-list-item')");
							innerChildNode.setAttribute('x-blackberry-focusable','true');
							
							if (!this.hideImages) {
								img = document.createElement('img');
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
								details.appendChild(accentDiv);
							}
							
							details.setAttribute('class', details.normal);
							
							// Add the description
							descriptionDiv = document.createElement('div');
							descriptionDiv.className = 'description';
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
    }
};

/*! * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org * Released under MIT license, http://cubiq.org/license */(function(){var m = Math,	mround = function (r) { return r >> 0; },	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :		(/firefox/i).test(navigator.userAgent) ? 'Moz' :		(/trident/i).test(navigator.userAgent) ? 'ms' :		'opera' in window ? 'O' : '',    // Browser capabilities    isAndroid = (/android/gi).test(navigator.appVersion),    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),    isPlaybook = (/playbook/gi).test(navigator.appVersion),    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),    hasTouch = 'ontouchstart' in window && !isTouchPad,    hasTransform = vendor + 'Transform' in document.documentElement.style,    hasTransitionEnd = isIDevice || isPlaybook,	nextFrame = (function() {	    return window.requestAnimationFrame			|| window.webkitRequestAnimationFrame			|| window.mozRequestAnimationFrame			|| window.oRequestAnimationFrame			|| window.msRequestAnimationFrame			|| function(callback) { return setTimeout(callback, 1); }	})(),	cancelFrame = (function () {	    return window.cancelRequestAnimationFrame			|| window.webkitCancelAnimationFrame			|| window.webkitCancelRequestAnimationFrame			|| window.mozCancelRequestAnimationFrame			|| window.oCancelRequestAnimationFrame			|| window.msCancelRequestAnimationFrame			|| clearTimeout	})(),	// Events	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',	START_EV = hasTouch ? 'touchstart' : 'mousedown',	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',	END_EV = hasTouch ? 'touchend' : 'mouseup',	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',	WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',	// Helpers	trnOpen = 'translate' + (has3d ? '3d(' : '('),	trnClose = has3d ? ',0)' : ')',	// Constructor	iScroll = function (el, options) {		var that = this,			doc = document,			i;		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);		that.wrapper.style.overflow = 'hidden';		that.scroller = that.wrapper.children[0];		// Default options		that.options = {			hScroll: true,			vScroll: true,			x: 0,			y: 0,			bounce: true,			bounceLock: false,			momentum: true,			lockDirection: true,			useTransform: true,			useTransition: false,			topOffset: 0,			checkDOMChanges: false,		// Experimental			// Scrollbar			hScrollbar: true,			vScrollbar: true,			fixedScrollbar: isAndroid,			hideScrollbar: isIDevice,			fadeScrollbar: isIDevice && has3d,			scrollbarClass: '',			// Zoom			zoom: false,			zoomMin: 1,			zoomMax: 4,			doubleTapZoom: 2,			wheelAction: 'scroll',			// Snap			snap: false,			snapThreshold: 1,			// Events			onRefresh: null,			onBeforeScrollStart: function (e) { e.preventDefault(); },			onScrollStart: null,			onBeforeScrollMove: null,			onScrollMove: null,			onBeforeScrollEnd: null,			onScrollEnd: null,			onTouchEnd: null,			onDestroy: null,			onZoomStart: null,			onZoom: null,			onZoomEnd: null		};		// User defined options		for (i in options) that.options[i] = options[i];				// Set starting position		that.x = that.options.x;		that.y = that.options.y;		// Normalize options		that.options.useTransform = hasTransform ? that.options.useTransform : false;		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;		that.options.zoom = that.options.useTransform && that.options.zoom;		that.options.useTransition = hasTransitionEnd && that.options.useTransition;		// Helpers FIX ANDROID BUG!		// translate3d and scale doesn't work together! 		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom		if ( that.options.zoom && isAndroid ){			trnOpen = 'translate(';			trnClose = ')';		}				// Set some default styles		that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';		that.scroller.style[vendor + 'TransitionDuration'] = '0';		that.scroller.style[vendor + 'TransformOrigin'] = '0 0';		if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';				if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';		if (that.options.useTransition) that.options.fixedScrollbar = true;		that.refresh();		that._bind(RESIZE_EV, window);		that._bind(START_EV);		if (!hasTouch) {			that._bind('mouseout', that.wrapper);			if (that.options.wheelAction != 'none')				that._bind(WHEEL_EV);		}		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {			that._checkDOMChanges();		}, 500);	};// PrototypeiScroll.prototype = {	enabled: true,	x: 0,	y: 0,	steps: [],	scale: 1,	currPageX: 0, currPageY: 0,	pagesX: [], pagesY: [],	aniTime: null,	wheelZoomCount: 0,		handleEvent: function (e) {		var that = this;		switch(e.type) {			case START_EV:				if (!hasTouch && e.button !== 0) return;				that._start(e);				break;			case MOVE_EV: that._move(e); break;			case END_EV:			case CANCEL_EV: that._end(e); break;			case RESIZE_EV: that._resize(); break;			case WHEEL_EV: that._wheel(e); break;			case 'mouseout': that._mouseout(e); break;			case 'webkitTransitionEnd': that._transitionEnd(e); break;		}	},		_checkDOMChanges: function () {		if (this.moved || this.zoomed || this.animating ||			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;		this.refresh();	},		_scrollbar: function (dir) {		var that = this,			doc = document,			bar;		if (!that[dir + 'Scrollbar']) {			if (that[dir + 'ScrollbarWrapper']) {				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = '';				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);				that[dir + 'ScrollbarWrapper'] = null;				that[dir + 'ScrollbarIndicator'] = null;			}			return;		}		if (!that[dir + 'ScrollbarWrapper']) {			// Create the scrollbar wrapper			bar = doc.createElement('div');			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:opacity;-' + vendor + '-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');			that.wrapper.appendChild(bar);			that[dir + 'ScrollbarWrapper'] = bar;			// Create the scrollbar indicator			bar = doc.createElement('div');			if (!that.options.scrollbarClass) {				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.9);-' + vendor + '-background-clip:padding-box;-' + vendor + '-box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';-' + vendor + '-border-radius:3px;border-radius:3px';			}			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:-' + vendor + '-transform;-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-' + vendor + '-transition-duration:0;-' + vendor + '-transform:' + trnOpen + '0,0' + trnClose;			if (that.options.useTransition) bar.style.cssText += ';-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';			that[dir + 'ScrollbarWrapper'].appendChild(bar);			that[dir + 'ScrollbarIndicator'] = bar;		}		if (dir == 'h') {			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;			that.hScrollbarIndicatorSize = m.max(mround(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;		} else {			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;			that.vScrollbarIndicatorSize = m.max(mround(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;		}		// Reset position		that._scrollbarPos(dir, true);	},		_resize: function () {		var that = this;		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);	},		_pos: function (x, y) {		x = this.hScroll ? x : 0;		y = this.vScroll ? y : 0;		if (this.options.useTransform) {			this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';		} else {			x = mround(x);			y = mround(y);			this.scroller.style.left = x + 'px';			this.scroller.style.top = y + 'px';		}		this.x = x;		this.y = y;		this._scrollbarPos('h');		this._scrollbarPos('v');	},	_scrollbarPos: function (dir, hidden) {		var that = this,			pos = dir == 'h' ? that.x : that.y,			size;		if (!that[dir + 'Scrollbar']) return;		pos = that[dir + 'ScrollbarProp'] * pos;		if (pos < 0) {			if (!that.options.fixedScrollbar) {				size = that[dir + 'ScrollbarIndicatorSize'] + mround(pos * 3);				if (size < 8) size = 8;				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';			}			pos = 0;		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {			if (!that.options.fixedScrollbar) {				size = that[dir + 'ScrollbarIndicatorSize'] - mround((pos - that[dir + 'ScrollbarMaxScroll']) * 3);				if (size < 8) size = 8;				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);			} else {				pos = that[dir + 'ScrollbarMaxScroll'];			}		}		that[dir + 'ScrollbarWrapper'].style[vendor + 'TransitionDelay'] = '0';		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';		that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;	},		_start: function (e) {		var that = this,			point = hasTouch ? e.touches[0] : e,			matrix, x, y,			c1, c2;		if (!that.enabled) return;		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);		that.moved = false;		that.animating = false;		that.zoomed = false;		that.distX = 0;		that.distY = 0;		that.absDistX = 0;		that.absDistY = 0;		that.dirX = 0;		that.dirY = 0;		// Gesture start		if (that.options.zoom && hasTouch && e.touches.length > 1) {			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);		}		if (that.options.momentum) {			if (that.options.useTransform) {				// Very lame general purpose alternative to CSSMatrix				matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');				x = matrix[4] * 1;				y = matrix[5] * 1;			} else {				x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;				y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;			}						if (x != that.x || y != that.y) {				if (that.options.useTransition) that._unbind('webkitTransitionEnd');				else cancelFrame(that.aniTime);				that.steps = [];				that._pos(x, y);			}		}		that.absStartX = that.x;	// Needed by snap threshold		that.absStartY = that.y;		that.startX = that.x;		that.startY = that.y;		that.pointX = point.pageX;		that.pointY = point.pageY;		that.startTime = e.timeStamp || Date.now();		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);		that._bind(MOVE_EV);		that._bind(END_EV);		that._bind(CANCEL_EV);	},		_move: function (e) {		var that = this,			point = hasTouch ? e.touches[0] : e,			deltaX = point.pageX - that.pointX,			deltaY = point.pageY - that.pointY,			newX = that.x + deltaX,			newY = that.y + deltaY,			c1, c2, scale,			timestamp = e.timeStamp || Date.now();		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);		// Zoom		if (that.options.zoom && hasTouch && e.touches.length > 1) {			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);			that.touchesDist = m.sqrt(c1*c1+c2*c2);			that.zoomed = true;			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);			that.lastScale = scale / this.scale;			newX = this.originX - this.originX * that.lastScale + this.x,			newY = this.originY - this.originY * that.lastScale + this.y;			this.scroller.style[vendor + 'Transform'] = trnOpen + newX + 'px,' + newY + 'px' + trnClose + ' scale(' + scale + ')';			if (that.options.onZoom) that.options.onZoom.call(that, e);			return;		}		that.pointX = point.pageX;		that.pointY = point.pageY;		// Slow down if outside of the boundaries		if (newX > 0 || newX < that.maxScrollX) {			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;		}		if (newY > that.minScrollY || newY < that.maxScrollY) { 			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;		}		that.distX += deltaX;		that.distY += deltaY;		that.absDistX = m.abs(that.distX);		that.absDistY = m.abs(that.distY);		if (that.absDistX < 6 && that.absDistY < 6) {			return;		}		// Lock direction		if (that.options.lockDirection) {			if (that.absDistX > that.absDistY + 5) {				newY = that.y;				deltaY = 0;			} else if (that.absDistY > that.absDistX + 5) {				newX = that.x;				deltaX = 0;			}		}		that.moved = true;		that._pos(newX, newY);		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;		if (timestamp - that.startTime > 300) {			that.startTime = timestamp;			that.startX = that.x;			that.startY = that.y;		}				if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);	},		_end: function (e) {		if (hasTouch && e.touches.length != 0) return;		var that = this,			point = hasTouch ? e.changedTouches[0] : e,			target, ev,			momentumX = { dist:0, time:0 },			momentumY = { dist:0, time:0 },			duration = (e.timeStamp || Date.now()) - that.startTime,			newPosX = that.x,			newPosY = that.y,			distX, distY,			newDuration,			snap,			scale;		that._unbind(MOVE_EV);		that._unbind(END_EV);		that._unbind(CANCEL_EV);		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);		if (that.zoomed) {			scale = that.scale * that.lastScale;			scale = Math.max(that.options.zoomMin, scale);			scale = Math.min(that.options.zoomMax, scale);			that.lastScale = scale / that.scale;			that.scale = scale;			that.x = that.originX - that.originX * that.lastScale + that.x;			that.y = that.originY - that.originY * that.lastScale + that.y;						that.scroller.style[vendor + 'TransitionDuration'] = '200ms';			that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';						that.zoomed = false;			that.refresh();			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);			return;		}		if (!that.moved) {			if (hasTouch) {				if (that.doubleTapTimer && that.options.zoom) {					// Double tapped					clearTimeout(that.doubleTapTimer);					that.doubleTapTimer = null;					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);					if (that.options.onZoomEnd) {						setTimeout(function() {							that.options.onZoomEnd.call(that, e);						}, 200); // 200 is default zoom duration					}				} else {					that.doubleTapTimer = setTimeout(function () {						that.doubleTapTimer = null;						// Find the last touched element						target = point.target;						while (target.nodeType != 1) target = target.parentNode;						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {							ev = document.createEvent('MouseEvents');							ev.initMouseEvent('click', true, true, e.view, 1,								point.screenX, point.screenY, point.clientX, point.clientY,								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,								0, null);							ev._fake = true;							target.dispatchEvent(ev);						}					}, that.options.zoom ? 250 : 0);				}			}			that._resetPos(200);			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);			return;		}		if (duration < 300 && that.options.momentum) {			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;			newPosX = that.x + momentumX.dist;			newPosY = that.y + momentumY.dist; 			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 }; 			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };		}		if (momentumX.dist || momentumY.dist) {			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);			// Do we need to snap?			if (that.options.snap) {				distX = newPosX - that.absStartX;				distY = newPosY - that.absStartY;				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }				else {					snap = that._snap(newPosX, newPosY);					newPosX = snap.x;					newPosY = snap.y;					newDuration = m.max(snap.time, newDuration);				}			}			that.scrollTo(mround(newPosX), mround(newPosY), newDuration);			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);			return;		}		// Do we need to snap?		if (that.options.snap) {			distX = newPosX - that.absStartX;			distY = newPosY - that.absStartY;			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);			else {				snap = that._snap(that.x, that.y);				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);			}			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);			return;		}		that._resetPos(200);		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);	},		_resetPos: function (time) {		var that = this,			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;		if (resetX == that.x && resetY == that.y) {			if (that.moved) {				that.moved = false;				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end			}			if (that.hScrollbar && that.options.hideScrollbar) {				if (vendor == 'webkit') that.hScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';				that.hScrollbarWrapper.style.opacity = '0';			}			if (that.vScrollbar && that.options.hideScrollbar) {				if (vendor == 'webkit') that.vScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';				that.vScrollbarWrapper.style.opacity = '0';			}			return;		}		that.scrollTo(resetX, resetY, time || 0);	},	_wheel: function (e) {		var that = this,			wheelDeltaX, wheelDeltaY,			deltaX, deltaY,			deltaScale;		if ('wheelDeltaX' in e) {			wheelDeltaX = e.wheelDeltaX / 12;			wheelDeltaY = e.wheelDeltaY / 12;		} else if('wheelDelta' in e) {			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;		} else if ('detail' in e) {			wheelDeltaX = wheelDeltaY = -e.detail * 3;		} else {			return;		}				if (that.options.wheelAction == 'zoom') {			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;						if (deltaScale != that.scale) {				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);				that.wheelZoomCount++;								that.zoom(e.pageX, e.pageY, deltaScale, 400);								setTimeout(function() {					that.wheelZoomCount--;					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);				}, 400);			}						return;		}				deltaX = that.x + wheelDeltaX;		deltaY = that.y + wheelDeltaY;		if (deltaX > 0) deltaX = 0;		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;		if (deltaY > that.minScrollY) deltaY = that.minScrollY;		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;		that.scrollTo(deltaX, deltaY, 0);	},		_mouseout: function (e) {		var t = e.relatedTarget;		if (!t) {			this._end(e);			return;		}		while (t = t.parentNode) if (t == this.wrapper) return;				this._end(e);	},	_transitionEnd: function (e) {		var that = this;		if (e.target != that.scroller) return;		that._unbind('webkitTransitionEnd');				that._startAni();	},	/**	 *	 * Utilities	 *	 */	_startAni: function () {		var that = this,			startX = that.x, startY = that.y,			startTime = Date.now(),			step, easeOut,			animate;		if (that.animating) return;				if (!that.steps.length) {			that._resetPos(400);			return;		}				step = that.steps.shift();				if (step.x == startX && step.y == startY) step.time = 0;		that.animating = true;		that.moved = true;				if (that.options.useTransition) {			that._transitionTime(step.time);			that._pos(step.x, step.y);			that.animating = false;			if (step.time) that._bind('webkitTransitionEnd');			else that._resetPos(0);			return;		}		animate = function () {			var now = Date.now(),				newX, newY;			if (now >= startTime + step.time) {				that._pos(step.x, step.y);				that.animating = false;				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end				that._startAni();				return;			}			now = (now - startTime) / step.time - 1;			easeOut = m.sqrt(1 - now * now);			newX = (step.x - startX) * easeOut + startX;			newY = (step.y - startY) * easeOut + startY;			that._pos(newX, newY);			if (that.animating) that.aniTime = nextFrame(animate);		};		animate();	},	_transitionTime: function (time) {		time += 'ms';		this.scroller.style[vendor + 'TransitionDuration'] = time;		if (this.hScrollbar) this.hScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;		if (this.vScrollbar) this.vScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;	},	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {		var deceleration = 0.0006,			speed = m.abs(dist) / time,			newDist = (speed * speed) / (2 * deceleration),			newTime = 0, outsideDist = 0;		// Proportinally reduce speed if we are outside of the boundaries 		if (dist > 0 && newDist > maxDistUpper) {			outsideDist = size / (6 / (newDist / speed * deceleration));			maxDistUpper = maxDistUpper + outsideDist;			speed = speed * maxDistUpper / newDist;			newDist = maxDistUpper;		} else if (dist < 0 && newDist > maxDistLower) {			outsideDist = size / (6 / (newDist / speed * deceleration));			maxDistLower = maxDistLower + outsideDist;			speed = speed * maxDistLower / newDist;			newDist = maxDistLower;		}		newDist = newDist * (dist < 0 ? -1 : 1);		newTime = speed / deceleration;		return { dist: newDist, time: mround(newTime) };	},	_offset: function (el) {		var left = -el.offsetLeft,			top = -el.offsetTop;					while (el = el.offsetParent) {			left -= el.offsetLeft;			top -= el.offsetTop;		}				if (el != this.wrapper) {			left *= this.scale;			top *= this.scale;		}		return { left: left, top: top };	},	_snap: function (x, y) {		var that = this,			i, l,			page, time,			sizeX, sizeY;		// Check page X		page = that.pagesX.length - 1;		for (i=0, l=that.pagesX.length; i<l; i++) {			if (x >= that.pagesX[i]) {				page = i;				break;			}		}		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;		x = that.pagesX[page];		sizeX = m.abs(x - that.pagesX[that.currPageX]);		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;		that.currPageX = page;		// Check page Y		page = that.pagesY.length-1;		for (i=0; i<page; i++) {			if (y >= that.pagesY[i]) {				page = i;				break;			}		}		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;		y = that.pagesY[page];		sizeY = m.abs(y - that.pagesY[that.currPageY]);		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;		that.currPageY = page;		// Snap with constant speed (proportional duration)		time = mround(m.max(sizeX, sizeY)) || 200;		return { x: x, y: y, time: time };	},	_bind: function (type, el, bubble) {		(el || this.scroller).addEventListener(type, this, !!bubble);	},	_unbind: function (type, el, bubble) {		(el || this.scroller).removeEventListener(type, this, !!bubble);	},	/**	 *	 * Public methods	 *	 */	destroy: function () {		var that = this;		that.scroller.style[vendor + 'Transform'] = '';		// Remove the scrollbars		that.hScrollbar = false;		that.vScrollbar = false;		that._scrollbar('h');		that._scrollbar('v');		// Remove the event listeners		that._unbind(RESIZE_EV, window);		that._unbind(START_EV);		that._unbind(MOVE_EV);		that._unbind(END_EV);		that._unbind(CANCEL_EV);				if (!that.options.hasTouch) {			that._unbind('mouseout', that.wrapper);			that._unbind(WHEEL_EV);		}				if (that.options.useTransition) that._unbind('webkitTransitionEnd');				if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);				if (that.options.onDestroy) that.options.onDestroy.call(that);	},	refresh: function () {		var that = this,			offset,			i, l,			els,			pos = 0,			page = 0;		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;		that.wrapperW = that.wrapper.clientWidth || 1;		that.wrapperH = that.wrapper.clientHeight || 1;		that.minScrollY = -that.options.topOffset || 0;		that.scrollerW = mround(that.scroller.offsetWidth * that.scale);		that.scrollerH = mround((that.scroller.offsetHeight + that.minScrollY) * that.scale);		that.maxScrollX = that.wrapperW - that.scrollerW;		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;		that.dirX = 0;		that.dirY = 0;		if (that.options.onRefresh) that.options.onRefresh.call(that);		that.hScroll = that.options.hScroll && that.maxScrollX < 0;		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);		that.hScrollbar = that.hScroll && that.options.hScrollbar;		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;		offset = that._offset(that.wrapper);		that.wrapperOffsetLeft = -offset.left;		that.wrapperOffsetTop = -offset.top;		// Prepare snap		if (typeof that.options.snap == 'string') {			that.pagesX = [];			that.pagesY = [];			els = that.scroller.querySelectorAll(that.options.snap);			for (i=0, l=els.length; i<l; i++) {				pos = that._offset(els[i]);				pos.left += that.wrapperOffsetLeft;				pos.top += that.wrapperOffsetTop;				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;			}		} else if (that.options.snap) {			that.pagesX = [];			while (pos >= that.maxScrollX) {				that.pagesX[page] = pos;				pos = pos - that.wrapperW;				page++;			}			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];			pos = 0;			page = 0;			that.pagesY = [];			while (pos >= that.maxScrollY) {				that.pagesY[page] = pos;				pos = pos - that.wrapperH;				page++;			}			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];		}		// Prepare the scrollbars		that._scrollbar('h');		that._scrollbar('v');		if (!that.zoomed) {			that.scroller.style[vendor + 'TransitionDuration'] = '0';			that._resetPos(200);		}	},	scrollTo: function (x, y, time, relative) {		var that = this,			step = x,			i, l;		that.stop();		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];				for (i=0, l=step.length; i<l; i++) {			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });		}		that._startAni();	},	scrollToElement: function (el, time) {		var that = this, pos;		el = el.nodeType ? el : that.scroller.querySelector(el);		if (!el) return;		pos = that._offset(el);		pos.left += that.wrapperOffsetLeft;		pos.top += that.wrapperOffsetTop;		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;		that.scrollTo(pos.left, pos.top, time);	},	scrollToPage: function (pageX, pageY, time) {		var that = this, x, y;				time = time === undefined ? 400 : time;		if (that.options.onScrollStart) that.options.onScrollStart.call(that);		if (that.options.snap) {			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;			that.currPageX = pageX;			that.currPageY = pageY;			x = that.pagesX[pageX];			y = that.pagesY[pageY];		} else {			x = -that.wrapperW * pageX;			y = -that.wrapperH * pageY;			if (x < that.maxScrollX) x = that.maxScrollX;			if (y < that.maxScrollY) y = that.maxScrollY;		}		that.scrollTo(x, y, time);	},	disable: function () {		this.stop();		this._resetPos(0);		this.enabled = false;		// If disabled after touchstart we make sure that there are no left over events		this._unbind(MOVE_EV);		this._unbind(END_EV);		this._unbind(CANCEL_EV);	},		enable: function () {		this.enabled = true;	},		stop: function () {		if (this.options.useTransition) this._unbind('webkitTransitionEnd');		else cancelFrame(this.aniTime);		this.steps = [];		this.moved = false;		this.animating = false;	},		zoom: function (x, y, scale, time) {		var that = this,			relScale = scale / that.scale;		if (!that.options.useTransform) return;		that.zoomed = true;		time = time === undefined ? 200 : time;		x = x - that.wrapperOffsetLeft - that.x;		y = y - that.wrapperOffsetTop - that.y;		that.x = x - x * relScale + that.x;		that.y = y - y * relScale + that.y;		that.scale = scale;		that.refresh();		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;		that.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';		that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';		that.zoomed = false;	},		isReady: function () {		return !this.moved && !this.zoomed && !this.animating;	}};if (typeof exports !== 'undefined') exports.iScroll = iScroll;else window.iScroll = iScroll;})();
bb.labelControlContainers = {
    // Apply our transforms to all label control rows
    apply: function(elements) {
        if (bb.device.isBB5) {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
                outerElement.setAttribute('class','bb-label-control-horizontal-row');
                // Gather our inner items
                var items = outerElement.querySelectorAll('[data-bb-type=label]');
                for (var j = 0; j < items.length; j++) {
                    var label = items[j];
                    label.setAttribute('class', 'bb-label');
                }
            }
		} else if (bb.device.isBB10) {
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
				bbType,
				res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
			for (i = 0; i < elements.length; i++) {
                outerElement = elements[i];
                
                // Fetch all our rows
                items = outerElement.querySelectorAll('[data-bb-type=row]');
                if (items.length > 0 ) {
                    // Create our containing table
                    table = document.createElement('table');
                    table.setAttribute('class','bb-bb10-label-control-rows');
                    outerElement.insertBefore(table,items[0]);
                    
                    for (j = 0; j < items.length; j++) {
                        row = items[j];
                        tr = document.createElement('tr');
						tr.setAttribute('class','bb-bb10-label-control-label-row-'+res);
                        table.appendChild(tr);
                        
						// Get the label
                        tdLabel = document.createElement('td');
                        tr.appendChild(tdLabel);
                        label = row.querySelectorAll('[data-bb-type=label]')[0];
						label.setAttribute('class','bb-bb10-label-control-label-'+res);
                        row.removeChild(label);
                        tdLabel.appendChild(label);
                        
						// Get the control
						tr = document.createElement('tr');
                        table.appendChild(tr);
                        tdControl = document.createElement('td');
                        tr.appendChild(tdControl);
                        control = row.querySelectorAll('[data-bb-type=button],input,[data-bb-type=dropdown],textarea')[0];
                        row.removeChild(control);
                        tdControl.appendChild(control);
                        outerElement.removeChild(row);
                        /*bbType = control.getAttribute('data-bb-type');
                        if (bbType == 'button' || bbType == 'dropdown') {
                            control.style.float = 'right';
                        }*/
                    }
                }
            }
		} else {
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
                        }
                    }
                }
            }
        }
    }
};
bb.menuBar = {
	height: 100,
	menuOpen: false,
	menu: false,

	apply: function(menuBar,screen){
		if (bb.device.isPlayBook || bb.device.isBB10) {
			bb.menuBar.createSwipeMenu(menuBar,screen);
			if (bb.device.isPlayBook && !bb.device.isBB10) {
				menuBar.parentNode.removeChild(menuBar);
			}
			if (window.blackberry && blackberry.app.event) {
				blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar); 
			}
		}else if(window.blackberry && blackberry.ui.menu){
			bb.menuBar.createBlackberryMenu(menuBar);
			menuBar.parentNode.removeChild(menuBar);
		}else{
			console.log('Unable to create Blackberry/onSwipeDown menu.');
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
	
	createSwipeMenu: function(menuBar, screen){
		// Get our resolution text for BB10 styling			
		if (bb.device.isBB10) {
			var res,
				i,
				type,
				item,
				foundItems = [],
				img,
				imgPath,
				caption,
				div,
				width;
				
			if (bb.device.isPlayBook) {
				res = 'lowres';
				bb.menuBar.height = 100;
			} else {
				res = 'hires';
				bb.menuBar.height = 140;
			}
			//screen.appendChild(menuBar);
			menuBar.setAttribute('class','bb-bb10-menu-bar-'+res+' bb-bb10-menu-bar-'+bb.actionBar.color);
			items = menuBar.querySelectorAll('[data-bb-type=menu-item]');
			for (i = 0; i < items.length; i++) {
				item = items[i];
				type = item.hasAttribute('data-bb-type') ? item.getAttribute('data-bb-type').toLowerCase() : undefined;
				// Get our menu items
				if (type == 'menu-item') {
					caption = item.innerHTML;
					imgPath = item.getAttribute('data-bb-img');
					// If the item doesn't have both an image and text then remove it
					if ((caption && imgPath) && (foundItems.length < 5)) {
						// BB10 menus only allow 5 items max
						foundItems.push(item);
						// Set our item information
						item.setAttribute('class','bb-bb10-menu-bar-item-'+res);
						item.innerHTML = '';
						// Add the image
						img = document.createElement('img');
						img.setAttribute('src',imgPath);
						item.appendChild(img);
						// Add the caption
						div = document.createElement('div');
						div.setAttribute('class','bb-bb10-menu-bar-item-caption-'+res);
						div.innerHTML = caption;
						item.appendChild(div);
					} else {
						item.style.display = 'none';
					}
				} else {
					item.style.display = 'none';
				}
			}
			// Now apply the widths since we now know how many there are
			if (foundItems.length > 0) {
				width = Math.floor(100/foundItems.length);
				for (i = 0; i < foundItems.length;i++) {
					item = foundItems[i];
					if (i == foundItems.length -1) {
						item.style.width = width - 1 +'%';
						item.style.float = 'right';
					} else {
						item.style.width = width +'%';
					}				
				}	
			} else {
				menuBar.style.display = 'none';
				bb.menuBar.menu = null;
			}
			// Remove any separators
			if (bb.menuBar.menu) {
				items = menuBar.querySelectorAll('[data-bb-type=menu-separator]');
				for (i = 0; i < items.length; i++) {
					items[i].style.display = 'none';
				}
			}
			// Set the size of the menu bar and assign the lstener
			menuBar.style['-webkit-transform']	= 'translate(0,0)';
			menuBar.addEventListener('click', bb.menuBar.onMenuBarClicked, false);
			// Assign the menu
			bb.menuBar.menu	= menuBar;	
		} else {
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
		}
		
		// Add the overlay for trapping clicks on items below
		if (!bb.screen.overlay) {
			bb.screen.overlay = document.createElement('div');
			bb.screen.overlay.setAttribute('class','bb-bb10-context-menu-overlay');
		}
		screen.appendChild(bb.screen.overlay);
		bb.menuBar.menu.overlay = bb.screen.overlay;	
	},

	showMenuBar: function(){
		if(!bb.menuBar.menuOpen){
			bb.menuBar.menu.overlay.style.display = 'inline';
			blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);
			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate(0, ' + (bb.menuBar.height + 3) + 'px)';
			bb.menuBar.menuOpen = true;
			bb.menuBar.menu.overlay.addEventListener('touchstart', bb.menuBar.overlayTouchHandler, false);
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.menuOpen){
			bb.menuBar.menu.overlay.style.display = 'none';
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate(0, -' + (bb.menuBar.height + 3) + 'px)';
			bb.menuBar.menuOpen = false;
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
				if (blackberry.app.event) {
					blackberry.app.event.onSwipeDown('');
				}
				bb.menuBar.menu.parentNode.removeChild(bb.menuBar.menu);
				bb.menuBar.menu = false;
				bb.menuBar.menuOpen = false;
			}else if(blackberry.ui && blackberry.ui.menu){
				blackberry.ui.menu.clearMenuItems();
			}
		}
	}
};
bb.pillButtons = {  
    // Apply our transforms to all pill buttons passed in
    apply: function(elements) {
        if (bb.device.isBB5) {
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
            }
		} else if (bb.device.isBB10) {
			var res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
			var i,
				outerElement,
				containerStyle = 'bb-bb10-pill-buttons-container-'+res+' bb-bb10-pill-buttons-container-' + bb.screen.controlColor,
				buttonStyle = 'bb-bb10-pill-button-'+res,
				containerDiv,
				innerBorder;
	
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
                outerElement.setAttribute('class','bb-bb10-pill-buttons-'+res);
				containerDiv = document.createElement('div');
				outerElement.appendChild(containerDiv);
				containerDiv.setAttribute('class',containerStyle);
                
                // Gather our inner items
                var items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
                    percentWidth = Math.floor(100 / items.length),
					sidePadding = 102-(percentWidth * items.length),
                    sidePadding,
					innerChildNode,
					j;
				
                outerElement.style['padding-left'] = sidePadding + '%';
                outerElement.style['padding-right'] = sidePadding + '%';
                for (j = 0; j < items.length; j++) {
                    innerChildNode = items[j];
					containerDiv.appendChild(innerChildNode);
					
                    // Set our styling
					innerChildNode.selected = buttonStyle + ' bb-bb10-pill-button-selected-'+res+'-'+ bb.screen.controlColor;
					innerChildNode.normal = buttonStyle;
					innerChildNode.highlight = buttonStyle + ' bb-bb10-pill-button-highlight-'+res+'-'+ bb.screen.controlColor +' bb10Highlight';
					if (j == items.length - 1) {
						innerChildNode.style.float = 'right';
						if (!bb.device.isPlayBook && j > 2) {
							innerChildNode.style.width = percentWidth-2 + '%';
						} else {
							innerChildNode.style.width = percentWidth-1 + '%';
						}						
					} else {
						innerChildNode.style.width = percentWidth + '%';
					}
					
					// Create our inner container to have double borders
					innerBorder = document.createElement('div');
					innerBorder.normal = 'bb-bb10-pill-button-inner-'+res;
					innerBorder.selected = innerBorder.normal +' bb-bb10-pill-button-inner-selected-'+res+'-'+bb.screen.controlColor;
					
					innerBorder.innerHTML = innerChildNode.innerHTML;
					innerChildNode.innerHTML = '';
					innerChildNode.appendChild(innerBorder);
					
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class',innerChildNode.selected);
						innerBorder.setAttribute('class',innerBorder.selected);
					} else {
						innerChildNode.setAttribute('class',innerChildNode.normal);
						innerBorder.setAttribute('class',innerBorder.normal);
						innerChildNode.ontouchstart = function() {
													this.setAttribute('class',this.highlight);
												};
						innerChildNode.ontouchend = function() {
													this.setAttribute('class',this.normal);
												};
					}
					
                    // Add our subscription for click events to change highlighting
                    innerChildNode.addEventListener('click',function (e) {
                            var innerChildNode,
								innerBorder,
								items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
                            for (var j = 0; j < items.length; j++) {
                                innerChildNode = items[j];
								innerBorder = innerChildNode.firstChild;
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class',innerChildNode.selected);
									innerBorder.setAttribute('class',innerBorder.selected);
								} else {
									innerBorder.setAttribute('class',innerBorder.normal);
									innerChildNode.setAttribute('class',innerChildNode.normal);
									innerChildNode.ontouchstart = function() {
													this.setAttribute('class',this.highlight);
												};
									innerChildNode.ontouchend = function() {
													this.setAttribute('class',this.normal);
												};
								}
                            }
                        },false);
                }
            }
        } else {
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
            }
        }
    } /*,
    
    // Reset the button back to its un-selected state
    deSelectButton: function(button) {
        var cssClass = button.getAttribute('class');
        if (cssClass == 'buttonLeft') {
            button.style.backgroundPosition = 'top right';
            button.firstChild.style.backgroundPosition = 'top left'; 
        }
        else if (cssClass == 'buttonRight') {
            button.style.backgroundPosition = 'top right';
            button.firstChild.style.backgroundPosition = '-10px 0px';
        }
        else if (cssClass == 'buttonMiddle') {
            button.style.backgroundPosition = 'top right';
            button.firstChild.style.backgroundPosition = '-10px 0px';
        }
    },
    
    // Highlight the button
    selectButton: function(button) {
        var cssClass = button.getAttribute('class');
        if (cssClass == 'buttonLeft') {
            button.style.backgroundPosition = 'bottom right';
            button.firstChild.style.backgroundPosition = 'bottom left';
        }
        else if (cssClass == 'buttonRight') {
            button.style.backgroundPosition = 'bottom right';
            button.firstChild.style.backgroundPosition = '-10px -39px';
        }
        else if (cssClass == 'buttonMiddle') {
            button.style.backgroundPosition = 'bottom right';
            button.firstChild.style.backgroundPosition = '-10px -39px';
        }
    }*/
};
bb.progress = {

	NORMAL : 0,
	PAUSED : 1,
	ERROR : 2,
	
	apply: function(elements) {
		
		var i, 
			progress,
			res,
			color,
			highlightColor,
			accentColor,
			NORMAL = 0,
			PAUSED = 1,
			ERROR = 2;
			
		if (bb.device.isBB10) {
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			color = bb.options.bb10ControlsDark ? 'dark' : 'light';
			highlightColor = bb.options.bb10HighlightColor;
			accentColor = bb.options.shades.darkHighlight;
		} else {
			res = 'lowres';
			color = 'light';
			highlightColor = '#92B43B';
			accentColor = '#8FB03B';
		}
		
		for (i = 0; i < elements.length; i++) {
			progress = elements[i];
			// Create our container div
			outerElement = document.createElement('div');
			outerElement.progress = progress;
			outerElement.state = bb.progress.NORMAL;
			progress.parentNode.insertBefore(outerElement, progress);
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
			
			// Set our value on a timeout so that it can calculate width once in the DOM
			window.setTimeout(progress.setValue, 0);
			outerElement.doOrientationChange = function() {
								window.setTimeout(this.progress.setValue, 0);
							};
			outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
			// Assign our document event listeners
			window.addEventListener('resize', outerElement.doOrientationChange,false); 
		}
	}
};

bb.radio = {
	apply: function(elements) {
		if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				i,
				outerElement,
				containerDiv,
				dotDiv,
				centerDotDiv,
				radio,
				color = bb.screen.controlColor;			
				
			// Apply our transforms to all Radio buttons
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				input = outerElement;
				outerElement = document.createElement('div');
				outerElement.setAttribute('class','bb-bb10-radio-container-'+res + '-'+color);
				outerElement.input = input;
				input.outerElement = outerElement;

				// Make the existing <input[type=radio]> invisible so that we can hide it and create our own display
				input.style.display = 'none';
				
				// Create the dropdown container and insert it where the select was
				input.radio = outerElement;
				input.parentNode.insertBefore(outerElement, input);
				// Insert the select as an invisible node in the new dropdown element
                outerElement.appendChild(input);
				
				// Create our colored dot
				dotDiv = document.createElement('div');
				dotDiv.setAttribute('class','bb-bb10-radio-dot-'+res);
				dotDiv.highlight = '-webkit-linear-gradient(top,  rgb('+ (bb.options.shades.R + 32) +', '+ (bb.options.shades.G + 32) +', '+ (bb.options.shades.B + 32) +') 0%, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 100%)';
				dotDiv.touchHighlight = '-webkit-linear-gradient(top,  rgba('+ (bb.options.shades.R - 64) +', '+ (bb.options.shades.G - 64) +', '+ (bb.options.shades.B - 64) +',0.25) 0%, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +',0.25) 100%)';
				if (input.checked) {
					dotDiv.style.background = dotDiv.highlight;
				}
				outerElement.dotDiv = dotDiv;
				outerElement.appendChild(dotDiv);
				
				// Set up our center dot
				centerDotDiv = document.createElement('div');
				centerDotDiv.setAttribute('class','bb-bb10-radio-dot-center-'+res);
				if (!input.checked) {
					bb.radio.resetDot(centerDotDiv);
				}
				dotDiv.appendChild(centerDotDiv);
				dotDiv.centerDotDiv = centerDotDiv;
				
				dotDiv.slideOutUp = function() {
									if (bb.device.isPlayBook) {
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
									if (bb.device.isPlayBook) {
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
									if (bb.device.isPlayBook) {
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
									this.centerDotDiv.style['-webkit-backface-visibility'] = 'hidden';
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
													if (bb.device.isPlayBook) {
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
													if (bb.device.isPlayBook) {
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
														this.dotDiv.style.top = bb.device.isPlayBook ? '9px' : '18px';
													} else {
														this.dotDiv.style.top = bb.device.isPlayBook ? '30px' : '60px';
													}
												}
											};
				outerElement.onclick = function() {
												if (!this.input.checked) {
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
								if (bb.device.isPlayBook) {
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
									this.outerElement.dotDiv.style.top = bb.device.isPlayBook ? '9px' : '18px';
								} else {
									this.outerElement.dotDiv.style.top = bb.device.isPlayBook ? '30px' : '60px';
								}
								
								// Fire our clicked event
								var ev = document.createEvent('MouseEvents');
								ev.initMouseEvent('click', true, true);
								this.outerElement.dispatchEvent(ev);
							}
							
						};
				input.setChecked = input.setChecked.bind(input);
				// Add our get Checked function
				input.getChecked = function() {
							return this.checked;
						};
				input.setChecked = input.setChecked.bind(input);
			}
		}
	},
	
	resetDot : function(dot) {
		dot.style['-webkit-transition'] = 'none';
		if (bb.device.isPlayBook) {
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
	}
};

bb.roundPanel = {  
    apply: function(elements) {
        if (bb.device.isBB7 || bb.device.isBB6 || bb.device.isBB5) {
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
            }
        }
		else if (bb.device.isBB10) {
			var i,
				j,
				outerElement,
				items,
				res;	

			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
				
			for (i = 0; i < elements.length; i++) {
                outerElement = elements[i];
                outerElement.setAttribute('class','bb-bb10-round-panel-'+res+' bb-bb10-round-panel-light');
                items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
                for (j = 0; j < items.length; j++) {
                     items[j].setAttribute('class','bb-bb10-panel-header-'+res+' bb-bb10-panel-header-'+res+'-light');
                }
            }
		}
        else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
                outerElement.setAttribute('class','bb-playbook-round-panel');
                var items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
                for (var j = 0; j < items.length; j++) {
                    if (bb.device.isHiRes) {
                        items[j].setAttribute('class','bb-hires-panel-header');
                    } else {
                        items[j].setAttribute('class','bb-lowres-panel-header');
                    }
                }
            }
        }
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
	animating : false,
    
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
					actionBarHeight = (bb.device.isPlayBook) ? 73 : 140,
					titleBarHeight = (bb.device.isPlayBook) ? 61 : 140;
				
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
					outerScrollArea.setAttribute('style','overflow:auto;position:absolute;bottom:'+actionBarHeight+'px;top:'+titleBarHeight+'px;left:0px;right:0px;');
				} else if (titleBar) {
					outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:'+titleBarHeight+'px;left:0px;right:0px;');
				} else if (actionBar) {
					outerScrollArea.setAttribute('style','overflow:auto;position:absolute;bottom:'+actionBarHeight+'px;top:0px;left:0px;right:0px;');
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
bb.scrollPanel = {
	apply: function(elements) {
		var i,j,
			outerElement,
			childNode,
			scrollArea,
			tempHolder;
		
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			tempHolder = [];
			
			if (bb.device.isBB10 || bb.device.isPlayBook) {				
				// Inner Scroll Area
				scrollArea = document.createElement('div');
				outerElement.appendChild(scrollArea); 
				
				// Copy all nodes in the screen that are not the action bar
				for (j = 0; j < outerElement.childNodes.length - 1; j++) {
					tempHolder.push(outerElement.childNodes[j]);
				}
				// Add them into the scrollable area
				for (j = 0; j < tempHolder.length -1; j++) {
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
									}});
				
				// Set refresh
				outerElement.refresh = function() {
						this.scroller.refresh();
					};
				outerElement.refresh = outerElement.refresh.bind(outerElement);
				setTimeout(outerElement.refresh,0);
				// Set ScrollTo
				outerElement.scrollTo = function(x, y, time, relative) {
						this.scroller.scrollTo(x, y, time, relative);
					};
				outerElement.scrollTo = outerElement.scrollTo.bind(outerElement);
				// Set ScrollToElement
				outerElement.scrollToElement = function(element, time) {
						this.scroller.scrollToElement(element, time);
					};
				outerElement.scrollToElement = outerElement.scrollToElement.bind(outerElement);
				
			} 
			outerElement.setAttribute('class','bb-scroll-panel');
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
				outerElement.inner.outerElement = outerElement;
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
										if (this.outerElement.isActivated === false) {
											this.outerElement.isActivated = true;
											this.outerElement.initialXPos = event.touches[0].pageX;	
											this.outerElement.halo.style['-webkit-transform'] = 'scale(1)';
											this.outerElement.halo.style['-webkit-animation-name'] = 'explode';
											this.outerElement.indicator.setAttribute('class','indicator bb-bb10-slider-indicator-' + color+ ' indicator-hover-'+color);
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
											this.outerElement.indicator.setAttribute('class','indicator bb-bb10-slider-indicator-' + color);   
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
				// Assign our document event listeners
				document.addEventListener('touchmove', outerElement.moveSlider, false);
				document.addEventListener('touchend', outerElement.inner.animateEnd, false);
				window.addEventListener('resize', outerElement.doOrientationChange,false); 
			}
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
		menu.res = (bb.device.isPlayBook) ? 'lowres' : 'hires';
		menu.setAttribute('class','bb-bb10-tab-overflow-menu bb-bb10-tab-overflow-menu-'+bb.actionBar.color);
		screen.parentNode.appendChild(menu);
		
		if (!bb.screen.tabOverlay) {
			overlay = document.createElement('div');
			overlay.menu = menu;
			bb.screen.tabOverlay = overlay;
			overlay.setAttribute('class','bb-bb10-tab-overflow-menu-overlay ');
			screen.appendChild(overlay);
			
			// Hide the menu on touch
			overlay.ontouchstart = function() {
						this.menu.hide();
					};
			
		}
		menu.overlay = bb.screen.tabOverlay;
		
		menu.show = function() {
					this.itemClicked = false;
					this.visible = true;
					var tabOverflowBtn = this.actionBar.tabOverflowBtn;
					this.tabOverflowState.display = tabOverflowBtn.tabHighlight.style.display;
					this.tabOverflowState.img = tabOverflowBtn.icon.src;
					this.tabOverflowState.caption = tabOverflowBtn.display.innerHTML;
					this.tabOverflowState.style = tabOverflowBtn.icon.getAttribute('class');
					this.setDimensions();					
					// Reset our overflow menu button
					tabOverflowBtn.reset();
				};
		menu.show = menu.show.bind(menu);	
		
		// Adjust the dimensions of the menu and screen
		menu.setDimensions = function() {
					var width = (bb.device.isPlayBook) ? bb.innerWidth() - 77 : bb.innerWidth() - 154;
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
					// Show our menu
					this.style.width = width + 'px';
					this.style['-webkit-transition'] = 'all 0.2s ease-out';
					this.style['-webkit-backface-visibility'] = 'hidden';
					// Slide our screen
					this.screen.style.left = width + 'px';
					this.screen.style.right = '-' + width +'px';
					this.screen.style['-webkit-transition'] = 'all 0.2s ease-out';
					this.screen.style['-webkit-backface-visibility'] = 'hidden';
				};
		menu.setDimensions = menu.setDimensions.bind(menu);	
		
		menu.hide = function() {
					this.visible = false;
					// Set our sizes
					this.style.width = '0px';
					this.screen.style.left = '0px';
					this.screen.style.right = '0px';
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
				};
		menu.hide = menu.hide.bind(menu);
		
		// Hide the menu
		menu.onclick = function() {
					this.hide();
				};
				
		// Center the items in the list
		menu.centerMenuItems = function() {
								var windowHeight = bb.innerHeight(),
									itemHeight = (bb.device.isPlayBook) ? 53 : 111,
									margin;
								margin = windowHeight - Math.floor(windowHeight/2) - Math.floor((this.actions.length * itemHeight)/2) - itemHeight; //itemHeight is the header
								this.actions[0].style['margin-top'] = margin + 'px';
							};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
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
		
		// Create our add item function
		menu.add = function(action) {
				var normal, 
					caption = action.innerHTML,
					inner = document.createElement('div'),
					img = document.createElement('img'),
					table, tr, td;
				
				// set our styling
				normal = 'bb-bb10-tab-overflow-menu-item-'+this.res+' bb-bb10-tab-overflow-menu-item-'+this.res+'-' + bb.actionBar.color;
				this.appendChild(action);
				this.actions.push(action);
				// If it is the top item it needs a top border
				if (this.actions.length == 1) {
					normal = normal + ' bb-bb10-tab-overflow-menu-item-first-' + this.res + '-' + bb.actionBar.color;
				}
				// Set our inner information
				action.normal = normal;
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
				img.setAttribute('class','bb-bb10-tab-overflow-menu-item-image-'+this.res);
				action.img = img;
				td.appendChild(img);
				tr.appendChild(td);
				// Add our caption
				td = document.createElement('td');
				inner.setAttribute('class','bb-bb10-tab-overflow-menu-item-inner-'+this.res);
				inner.innerHTML = caption;
				td.appendChild(inner);
				tr.appendChild(td);
				
				// Trap the old click so that we can call it later
				action.oldClick = action.onclick;
				action.onclick = function() {
									var tabOverflowBtn = this.actionBar.tabOverflowBtn;
									this.menu.itemClicked = true;
									
									bb.actionBar.highlightAction(this.visibleTab, this);
									if (this.visibleTab == tabOverflowBtn) {
										tabOverflowBtn.icon.setAttribute('src',this.img.src);
										tabOverflowBtn.icon.setAttribute('class',tabOverflowBtn.icon.highlight);
										tabOverflowBtn.tabHighlight.style.display = 'block';
										tabOverflowBtn.display.innerHTML = this.caption;
										if (this.oldClick) {
											this.oldClick();
										}
									} else {
										tabOverflowBtn.tabHighlight.reset();
										if (this.visibleTab.onclick) {
											this.visibleTab.onclick();
										}
									}										
								};
		};
		menu.add = menu.add.bind(menu);
		return menu;
	}
},
bb.tallList = { 
    // Apply our transforms to all Tall Lists
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var inEvent,
				outEvent,
				outerElement = elements[i];
            outerElement.setAttribute('class','bb-tall-list');
			// Set our highlight events
			if (bb.device.isPlayBook()) {
				inEvent = 'ontouchstart';
				outEvent = 'ontouchend';
			} else {
				inEvent = 'onmouseover';
				outEvent = 'onmouseout';
			}
            // Gather our inner items
            var items = outerElement.querySelectorAll('[data-bb-type=item]');
            for (var j = 0; j < items.length; j++) {
                var innerChildNode = items[j];
                if (innerChildNode.hasAttribute('data-bb-type')) {
                    var type = innerChildNode.getAttribute('data-bb-type').toLowerCase();
                    
                    if (type == 'item') {
                        var description = innerChildNode.innerHTML;
                        innerChildNode.setAttribute('class', 'bb-tall-list-item');
                        innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-tall-list-item-hover')");
                        innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-tall-list-item')");
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
                                        '<div class="details">\n'+
                                        '   <span class="title">' + innerChildNode.getAttribute('data-bb-title') + '</span>\n'+
                                        '   <span class="description">' + description + '</span>\n'+
                                        '   <div class="time">' + innerChildNode.getAttribute('data-bb-time')+ '</div>\n'+
                                        '</div>\n';
                                        
                        innerChildNode.removeAttribute('data-bb-img');
                        innerChildNode.removeAttribute('data-bb-title');
                        innerChildNode.removeAttribute('data-bb-time');
                    
                    }
                }
            }
        }
    }
};

bb.textInput = { 
    apply: function(elements) {
        if (bb.device.isBB5) {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
            }
        } else if (bb.device.isBB10){
			var res,
				i,
				outerElement,
				css;
				
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
			for (i = 0; i < elements.length; i++) {
                outerElement = elements[i];
                css = '';
				// Keep the developers existing styling
				if (outerElement.hasAttribute('class')) {
					css = outerElement.getAttribute('class');
				}
              
				outerElement.normal = css + ' bb-bb10-input bb-bb10-input-'+res;
				outerElement.focused = css + ' bb-bb10-input-focused bb-bb10-input-focused-'+res+' bb-bb10-input-'+res;
                outerElement.setAttribute('class', outerElement.normal);
				outerElement.isFocused = false;
				outerElement.clickCount = 0;
				outerElement.addEventListener('focus', function() {
															this.setAttribute('class',this.focused);
															this.style['border-color'] = bb.options.bb10HighlightColor;
															this.isFocused = true;
															this.clickCount = 0;
														}, false);
														
				outerElement.addEventListener('blur', function() {
															this.setAttribute('class',this.normal);	
															this.style['border-color'] = '';
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
														if (bb.device.isPlayBook && event.clientX > (this.clientWidth - 40)) {
															deleteClicked = true;
														} else if(event.clientX > (this.clientWidth - 45)){
															deleteClicked = true;
														}
														if (deleteClicked) {
															this.value = '';
														}
													}
												} , false);
            }
		}else {
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
    }
};
bb.titleBar = {

	apply: function(titleBar) {
		
		if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				button,
				caption;
			titleBar.setAttribute('class', 'bb-bb10-title-bar-'+res +' bb-bb10-title-bar-' + bb.actionBar.color);
			caption = document.createElement('div');
			titleBar.caption = caption;
			caption.setAttribute('class','bb-bb10-title-bar-caption-'+res);
			caption.innerHTML = titleBar.getAttribute('data-bb-caption');
			titleBar.appendChild(caption);
			// Get our back button if provided
			if (titleBar.hasAttribute('data-bb-back-caption')) {
				button = document.createElement('div');
				button.innerHTML = titleBar.getAttribute('data-bb-back-caption');
				titleBar.appendChild(button);
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
					button.onclick = onactionclick;
				}
				bb.titleBar.styleBB10Button(button);
				button.style.right = '0px';
				titleBar.appendChild(button);
				titleBar.actionButton = button;
			}
			// Create an adjustment function for the widths
			if (titleBar.actionButton && titleBar.backButton) {
				titleBar.evenButtonWidths = function() {
										var backWidth = parseInt(window.getComputedStyle(this.backButton).width),
											actionWidth = parseInt(window.getComputedStyle(this.actionButton).width);
				
										if (backWidth > actionWidth) {
											this.actionButton.style.width = backWidth +'px';
										} else {
											this.backButton.style.width = actionWidth +'px';
										}
									};
				titleBar.evenButtonWidths = titleBar.evenButtonWidths.bind(titleBar);
				window.setTimeout(titleBar.evenButtonWidths,0);
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
		var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			//disabledStyle,
			innerElement = document.createElement('div');
			//disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res,
			highlight = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb10-button-highlight',
			outerNormal = 'bb-bb10-titlebar-button-container-'+res+' bb-bb10-titlebar-button-container-' + bb.actionBar.color;
			
		//outerElement.enabled = !disabled;
		outerElement.enabled = true;
		innerElement.innerHTML = outerElement.innerHTML;
		outerElement.innerHTML = '';
		outerElement.appendChild(innerElement);

		// Set our styles
		//disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
		normal = normal + ' bb-bb10-titlebar-button-' + bb.actionBar.color;
		
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
bb.toggle = {

	apply: function(elements) {
		if (bb.device.isBB10) {
			var i, 
				res,
				table,
				tr,
				td,
				color = bb.options.bb10ControlsDark ? 'dark' : 'light',
				res = (bb.device.isPlayBook) ? 'lowres' : 'hires';

			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.checked = false;
				outerElement.buffer = (bb.device.isPlayBook) ? 35 : 70;
				outerElement.isActivated = false;
				outerElement.initialXPos = 0;
				outerElement.currentXPos = 0;
				outerElement.transientXPos = 0;
				outerElement.movedWithSlider = false;
				outerElement.startValue = false;
				// Set our styling and create the inner divs
				outerElement.className = 'bb-bb10-toggle-'+res;
				outerElement.outer = document.createElement('div');
				outerElement.outer.setAttribute('class','outer bb-bb10-toggle-outer-' + color);
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
				outerElement.indicator.setAttribute('class','indicator bb-bb10-toggle-indicator-' + color);
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
										if (this.outerElement.isActivated === false) {
											this.outerElement.startValue = this.outerElement.checked;
											this.outerElement.movedWithSlider = false;
											this.outerElement.isActivated = true;
											this.outerElement.initialXPos = event.touches[0].pageX;	
											this.outerElement.halo.style['-webkit-transform'] = 'scale(1)';
											this.outerElement.halo.style['-webkit-animation-name'] = 'explode';
											this.outerElement.indicator.setAttribute('class','indicator bb-bb10-toggle-indicator-' + color+ ' indicator-hover-'+color);
											this.outerElement.indicator.style.background = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
										}
									};
				outerElement.inner.animateBegin = outerElement.inner.animateBegin.bind(outerElement.inner);
				outerElement.inner.addEventListener("touchstart", outerElement.inner.animateBegin, false);
				outerElement.container.addEventListener("touchstart", outerElement.inner.animateBegin, false);
				outerElement.inner.animateEnd = function () {
										if (this.outerElement.isActivated === true) {
											this.outerElement.isActivated = false;
											this.outerElement.currentXPos = this.outerElement.transientXPos;
											this.outerElement.halo.style['-webkit-transform'] = 'scale(0)';
											this.outerElement.halo.style['-webkit-animation-name'] = 'implode';
											this.outerElement.indicator.setAttribute('class','indicator bb-bb10-toggle-indicator-' + color);   
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
									
							if (this.checked) {
								this.indicator.style['background-image'] = '-webkit-linear-gradient(top, '+ bb.options.bb10HighlightColor +' 0%, '+ bb.options.shades.darkHighlight +' 100%)';
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
				
				// set our checked state
				outerElement.checked = (outerElement.hasAttribute('data-bb-checked')) ? outerElement.getAttribute('data-bb-checked').toLowerCase() == 'true' : false;
				setTimeout(outerElement.positionButton,0);
				
				// Assign our document event listeners
				document.addEventListener('touchmove', outerElement.moveToggle, false);
				document.addEventListener('touchend', outerElement.inner.animateEnd, false);
			}
		} 
	}
};
