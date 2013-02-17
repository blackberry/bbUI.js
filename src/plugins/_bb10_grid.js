_bb10_grid = {  
    apply: function(elements) {
		var res = '1280x768-1280x720',
			solidHeader = false,
			headerJustify;
		
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			res = '1024x600';
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			res = '1280x768-1280x720';
		}
				
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

					// If the inner item is a group
					if (type == 'group') {
						/**
						 * Gets the title text of the group
						 * 
						 * @return {string or false} the title text or false if 
						 * no title is set
						 */
						innerChildNode.getTitle = function() {
							if (this.hasAttribute('data-bb-title')) {
								return this.getAttribute('data-bb-title');
							} else {
								return false;
							}
						};
						innerChildNode.getTitle = innerChildNode.getTitle.bind(innerChildNode);

						/**
						 * Removes the title of the group
						 */
						innerChildNode.removeTitle = function() {
							if (this.getTitle()) {
								// Remove the title attribute of the group
								this.removeAttribute('data-bb-title');
								// Remove the title element which is the first 
								// child node of the group
								this.removeChild(this.firstChild);
							} 
						}
						innerChildNode.removeTitle = innerChildNode.removeTitle.bind(innerChildNode);

						/**
						 * Sets the title of the group
						 * 
						 * @param {string} titleText the title text, if it is 
						 * null or empty, the title will be removed from the group
						 */
						innerChildNode.setTitle = function(titleText) {
							// Remove the title if title text is null or empty
							if (!titleText || titleText === '') {
								this.removeTitle();
							} 
							// Set the title otherwise
							else {
								// Add the title attribute
								this.setAttribute('data-bb-title', titleText);

								// Create a new title element
								title = document.createElement('div');
								title.normal = 'bb-bb10-grid-header-'+res;
								title.innerHTML = '<p>'+ titleText +'</p>';
								
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
								
								// Insert the newly created title as the first child
								if (this.firstChild) {
									this.insertBefore(title, this.firstChild);
								} else {
									this.appendChild(title);
								}
							}
						}
						innerChildNode.setTitle = innerChildNode.setTitle.bind(innerChildNode);

						/**
						 * Removes all the rows from the group
						 */
						innerChildNode.clear = function() {
							if (this.hasChildNodes()) {
								var childNodes = this.childNodes;
								for (var i = 0; i < childNodes.length; i++) {
									// Check if the child node element has the hasAttribute() method
									// <text> is also a child node and it does not have this method
									if (childNodes[i].hasAttribute) {
										// Check if the child node is a row element
										var isRow = (childNodes[i].hasAttribute('data-bb-type') 
											&& childNodes[i].getAttribute('data-bb-type')=='row') ? true : false;
										// Remove the child node if so
										if (isRow) {
											this.removeChild(childNodes[i]);
										}
									}
								}
							}
						}
						innerChildNode.clear = innerChildNode.clear.bind(innerChildNode);

						/**
						 * Removes the group itself from the grid
						 */
						innerChildNode.remove = function() {
							if (this.parentNode) {
								var grid = this.parentNode;
								grid.removeChild(this);
							}
						}
						innerChildNode.remove = innerChildNode.remove.bind(innerChildNode);

						/**
						 * Gets the last child DOM node element of the group
						 * 
						 * @return {DOM node element} the last child DOM
						 * node element of the group
						 */
						innerChildNode.getLastDomChild = function() {
							if (!this.lastChild) return false;
							var lastChild = this.lastChild;
							while (lastChild.nodeType != 1) {
								lastChild = lastChild.previousSibling;
							}
							return lastChild;
						}
						innerChildNode.getLastDomChild = innerChildNode.getLastDomChild.bind(innerChildNode);

						/**
						 * Appends a row DOM element to the end of the group
						 * 
						 * @param  {DOM node element} row a row DOM element
						 */
						innerChildNode.appendRow = function(row) {
							if (!row) return false;
							// Check if the input is actually a row DOM element
							var isRow = (row.hasAttribute && row.hasAttribute('data-bb-type') 
								&& row.getAttribute('data-bb-type') == 'row') ? true : false;
							if (!isRow) return false;
							// Add the row after the last child DOM element
							if (this.getLastDomChild()) {
								var lastDomChild = this.getLastDomChild();
								this.insertBefore(row, lastDomChild);
							} else {
								this.appendChild(row);
							}
						}
						innerChildNode.appendRow = innerChildNode.appendRow.bind(innerChildNode);
					}
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
							columnCount = 0,
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
							hardCodedColumnNum = -1, // none specified
							rowItems = innerChildNode.querySelectorAll('[data-bb-type=item]');
						
						numItems = rowItems.length;
						if (numItems == 0) continue;
						
						// See if they specified the number of items per column
						if (innerChildNode.hasAttribute('data-bb-columns')) {
							hardCodedColumnNum = innerChildNode.getAttribute('data-bb-columns');
						}
						
						table = document.createElement('table');
						table.style.width = '100%';
						innerChildNode.appendChild(table);
						tr = document.createElement('tr');
						table.appendChild(tr);

						// Calculate the width
						if (hardCodedColumnNum > 0) {
							// If there are more items than the number of hardcoded columns then
							// we need to shrink the item size a bit to show that there are available
							// items to the left to scroll to
							if ((rowItems.length > hardCodedColumnNum) && !bb.device.isPlayBook) {
								innerChildNode.style['overflow-y'] = 'hidden';
								innerChildNode.style['overflow-x'] = 'scroll';
								width = (window.innerWidth/(parseInt(hardCodedColumnNum) + 0.5));
							} else {
								width = (window.innerWidth/hardCodedColumnNum) - 6;
							}
						} else {
							width = (window.innerWidth/numItems) - 6;
						}
							
						for (k = 0; k < numItems; k++) {
							itemNode = rowItems[k];
							
							// If it is PlayBook, Don't do the carousel, it doesn't work well
							if (bb.device.isPlayBook && (hardCodedColumnNum >0) && (k > hardCodedColumnNum - 1)) {
								itemNode.style.display = 'none';
								continue;
							}
														
							subtitle = itemNode.innerHTML;
							title = itemNode.getAttribute('data-bb-title');
							hasOverlay = (subtitle || title);
							itemNode.innerHTML = '';
							// Add our cell to the table
							td = document.createElement('td');
							tr.appendChild(td);
							td.appendChild(itemNode);
							columnCount++;
							
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
							image.style.height = height + 'px';
							image.style.width = width + 'px';
							image.style.opacity = '0';
							image.style['-webkit-transition'] = 'opacity 0.5s linear';
							image.style['-webkit-backface-visibility'] = 'hidden';
							image.style['-webkit-perspective'] = 1000;
							image.style['-webkit-transform'] = 'translate3d(0,0,0)';
							image.itemNode = itemNode;
							itemNode.image = image;
							itemNode.appendChild(image);
							
							// Load our image once onbbuidomready 
							itemNode.onbbuidomready = function() {
										if (bb.isScrolledIntoView(this)) {
											// Animate its visibility once loaded
											this.image.onload = function() {
												this.style.opacity = '1.0';
											}
											this.image.src = this.getAttribute('data-bb-img');
										} else {
											document.addEventListener('bbuiscrolling', this.onbbuiscrolling,false);
											// Add listener for removal on popScreen
											this.listener = {name: 'bbuiscrolling', eventHandler: this.onbbuiscrolling};
											bb.documentListeners.push(this.listener);
										}
										document.removeEventListener('bbuidomready', this.onbbuidomready,false);
									};
							itemNode.onbbuidomready = itemNode.onbbuidomready.bind(itemNode);
							document.addEventListener('bbuidomready', itemNode.onbbuidomready,false);
							
							// Only have the image appear when it scrolls into view
							itemNode.onbbuiscrolling = function() {
										if (bb.isScrolledIntoView(this)) {
											// Animate its visibility once loaded
											this.image.onload = function() {
												this.style.opacity = '1.0';
											}
											this.image.src = this.getAttribute('data-bb-img');
											document.removeEventListener('bbuiscrolling', this.onbbuiscrolling,false);
											// Remove our listenter from the global list as well
											var index = bb.documentListeners.indexOf(this.listener);
											if (index >= 0) {
												bb.documentListeners.splice(index,1);
											}
										} 
									};
							itemNode.onbbuiscrolling = itemNode.onbbuiscrolling.bind(itemNode);	
							
							// Create our translucent overlay
							if (hasOverlay) {
								overlay = document.createElement('div');
								if (title && subtitle) {
									overlay.setAttribute('class','bb-bb10-grid-item-overlay-'+res+ ' bb-bb10-grid-item-overlay-two-rows-'+res);
									overlay.innerHTML = '<div><p class="title title-two-rows">' + title + '<br/>' + subtitle +'</p></div>';	
								} else if (title){
									overlay.setAttribute('class','bb-bb10-grid-item-overlay-'+res+ ' bb-bb10-grid-item-overlay-one-row-'+res);
									overlay.innerHTML = '<div><p class="title title-one-row">' + title + '</p></div>';
								} else if (subtitle) {
									overlay.setAttribute('class','bb-bb10-grid-item-overlay-'+res+ ' bb-bb10-grid-item-overlay-one-row-'+res);
									overlay.innerHTML = '<div><p class="title title-one-row">' + subtitle + '</p></div>';
								}
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
															this.overlay.style['opacity'] = '1.0';
							                                this.overlay.style['background-color'] = bb.options.highlightColor;
														}
														itemNode.fingerDown = true;
														itemNode.contextShown = false;
														if (itemNode.contextMenu) {
															window.setTimeout(this.touchTimer, 667);
														}
													};
							itemNode.ontouchend = function() {
														if (this.overlay) {
															this.overlay.style['opacity'] = '';
							                                this.overlay.style['background-color'] = '';
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
						
						// if there were hardcoded columns and not enough items to fit those columns, add the extra columns
						if ((hardCodedColumnNum > 0) && (columnCount < hardCodedColumnNum)) {
							var diff = hardCodedColumnNum - columnCount;
							innerChildNode.extraColumns = [];
							for (k = 0; k < diff; k++) {
								td = document.createElement('td');
								tr.appendChild(td);
								td.style.width = width + 'px';
								innerChildNode.extraColumns.push(td);
							}
						}
					}
				}
			}
			
			// Make sure we move when the orientation of the device changes
			outerElement.orientationChanged = function(event) {
									var items = this.querySelectorAll('[data-bb-type=row]'),
										i,j,
										rowItems,
										row,
										numItems,
										itemNode,
										width,
										height;
				
									for (i = 0; i < items.length; i++) {
										var hardCodedColumnNum = -1;
										row = items[i];
										rowItems = row.querySelectorAll('[data-bb-type=item]');
										numItems = rowItems.length;
										
										// See if they specified the number of items per column
										if (row.hasAttribute('data-bb-columns')) {
											hardCodedColumnNum = row.getAttribute('data-bb-columns');
										}

										// Calculate the width
										if (hardCodedColumnNum > 0) {
											// If there are more items than the number of hardcoded columns then
											// we need to shrink the item size a bit to show that there are available
											// items to the left to scroll to
											if ((rowItems.length > hardCodedColumnNum) && !bb.device.isPlayBook) {
												width = (window.innerWidth/(parseInt(hardCodedColumnNum) + 0.5));
											} else {
												width = (window.innerWidth/hardCodedColumnNum) - 6;
											}
										} else {
											width = (window.innerWidth/numItems) - 6;
										}
										
										// Adjust all the items
										for (j = 0; j < numItems; j++ ) {
											itemNode = rowItems[j];
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
										
										// Adjust the extra columns if there was hard coded columns that were not filled
										if (row.extraColumns) {
											for (j = 0; j < row.extraColumns.length;j++) {
												row.extraColumns[j].style.width = width + 'px';
											}
										}
									}
								};
			outerElement.orientationChanged = outerElement.orientationChanged.bind(outerElement);	
			window.addEventListener('resize', outerElement.orientationChanged,false); 
			// Add listener for removal on popScreen
			bb.windowListeners.push({name: 'resize', eventHandler: outerElement.orientationChanged});
			
			// Add show function
			outerElement.show = function() {
				this.style.display = 'block';
				bb.refresh();
				};
			outerElement.show = outerElement.show.bind(outerElement);

			// Add hide function
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
		}		
    }
};