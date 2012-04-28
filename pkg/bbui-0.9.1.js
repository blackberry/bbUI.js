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
		bb.device.isRipple = (navigator.appVersion.indexOf('Ripple') >= 0);
		bb.device.isPlayBook = (navigator.appVersion.indexOf('PlayBook') >= 0) || ((window.innerWidth == 1024 && window.innerHeight == 600) || (window.innerWidth == 600 && window.innerHeight == 1024));
		if (bb.device.isPlayBook && bb.options.bb10ForPlayBook) {
			bb.device.isBB10 = true;
		} else {
			bb.device.isBB10 = (navigator.appVersion.indexOf('Version/10.0') >= 0);
		}
		bb.device.isBB7 = (navigator.appVersion.indexOf('7.0.0') >= 0) || (navigator.appVersion.indexOf('7.1.0') >= 0) || bb.device.isRipple;
		bb.device.isBB6 = navigator.appVersion.indexOf('6.0.0') >= 0;
		bb.device.isBB5 = navigator.appVersion.indexOf('5.0.0') >= 0;
		// Determine HiRes
		if (bb.device.isRipple) {
			bb.device.isHiRes = window.innerHeight > 480 || window.innerWidth > 480; 
		} else {
			bb.device.isHiRes = screen.width > 480 || screen.height > 480;
		}
		
		// Create our coloring
		if (document.styleSheets && document.styleSheets.length) {
			try {
				document.styleSheets[0].insertRule('.bb10Highlight {background-color:'+ bb.options.bb10HighlightColor +';background-image:none;}', 0);
				document.styleSheets[0].insertRule('.bb10-button-highlight {color:White;background-image: -webkit-gradient(linear, center top, center bottom, from('+bb.options.bb10AccentColor+'), to('+bb.options.bb10HighlightColor+'));border-color:#53514F;}', 0);
				document.styleSheets[0].insertRule('.bb10Accent {background-color:'+ bb.options.bb10AccentColor +';}', 0);
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
        bb.textInput.apply(root.querySelectorAll('input[type=text]'));
        bb.dropdown.apply(root.querySelectorAll('select'));
        bb.roundPanel.apply(root.querySelectorAll('[data-bb-type=round-panel]'));
        bb.textArrowList.apply(root.querySelectorAll('[data-bb-type=text-arrow-list]'));
        bb.imageList.apply(root.querySelectorAll('[data-bb-type=image-list]'));
		bb.grid.apply(root.querySelectorAll('[data-bb-type=grid-layout]'));
        bb.bbmBubble.apply(root.querySelectorAll('[data-bb-type=bbm-bubble]'));
        bb.pillButtons.apply(root.querySelectorAll('[data-bb-type=pill-buttons]'));
        bb.labelControlContainers.apply(root.querySelectorAll('[data-bb-type=label-control-container]'));
        bb.button.apply(root.querySelectorAll('[data-bb-type=button]'));

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
		bb10ControlsDark: true, 
		bb10ListsDark: false,
		bb10ForPlayBook: false,
		bb10AccentColor: '#2D566F',
		bb10HighlightColor: '#00A8DF'
	},
	
    loadScreen: function(url, id) {
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
						bb.initContainer(container, id);
                    }
                };
        }

        // In case there are no scripts at all we simply doLoad() now
        if(bb.screen.totalScripts === 0) {
            bb.initContainer(container, id);
        }
        return container;
    },
	
	// Initialize the container
	initContainer : function(container, id) {
		// Fire the onscreenready and then apply our changes in doLoad()
		if (bb.options.onscreenready) {
			bb.options.onscreenready(container, id);
		}
		bb.doLoad(container);
		// Load in the new content
		document.body.appendChild(container);
		// Fire the ondomready after the element is added to the DOM
		if (bb.options.ondomready) {
			bb.domready.container = container;
			bb.domready.id = id;
			setTimeout(bb.domready.fire(), 1); 
		}
		window.scroll(0,0);
		bb.screen.applyEffect(id, container);
		bb.createScreenScroller();  
	},
	
	// Function pointer to allow us to asynchronously fire ondomready
	domready : {
	
		container : null,
		id : null,
		
		fire : function() {
			bb.options.ondomready(bb.domready.container, bb.domready.id);
			bb.domready.container = null;
			 bb.domready.id = null;		
		}
	
	},
	
	// Creates the scroller for the screen
	createScreenScroller : function() {   
		var scrollWrapper = document.getElementById('bbUIscrollWrapper');
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
		if (bb.scroller) {
			bb.scroller.destroy();
			bb.scroller = null;
		}
	},
	
    // Add a new screen to the stack
    pushScreen : function (url, id) {

        // Remove our old screen
        bb.removeLoadedScripts();
		bb.menuBar.clearMenu();
        var numItems = bb.screens.length;
        if (numItems > 0) {
            var oldScreen = document.getElementById(bb.screens[numItems -1].id);
            document.body.removeChild(oldScreen);
			bb.clearScrollers();
        }

        // Add our screen to the stack
        var container = bb.loadScreen(url, id);
		
        bb.screens.push({'id' : id, 'url' : url, 'scripts' : container.scriptIds});
    },

    // Pop a screen from the stack
    popScreen: function() {

        var numItems = bb.screens.length;
        if (numItems > 1) {
            bb.removeLoadedScripts();
			bb.clearScrollers();
            var currentStackItem = bb.screens[numItems-1],
                current = document.getElementById(currentStackItem.id);
            document.body.removeChild(current);
            bb.screens.pop();
		    bb.menuBar.clearMenu();
			bb.screen.overlay = null;

            // Retrieve our new screen
            var display = bb.screens[numItems-2],
                container = bb.loadScreen(display.url, display.id);
				
            window.scroll(0,0);
            bb.screen.applyEffect(display.id, container);

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
    }
};

Function.prototype.bind = function(object){ 
  var fn = this; 
  return function(){ 
    return fn.apply(object, arguments); 
  }; 
}; 


bb.menuBar = {
	height: 103,
	activeClick: false,
	ignoreClick: false,
	menuOpen: false,
	menu: false,

	apply: function(menuBar,screen){
		if ((window.blackberry && blackberry.app.event) && (bb.device.isPlayBook || bb.device.isBB10)) {
			bb.menuBar.createSwipeMenu(menuBar,screen);
			if (bb.device.isPlayBook && !bb.device.isBB10) {
				menuBar.parentNode.removeChild(menuBar);
			}
			document.addEventListener("click", bb.menuBar.globalClickHandler, false);
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar); 
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
			screen.appendChild(bb.screen.overlay);
			bb.menuBar.menu.overlay = bb.screen.overlay;	
		}
	},

	showMenuBar: function(){
		if(!bb.menuBar.menuOpen){
			bb.menuBar.menu.overlay.style.display = 'inline';
			blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);
			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate(0, ' + (bb.menuBar.height + 3) + 'px)';
			bb.menuBar.menuOpen = true;
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.menuOpen){
			bb.menuBar.menu.overlay.style.display = 'none';
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate(0, -' + (bb.menuBar.height + 3) + 'px)';
			bb.menuBar.menuOpen = false;
		}
	},

	globalClickHandler: function(){
		if (bb.menuBar.menuOpen && !bb.menuBar.activeClick && !bb.menuBar.ignoreClick) {
			bb.menuBar.hideMenuBar();
		}
		bb.menuBar.activeClick = false;
		bb.menuBar.ignoreClick = false;
	},

	onMenuBarClicked: function () {
		bb.menuBar.activeClick = true;
		bb.menuBar.hideMenuBar();
	},

	clearMenu: function(){
		if(window.blackberry){
			if(bb.menuBar.menu && (bb.device.isPlayBook || bb.device.isBB10) && blackberry.app.event){
				blackberry.app.event.onSwipeDown('');
				document.removeEventListener("click", bb.menuBar.globalClickHandler, false);
				bb.menuBar.menu.parentNode.removeChild(bb.menuBar.menu);
				bb.menuBar.menu = false;
			}else if(blackberry.ui && blackberry.ui.menu){
				blackberry.ui.menu.clearMenuItems();
			}
		}
	}
};

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

                /*if (outerElement.hasAttribute('data-bb-style')) {
                    var style = outerElement.getAttribute('data-bb-style');
                    if (style == 'stretch') {
                        normal = normal + ' button-stretch';
                        highlight = highlight + ' button-stretch';
                    }
                }*/
                outerElement.innerHTML = '';
                outerElement.setAttribute('class','bb-bb5-button');
                var button = document.createElement('a');
                //button.setAttribute('href','#');
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
			var res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
			for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
					disabledStyle,
					innerElement = document.createElement('div');
                    disabled = outerElement.hasAttribute('data-bb-disabled'),
                    normal = 'bb-bb10-button bb-bb10-button-'+res,
                    highlight = 'bb-bb10-button bb-bb10-button-'+res+' bb10-button-highlight',
					outerNormal = 'bb-bb10-button-container-'+res+' bb-bb10-button-container-' + bb.screen.controlColor;
					
                outerElement.enabled = !disabled;
				innerElement.innerHTML = outerElement.innerHTML;
				outerElement.innerHTML = '';
				outerElement.appendChild(innerElement);

                if (outerElement.hasAttribute('data-bb-style')) {
                    var style = outerElement.getAttribute('data-bb-style');
                    if (style == 'stretch') {
                        normal = normal + ' bb-bb10-button-stretch';
                        highlight = highlight + ' bb-bb10-button-stretch';
                    }
                }
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
										// Style the previously selected item as no longer selected
										if (this.dropdown.selected) {
											this.dropdown.selected.setAttribute('class',this.normalStyle);
											this.dropdown.selected.img.style.visibility = 'hidden';
										}
										// Style this item as selected
										this.setAttribute('class',this.slectedStyle);
										this.img.style.visibility = 'visible';
										this.dropdown.selected = this;
										// Set our index and fire the event
										this.select.setSelectedItem(this.index);
										this.dropdown.hide();
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
				// Collapse the combo-box			
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
											scrollHeight = (this.numItems * 54);
											this.style.height = 60 + scrollHeight +'px';
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
									};
				dropdown.show = dropdown.show.bind(dropdown);
				// Collapse the combo-box
				dropdown.hide = function() {
										this.open = false;
										this.style.height = '59px';
										
										if (bb.device.isPlayBook) {
											this.style.height = '60px';
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
									};
				dropdown.hide = dropdown.hide.bind(dropdown);

				// Assign our functions to be able to set the value
                select.setSelectedItem = function(index) {
                    if (this.selectedIndex != index) {
                        this.selectedIndex = index;
						this.dropdown.caption.innerHTML = this.options[index].text;
						
                        window.setTimeout(this.fireEvent,0);
                    }
                };
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

bb.imageList = {  
    apply: function(elements) {
		if (bb.device.isBB10) {
			var res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
		
			// Apply our transforms to all Image Lists
			for (var i = 0; i < elements.length; i++) {
				var outerElement = elements[i],
					normal,
					highlight,
					contextMenu;
				outerElement.setAttribute('class','bb-bb10-image-list');
				// Assign our context menu if there is one
				if (outerElement.hasAttribute('data-bb-context') && outerElement.getAttribute('data-bb-context').toLowerCase() == 'true') {
					contextMenu = bb.screen.contextMenu;
				}
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item], [data-bb-type=header]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j];
					if (innerChildNode.hasAttribute('data-bb-type')) {
						// Figure out the type of item
						var type = innerChildNode.getAttribute('data-bb-type').toLowerCase(),
							description = innerChildNode.innerHTML,
							title,
							accentText,
							img,
							details,
							descriptionDiv;
						
						if (type == 'header') {
							// Set our normal and highlight styling
							normal = 'bb-bb10-image-list-header bb10Accent bb-bb10-image-list-header-'+res;
							highlight = 'bb-bb10-image-list-header bb10Highlight bb-bb10-image-list-header-'+res;
							// Check for alignment
							if (innerChildNode.hasAttribute('data-bb-justify')) {
								if (innerChildNode.getAttribute('data-bb-justify').toLowerCase() == 'left') {
									normal = normal + ' bb-bb10-image-list-header-left-'+res;
									highlight = highlight + ' bb-bb10-image-list-header-left-'+res;
								} else if (innerChildNode.getAttribute('data-bb-justify').toLowerCase() == 'right') {
									normal = normal + ' bb-bb10-image-list-header-right-'+res;
									highlight = highlight + ' bb-bb10-image-list-header-right-'+res;
								} else {
									normal = normal + ' bb-bb10-image-list-header-center';
									highlight = highlight + ' bb-bb10-image-list-header-center';
								}
							} else {
								normal = normal + ' bb-bb10-image-list-header-center';
								highlight = highlight + ' bb-bb10-image-list-header-center';
							}
							
							// Set our styling
							innerChildNode.normal = normal;
							innerChildNode.highlight = highlight;
							innerChildNode.innerHTML = '<p>'+ description +'</p>';
							innerChildNode.setAttribute('class', normal);
							innerChildNode.ontouchstart = function () {
															this.setAttribute('class', this.highlight);
														}
							innerChildNode.ontouchend = function () {
															this.setAttribute('class',this.normal);
														}
						}
						else if (type == 'item') {
							normal = 'bb-bb10-image-list-item bb-bb10-image-list-item-' + bb.screen.listColor + ' bb-bb10-image-list-item-' + res;
							highlight = normal + ' bb-bb10-image-list-item-hover bb10Highlight';
							innerChildNode.normal = normal;
							innerChildNode.highlight = highlight;
							innerChildNode.setAttribute('class', normal);
							innerChildNode.innerHTML = '';
							// Create our image
							img = document.createElement('img');
							img.setAttribute('src',innerChildNode.getAttribute('data-bb-img'));
							innerChildNode.appendChild(img);
							// Create the details container
							details = document.createElement('div');
							details.setAttribute('class','details');
							innerChildNode.appendChild(details);
							// Create our title
							title = document.createElement('span');
							title.setAttribute('class','title');
							title.innerHTML = innerChildNode.getAttribute('data-bb-title');
							details.appendChild(title);
							// Create the accent text
							if (innerChildNode.hasAttribute('data-bb-accent-text')) {
								accentText = document.createElement('div');
								accentText.setAttribute('class','accent-text');
								accentText.innerHTML = innerChildNode.getAttribute('data-bb-accent-text');
								details.appendChild(accentText);
							}
							// Create our description
							descriptionDiv = document.createElement('div');
							descriptionDiv.setAttribute('class','description');
							descriptionDiv.innerHTML = description;
							details.appendChild(descriptionDiv);
							// Clean-up
							innerChildNode.removeAttribute('data-bb-img');
							innerChildNode.removeAttribute('data-bb-title');
							// Set up our variables
							innerChildNode.fingerDown = false;
							innerChildNode.contextShown = false;
							innerChildNode.contextMenu = contextMenu;
							innerChildNode.description = description;
							innerChildNode.title = title.innerHTML;
							innerChildNode.ontouchstart = function () {
															this.setAttribute('class',this.highlight);
															innerChildNode.fingerDown = true;
															innerChildNode.contextShown = false;
															if (innerChildNode.contextMenu) {
																window.setTimeout(this.touchTimer, 667);
															}
														};
							innerChildNode.ontouchend = function (event) {
															this.setAttribute('class',this.normal);
															innerChildNode.fingerDown = false;
															if (innerChildNode.contextShown) {
																event.preventDefault();
																event.stopPropagation();
															}
														};
							innerChildNode.touchTimer = function() {
															if (innerChildNode.fingerDown) {
																innerChildNode.contextShown = true;
																innerChildNode.contextMenu.peek({title:this.title,description:this.description, selected: this});
															}
														};
							innerChildNode.touchTimer = innerChildNode.touchTimer.bind(innerChildNode);
						}
					}
				}
			}		
		}
		else {
			// Apply our transforms to all Image Lists
			for (var i = 0; i < elements.length; i++) {
				var inEvent, 
					outEvent, 
					outerElement = elements[i];
				// Set our highlight events
				if (bb.device.isPlayBook) {
					inEvent = 'ontouchstart';
					outEvent = 'ontouchend';
				} else {
					inEvent = 'onmouseover';
					outEvent = 'onmouseout';
				}
				if (bb.device.isHiRes) {
					outerElement.setAttribute('class','bb-hires-image-list');
				} else {
					outerElement.setAttribute('class','bb-lowres-image-list');
				}
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item], [data-bb-type=header]'),
					innerChildNode,
					type,
					j,
					description,
					accentText,
					normal,
					highlight,
					res;
					
				if (bb.device.isHiRes) {
					res = 'hires';
				} else {
					res = 'lowres';
				}
					
				for (j = 0; j < items.length; j++) {
					innerChildNode = items[j];
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
							if (innerChildNode.hasAttribute('data-bb-justify')) {
								if (innerChildNode.getAttribute('data-bb-justify').toLowerCase() == 'left') {
									normal = normal + ' bb-'+res+'-image-list-header-left';
									highlight = highlight + ' bb-'+res+'-image-list-header-left';
								} else if (innerChildNode.getAttribute('data-bb-justify').toLowerCase() == 'right') {
									normal = normal + ' bb-'+ res+'-image-list-header-right';
									highlight = highlight + ' bb-'+res+'-image-list-header-right';
								} else {
									normal = normal + ' bb-'+res+'-image-list-header-center';
									highlight = highlight + ' bb-'+res+'-image-list-header-center';
								}
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
							innerChildNode.setAttribute('class', 'bb-'+res+'-image-list-item');
							innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-"+res+"-image-list-item-hover')");
							innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-"+res+"-image-list-item')");
							innerChildNode.setAttribute('x-blackberry-focusable','true');
							innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
											'<div class="details">\n'+
											'   <span class="title">' + innerChildNode.getAttribute('data-bb-title') + '</span>\n'+
											'   <span class="accent-text">' + accentText + '</span>\n'+
											'   <div class="description">' + description + '</div>\n'+
											'</div>\n';
							innerChildNode.removeAttribute('data-bb-img');
							innerChildNode.removeAttribute('data-bb-title');
						}
					}
				}
			}
		}
    }
};

bb.grid = {  
    apply: function(elements) {
		if (bb.device.isBB10) {
			var res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
			// Apply our transforms to all grids
			for (var i = 0; i < elements.length; i++) {
				var j,
					items,
					type,
					title,
					innerChildNode,
					outerElement = elements[i];
					
				outerElement.setAttribute('class','bb-bb10-grid-'+res);			
				// Gather our inner items
				items = outerElement.querySelectorAll('[data-bb-type=group], [data-bb-type=row]');
				for (j = 0; j < items.length; j++) {
					innerChildNode = items[j];
					if (innerChildNode.hasAttribute('data-bb-type')) {
					
						type = innerChildNode.getAttribute('data-bb-type').toLowerCase();
						if (type == 'group' && innerChildNode.hasAttribute('data-bb-title')) {
							title = document.createElement('div');
							title.normal = 'bb-bb10-grid-header-'+res+' bb10Accent';
							title.highlight = 'bb-bb10-grid-header-'+res+' bb10Highlight';
							title.innerHTML = '<p>'+ innerChildNode.getAttribute('data-bb-title') +'</p>';
							title.setAttribute('class', title.normal);
							title.ontouchstart = function() {
													this.setAttribute('class',this.highlight);
												};
							title.ontouchend = function() {
													this.setAttribute('class',this.normal);
												};
							if (innerChildNode.firstChild) {
								innerChildNode.insertBefore(title, innerChildNode.firstChild);
							} else {
								innerChildNode.appendChild(title);
							}
						}
						else if (type == 'row') {
							var k,
								numItems,
								itemNode,
								columnClass,
								subtitle,
								image,
								overlay,
								subtitle,
								height,
								width,
								rowItems = innerChildNode.querySelectorAll('[data-bb-type=item]');
							
							innerChildNode.setAttribute('class', 'bb-bb10-grid-row-'+res);
							numItems = rowItems.length;
							if (numItems > 0) {
								columnClass = 'bb-bb10-grid-item-col-' + numItems+'-'+res;
							}

							for (k = 0; k < numItems; k++) {
								itemNode = rowItems[k];
								subtitle = itemNode.innerHTML;
								itemNode.innerHTML = '';
								if (bb.device.isPlayBook) {
									width = ((window.innerWidth/numItems) - 5);
								} else {
									width = ((window.innerWidth/numItems) - 8);
								}
								height = Math.ceil(width*0.5625);
								itemNode.setAttribute('class', 'bb-bb10-grid-item ' + columnClass);
								itemNode.style.width = width + 'px';
								itemNode.style.height = height + 'px';

								// Create our display image
								image = document.createElement('img');
								image.setAttribute('src',itemNode.getAttribute('data-bb-img'));
								image.setAttribute('style','height:100%;width:100%;');
								itemNode.appendChild(image);
								// Create our translucent overlay
								overlay = document.createElement('div');
								overlay.setAttribute('class','bb-bb10-grid-item-overlay-'+res);
								overlay.innerHTML = '<div><p class="title">' + itemNode.getAttribute('data-bb-title') + '<br/>' + subtitle +'</p></div>';								
								itemNode.appendChild(overlay);
								// Add the overlay to the itemNode as a pointer for convenience when highlighting
								itemNode.overlay = overlay;
								itemNode.ontouchstart = function() {
															this.overlay.setAttribute('style','opacity:1.0;background-color:' + bb.options.bb10HighlightColor +';');
														};
								itemNode.ontouchend = function() {
															this.overlay.setAttribute('style','');
														};
								itemNode.removeAttribute('data-bb-img');
								itemNode.removeAttribute('data-bb-title');
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
											height,
											innerWidth;
										
										// Orientation is backwards between playbook and BB10 smartphones
										if (bb.device.isPlayBook) {
											if (window.orientation == 0 || window.orientation == 180) {
												innerWidth = 1024;  // Doesn't seem to calculate width to the new width when this even fires
											} else if (window.orientation == -90 || window.orientation == 90) {
												innerWidth = 600;
											}
										} else {
											if (window.orientation == 0 || window.orientation == 180) {
												innerWidth = 768;
											} else if (window.orientation == -90 || window.orientation == 90) {
												innerWidth = 1280;
											}
										}
										
					
										for (i = 0; i < items.length; i++) {
											rowItems = items[i].querySelectorAll('[data-bb-type=item]');
											numItems = rowItems.length;
											for (j = 0; j < numItems; j++ ) {
												itemNode = rowItems[j];
												if (bb.device.isPlayBook) {
													width = ((innerWidth/numItems) - 5);
												} else {
													width = ((innerWidth/numItems) - 8);
												}
												height = Math.ceil(width*0.5625);
												itemNode.style.width = width+'px';
												itemNode.style.height = height+'px';
											}
										}
									};
				outerElement.orientationChanged = outerElement.orientationChanged.bind(outerElement);	
				window.addEventListener('orientationchange', outerElement.orientationChanged,false); 
			}		
		} else {
			// Make the grids invisible if it isn't BB10
			for (var i = 0; i < elements.length; i++) {
				elements[i].style.display = 'none';
			}
		}
    }
};

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
                        control = row.querySelectorAll('[data-bb-type=button],input,[data-bb-type=dropdown]')[0];
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
                        var control = row.querySelectorAll('[data-bb-type=button],input,[data-bb-type=dropdown]')[0];
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
	contextMenu : null,
    
    apply: function(elements) {
		var screenRes,
			outerElement;
		// Reset our context Menu
		bb.screen.contextMenu = null;
		
		if (bb.device.isBB10 && bb.device.isPlayBook) {
			screenRes = 'bb-hires-screen';
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
					j;
				
				// Figure out what to do with the title bar
                if (titleBar.length > 0) {
					titleBar = titleBar[0];
					// See if they want a back button
					if (titleBar.hasAttribute('data-bb-back-caption')) {
						if (actionBar.length == 0) {
							// Since there's no way to get back, we'll add an action bar
							var newBackBar = document.createElement('div');
							newBackBar.setAttribute('data-bb-type','action-bar');
							newBackBar.setAttribute('data-bb-back-caption',titleBar.getAttribute('data-bb-back-caption'));
							outerElement.appendChild(newBackBar);
							actionBar = [newBackBar];
						}
					}
					// TODO: Add title bar support
					outerElement.removeChild(titleBar);
				}
				
				// Assign our action bar
				if (actionBar.length > 0) {
                    actionBar = actionBar[0]; 
				} else {
					actionBar = null;
				}
                
				// Create our scrollable <div>
				outerScrollArea = document.createElement('div'); 
				outerElement.appendChild(outerScrollArea);
				// Turn off scrolling effects if they don't want them
				if (!outerElement.hasAttribute('data-bb-scroll-effect') || outerElement.getAttribute('data-bb-scroll-effect').toLowerCase() != 'off') {
					outerScrollArea.setAttribute('id','bbUIscrollWrapper'); 
				}
				
				// Inner Scroll Area
				scrollArea = document.createElement('div');
				outerScrollArea.appendChild(scrollArea); 
				
				// Copy all nodes in the screen that are not the action bar
				for (j = 0; j < outerElement.childNodes.length - 1; j++) {
					childNode = outerElement.childNodes[j];
					if ((childNode != actionBar) && (childNode != menuBar)) {
						tempHolder.push(childNode);
					}
				}
				// Add them into the scrollable area
				for (j = 0; j < tempHolder.length -1; j++) {
					scrollArea.appendChild(tempHolder[j]);
				}
				
				if (actionBar) {
					if (bb.device.isPlayBook) {
						outerScrollArea.setAttribute('style','overflow:auto;position:absolute;bottom:73px;top:0px;left:0px;right:0px;');
					} else {
						outerScrollArea.setAttribute('style','overflow:auto;position:absolute;bottom:140px;top:0px;left:0px;right:0px;');
					}
					bb.actionBar.apply(actionBar,outerElement);
                }
				else {
					outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:0px;left:0px;right:0px;');
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
					outerScrollArea.setAttribute('id','bbUIscrollWrapper'); 
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
                    if (titleBar.hasAttribute('data-bb-caption')) {
                        var outerStyle = outerElement.getAttribute('style');
                        if (bb.device.isHiRes) {
                            titleBar.setAttribute('class', 'bb-hires-screen-title');
                            outerElement.setAttribute('style', outerStyle + ';padding-top:33px');
                        } else {
                            titleBar.setAttribute('class', 'bb-lowres-screen-title');
                            outerElement.setAttribute('style', outerStyle + ';padding-top:27px');
                        }
                        titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
                    }
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
	},
    
    fadeIn: function (params) {
        // set default values
        var r = 0,
            duration = 1,
            iteration = 1,
            timing = 'ease-out';

        if (document.getElementById(params.id)) {
            var elem = document.getElementById(params.id),
                s = elem.style;

            if (params.random) {
                r = Math.random() * (params.random / 50) - params.random / 100;
            }

            if (params.duration) {
                duration = parseFloat(params.duration) + parseFloat(params.duration) * r;
                duration = Math.round(duration * 1000) / 1000;
            }

            if (params.iteration) {
                iteration = params.iteration;
            }

            if (params.timing) {
                timing = params.timing;
            }

            s['-webkit-animation-name']            = 'bbUI-fade-in';
            s['-webkit-animation-duration']        = duration + 's';
            s['-webkit-animation-timing-function'] = timing;
        }
        else {
            console.warn('Could not access ' + params.id);
        }
    },
	
    
    applyEffect: function(id, container) {
        // see if there is a display effect
        if (!bb.device.isBB5 && !bb.device.isBB6) {
            var screen = container.querySelectorAll('[data-bb-type=screen]');
            if (screen.length > 0 ) {
                screen = screen[0];
                var effect = screen.getAttribute('data-bb-effect');
                if (effect && effect.toLowerCase() == 'fade') {
                    bb.screen.fadeIn({'id': id, 'duration': 1.0});
                }
            }
        }
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

// Apply styling to an action bar
bb.actionBar = {

	color: '',
	
	apply: function(actionBar, screen) {
		
		actionBar.tabs = [];
		var actions = actionBar.querySelectorAll('[data-bb-type=action]'),
			action,
			caption,
			style,
			lastStyle,
			tabStyle,
			backBtn,
			actionContainer = actionBar,
			btnWidth,
			limit = actions.length,
			res,
			icon,
			color = bb.actionBar.color,
			j,
			firstTab = true;
			
		// Find our resolution
		if (bb.device.isPlayBook) {
			res = 'lowres';
		} else {
			res = 'hires';
		}
		
		actionBar.setAttribute('class','bb-bb10-action-bar-'+res+' bb-bb10-action-bar-' + bb.actionBar.color);
		
		// Create the back button if it has one and there are no tabs in the action bar
		if (actionBar.hasAttribute('data-bb-back-caption') && actionBar.querySelectorAll('[data-bb-style=tab]').length == 0) {		
			backBtn = document.createElement('div');
			backBtn.innerHTML = actionBar.getAttribute('data-bb-back-caption');
			backBtn.setAttribute('class','bb-bb10-action-bar-back-button-'+res+' bb-bb10-action-bar-back-button-'+res+'-' + color);
			backBtn.onclick = bb.popScreen;
			// Set tab coloring
			backBtn.normal = 'bb-bb10-action-bar-tab-normal-'+color;
			backBtn.highlight = 'bb-bb10-action-bar-tab-selected-'+color;
			actionBar.backBtn = backBtn;
			// Create a table to hold the back button and our actions
			var table = document.createElement('table'),
				tr = document.createElement('tr'),
				td = document.createElement('td');
			actionBar.appendChild(table);
			table.appendChild(tr);
			table.setAttribute('class','bb-bb10-action-bar-table');
			// Create the container for the back button
			if (bb.device.isPlayBook) {
				td.style.width = '86px';
			} else {
				td.style.width = '178px';
			}
			tr.appendChild(td);
			td.appendChild(backBtn);
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
			limit++;
		}
		
		// If we have more than 5 items in the action bar we need to show the more menu button
		if (limit > 5) {
			actionBar.menu = bb.contextMenu.create(screen);
			actionBar.appendChild(actionBar.menu);
			// Create our action bar overflow button
			action = document.createElement('div');
			action.setAttribute('data-bb-type','action');
			action.setAttribute('data-bb-style','button');
			
			if (res == 'lowres') {
				action.setAttribute('data-bb-img','overflow');
			} else {
				action.setAttribute('data-bb-img','overflow');
			}

			action.onclick = actionBar.menu.show;
			if (backBtn) {
				actionContainer.insertBefore(action,actions[3]);
			} else {
				actionContainer.insertBefore(action,actions[4]);
			}
			// Refresh our list of actions
			actions = actionBar.querySelectorAll('[data-bb-type=action]');
		}
		
		// Find out what kind of tab style is desired
		if (actionBar.hasAttribute('data-bb-tab-style')) {
			if (actionBar.getAttribute('data-bb-tab-style').toLowerCase() == 'indent') {
				tabStyle = 'indent';
			} else {
				tabStyle = 'highlight';
			}
			actionBar.tabStyle = tabStyle;
		}			

		// Calculate action widths
		if (backBtn) {
			if (actions.length < 5) {
			btnWidth = Math.floor(100/actions.length);
			} else {
				btnWidth = Math.floor(100/4);
			}
		} else {
			if (actions.length < 6) {
				btnWidth = Math.floor(100/actions.length);
			} else {
				btnWidth = Math.floor(100/5);
			}
		}
		
		// Grab all the actions that are defined
		for (j = 0; j < actions.length; j++) {
			action = actions[j];
			action.res = res;
			caption = action.innerHTML;
			
			if ((backBtn && j > 3) || j > 4) {
				actionBar.menu.add(action);
			} else {
				// apply our button styling
				if (action.hasAttribute('data-bb-style')) {
					// Set our button widths taking into account the last button float
					if ((backBtn && j > 2) || (j > 3) || (j == actions.length -1)) {
						action.style.width =  btnWidth - 1 + '%';
						action.style.float = 'right';
					} else {
						action.style.width =  btnWidth + '%';
					}
					style = action.getAttribute('data-bb-style').toLowerCase();
					if (style == 'button') {
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
							icon.setAttribute('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'+
													'/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wEFxQXKc14qEQAAAAZdEVYdENv'+
													'bW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADUlEQVQI12NgYGBgAAAABQABXvMqOgAAAABJ'+
													'RU5ErkJggg==');
							icon.setAttribute('class','bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-overflow-button-'+res+'-'+color);
						} else {
							icon.setAttribute('src',action.getAttribute('data-bb-img'));
							icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
						}
						action.appendChild(icon);
						
						
						/*icon = document.createElement('img');
						icon.setAttribute('src',action.getAttribute('data-bb-img'));
						icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
						action.appendChild(icon);*/
						// Set our caption
						var display = document.createElement('div');
						display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
						display.innerHTML = caption;
						action.appendChild(display);					
					}
					else if (style=='tab') {
						action.actionBar = actionBar;
						// Apply our highlight tab styling
						if (tabStyle == 'highlight') {
							actionBar.tabs.push(action);
							action.innerHTML = '';
							action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-tab-'+color+' bb-bb10-action-bar-tab-normal-'+color;
							action.highlight = action.normal + ' bb-bb10-action-bar-tab-selected-'+color;
							action.setAttribute('class',action.normal);
							if (firstTab && actionBar.backBtn) {
								actionBar.backBtn.parentNode.setAttribute('class',actionBar.backBtn.normal);
							}
							if (action.hasAttribute('data-bb-selected') && (action.getAttribute('data-bb-selected').toLowerCase() == 'true')) {
								bb.actionBar.highlightAction(action);
								if (firstTab && actionBar.backBtn) {
									actionBar.backBtn.parentNode.setAttribute('class',actionBar.backBtn.highlight);
								}
							} 
							
							firstTab = false;
							// Add the icon
							icon = document.createElement('img');
							icon.setAttribute('src',action.getAttribute('data-bb-img'));
							icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
							action.appendChild(icon);
							// Set our caption
							var display = document.createElement('div');
							display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
							display.innerHTML = caption;
							action.appendChild(display);

							// Make the last tab have a smaller border
							if (j == actions.length-1) {
								action.style['border-right-width'] = '1px';
							} 
						}						
						// Add our click listener
						action.addEventListener('click',function (e) {
							var i,
								action,
								tabStyle = this.actionBar.tabStyle;
								tabs = this.actionBar.tabs,
								firstTab = false;
								
							for (i = 0; i < tabs.length; i++) {
								action = tabs[i];
								if (tabStyle == 'highlight') {
									if (action == this) {
										bb.actionBar.highlightAction(action);
										firstTab = (i == 0);
									} else {
										bb.actionBar.unhighlightAction(action);
									}
								}
								// Set our back button highlighting
								if (firstTab && actionBar.backBtn) {
									actionBar.backBtn.parentNode.setAttribute('class',actionBar.backBtn.highlight);
								} else if (actionBar.backBtn){
									actionBar.backBtn.parentNode.setAttribute('class',actionBar.backBtn.normal);
								}
								
							}
							
						},false);
					}
					lastStyle = style;
				}
			}
		}
		// Set the proper header height
	/*	if (actionBar.menu) {
			actionBar.menu.setHeaderHeight();
		}*/
	},

	// Apply the proper highlighting for the action
	highlightAction: function (action) {
		action.style['border-top-color'] = bb.options.bb10HighlightColor;
		action.setAttribute('class',action.highlight);
	},
	
	// Apply the proper styling for an action that is no longer highlighted
	unhighlightAction: function(action) {
		action.style['border-top-color'] = '';
		action.setAttribute('class',action.normal);
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
		menu.res = res;
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
												this.menu.show();
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
		menu.topTitle = title;
		header.appendChild(title);
		
		// Create our description container
		description.setAttribute('class','bb-bb10-context-menu-header-description-'+res);
		menu.description = description;
		header.appendChild(description);

		// Set our first left position
		menu.style.left = bb.contextMenu.getLeft();
		
		// Display the menu
		menu.show = function(data){
						if (data) {
							if (data.title) {
								this.topTitle.innerHTML = data.title;
							}
							if (data.description) {
								this.description.innerHTML = data.description;
							}
							this.selected = data;
						}
						this.peeking = false;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + bb.contextMenu.getWidth() + ', 0)';	
						this.addEventListener("touchstart", this.touchHandler, false);		
						// Remove the header click handling while peeking
						this.header.addEventListener("click", this.hide, false);	
					};
		menu.show = menu.show.bind(menu);
		// Hide the menu
		menu.hide = function(){
						this.overlay.style.display = 'none';
						this.removeEventListener("touchstart", this.touchHandler, false);
						this.style['-webkit-transition'] = 'all 0.5s ease-in-out';
						this.style['-webkit-transform'] = 'translate(' + bb.contextMenu.getWidth() + ', 0px)';
						if (!this.peeking) {
							// Remove the header click handling 
							this.header.removeEventListener("click", this.hide, false);	
						}
						this.peeking = false;
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
						this.peeking = true;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + bb.contextMenu.getPeekWidth() + ', 0)';	
						this.addEventListener("touchstart", this.touchHandler, false);	
						// Remove the header click handling while peeking
						this.header.removeEventListener("click", this.hide, false);						
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
		
		// Calculate the header bottom margin to center the items in the list
		menu.setHeaderHeight = function() {
								var windowHeight,
									itemHeight,
									margin;
								if (bb.device.isPlayBook) {
									itemHeight = 53;
									if (window.orientation == 0 || window.orientation == 180) {
										windowHeight = 600;
									} else if (window.orientation == -90 || window.orientation == 90) {
										windowHeight = 1024;
									}
								} else {
									itemHeight = 111;
									if (window.orientation == 0 || window.orientation == 180) {
										windowHeight = 1280;
									} else if (window.orientation == -90 || window.orientation == 90) {
										windowHeight = 768;
									}
								}
								margin = Math.floor(windowHeight/2) - Math.floor((this.actions.length * itemHeight)/2);
								this.header.style['margin-bottom'] = margin + 'px';
							};
		menu.setHeaderHeight = menu.setHeaderHeight.bind(menu);
		
		
		// Make sure we move when the orientation of the device changes
		menu.orientationChanged = function(event) {
								// Orientation is backwards between playbook and BB10 smartphones
								if (bb.device.isPlayBook) {
									if (window.orientation == 0 || window.orientation == 180) {
										this.style.left = '1027px';
									} else if (window.orientation == -90 || window.orientation == 90) {
										this.style.left = '603px';
									}
								} else {
									if (window.orientation == 0 || window.orientation == 180) {
										this.style.left = '771px';
									} else if (window.orientation == -90 || window.orientation == 90) {
										this.style.left = '1283px';
									}
								}
							};
		menu.orientationChanged = menu.orientationChanged.bind(menu);	
		window.addEventListener('orientationchange', menu.orientationChanged,false); 
		
		// Create our add item function
		menu.add = function(action) {
				var normal, 
					highlight,
					caption = action.innerHTML;
				
				// set our styling
				normal = 'bb-bb10-context-menu-item-'+this.res+' bb-bb10-context-menu-item-'+this.res+'-' + bb.actionBar.color;
				highlight = normal + ' bb-bb10-context-menu-item-hover-'+this.res;
				this.appendChild(action);
				this.actions.push(action);
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
										this.setAttribute('style','border-left-color:'+ bb.options.bb10HighlightColor);
									}
				action.ontouchend = function () {
										this.setAttribute('class',this.normal);
										this.setAttribute('style','');
									}
				action.addEventListener("click", this.hide, false);
		};
		menu.add = menu.add.bind(menu);
		
		return menu;
	},
	
	// Calculate the proper width of the context menu
	getWidth : function() {
		if (bb.device.isPlayBook) {
			return '300px';
		} else {
			return '563px';		
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


bb.textArrowList = { 
    // Apply our transforms to all arrow lists passed in
    apply: function(elements) {
        if (bb.device.isBB10) {
			var i, 
				outerElement,
				res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}	
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.setAttribute('class','bb-bb10-text-arrow-list-'+res);
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j],
						text = innerChildNode.innerHTML;
					innerChildNode.normal = 'bb-bb10-text-arrow-list-item-'+res+' bb-bb10-text-arrow-list-item-'+bb.screen.listColor;
					innerChildNode.highlight = 'bb-bb10-text-arrow-list-item-'+res+' bb-bb10-text-arrow-list-item-hover bb10Highlight';
					innerChildNode.setAttribute('class',innerChildNode.normal);
					innerChildNode.innerHTML = '<div class="bb-bb10-text-arrow-list-item-value-'+res+'">'+ text + '</div>'+
											'<div class="bb-bb10-arrow-list-arrow-'+res+'"></div>';
					innerChildNode.ontouchstart = function() {
													this.setAttribute('class', this.highlight);
												};
					innerChildNode.ontouchend = function() {
													this.setAttribute('class', this.normal);
												};					
					// Create our separator <div>
					if (j < items.length - 1) {
						var placeholder = document.createElement('div');
						placeholder.setAttribute('class','bb-bb10-arrow-list-separator-'+res+'-'+bb.screen.listColor);
						outerElement.insertBefore(placeholder,innerChildNode.nextSibling);
					}
				}
			}
		}
		else {
			for (var i = 0; i < elements.length; i++) {
				var inEvent, 
					outEvent,
					outerElement = elements[i];
					
				// Set our highlight events
				if (bb.device.isPlayBook) {
					inEvent = 'ontouchstart';
					outEvent = 'ontouchend';
				} else {
					inEvent = 'onmouseover';
					outEvent = 'onmouseout';
				}
				outerElement.setAttribute('class','bb-text-arrow-list');
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j],
						text = innerChildNode.innerHTML;
					innerChildNode.setAttribute('class','bb-text-arrow-list-item');
					innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-text-arrow-list-item-hover');");
					innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-text-arrow-list-item')");
					innerChildNode.setAttribute('x-blackberry-focusable','true');
					
					innerChildNode.innerHTML = '<span class="bb-text-arrow-list-item-value">'+ text + '</span>' +
											'<div class="bb-arrow-list-arrow"></div>';
					
					// Create our separator <div>
					if (j < items.length - 1) {
						var placeholder = document.createElement('div');
						placeholder.setAttribute('class','bb-arrow-list-separator');
						outerElement.insertBefore(placeholder,innerChildNode.nextSibling);
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

/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){
var m = Math,
	mround = function (r) { return r >> 0; },
	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'Moz' :
		(/trident/i).test(navigator.userAgent) ? 'ms' :
		'opera' in window ? 'O' : '',

    // Browser capabilities
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isPlaybook = (/playbook/gi).test(navigator.appVersion),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor + 'Transform' in document.documentElement.style,
    hasTransitionEnd = isIDevice || isPlaybook,

	nextFrame = (function() {
	    return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback) { return setTimeout(callback, 1); }
	})(),
	cancelFrame = (function () {
	    return window.cancelRequestAnimationFrame
			|| window.webkitCancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame
			|| window.mozCancelRequestAnimationFrame
			|| window.oCancelRequestAnimationFrame
			|| window.msCancelRequestAnimationFrame
			|| clearTimeout
	})(),

	// Events
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',

	// Helpers
	trnOpen = 'translate' + (has3d ? '3d(' : '('),
	trnClose = has3d ? ',0)' : ')',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			doc = document,
			i;

		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];

		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			x: 0,
			y: 0,
			bounce: true,
			bounceLock: false,
			momentum: true,
			lockDirection: true,
			useTransform: true,
			useTransition: false,
			topOffset: 0,
			checkDOMChanges: false,		// Experimental

			// Scrollbar
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: isAndroid,
			hideScrollbar: isIDevice,
			fadeScrollbar: isIDevice && has3d,
			scrollbarClass: '',

			// Zoom
			zoom: false,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: 'scroll',

			// Snap
			snap: false,
			snapThreshold: 1,

			// Events
			onRefresh: null,
			onBeforeScrollStart: function (e) { e.preventDefault(); },
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];
		
		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform ? that.options.useTransform : false;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Helpers FIX ANDROID BUG!
		// translate3d and scale doesn't work together! 
		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom
		if ( that.options.zoom && isAndroid ){
			trnOpen = 'translate(';
			trnClose = ')';
		}
		
		// Set some default styles
		that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';
		that.scroller.style[vendor + 'TransitionDuration'] = '0';
		that.scroller.style[vendor + 'TransformOrigin'] = '0 0';
		if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';
		
		if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		if (that.options.useTransition) that.options.fixedScrollbar = true;

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			that._bind('mouseout', that.wrapper);
			if (that.options.wheelAction != 'none')
				that._bind(WHEEL_EV);
		}

		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			that._checkDOMChanges();
		}, 500);
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
	
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case WHEEL_EV: that._wheel(e); break;
			case 'mouseout': that._mouseout(e); break;
			case 'webkitTransitionEnd': that._transitionEnd(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},
	
	_scrollbar: function (dir) {
		var that = this,
			doc = document,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = '';
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');

			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:opacity;-' + vendor + '-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.9);-' + vendor + '-background-clip:padding-box;-' + vendor + '-box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';-' + vendor + '-border-radius:3px;border-radius:3px';
			}
			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:-' + vendor + '-transform;-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-' + vendor + '-transition-duration:0;-' + vendor + '-transform:' + trnOpen + '0,0' + trnClose;
			if (that.options.useTransition) bar.style.cssText += ';-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(mround(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(mround(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._scrollbarPos(dir, true);
	},
	
	_resize: function () {
		var that = this;
		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
	},
	
	_pos: function (x, y) {
		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
		} else {
			x = mround(x);
			y = mround(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;

		this._scrollbarPos('h');
		this._scrollbarPos('v');
	},

	_scrollbarPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;

		if (pos < 0) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] + mround(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - mround((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}

		that[dir + 'ScrollbarWrapper'].style[vendor + 'TransitionDelay'] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		// Gesture start
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
			
			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
		}

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');
				x = matrix[4] * 1;
				y = matrix[5] * 1;
			} else {
				x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;
				y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind('webkitTransitionEnd');
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
			}
		}

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now();

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		that._bind(MOVE_EV);
		that._bind(END_EV);
		that._bind(CANCEL_EV);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now();
		
		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		// Zoom
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
			that.touchesDist = m.sqrt(c1*c1+c2*c2);

			that.zoomed = true;

			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

			that.lastScale = scale / this.scale;

			newX = this.originX - this.originX * that.lastScale + this.x,
			newY = this.originY - this.originY * that.lastScale + this.y;

			this.scroller.style[vendor + 'Transform'] = trnOpen + newX + 'px,' + newY + 'px' + trnClose + ' scale(' + scale + ')';

			if (that.options.onZoom) that.options.onZoom.call(that, e);
			return;
		}

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) { 
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		if (that.absDistX < 6 && that.absDistY < 6) {
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 300) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length != 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;

		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (that.zoomed) {
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;
			
			that.scroller.style[vendor + 'TransitionDuration'] = '200ms';
			that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';
			
			that.zoomed = false;
			that.refresh();

			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
			return;
		}

		if (!that.moved) {
			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
					if (that.options.onZoomEnd) {
						setTimeout(function() {
							that.options.onZoomEnd.call(that, e);
						}, 200); // 200 is default zoom duration
					}
				} else {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							ev = document.createEvent('MouseEvents');
							ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
							ev._fake = true;
							target.dispatchEvent(ev);
						}
					}, that.options.zoom ? 250 : 0);
				}
			}

			that._resetPos(200);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

 			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
 			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				distX = newPosX - that.absStartX;
				distY = newPosY - that.absStartY;
				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
				else {
					snap = that._snap(newPosX, newPosY);
					newPosX = snap.x;
					newPosY = snap.y;
					newDuration = m.max(snap.time, newDuration);
				}
			}

			that.scrollTo(mround(newPosX), mround(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		// Do we need to snap?
		if (that.options.snap) {
			distX = newPosX - that.absStartX;
			distY = newPosY - that.absStartY;
			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
			else {
				snap = that._snap(that.x, that.y);
				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
			}

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.hScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.vScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		that.scrollTo(resetX, resetY, time || 0);
	},

	_wheel: function (e) {
		var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
		} else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			return;
		}
		
		if (that.options.wheelAction == 'zoom') {
			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
			
			if (deltaScale != that.scale) {
				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				that.wheelZoomCount++;
				
				that.zoom(e.pageX, e.pageY, deltaScale, 400);
				
				setTimeout(function() {
					that.wheelZoomCount--;
					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
				}, 400);
			}
			
			return;
		}
		
		deltaX = that.x + wheelDeltaX;
		deltaY = that.y + wheelDeltaY;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

		that.scrollTo(deltaX, deltaY, 0);
	},
	
	_mouseout: function (e) {
		var t = e.relatedTarget;

		if (!t) {
			this._end(e);
			return;
		}

		while (t = t.parentNode) if (t == this.wrapper) return;
		
		this._end(e);
	},

	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind('webkitTransitionEnd');
		
		that._startAni();
	},


	/**
	 *
	 * Utilities
	 *
	 */
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (that.animating) return;
		
		if (!that.steps.length) {
			that._resetPos(400);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;
		
		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) that._bind('webkitTransitionEnd');
			else that._resetPos(0);
			return;
		}

		animate = function () {
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();
	},

	_transitionTime: function (time) {
		time += 'ms';
		this.scroller.style[vendor + 'TransitionDuration'] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
	},

	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries 
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: mround(newTime) };
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		
		if (el != this.wrapper) {
			left *= this.scale;
			top *= this.scale;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length - 1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = mround(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el, bubble) {
		(el || this.scroller).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.scroller).removeEventListener(type, this, !!bubble);
	},


	/**
	 *
	 * Public methods
	 *
	 */
	destroy: function () {
		var that = this;

		that.scroller.style[vendor + 'Transform'] = '';

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);
		
		if (!that.options.hasTouch) {
			that._unbind('mouseout', that.wrapper);
			that._unbind(WHEEL_EV);
		}
		
		if (that.options.useTransition) that._unbind('webkitTransitionEnd');
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.minScrollY = -that.options.topOffset || 0;
		that.scrollerW = mround(that.scroller.offsetWidth * that.scale);
		that.scrollerH = mround((that.scroller.offsetHeight + that.minScrollY) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		if (!that.zoomed) {
			that.scroller.style[vendor + 'TransitionDuration'] = '0';
			that._resetPos(200);
		}
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		
		time = time === undefined ? 400 : time;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV);
		this._unbind(END_EV);
		this._unbind(CANCEL_EV);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind('webkitTransitionEnd');
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	zoom: function (x, y, scale, time) {
		var that = this,
			relScale = scale / that.scale;

		if (!that.options.useTransform) return;

		that.zoomed = true;
		time = time === undefined ? 200 : time;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;
		that.refresh();

		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		that.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';
		that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';
		that.zoomed = false;
	},
	
	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})();