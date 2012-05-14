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
				// See if it is square or landscape layout
				outerElement.isSquare = (outerElement.hasAttribute('data-bb-style') && outerElement.getAttribute('data-bb-style').toLowerCase() == 'square');
				
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
								if (outerElement.isSquare) {
									height = width;
								} else {
									height = Math.ceil(width*0.5625);
								}
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
												if (outerElement.isSquare) {
													height = width;
												} else {
													height = Math.ceil(width*0.5625);
												}
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