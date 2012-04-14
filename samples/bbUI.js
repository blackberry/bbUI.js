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

    // Assign any listeners we need to make the bbUI framework function
    assignBackHandler: function(callback) {
        if (window.blackberry && blackberry.system.event.onHardwareKey) {
            blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, callback);
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
        bb.tallList.apply(root.querySelectorAll('[data-bb-type=tall-list]'));
        bb.inboxList.apply(root.querySelectorAll('[data-bb-type=inbox-list]'));
        bb.bbmBubble.apply(root.querySelectorAll('[data-bb-type=bbm-bubble]'));
        bb.pillButtons.apply(root.querySelectorAll('[data-bb-type=pill-buttons]'));
        bb.labelControlContainers.apply(root.querySelectorAll('[data-bb-type=label-control-container]'));
        bb.button.apply(root.querySelectorAll('[data-bb-type=button]'));

        // perform device specific formatting
        bb.screen.reAdjustHeight();
    },

    device: {  
        isHiRes: function() { 
			if (bb.device.isRipple()) {
				return window.innerHeight > 480 || window.innerWidth > 480; 
			} else {
				return screen.width > 480 || screen.height > 480;
			}
		}, 

        // Determine if this browser is BB5
        isBB5: function() {
            return navigator.appVersion.indexOf('5.0.0') >= 0;
        },

        // Determine if this browser is BB6
        isBB6: function() {
            return navigator.appVersion.indexOf('6.0.0') >= 0;
        },

        // Determine if this browser is BB7.. Ripple's Render is similar to that in BB7
        isBB7: function() {
            return (navigator.appVersion.indexOf('7.0.0') >= 0) || (navigator.appVersion.indexOf('7.1.0') >= 0) || bb.device.isRipple();
        },

        isPlayBook: function() {
            return (navigator.appVersion.indexOf('PlayBook') >= 0) || ((window.innerWidth == 1024 && window.innerHeight == 600) || (window.innerWidth == 600 && window.innerHeight == 1024));
        },

        isRipple: function() {
            return (navigator.appVersion.indexOf('Ripple') >= 0);
        },

        // Determines if this device supports touch
        isTouch: function() {
            return true;
        }
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
                        // When we have scripts we fire the onscreenready and then apply our changes in doLoad()
                        if (bb.onscreenready) {
                            bb.onscreenready(container, container.getAttribute('id'));
                        }
                        bb.doLoad(container);
                        // Load in the new content
                        document.body.appendChild(container);
                        window.scroll(0,0);
                        bb.screen.applyEffect(id, container);
						bb.createScreenScroller();  
                    }
                };
        }

        // In case there are no scripts at all we simply doLoad() now
        if(bb.screen.totalScripts === 0) {
            if (bb.onscreenready) {
                bb.onscreenready(container, container.getAttribute('id'));
            }
            bb.doLoad(container);
            // Load in the new content
            document.body.appendChild(container);
            window.scroll(0,0);
            bb.screen.applyEffect(id, container);
			bb.createScreenScroller(); 
        }
        return container;
    },
	
	// Creates the scroller for the screen
	createScreenScroller : function() {   
	
		var scrollWrapper = document.getElementById('bbUIscrollWrapper');
		if (scrollWrapper) {
			bb.scroller = new iScroll(scrollWrapper, {hideScrollbar:true,fadeScrollbar:true, onBeforeScrollStart: function (e) {
				var target = e.target;
				while (target.nodeType != 1) target = target.parentNode;

				if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
					e.preventDefault();
			}}); 
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
            var currentStackItem = bb.screens[numItems-1],
                current = document.getElementById(currentStackItem.id);
            document.body.removeChild(current);
			bb.menuBar.clearMenu();
            bb.screens.pop();

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

bb.menuBar = {
	height: 100,
	activeClick: false,
	ignoreClick: false,
	menuOpen: false,
	menu: false,

	apply: function(menuBar){
		if (blackberry && blackberry.app.event && bb.device.isPlayBook()) {
			bb.menuBar.createSwipeMenu(menuBar);
			menuBar.parentNode.removeChild(menuBar);
			document.addEventListener("click", bb.menuBar.globalClickHandler, false);
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar); 
		}else if(blackberry && blackberry.ui.menu){
			bb.menuBar.createBlackberryMenu(menuBar);
			menuBar.parentNode.removeChild(menuBar);
		}else{
			console.log('Unable to create Blackberry/onSwipeDown menu.');
		}
	},

	createBlackberryMenu: function(menuBar){
		var items, item, title;
		
		items = menuBar.getElementsByTagName('div');
		
		for (var j = 0; j < items.length; j++) {
			if(items[j].getAttribute('data-bb-type') === "menu-item"){
				title	= items[j].hasAttribute('data-bb-caption') ? items[j].getAttribute('data-bb-caption') : false;
				if(title){
					item	= new blackberry.ui.menu.MenuItem(false, j, title, items[j].onclick);
					blackberry.ui.menu.addMenuItem(item);
					if(items[j].hasAttribute('data-bb-selected') && items[j].getAttribute('data-bb-selected') === "true"){
						blackberry.ui.menu.setDefaultMenuItem(item);
					}
				}else{
					console.log("can't add menu item without data-bb-caption");
				}
			}else if(items[j].getAttribute('data-bb-type') === "menu-separator"){
				item = new blackberry.ui.menu.MenuItem(true, j);
				blackberry.ui.menu.addMenuItem(item);
			}else{
				console.log('invalid menu item type');
			}
		}		
	},
	
	createSwipeMenu: function(menuBar){
		var pbMenu, items, pbMenuInner, top, style;
		
		pbMenu				= document.createElement("div");
		pbMenu.id			= 'pb-menu-bar';
		if(menuBar.hasAttribute('class')) {
			pbMenu.setAttribute('class', menuBar.getAttribute('class'));
		}
		style				= pbMenu.style;
		style.height		= bb.menuBar.height + 'px';
		style.top			= '-' + (bb.menuBar.height + 3) + 'px';
		pbMenu.style		= style;
		pbMenu.addEventListener("click", bb.menuBar.onMenuBarClicked, false);

		items				= menuBar.getElementsByTagName('div');
		if(items.length > 0){
			top						= parseInt(bb.menuBar.height / 9, 10);
			pbMenuInner				= document.createElement("ul");
			style					= pbMenuInner.style;
			style.top				= top +'px';
			pbMenuInner.style		= style;
			for (var j = 0; j < items.length; j++) {
				if(items[j].getAttribute('data-bb-type') === "menu-item"){
					var img, title, span, fontHeight, br, iconOnly;
					
					fontHeight			= parseInt(bb.menuBar.height /2.5, 10);
					
					var pbMenuItem		= document.createElement("li");
					if(items[j].hasAttribute('class')) {
						pbMenuItem.setAttribute('class', items[j].getAttribute('class'));
					}
					style				= pbMenuItem.style;
					style.padding		= parseInt(fontHeight/1.65, 10) + "px 12px";
					style.fontSize		= fontHeight + "px";
					pbMenuItem.style	= style;
					
					title				= items[j].hasAttribute('data-bb-caption') ? items[j].getAttribute('data-bb-caption') : '';
					iconPath			= items[j].hasAttribute('data-bb-img') ? items[j].getAttribute('data-bb-img') : '';
					iconOnly			= items[j].hasAttribute('data-bb-icon-only') ? items[j].getAttribute('data-bb-icon-only') : false;

					if(iconPath){
						style				= pbMenuItem.style;
						style.padding		= parseInt(fontHeight /4, 10) + "px 12px";
						pbMenuItem.style	= style;
						
						img					= new Image();
						img.src				= iconPath;
						style				= img.style;
						style.height		= parseInt(bb.menuBar.height * 0.55, 10) + "px";
						img.style			= style;
						pbMenuItem.appendChild(img);
						
						if(title && !iconOnly){
							br					= document.createElement("br");
							pbMenuItem.appendChild(br);
							style				= img.style;
							style.height		= parseInt(bb.menuBar.height * 0.4, 10) + "px";
							img.style			= style;
							style				= pbMenuItem.style;
							style.fontSize		= parseInt(fontHeight/2,10) +"px";
							pbMenuItem.style	= style;
						}
					}

					if(!iconOnly){
						span				= document.createElement("span");
						span.innerText		= title;
						pbMenuItem.appendChild(span);
					}

					pbMenuItem.onclick	= items[j].onclick;
					pbMenuInner.appendChild(pbMenuItem);
				}else if(items[j].getAttribute('data-bb-type') === "menu-separator"){
					pbMenu.appendChild(pbMenuInner);
					pbMenuInner	= document.createElement("ul")
					style					= pbMenuInner.style;
					style.top				= top +'px';
					pbMenuInner.style		= style;
				}else{
					console.log('invalid menu item type');
				}
			}
			pbMenu.appendChild(pbMenuInner);
		}
		document.body.appendChild(pbMenu);
		pbMenu.style['-webkit-transform']	= 'translate(0,0)';
		
		bb.menuBar.menu	= pbMenu;		
	},

	showMenuBar: function(){
		if(!bb.menuBar.menuOpen){
			blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);
			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate(0, ' + (bb.menuBar.height + 3) + 'px)';

			bb.menuBar.menuOpen = true;
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.menuOpen){
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
	},

	clearMenu: function(){
		if(window.blackberry){
			if(blackberry.app.event && bb.menuBar.menu && bb.device.isPlayBook()){
				blackberry.app.event.onSwipeDown('');
				document.removeEventListener("click", bb.menuBar.globalClickHandler, false);
				bb.menuBar.menu.parentNode.removeChild(bb.menuBar.menu);
				bb.menuBar.menu = false;
			}else if(blackberry.ui.menu){
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
    
        if (bb.device.isBB5()) {
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
        } else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    disabled = outerElement.hasAttribute('data-bb-disabled'),
                    normal = 'bb-bb7-button',
                    highlight = 'bb-bb7-button-highlight',
					inEvent,
					outEvent;
					
				// Set our highlight events
				if (bb.device.isPlayBook()) {
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
                
                if (bb.device.isHiRes()) {
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
                        
                        if (bb.device.isHiRes()) {
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
                        
                        if (bb.device.isHiRes()) {
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
        if (bb.device.isBB5()) {

        } else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    options = outerElement.getElementsByTagName('option'),
                    caption = '',
					inEvent,
					outEvent;
					
				// Set our highlight events
				if (bb.device.isPlayBook()) {
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

                if (bb.device.isHiRes()) {
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
                        if (bb.device.isPlayBook() || bb.device.isRipple()) {
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
                            if (bb.device.isHiRes()) {
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
                                //alert("Exception in selectAsync: " + e);
                            }
                        }
                    };
            }
        }
    }
};

bb.imageList = {  
    apply: function(elements) {
        // Apply our transforms to all Dark Image Lists
        for (var i = 0; i < elements.length; i++) {
            var inEvent, 
				outEvent, 
				outerElement = elements[i];
			// Set our highlight events
			if (bb.device.isPlayBook()) {
				inEvent = 'ontouchstart';
				outEvent = 'ontouchend';
			} else {
				inEvent = 'onmouseover';
				outEvent = 'onmouseout';
			}
            if (bb.device.isHiRes()) {
                outerElement.setAttribute('class','bb-hires-image-list');
            } else {
                outerElement.setAttribute('class','bb-lowres-image-list');
            }
            // Gather our inner items
            var items = outerElement.querySelectorAll('[data-bb-type=item]');
            for (var j = 0; j < items.length; j++) {
                var innerChildNode = items[j];
                if (innerChildNode.hasAttribute('data-bb-type')) {
                    var type = innerChildNode.getAttribute('data-bb-type').toLowerCase(),
                        description = innerChildNode.innerHTML;
                    
                    if (bb.device.isHiRes()) {
                        innerChildNode.setAttribute('class', 'bb-hires-image-list-item');
						innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-hires-image-list-item-hover')");
						innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-hires-image-list-item')");
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
                                        '<div class="details">\n'+
                                        '   <span class="title">' + innerChildNode.getAttribute('data-bb-title') + '</span>\n'+
                                        '   <div class="description">' + description + '</div>\n'+
                                        '</div>\n';
                    } else {
                        innerChildNode.setAttribute('class', 'bb-lowres-image-list-item');
                        innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-lowres-image-list-item-hover')");
						innerChildNode.ontouchstart = innerChildNode.onmouseover;  
                        innerChildNode.ontouchend = innerChildNode.onmouseout;  
						innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-lowres-image-list-item')");
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
                                        '<div class="details">\n'+
                                        '   <span class="title">' + innerChildNode.getAttribute('data-bb-title') + '</span>\n'+
                                        '   <div class="description">' + description + '</div>\n'+
                                        '</div>\n';
                    }
                    innerChildNode.removeAttribute('data-bb-img');
                    innerChildNode.removeAttribute('data-bb-title');
                }
            }
        }
    }
};

bb.inboxList = { 
    // Apply our transforms to all Inbox lists
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var inEvent, outEvent, outerElement = elements[i];
			// Set our highlight events
			if (bb.device.isPlayBook()) {
				inEvent = 'ontouchstart';
				outEvent = 'ontouchend';
			} else {
				inEvent = 'onmouseover';
				outEvent = 'onmouseout';
			}
            outerElement.setAttribute('class','bb-inbox-list');
            // Gather our inner items
            var items = outerElement.querySelectorAll('[data-bb-type=item], [data-bb-type=header]');
            for (var j = 0; j < items.length; j++) {
                var innerChildNode = items[j];
				
                if (innerChildNode.hasAttribute('data-bb-type')) {
                    var type = innerChildNode.getAttribute('data-bb-type').toLowerCase();
                    
                    if (type == 'header') {
                        var description = innerChildNode.innerHTML;
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<p>'+ description +'</p>';
                        if (bb.device.isHiRes()) {
                            innerChildNode.setAttribute('class', 'bb-hires-inbox-list-header');
							innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-hires-inbox-list-header-hover')");
							innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-hires-inbox-list-header')");
                        } else {
                            innerChildNode.setAttribute('class', 'bb-lowres-inbox-list-header');
                            innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-lowres-inbox-list-header-hover')");
                            innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-lowres-inbox-list-header')");
                        }
                    }
                    else if (type == 'item') {
                        var description = innerChildNode.innerHTML,
                            title = innerChildNode.getAttribute('data-bb-title');
                        if (innerChildNode.hasAttribute('data-bb-accent') && innerChildNode.getAttribute('data-bb-accent').toLowerCase() == 'true') {
                            title = '<b>' + title + '</b>';
                        }
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
                                        '<div class="title">'+ title +'</div>\n'+
                                        '<div class="time">' + innerChildNode.getAttribute('data-bb-time') + '</div>\n'+
                                        '<div class="description">' + description + '</div>\n';
                        innerChildNode.removeAttribute('data-bb-img');
                        innerChildNode.removeAttribute('data-bb-title');    
                        
                        if (bb.device.isHiRes()) {
                            innerChildNode.setAttribute('class', 'bb-hires-inbox-list-item');
							innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-hires-inbox-list-item-hover')");
							innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-hires-inbox-list-item')");
                        } else {
                            innerChildNode.setAttribute('class', 'bb-lowres-inbox-list-item');
                            innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-lowres-inbox-list-item-hover')");
                            innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-lowres-inbox-list-item')");
                        }     
                    }
                }               
            }           
        }   
    }
};

bb.labelControlContainers = {
    // Apply our transforms to all label control rows
    apply: function(elements) {
        if (bb.device.isBB5()) {
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
        if (bb.device.isBB5()) {
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
        } else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    containerStyle = 'bb-bb7-pill-buttons',
                    buttonStyle = '';
                
                // Set our container style
                if (bb.device.isHiRes()) {
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
					
				if (bb.device.isPlayBook()) {
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
							
							if (bb.device.isPlayBook()) {
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
        if (bb.device.isBB7() || bb.device.isBB6() || bb.device.isBB5()) {
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
        else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
                outerElement.setAttribute('class','bb-bb7-round-panel');
                var items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
                for (var j = 0; j < items.length; j++) {
                    if (bb.device.isHiRes()) {
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
    
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var outerElement = elements[i];
            if (bb.device.isHiRes()) {
                outerElement.setAttribute('class', 'bb-hires-screen');
            }
			
			//check to see if a menu/menuBar needs to be created
			var menuBar = outerElement.querySelectorAll('[data-bb-type=menu]');
			if (menuBar.length > 0) {
				menuBar = menuBar[0];
				bb.menuBar.apply(menuBar);
			}
            
            if (bb.device.isPlayBook()) {
                outerElement.style.height = window.innerHeight;
                outerElement.style.width = window.innerWidth;
                outerElement.style.overflow = 'auto';
                
                var titleBar = outerElement.querySelectorAll('[data-bb-type=title]');
                if (titleBar.length > 0) {
                    titleBar = titleBar[0]; }
				else {
					titleBar = null;
				}
				
				// Create our scrollable <div>
				var outerScrollArea = document.createElement('div'); 
				var outerScrollArea = document.createElement('div');
				outerElement.appendChild(outerScrollArea);
				// Turn off scrolling effects if they don't want them
				if (!outerElement.hasAttribute('data-bb-scroll-effect') || outerElement.getAttribute('data-bb-scroll-effect').toLowerCase() != 'off') {
					outerScrollArea.setAttribute('id','bbUIscrollWrapper'); 
				}
				// Inner Scroll Area
				var scrollArea = document.createElement('div');
				outerScrollArea.appendChild(scrollArea); 
				
				
				// Copy all nodes that are not the title bar
				var tempHolder = [],
					childNode = null, 
					j;
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
                var titleBar = outerElement.querySelectorAll('[data-bb-type=title]');
                if (titleBar.length > 0) {
                    titleBar = titleBar[0];
                    if (titleBar.hasAttribute('data-bb-caption')) {
                        var outerStyle = outerElement.getAttribute('style');
                        if (bb.device.isHiRes()) {
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
        if (!bb.device.isBB5()) {
            var screen = container.querySelectorAll('[data-bb-type=screen]');
            if (screen.length > 0 ) {
                screen = screen[0];
                var effect = screen.getAttribute('data-bb-effect');
                if (effect && effect.toLowerCase() == 'fade') {
                    if (bb.device.isBB6()) {
                    // On BB6 Fade doesn't work well when input controls are on the screen
                    // so we disable the fade effect for the sake of performance
                    var inputControls = container.querySelectorAll('input');
                    if (inputControls.length === 0) {
                        bb.screen.fadeIn({'id': id, 'duration': 1.0});
                    }
                    } else {
                    bb.screen.fadeIn({'id': id, 'duration': 1.0});
                    }
                }
            }
        }
    },
    
    reAdjustHeight: function() {
        // perform device specific formatting
        if (bb.device.isBB5()) {
            document.body.style.height = screen.height - 27 + 'px';
        }
        else if (bb.device.isBB6()) {
            document.body.style.height = screen.height - 17 + 'px';
        }
        else if (bb.device.isBB7() && (navigator.appVersion.indexOf('Ripple') < 0)) {
            document.body.style.height = screen.height + 'px';
        }
    }
};

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

bb.textArrowList = { 
    // Apply our transforms to all arrow lists passed in
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var inEvent, 
				outEvent,
				outerElement = elements[i];
				
			// Set our highlight events
			if (bb.device.isPlayBook()) {
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
				innerChildNode.setAttribute('class', 'bb-text-arrow-list-item');
                innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-text-arrow-list-item-hover');");
                innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-text-arrow-list-item')");
                innerChildNode.setAttribute('x-blackberry-focusable','true');
                
                innerChildNode.innerHTML = '<div class="bb-text-arrow-list-item-value">'+ text + '</div>' +
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
};


bb.textInput = { 
    apply: function(elements) {
        if (bb.device.isBB5()) {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
            }
        } else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
                var style = outerElement.getAttribute('class');
                style = style + ' bb-bb7-input';
                
                if (bb.device.isHiRes()) {
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

bb.assignBackHandler(bb.popScreen);

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