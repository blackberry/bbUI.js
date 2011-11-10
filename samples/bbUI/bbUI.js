/*
* Copyright 2010-2011 Research In Motion Limited.
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
	
	screens: [], 
	
	// Assign any listeners we need to make the bbUI framework function
	assignHandlers: function() {
		if (blackberry) {
			blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, bb.popScreen);
		}
	},
	
	doLoad: function(element) {
		// Apply our styling
		var root;

		if (element == undefined) {
			root = document.body;
		} else  {
			root = element;
		}
		
		bb.screen.apply(root.querySelectorAll('[x-bb-type=screen]'));
		bb.textInput.apply(root.querySelectorAll('input[type=text]'));
		bb.roundPanel.apply(root.querySelectorAll('[x-bb-type=round-panel]'));
		bb.textArrowList.apply(root.querySelectorAll('[x-bb-type=text-arrow-list]'));	
		bb.imageList.apply(root.querySelectorAll('[x-bb-type=image-list]'));	
		bb.tallList.apply(root.querySelectorAll('[x-bb-type=tall-list]'));
		bb.inboxList.apply(root.querySelectorAll('[x-bb-type=inbox-list]'));
		bb.bbmBubble.apply(root.querySelectorAll('[x-bb-type=bbm-bubble]'));
		bb.pillButtons.apply(root.querySelectorAll('[x-bb-type=pill-buttons]'));
		bb.labelControlContainers.apply(root.querySelectorAll('[x-bb-type=label-control-container]'));
		bb.button.apply(root.querySelectorAll('[x-bb-type=button]'));
		
		// perform device specific formatting
		bb.screen.reAdjustHeight();
	},
	
	
	// Contains all device information
	device: {
	
		isHiRes: window.innerHeight > 480 || window.innerWidth > 480,
		
		// Determine if this browser is BB5
		isBB5: function() {
			//return true;
			return navigator.appVersion.indexOf('5.0.0') >= 0;
		},
		
		// Determine if this browser is BB6
		isBB6: function() {
			return navigator.appVersion.indexOf('6.0.0') >= 0;
		},
		
		// Determine if this browser is BB7.. Ripple's Render is similar to that in BB7
		isBB7: function() {
			return (navigator.appVersion.indexOf('7.0.0') >= 0) || (navigator.appVersion.indexOf('7.1.0') >= 0) || (navigator.appVersion.indexOf('Ripple') >= 0);
		},
		
		// Determines if this device supports touch
		isTouch: function() {
			return true;
		}		
	},
	
	loadScreen: function(url, id) {
		// Retrieve the screen contents
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		// generate our screen content
		var newScreen = xmlhttp.responseText;
		var container = document.createElement('div');
		container.setAttribute('id', id);
		container.innerHTML = newScreen;
		// Apply our styling and insert into the dom
		bb.doLoad(container);
		return container;
	},
	
	
	
	// Add a new screen to the stack
	pushScreen : function (url, id) {					
		var container = bb.loadScreen(url, id);
		
		// Add any Java Script files that need to be included
		var scriptIds = [];
		var scripts = container.getElementsByTagName('script');
		var newScriptTags = [];
		for (var i = 0; i < scripts.length; i++) {
			var bbScript = scripts[i];
			scriptIds.push({'id' : bbScript.getAttribute('id'), 'onunload': bbScript.getAttribute('onunload')});
			var scriptTag = document.createElement('script');
			scriptTag.setAttribute('type','text/javascript');
			scriptTag.setAttribute('src', bbScript.getAttribute('src'));
			scriptTag.setAttribute('id', bbScript.getAttribute('id'));
			newScriptTags.push(scriptTag);	
			// Remove script tag from container because we are going to add it to <head>
			bbScript.parentNode.removeChild(bbScript);
		}
		
		// Load in the new content
		document.body.appendChild(container);
		
		// Special handling for inserting script tags
		for (var i = 0; i < newScriptTags.length; i++) {
			var head = document.getElementsByTagName('head');
			if (head.length > 0 ) {
				head[0].appendChild(newScriptTags[i]);
			}	
		}
		
		// Add our screen to the stack
		bb.screens.push({'id' : id, 'url' : url, 'scripts' : scriptIds});
		
		// Remove the old screen
		var numItems = bb.screens.length;
		if (numItems > 1) {
			var oldScreen = document.getElementById(bb.screens[numItems -2].id);
			document.body.removeChild(oldScreen);
		}
		
		window.scroll(0,0);
	
		//bb.animate.fadeIn({'id': id, duration: 1.0});
		
	},
	
	// Pop a screen from the stack
	popScreen: function() {
		var numItems = bb.screens.length;
		if (numItems > 1) {
			// pop the old item
			var currentStackItem = bb.screens[numItems-1];
			var current = document.getElementById(currentStackItem.id);
			bb.screens.pop();

			// Retrieve our new screen
			var display = bb.screens[numItems-2];
			var container = bb.loadScreen(display.url, display.id);

			// Remove any JavaScript files
			for (var i = 0; i < currentStackItem.scripts.length; i++) {
				var bbScript = currentStackItem.scripts[i];
				var scriptTag = document.getElementById(bbScript.id);
				// Call the unload function if any is defined
				if (bbScript.onunload) {
					eval(bbScript.onunload);
				}
				var head = document.getElementsByTagName('head');
				if (head.length > 0 ) {
					head[0].removeChild(scriptTag);
				}	
			}
			// Apply dom changes
			document.body.appendChild(container);
			document.body.removeChild(current);

			window.scroll(0,0);
			//bb.animate.fadeIn({'id': display.id, duration: 1.0});
			
		} else {
			if (blackberry) {
				blackberry.app.exit();
			}
		}
		
	},
	
	screen: {
		apply: function(elements) {
			for (var i = 0; i < elements.length; i++) {
				var outerElement = elements[i];
				if (bb.device.isHiRes) {
					outerElement.setAttribute('class', 'bb-hires-screen');
				}
				if (outerElement.hasAttribute('x-bb-title')) {
					var outerStyle = outerElement.getAttribute('style'); 
					var title = document.createElement('div');
					if (bb.device.isHiRes) {
						title.setAttribute('class', 'bb-hires-screen-title');
						outerElement.setAttribute('style', outerStyle + ';padding-top:33px');
					} else {
						title.setAttribute('class', 'bb-lowres-screen-title');
						outerElement.setAttribute('style', outerStyle + ';padding-top:27px');
					}
					title.innerHTML = outerElement.getAttribute('x-bb-title');
					var firstChild = outerElement.firstChild;
					if (firstChild != undefined && firstChild != null) {
						outerElement.insertBefore(title, firstChild);
					} else {
						outerElement.appendChild(title);
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
	},
		
	roundPanel: {
		apply: function(elements) {
			if (bb.device.isBB5()) {
				// Apply our transforms to all the panels
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
					outerElement.setAttribute('class','bb-round-panel');
					if (outerElement.hasChildNodes()) {
						var innerElements = new Array();
						// Grab the internal contents so that we can add them
						// back to the massaged version of this div
						var innerCount = outerElement.childNodes.length;
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
					var items = outerElement.querySelectorAll('[x-bb-type=panel-header]');
					for (var j = 0; j < items.length; j++) {
						items[j].setAttribute('class','bb-lowres-panel-header');
					}
				}
			}
			else {
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
					outerElement.setAttribute('class','bb-bb7-round-panel');
					var items = outerElement.querySelectorAll('[x-bb-type=panel-header]');
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
	},
	
	/* Object that contains all the logic for a Text Arrow List */
	textArrowList: {
		
		// Apply our transforms to all arrow lists passed in
		apply: function(elements) {
			for (var i = 0; i < elements.length; i++) {
				var outerElement = elements[i];
				outerElement.setAttribute('class','bb-text-arrow-list');
				// Gather our inner items
				var items = outerElement.querySelectorAll('[x-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j];
					innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-text-arrow-list-item-hover')");
					innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-text-arrow-list-item')");
					innerChildNode.setAttribute('x-blackberry-focusable','true');
					var text = innerChildNode.innerHTML;
					
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
	},
	
	/* Object that contains all the logic for inputs of type text */
	textInput: {
		apply: function(elements) {
			if (bb.device.isBB5()) {
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
				}
			} else {
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
					var style = 'bb-bb7-input';
					
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
	
	},
	
	/* Object that contains all the logic for buttons */
	button: {
		
		// Apply our transforms to all arrow lists passed in
		apply: function(elements) {
		
			if (bb.device.isBB5()) {
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
					var caption = outerElement.innerHTML;
					var normal = 'bb5-button';
					var highlight = 'bb5-button-highlight';

					/*if (outerElement.hasAttribute('x-bb-style')) {
						var style = outerElement.getAttribute('x-bb-style');
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
					var outerElement = elements[i];
					var normal = 'bb-bb7-button';
					var highlight = 'bb-bb7-button-highlight';
					
					if (bb.device.isHiRes) {
						normal = normal + ' bb-bb7-button-hires';
						highlight = highlight + ' bb-bb7-button-hires';
					} else {
						normal = normal + ' bb-bb7-button-lowres';
						highlight = highlight + ' bb-bb7-button-lowres';
					}

					if (outerElement.hasAttribute('x-bb-style')) {
						var style = outerElement.getAttribute('x-bb-style');
						if (style == 'stretch') {
							normal = normal + ' button-stretch';
							highlight = highlight + ' button-stretch';
						}
					}
					outerElement.setAttribute('class',normal);
					outerElement.setAttribute('x-blackberry-focusable','true');
					outerElement.setAttribute('onmouseover',"this.setAttribute('class','" + highlight +"')");
					outerElement.setAttribute('onmouseout',"this.setAttribute('class','" + normal + "')");
				}	
			}
		}
	},
	
	labelControlContainers: {
		// Apply our transforms to all label control rows
		apply: function(elements) {
			if (bb.device.isBB5()) {
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
					outerElement.setAttribute('class','bb-label-control-horizontal-row');
					// Gather our inner items
					var items = outerElement.querySelectorAll('[x-bb-type=label]');
					for (var j = 0; j < items.length; j++) {
						var label = items[j];
						label.setAttribute('class', 'bb-label');
					}
				}	
			} else {
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
					
					// Fetch all our rows
					var items = outerElement.querySelectorAll('[x-bb-type=row]');
					if (items.length > 0 ) {
						// Create our containing table
						var table = document.createElement('table');
						table.setAttribute('class','bb-bb7-label-control-rows');
						outerElement.insertBefore(table,items[0]);
						
						for (var j = 0; j < items.length; j++) {
							var row = items[j];
							var tr = document.createElement('tr');
							table.appendChild(tr);
							// Get the label
							var tdLabel = document.createElement('td');
							tr.appendChild(tdLabel);
							var label = row.querySelectorAll('[x-bb-type=label]')[0];
							row.removeChild(label);
							tdLabel.appendChild(label);
							// Get the control
							var tdControl = document.createElement('td');
							tr.appendChild(tdControl);
							var control = row.querySelectorAll('[x-bb-type=button],input')[0];
							row.removeChild(control);
							tdControl.appendChild(control);
							outerElement.removeChild(row);
							if (control.getAttribute('x-bb-type') == 'button') {
								control.style.float = 'right';
							}
						}
					}
				}				
			}
		}
	},
	
	/* Object that contains all the logic for Pill Buttons*/
	pillButtons: {
		// Apply our transforms to all pill buttons passed in
		apply: function(elements) {
			if (bb.device.isBB5()) {
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
					outerElement.setAttribute('class','bb-pill-buttons');

					// Gather our inner items
					var items = outerElement.querySelectorAll('[x-bb-type=pill-button]');
					for (var j = 0; j < items.length; j++) {
						var innerChildNode = items[j];
						innerChildNode.setAttribute('x-blackberry-focusable','true');
						var text = innerChildNode.innerHTML;
						innerChildNode.innerHTML = '<span>' + text + '</span>';
						
						if (j == 0) {
							innerChildNode.setAttribute('class','buttonLeft');
						}
						else if (j == items.length -1) {
							innerChildNode.setAttribute('class','buttonRight');
						}
						else {
							innerChildNode.setAttribute('class','buttonMiddle');
						}
						
						// See if the item is marked as selected
						if (innerChildNode.hasAttribute('x-bb-selected') && innerChildNode.getAttribute('x-bb-selected').toLowerCase() == 'true') {
							bb.pillButtons.selectButton(innerChildNode);
						}
						
						// Change the selected state when a user presses the button
						innerChildNode.onmousedown = function() {
							bb.pillButtons.selectButton(this);
							var buttons = this.parentNode.querySelectorAll('[x-bb-type=pill-button]');
							for (var i = 0; i < buttons.length; i++) {
								var button = buttons[i];
								if (button != this) {
									bb.pillButtons.deSelectButton(button);
								}
							}
						}
					}			
				}	
			} else {
				for (var i = 0; i < elements.length; i++) {
					var outerElement = elements[i];
					
					var containerStyle = 'bb-bb7-pill-buttons';
					var buttonStyle = '';
					
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
					var items = outerElement.querySelectorAll('[x-bb-type=pill-button]');
					var percentWidth = Math.floor(98 / items.length);
					var sidePadding = 102-(percentWidth * items.length);
					outerElement.style['padding-left'] = sidePadding + '%';
					outerElement.style['padding-right'] = sidePadding + '%';
					for (var j = 0; j < items.length; j++) {
						var innerChildNode = items[j];
						innerChildNode.setAttribute('x-blackberry-focusable','true');
						if (j == 0) {  // First button
							innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left '+ buttonStyle);
							innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left " + buttonStyle +"')");
							innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left " + buttonStyle +"')");
						} else if (j == items.length -1) { // Right button
							innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right ' + buttonStyle);
							innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right " + buttonStyle +"')");
							innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right " + buttonStyle +"')");
						} else { // Middle Buttons
							innerChildNode.setAttribute('class','bb-bb7-pill-button ' + buttonStyle);
							innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight " + buttonStyle +"')");
							innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button " + buttonStyle +"')");
						}
						// Set our width
						innerChildNode.style.width = percentWidth + '%';
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
	},
	
	imageList: {
		apply: function(elements) {
			// Apply our transforms to all Dark Image Lists
			for (var i = 0; i < elements.length; i++) {
				var outerElement = elements[i];
				
				if (bb.device.isHiRes) {
					outerElement.setAttribute('class','bb-hires-image-list');
				} else {
					outerElement.setAttribute('class','bb-lowres-image-list');
				}
				// Gather our inner items
				var items = outerElement.querySelectorAll('[x-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j];
					if (innerChildNode.hasAttribute('x-bb-type')) {
						var type = innerChildNode.getAttribute('x-bb-type').toLowerCase();
						var description = innerChildNode.innerHTML;
						
						if (bb.device.isHiRes) {
							innerChildNode.setAttribute('class', 'bb-hires-image-list-item');
							innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-hires-image-list-item-hover')");
							innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-hires-image-list-item')");
							innerChildNode.setAttribute('x-blackberry-focusable','true');
							innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('x-bb-img') +'" />\n'+
											'<div class="details">\n'+
											'	<span class="title">' + innerChildNode.getAttribute('x-bb-title') + '</span>\n'+
											'	<div class="description">' + description + '</div>\n'+
											'</div>\n';
						} else {
							innerChildNode.setAttribute('class', 'bb-lowres-image-list-item');
							innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-lowres-image-list-item-hover')");
							innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-lowres-image-list-item')");
							innerChildNode.setAttribute('x-blackberry-focusable','true');
							innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('x-bb-img') +'" />\n'+
											'<div class="details">\n'+
											'	<span class="title">' + innerChildNode.getAttribute('x-bb-title') + '</span>\n'+
											'	<div class="description">' + description + '</div>\n'+
											'</div>\n';						
						}
						innerChildNode.removeAttribute('x-bb-img');
						innerChildNode.removeAttribute('x-bb-title');						
					}				
				}			
			}	
		}
	},
	
	tallList: {
		// Apply our transforms to all Tall Lists
		apply: function(elements) {
			for (var i = 0; i < elements.length; i++) {
				var outerElement = elements[i];
				outerElement.setAttribute('class','bb-tall-list');
				
				// Gather our inner items
				var items = outerElement.querySelectorAll('[x-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j];
					if (innerChildNode.hasAttribute('x-bb-type')) {
						var type = innerChildNode.getAttribute('x-bb-type').toLowerCase();
						
						if (type == 'item') {
							var description = innerChildNode.innerHTML;
							innerChildNode.setAttribute('class', 'bb-tall-list-item');
							innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-tall-list-item-hover')");
							innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-tall-list-item')");
							innerChildNode.setAttribute('x-blackberry-focusable','true');
							innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('x-bb-img') +'" />\n'+
											'<div class="details">\n'+
											'	<span class="title">' + innerChildNode.getAttribute('x-bb-title') + '</span>\n'+
											'	<span class="description">' + description + '</span>\n'+
											'   <div class="time">' + innerChildNode.getAttribute('x-bb-time')+ '</div>\n'+
											'</div>\n';
											
							innerChildNode.removeAttribute('x-bb-img');
							innerChildNode.removeAttribute('x-bb-title');
							innerChildNode.removeAttribute('x-bb-time');
						
						}
					}				
				}		
			}	
		}
	},
	
	inboxList: {
		// Apply our transforms to all Inbox lists
		apply: function(elements) {
			for (var i = 0; i < elements.length; i++) {
				var outerElement = elements[i];
				outerElement.setAttribute('class','bb-inbox-list');
				// Gather our inner items
				var items = outerElement.querySelectorAll('[x-bb-type=item], [x-bb-type=header]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j];
					if (innerChildNode.hasAttribute('x-bb-type')) {
						var type = innerChildNode.getAttribute('x-bb-type').toLowerCase();
						
						if (type == 'header') {
							var description = innerChildNode.innerHTML;
							innerChildNode.setAttribute('x-blackberry-focusable','true');
							innerChildNode.innerHTML = '<p>'+ description +'</p>';
							if (bb.device.isHiRes) {
								innerChildNode.setAttribute('class', 'bb-hires-inbox-list-header');
								innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-hires-inbox-list-header-hover')");
								innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-hires-inbox-list-header')");
							} else {
								innerChildNode.setAttribute('class', 'bb-lowres-inbox-list-header');
								innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-lowres-inbox-list-header-hover')");
								innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-lowres-inbox-list-header')");
							}
						}
						else if (type == 'item') {
							var description = innerChildNode.innerHTML;
							var title = innerChildNode.getAttribute('x-bb-title');
							if (innerChildNode.hasAttribute('x-bb-accent') && innerChildNode.getAttribute('x-bb-accent').toLowerCase() == 'true') {
								title = '<b>' + title + '</b>';
							}
							innerChildNode.setAttribute('x-blackberry-focusable','true');
							innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('x-bb-img') +'" />\n'+
											'<div class="title">'+ title +'</div>\n'+
											'<div class="time">' + innerChildNode.getAttribute('x-bb-time') + '</div>\n'+
											'<div class="description">' + description + '</div>\n';
							innerChildNode.removeAttribute('x-bb-img');
							innerChildNode.removeAttribute('x-bb-title');	
							
							if (bb.device.isHiRes) {
								innerChildNode.setAttribute('class', 'bb-hires-inbox-list-item');
								innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-hires-inbox-list-item-hover')");
								innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-hires-inbox-list-item')");
							} else {
								innerChildNode.setAttribute('class', 'bb-lowres-inbox-list-item');
								innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-lowres-inbox-list-item-hover')");
								innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-lowres-inbox-list-item')");
							}				
						}
					}				
				}			
			}	
		}
	},
	
	
	bbmBubble: {
		// Apply our transforms to all BBM Bubbles
		apply: function(elements) {
			for (var i = 0; i < elements.length; i++) {
				var outerElement = elements[i];
				
				if (outerElement.hasAttribute('x-bb-style')) {
					var style = outerElement.getAttribute('x-bb-style').toLowerCase();
					if (style == 'left')
						outerElement.setAttribute('class','bb-bbm-bubble-left');
					else
						outerElement.setAttribute('class','bb-bbm-bubble-right');
						
					var innerElements = outerElement.querySelectorAll('[x-bb-type=item]');
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
						var innerChildNode = innerElements[j];
						var description = innerChildNode.innerHTML;
						innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('x-bb-img') +'" />\n' +
								'<div class="details">'+ description +'</div>\n';
						insidePanel.appendChild(innerChildNode); 
					}
					
				}
			}	
		}
		
	},
	
}


//addEventListener("DOMContentLoaded", bb.assignHandlers, false)

setTimeout("bb.assignHandlers()", 200);




