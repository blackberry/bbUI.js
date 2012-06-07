bb.imageList = {  
    apply: function(elements) {
		if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				i,j,
				outerElement,
				innerChildNode,
				normal,
				highlight,
				contextMenu,
				items,
				hideImages,
				imageEffect,
				imagePlaceholder,
				solidHeader = false,
				headerJustify;
		
			// Apply our transforms to all Image Lists
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.setAttribute('class','bb-bb10-image-list');
				hideImages = outerElement.hasAttribute('data-bb-images') ? (outerElement.getAttribute('data-bb-images').toLowerCase() == 'none') : false;
				if (!hideImages) {
					imageEffect = outerElement.hasAttribute('data-bb-image-effect') ? outerElement.getAttribute('data-bb-image-effect').toLowerCase() : undefined;
					imagePlaceholder = outerElement.hasAttribute('data-bb-image-placeholder') ? outerElement.getAttribute('data-bb-image-placeholder') : undefined;
				}
				
				// Get our header style
				solidHeader = outerElement.hasAttribute('data-bb-header-style') ? (outerElement.getAttribute('data-bb-header-style').toLowerCase() == 'solid') : false;
				// Get our header justification
				headerJustify = outerElement.hasAttribute('data-bb-header-justify') ? outerElement.getAttribute('data-bb-header-justify').toLowerCase() : 'center';
				
				// Assign our context menu if there is one
				if (outerElement.hasAttribute('data-bb-context') && outerElement.getAttribute('data-bb-context').toLowerCase() == 'true') {
					contextMenu = bb.screen.contextMenu;
				}
				// Gather our inner items
				items = outerElement.querySelectorAll('[data-bb-type=item], [data-bb-type=header]');
				for (j = 0; j < items.length; j++) {
					innerChildNode = items[j];
					if (innerChildNode.hasAttribute('data-bb-type')) {
						// Figure out the type of item
						var type = innerChildNode.getAttribute('data-bb-type').toLowerCase(),
							description = innerChildNode.innerHTML,
							title,
							overlay,
							accentText,
							img,
							details,
							descriptionDiv;
						
						if (type == 'header') {
							// Set our normal and highlight styling
							normal = 'bb-bb10-image-list-header bb-bb10-image-list-header-'+res;
							if (solidHeader) {
								normal = normal +' bb10Accent';
								innerChildNode.style.color = 'white';
								innerChildNode.style['border-bottom-color'] = 'transparent';
							} else {
								normal = normal + ' bb-bb10-image-list-header-normal-'+bb.screen.listColor;
								innerChildNode.style['border-bottom-color'] = bb.options.shades.darkOutline;
							}
							
							// Check for alignment
							if (headerJustify == 'left') {
								normal = normal + ' bb-bb10-image-list-header-left-'+res;
							} else if (headerJustify == 'right') {
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
							if (!hideImages) {
								img = document.createElement('img');
								if (imagePlaceholder) {
									img.placeholder = imagePlaceholder;
									img.src = innerChildNode.hasAttribute('data-bb-img') ? innerChildNode.getAttribute('data-bb-img') : imagePlaceholder;
								} else {
									img.setAttribute('src',innerChildNode.getAttribute('data-bb-img'));
								}
								innerChildNode.appendChild(img);
								
								if (imageEffect) {
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
								if (imagePlaceholder) {
									img.onerror = function() {
													if (this.src == this.placeholder) return;
													this.src = this.placeholder;
													if (imageEffect) {
														this.show();
													}
												};
								}
							}
							// Create the details container
							details = document.createElement('div');
							if (hideImages) {
								details.setAttribute('class','bb-bb10-image-list-item-details-'+res+' bb-bb10-image-list-item-noimage-'+res);
							} else {
								details.setAttribute('class','bb-bb10-image-list-item-details-'+res);
							}
							innerChildNode.appendChild(details);
							// Create our title
							title = document.createElement('div');
							title.setAttribute('class','title');
							title.innerHTML = innerChildNode.getAttribute('data-bb-title');
							if (title.innerHTML.length == 0) {
								title.innerHTML = '&nbsp;';
							}
							details.appendChild(title);
							// Create the accent text
							if (innerChildNode.hasAttribute('data-bb-accent-text')) {
								accentText = document.createElement('div');
								accentText.setAttribute('class','accent-text');
								accentText.innerHTML = innerChildNode.getAttribute('data-bb-accent-text');
								details.appendChild(accentText);
							}
							// Create our description
							descriptionDiv = document.createElement('div');
							descriptionDiv.setAttribute('class','description');
							if (description.length == 0) {
								description = '&nbsp;';
							}
							descriptionDiv.innerHTML = description;
							details.appendChild(descriptionDiv);
							// Clean-up
							innerChildNode.removeAttribute('data-bb-img');
							innerChildNode.removeAttribute('data-bb-title');
							// Add our highlight overlay
							overlay = document.createElement('div');
							overlay.setAttribute('class','bb-bb10-image-list-item-overlay-'+res);
							innerChildNode.appendChild(overlay);
								
							// Set up our variables
							innerChildNode.fingerDown = false;
							innerChildNode.contextShown = false;
							innerChildNode.overlay = overlay;
							innerChildNode.contextMenu = contextMenu;
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
																innerChildNode.contextMenu.peek({title:this.title,description:this.description, selected: this});
															}
														};
							innerChildNode.touchTimer = innerChildNode.touchTimer.bind(innerChildNode);
							
							// Add our subscription for click events to change highlighting on click
							innerChildNode.trappedClick = innerChildNode.onclick;
							innerChildNode.onclick = undefined;
							innerChildNode.addEventListener('click',function (e) {
									this.setAttribute('class',this.highlight);
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
						}
					}
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
