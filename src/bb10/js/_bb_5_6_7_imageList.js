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