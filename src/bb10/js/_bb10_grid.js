_bb10_grid = {  
    apply: function(elements) {
		var solidHeader = false,
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
				
			outerElement.setAttribute('class','bb-grid');	
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
						title.normal = 'bb-grid-header';
						title.innerHTML = '<p>'+ innerChildNode.getAttribute('data-bb-title') +'</p>';
						
						// Style our header for appearance
						if (solidHeader) {
							title.normal = title.normal +' bb10Accent';
							title.style.color = 'white';
							title.style['border-bottom-color'] = 'transparent';
						} else {
							title.normal = title.normal + ' bb-grid-header-normal-'+bb.screen.listColor;
							title.style['border-bottom-color'] = bb.options.shades.darkOutline;
						}
						
						// Style our header for text justification
						if (headerJustify == 'left') {
							title.normal = title.normal + ' bb-grid-header-left';
						} else if (headerJustify == 'right') {
							title.normal = title.normal + ' bb-grid-header-right';
						} else {
							title.normal = title.normal + ' bb-grid-header-center';
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
							rowItems = innerChildNode.querySelectorAll('[data-bb-type=item]'),
							json;
						
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
									overlay.setAttribute('class','bb-grid-item-overlay bb-grid-item-overlay-two-rows');
									overlay.innerHTML = '<div><p class="title title-two-rows">' + title + '<br/>' + subtitle +'</p></div>';	
								} else if (title){
									overlay.setAttribute('class','bb-grid-item-overlay bb-grid-item-overlay-one-row');
									overlay.innerHTML = '<div><p class="title title-one-row">' + title + '</p></div>';
								} else if (subtitle) {
									overlay.setAttribute('class','bb-grid-item-overlay bb-grid-item-overlay-one-row');
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
							
							// See if a context menu needs to be assigned
							if (itemNode.contextMenu) {
								itemNode.guid = 'bbui'+bb.guidGenerator();
								itemNode.setAttribute('data-bb-context-menu-id', itemNode.guid);
								json = new Object();
								json.id = itemNode.guid;
								json.type = 'bbui-context';
								json.header = itemNode.title;
								json.subheader = itemNode.description;
								itemNode.setAttribute('data-webworks-context', JSON.stringify(json));
							}	
							
							itemNode.ontouchstart = function() {
														if (this.overlay) {
															this.overlay.style['opacity'] = '1.0';
							                                this.overlay.style['background-color'] = bb.options.highlightColor;
														}
														itemNode.fingerDown = true;
														itemNode.contextShown = false;
														if (itemNode.contextMenu && (bb.device.isPlayBook || bb.device.isRipple)) {
															window.setTimeout(this.touchTimer, 667);
															var scr = bb.getCurScreen();
															itemNode.touchstartx = scr.bbUIscrollWrapper.scrollTop;
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
														if (bb.device.isPlayBook || bb.device.isRipple) {
															var scr = bb.getCurScreen();
															var curx = scr.bbUIscrollWrapper.scrollTop;
															if (itemNode.fingerDown && Math.abs(itemNode.touchstartx - curx) < 50) {
																itemNode.contextShown = true;
																itemNode.contextMenu.peek({title:this.title,description:this.description, selected: this});
															}
														}
													};
							itemNode.touchTimer = itemNode.touchTimer.bind(itemNode);
							
							// Draw the selected state based on the BB10 context menu
							itemNode.drawSelected = function() {
														if (this.overlay) {
															this.overlay.style['opacity'] = '1.0';
							                                this.overlay.style['background-color'] = bb.options.highlightColor;
														}
													};
							itemNode.drawSelected = itemNode.drawSelected.bind(itemNode);
							
							// Draw the Unselected state based on the BB10 context menu
							itemNode.drawUnselected = function() {
														if (this.overlay) {
															this.overlay.style['opacity'] = '';
							                                this.overlay.style['background-color'] = '';
														}
													};
							itemNode.drawUnselected = itemNode.drawUnselected.bind(itemNode);
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