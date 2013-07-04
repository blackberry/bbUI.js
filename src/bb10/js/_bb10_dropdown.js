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
