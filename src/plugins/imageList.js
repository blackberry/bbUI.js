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
							if (description.length == 0) {
								description = '&nbsp;';
							}
							descriptionDiv.innerHTML = description;
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
														this.setAttribute('class',this.normal);
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
									this.innerChildNode.parentNode.removeChild(this.innerChildNode);
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
						if (bb.scroller) {
							bb.scroller.refresh();
						}
					};
				outerElement.appendItem = outerElement.appendItem.bind(outerElement);
				
				// Gather our inner items and style them
				items = outerElement.querySelectorAll('[data-bb-type=item], [data-bb-type=header]');
				for (j = 0; j < items.length; j++) {
					outerElement.styleItem(items[j]);
				}
			}		
		}
		else {
			// Apply our transforms to all Image Lists
			for (var i = 0; i < elements.length; i++) {
				var inEvent, 
					outEvent, 
					outerElement = elements[i],
					imagePlaceholder,
					headerJustify,
					hideImages = outerElement.hasAttribute('data-bb-images') ? (outerElement.getAttribute('data-bb-images').toLowerCase() == 'none') : false;
					
				if (!hideImages) {
					imagePlaceholder = outerElement.hasAttribute('data-bb-image-placeholder') ? outerElement.getAttribute('data-bb-image-placeholder') : undefined;
				}
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
				
				// Get our header justification
				headerJustify = outerElement.hasAttribute('data-bb-header-justify') ? outerElement.getAttribute('data-bb-header-justify').toLowerCase() : 'center';
				
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item], [data-bb-type=header]'),
					innerChildNode,
					type,
					j,
					description,
					accentText,
					normal,
					highlight,
					details,
					titleDiv,
					descriptionDiv,
					accentDiv,
					img,
					res = (bb.device.isHiRes) ? 'hires' : 'lowres';
					
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
							if (headerJustify == 'left') {
								normal = normal + ' bb-'+res+'-image-list-header-left';
								highlight = highlight + ' bb-'+res+'-image-list-header-left';
							} else if (headerJustify == 'right') {
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
							innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-"+res+"-image-list-item-hover')");
							innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-"+res+"-image-list-item')");
							innerChildNode.setAttribute('x-blackberry-focusable','true');
							
							if (!hideImages) {
								img = document.createElement('img');
								if (imagePlaceholder) {
									img.placeholder = imagePlaceholder;
									img.src = innerChildNode.hasAttribute('data-bb-img') ? innerChildNode.getAttribute('data-bb-img') : imagePlaceholder;
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
							if (hideImages) {
								details.setAttribute('class','bb-'+res+'-image-list-details bb-'+res+'-image-list-noimage');
							} else {
								details.setAttribute('class','bb-'+res+'-image-list-details');
							}
							
							titleDiv = document.createElement('div');
							titleDiv.innerHTML = innerChildNode.getAttribute('data-bb-title');
							titleDiv.className = 'title';
							details.appendChild(titleDiv);
							accentDiv = document.createElement('div');
							accentDiv.innerHTML = accentText;
							accentDiv.className = 'accent-text';
							details.appendChild(accentDiv);
							descriptionDiv = document.createElement('div');
							descriptionDiv.innerHTML = description;
							descriptionDiv.className = 'description';
							details.appendChild(descriptionDiv);
							
							innerChildNode.removeAttribute('data-bb-img');
							innerChildNode.removeAttribute('data-bb-title');
						}
					}
				}
			}
		}
    }
};