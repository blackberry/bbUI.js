_bb10_dropdown = { 
    // Apply our transforms to all dropdowns passed in
    apply: function(elements) {
		var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			options,
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
				item.selectedStyle = 'bb-bb10-dropdown-item-'+res+' bb-bb10-dropdown-item-'+bb.screen.controlColor+' bb-bb10-dropdown-item-selected-'+ bb.screen.controlColor;
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
					item.setAttribute('class',item.selectedStyle);
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
					item.setAttribute('class',item.selectedStyle);
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
    }
};