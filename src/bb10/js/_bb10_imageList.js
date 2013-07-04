_bb10_imageList = {  
    apply: function(elements) {
		var i,j,
			outerElement,
			items;

		// Apply our transforms to all Image Lists
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			outerElement.items = [];
			outerElement.setAttribute('class','bb-image-list');
			outerElement.hideImages = outerElement.hasAttribute('data-bb-images') ? (outerElement.getAttribute('data-bb-images').toLowerCase() == 'none') : false;
			if (!outerElement.hideImages) {
				outerElement.imagePlaceholder = outerElement.hasAttribute('data-bb-image-placeholder') ? outerElement.getAttribute('data-bb-image-placeholder') : undefined;
				outerElement.imageLoading = outerElement.hasAttribute('data-bb-image-loading') ? outerElement.getAttribute('data-bb-image-loading') : undefined;
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
						btnInner,
						json;
					
					innerChildNode.btn = undefined;

					if (type == 'header') {
						// Set our normal and highlight styling
						normal = 'bb-image-list-header';
						if (this.solidHeader) {
							normal = normal +' bb10Accent';
							innerChildNode.style.color = 'white';
							innerChildNode.style['border-bottom-color'] = 'transparent';
						} else {
							normal = normal + ' bb-image-list-header-normal-'+bb.screen.listColor;
							innerChildNode.style['border-bottom-color'] = bb.options.shades.darkOutline;
						}
						
						// Check for alignment
						if (this.headerJustify == 'left') {
							normal = normal + ' bb-image-list-header-left';
						} else if (this.headerJustify == 'right') {
							normal = normal + ' bb-image-list-header-right';
						} else {
							normal = normal + ' bb-image-list-header-center';
						}
						
						// Set our styling
						innerChildNode.normal = normal;
						innerChildNode.innerHTML = '<p>'+ description +'</p>';
						innerChildNode.setAttribute('class', normal);
					}
					else if (type == 'item') {
						normal = 'bb-image-list-item bb-image-list-item-' + bb.screen.listColor;
						highlight = normal + ' bb-image-list-item-hover bb10Highlight';
						innerChildNode.normal = normal;
						innerChildNode.highlight = highlight;
						innerChildNode.setAttribute('class', normal);
						innerChildNode.innerHTML = '';
						img = undefined;
			
						// Create the details container
						details = document.createElement('div');
						details.innerChildNode = innerChildNode;
						innerChildNode.details = details;
						innerChildNode.appendChild(details);
						detailsClass = 'bb-image-list-item-details';
						if (this.hideImages) {
							detailsClass = detailsClass + ' bb-image-list-item-noimage';
						} else {
							img = new Image();
							innerChildNode.img = img;
							if (this.imagePlaceholder) {
								img.placeholder = this.imagePlaceholder;
								img.path = innerChildNode.hasAttribute('data-bb-img') ? innerChildNode.getAttribute('data-bb-img') : this.imagePlaceholder;
							} else {
								img.path = innerChildNode.getAttribute('data-bb-img');
							}
							// Handle our loaded image
							innerChildNode.onimageload = function() {
									this.details.style['background-image'] = 'url("'+this.img.src+'")';
									innerChildNode.details.style['background-size'] = '';
									// Unassign this image so that it is removed from memory and replace it with its path
									this.img = this.img.src;
								};
							innerChildNode.onimageload = innerChildNode.onimageload.bind(innerChildNode);
							img.onload = innerChildNode.onimageload;
							
							if (this.imagePlaceholder) {
								// Handle our error state
								innerChildNode.onimageerror = function() {
									if (this.img.src == this.img.placeholder) return;
									this.img.src = this.img.placeholder;
								};
								innerChildNode.onimageerror = innerChildNode.onimageerror.bind(innerChildNode);
								img.onerror = innerChildNode.onimageerror;
							}
							// Add our loading image
							if (this.imageLoading) {
								innerChildNode.details.style['background-image'] = 'url("'+this.imageLoading+'")';
								// Hack to adjust background sizes for re-paint issues in webkit
								if (bb.device.is1024x600) {
									innerChildNode.details.style['background-size'] = '64px 65px';
								} else if (bb.device.is1280x768 || bb.device.is1280x720) {
									innerChildNode.details.style['background-size'] = '109px 110px';
								} else if (bb.device.is720x720) {
									innerChildNode.details.style['background-size'] = '92px 93px';
								}else {
									innerChildNode.details.style['background-size'] = '109px 110px';
								}
							}
							img.src = img.path;
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
						descriptionDiv.setAttribute('class','description bb-image-list-description-'+bb.screen.listColor);
						details.description = descriptionDiv;
						details.appendChild(descriptionDiv);
						
						// Add our highlight overlay
						overlay = document.createElement('div');
						overlay.setAttribute('class','bb-image-list-item-overlay');
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
							btnBorder.normal = 'bb-image-list-item-button-border bb-image-list-item-button-'+ bb.screen.listColor;
							btnBorder.setAttribute('class',btnBorder.normal);
							btn.btnBorder = btnBorder;
							btn.appendChild(btnBorder);
							// Create the inner button that has the image
							btnInner = document.createElement('div');
							btnInner.normal = 'bb-image-list-item-button-inner';
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
												if (!this.onbtnclick) return;
												this.btnInner.setAttribute('class',this.btnInner.highlight);
												this.btnBorder.style.background = '-webkit-gradient(linear, center top, center bottom, from(rgb(' + (bb.options.shades.R + 32) +',' + (bb.options.shades.G + 32) + ','+ (bb.options.shades.B + 32) +')), to('+bb.options.highlightColor+'))';
											};
											
								btn.ontouchend = function() {
												if (!this.onbtnclick) return;
												this.btnBorder.style.background = '';
												this.btnInner.setAttribute('class',this.btnInner.normal);
											};
								
								// Assign our click handler if one was available
								btn.onclick = function(e) {
												e.stopPropagation();
												if (this.onbtnclick) {
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
								accentText.setAttribute('class','accent-text bb-image-list-accent-text-'+bb.screen.listColor);
								accentText.innerHTML = innerChildNode.getAttribute('data-bb-accent-text');
								details.appendChild(accentText);
								details.accentText = accentText;
							}
						}
						
						// Adjust the description 
						if (description.length == 0) {
							description = '&nbsp;';
							descriptionDiv.style.visibilty = 'hidden';
							detailsClass = detailsClass + ' bb-image-list-item-details-nodescription';
							
							// Adjust margins
							if (bb.device.is1024x600) {
								title.style['margin-top'] = '16px';
								title.style['padding-top'] = '28px';
								overlay.style['margin-top'] = '-94px';
								if (innerChildNode.btn) {
									innerChildNode.btn.style['margin-top'] = '-59px';
								}
							} else if (bb.device.is1280x768 || bb.device.is1280x720) {
								title.style['margin-top'] = '-7px';
								title.style['padding-top'] = '20px';
								overlay.style['margin-top'] = '-140px';
								if (innerChildNode.btn) {
									innerChildNode.btn.style['margin-top'] = '-102px';
								}
							} else if (bb.device.is720x720) {
								title.style['margin-top'] = '-14px';
								title.style['padding-top'] = '20px';
								overlay.style['margin-top'] = '-133px';
								if (innerChildNode.btn) {
									innerChildNode.btn.style['margin-top'] = '-89px';
								}
							}else {
								title.style['margin-top'] = '-7px';
								title.style['padding-top'] = '20px';
								overlay.style['margin-top'] = '-121px';
								if (innerChildNode.btn) {
									innerChildNode.btn.style['margin-top'] = '-102px';
								}
							}
							// Adjust accent text
							if (accentText) {
								if (bb.device.is1024x600) {
									accentText.style['margin-top'] = '-52px';
								} else if (bb.device.is1280x768 || bb.device.is1280x720) {
									accentText.style['margin-top'] = '-82px';
								} else if (bb.device.is720x720) {
									accentText.style['margin-top'] = '-75px';
								} else {
									accentText.style['margin-top'] = '-82px';
								}
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
														if (bb.device.isPlayBook) {
															if (!innerChildNode.trappedClick && !this.contextMenu) return;
															innerChildNode.fingerDown = true;
															innerChildNode.contextShown = false;
															this.overlay.style['visibility'] = 'visible';
															if (innerChildNode.contextMenu) {
																window.setTimeout(this.touchTimer, 667);
																var scr = bb.getCurScreen();
																innerChildNode.touchstartx = scr.bbUIscrollWrapper.scrollTop;
															}
														}
													};
						innerChildNode.ontouchend = function (event) {
														if (bb.device.isPlayBook) {
															if (!innerChildNode.trappedClick && !this.contextMenu) return;
															this.overlay.style['visibility'] = 'hidden';
															innerChildNode.fingerDown = false;
															if (innerChildNode.contextShown) {
																event.preventDefault();
																event.stopPropagation();
															}
														}
													};
						innerChildNode.touchTimer = function() {
														if (bb.device.isPlayBook) {
															var scr = bb.getCurScreen();
															var curx = scr.bbUIscrollWrapper.scrollTop;
															if (innerChildNode.fingerDown && Math.abs(innerChildNode.touchstartx - curx) < 50) {
																innerChildNode.contextShown = true;
																this.drawSelected();
																innerChildNode.contextMenu.hideEvents.push(this.finishHighlight);
																innerChildNode.contextMenu.peek({title:this.title,description:this.description, selected: this});
															}
														}
													};
						innerChildNode.touchTimer = innerChildNode.touchTimer.bind(innerChildNode);
						// Draw the selected state for the context menu
						innerChildNode.drawSelected = function() {
														this.setAttribute('class',this.highlight);
														this.overlay.style['visibility'] = 'visible';
														this.overlay.style['border-color'] =  bb.options.shades.darkOutline;
													};
						innerChildNode.drawSelected = innerChildNode.drawSelected.bind(innerChildNode);
						// Draw the unselected state for the context menu
						innerChildNode.drawUnselected = function() {
														this.setAttribute('class',this.normal);
														this.overlay.style['visibility'] = 'hidden';
														this.overlay.style['border-color'] =  'transparent';
													};
						innerChildNode.drawUnselected = innerChildNode.drawUnselected.bind(innerChildNode);
						
						// See if a context menu needs to be assigned
						if (this.contextMenu) {
							innerChildNode.guid = 'bbui'+bb.guidGenerator();
							innerChildNode.setAttribute('data-bb-context-menu-id', innerChildNode.guid);
							json = new Object();
							json.id = innerChildNode.guid;
							json.type = 'bbui-context';
							json.header = innerChildNode.title;
							if (innerChildNode.description && (innerChildNode.description != '&nbsp;')) {
								json.subheader = innerChildNode.description;
							}
							innerChildNode.setAttribute('data-webworks-context', JSON.stringify(json));
						}	
						
						// Add our subscription for click events to change highlighting on click
						innerChildNode.trappedClick = innerChildNode.onclick;
						innerChildNode.onclick = undefined;
						innerChildNode.outerElement = this;
						innerChildNode.addEventListener('click',function (e) {
								if (!innerChildNode.trappedClick) return;
								this.outerElement.selected = this;
								if (this.trappedClick) {
									setTimeout(this.trappedClick, 0);
								}
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
								return this.img;
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
					// Fire our list event
					var evt = document.createEvent('Events');
					evt.initEvent('bbuilistready', true, true);
					document.dispatchEvent(evt);
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
			outerElement.appendItem = outerElement.appendItem.bind(outerElement);
			
			// This is a hack function to do with a 10.0 repaint issue for divs in an overflow with touch scroll
			outerElement.resetPadding = function() {
					this.style['padding-right'] = '0px';
					this.timeout = null;
				};
			outerElement.resetPadding = outerElement.resetPadding.bind(outerElement);
			
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

					// Fire our list event
					var evt = document.createEvent('Events');
					evt.initEvent('bbuilistready', true, true);
					document.dispatchEvent(evt);
					
					/* This is a major hack to fix an issue in webkit where it doesn't always
					   understand when to re-paint the screen when scrolling a <div> with overflow
					   and using the inertial scrolling for 10.0*/
					if (bb.device.requiresScrollingHack) {
						if (this.timeout) {
							clearTimeout(this.timeout);
						} else {
							this.style['padding-right'] = '1px';
						}			
						// Set our new timeout for resetting
						this.timeout = setTimeout(this.resetPadding,20);
					}
					/* ********** END OF THE SCROLLING HACK ************/
				};
			outerElement.refresh = outerElement.refresh.bind(outerElement);
			
			// Insert an item before another item in the list
			outerElement.insertItemBefore = function(newItem, existingItem) {
					this.styleItem(newItem);
					this.insertBefore(newItem,existingItem);
					this.items.splice(this.items.indexOf(existingItem),0,newItem);
					// Fire our list event
					var evt = document.createEvent('Events');
					evt.initEvent('bbuilistready', true, true);
					document.dispatchEvent(evt);
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