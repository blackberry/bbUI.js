_bb10_pillButtons = {  
    apply: function(elements) {
		var i,
			outerElement;
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			bb.pillButtons.style(outerElement, true);
		}
	},
	
	style: function(outerElement, offdom) {
		var i,
			containerStyle = 'bb-pill-buttons-container bb-pill-buttons-container-' + bb.screen.controlColor,
			buttonStyle = 'bb-pill-button',
			containerDiv,
			innerBorder,
			items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
			percentWidth = Math.floor(100 / items.length),
			sidePadding = 10,
			innerChildNode,
			table,
			tr,
			td,
			j;
		
		outerElement.sidePadding = sidePadding;
		outerElement.setAttribute('class','bb-pill-buttons');
		containerDiv = document.createElement('div');
		outerElement.appendChild(containerDiv);
		containerDiv.setAttribute('class',containerStyle);
		// Set our selected color
		outerElement.selectedColor = (bb.screen.controlColor == 'dark') ? '#909090' : '#555555';
		
		// Create our selection pill
		pill = document.createElement('div');
		pillInner = document.createElement('div');
		pill.appendChild(pillInner);
		pill.setAttribute('class',buttonStyle + ' bb-pill-button-selected-'+ bb.screen.controlColor + ' bb-pill-buttons-pill');
		pillInner.setAttribute('class','bb-pill-button-inner bb-pill-button-inner-selected-'+bb.screen.controlColor);
		pill.style.opacity = '0';
		outerElement.pill = pill;
		containerDiv.appendChild(pill);
					
		// Set our left and right padding
		outerElement.style['padding-left'] = sidePadding + 'px';
		outerElement.style['padding-right'] = sidePadding + 'px';
		
		// create our containing table
		table = document.createElement('table');
		outerElement.table = table;
		tr = document.createElement('tr');
		table.tr = tr;
		table.appendChild(tr);
		table.setAttribute('class','bb-pill-buttons-table');
		table.style.opacity = '0';
		containerDiv.appendChild(table);				
		
		// Style an indiviual button
		outerElement.styleButton = function(innerChildNode) {
				innerChildNode.isSelected = false;
				// Create our inner container to have double borders
				innerBorder = document.createElement('div');
				innerBorder.innerHTML = innerChildNode.innerHTML;
				innerChildNode.innerHTML = '';
				innerChildNode.appendChild(innerBorder);
				// Set our variables
				innerChildNode.border = innerBorder;
				innerChildNode.outerElement = outerElement;
				if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
					innerChildNode.isSelected = true;
					outerElement.selected = innerChildNode;
					innerChildNode.style.color = outerElement.selectedColor;
				} 
				// Set our styling
				innerChildNode.setAttribute('class',buttonStyle);
				innerBorder.setAttribute('class','bb-pill-button-inner');
				innerChildNode.style['z-index'] = 4;
				innerChildNode.style.width = '100%';
				// Set our touch start					
				innerChildNode.dotouchstart = function(e) {
											if (this.isSelected) return;
											// Turn of the selected state of the last item
											var lastSelected = this.outerElement.selected;
											lastSelected.style.color = '';	
											// change color of the pill if it is light coloring
											if (bb.screen.controlColor == 'light') {
												this.outerElement.pill.style['background-color'] = '#DDDDDD';
											}
											this.outerElement.setPillLeft(this);
										};
				innerChildNode.dotouchstart = innerChildNode.dotouchstart.bind(innerChildNode);
				// Set our touch end					
				innerChildNode.dotouchend = function(e) {
											if (this.isSelected) return;
											
											// Reset the old selected
											var lastSelected = this.outerElement.selected;
											lastSelected.isSelected = false;
											
											// Select this item's state
											this.isSelected = true;
											this.outerElement.selected = this;
											this.style.color = this.outerElement.selectedColor;
											
											// Remove color styling from pill if light
											if (bb.screen.controlColor == 'light') {
												this.outerElement.pill.style['background-color'] = '';
											}
											
											// Raise the click event. Need to do it this way to match the
											// Cascades selection style in pill buttons
											var ev = document.createEvent('MouseEvents');
											ev.initMouseEvent('click', true, true);
											ev.doClick = true;
											this.dispatchEvent(ev);
										};
				innerChildNode.dotouchend = innerChildNode.dotouchend.bind(innerChildNode);
				// Tie it to mouse events in ripple, and touch events on devices
				if (bb.device.isRipple) {
					innerChildNode.onmousedown = innerChildNode.dotouchstart;	
					innerChildNode.onmouseup = innerChildNode.dotouchend;
				} else {
					innerChildNode.ontouchstart = innerChildNode.dotouchstart;	
					innerChildNode.ontouchend = innerChildNode.dotouchend;
				}
				// Prevent the default click unless we want it to happen
				innerChildNode.addEventListener('click',function (e) { 
							e.stopPropagation();
						}, true);
						
				// setCaption function
				innerChildNode.setCaption = function(value){ 
					this.border.innerHTML = value;
			    };
				innerChildNode.setCaption = innerChildNode.setCaption.bind(innerChildNode);
				
				// getCaption function, returns null if no button
				innerChildNode.getCaption = function(){ 
					return this.border.innerHTML;
			    };
				innerChildNode.getCaption = innerChildNode.getCaption.bind(innerChildNode); 
						
				return innerChildNode;
			};
		outerElement.styleButton = outerElement.styleButton.bind(outerElement);
		
		// Loop through all our buttons
		for (j = 0; j < items.length; j++) {
			innerChildNode = items[j];
			innerChildNode = outerElement.styleButton(innerChildNode);
			// Create our cell
			td = document.createElement('td');
			tr.appendChild(td);
			td.appendChild(innerChildNode);
			td.style.width = percentWidth + '%';
		}
		// Determine our pill widths based on size
		outerElement.recalculateSize = function() {
					var items = this.table.querySelectorAll('td'),
						totalWidth = parseInt(window.getComputedStyle(this).width) - this.sidePadding,
						itemWidth = Math.floor((totalWidth - (items.length * 4)) /items.length) + 'px', // Accounting for margins
						i;
					for (i = 0; i < items.length; i++) {
						items[i].style.width = itemWidth;
					}
					// Size our table and pill
					this.table.style.width = totalWidth + 'px';
					this.pill.style.width = itemWidth;
				};
		outerElement.recalculateSize = outerElement.recalculateSize.bind(outerElement);	
		
		// Set our pill left
		outerElement.setPillLeft = function(element) {
					if (!element) {
						element = this.selected;
						// Nothing was marked as selected so select the first button
						if (!element) {
							var items = this.table.querySelectorAll('[data-bb-type=pill-button]');
							if (items.length > 0) {
								element = items[0];
								this.selected = element;
							}
						}
					}
					if (element) {
						this.pill.style['-webkit-transform'] = 'translate3d(' + element.parentNode.offsetLeft + 'px,0px,0px)';
					}
				};
		outerElement.setPillLeft = outerElement.setPillLeft.bind(outerElement);	
		
		// Initialize the control
		outerElement.initialize = function() {
					this.recalculateSize();
					this.setPillLeft();
					// Fade in our sized elements
					this.table.style.opacity = '1';
					this.table.style['-webkit-transition'] = 'opacity 0.1s linear';
					this.pill.style.opacity = '1';
				};
		outerElement.initialize = outerElement.initialize.bind(outerElement);	
		
		if (offdom) {
			// Create our event handler for when the dom is ready
			outerElement.onbbuidomready = function() {
						this.initialize();
						document.removeEventListener('bbuidomprocessed', this.onbbuidomready,false);
					};
			outerElement.onbbuidomready = outerElement.onbbuidomready.bind(outerElement);
			/* Add our event listener for the domready to move our selected item.  We want to
		      do it this way because it will ensure the screen transition animation is finished before
		      the pill button move transition happens. This will help for any animation stalls/delays */
			document.addEventListener('bbuidomprocessed', outerElement.onbbuidomready,false);
		} else {
			window.setTimeout(outerElement.initialize, 0);
		}

		// Handle pill sizing on orientation change
		outerElement.doOrientationChange = function() {
					this.recalculateSize();
					this.setPillLeft();
				};
		outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
		window.addEventListener('resize', outerElement.doOrientationChange,false); 
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'resize', eventHandler: outerElement.doOrientationChange});
		
		// Add our show function
		outerElement.show = function() {
			this.style.display = 'block';
			this.recalculateSize();
			this.setPillLeft();
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
		
		// Add clear function
		outerElement.clear = function() {
			var items = this.table.querySelectorAll('td'),
				i;
			for (i = 0; i < items.length; i++) {
				this.table.tr.removeChild(items[i]);
			}
			this.pill.style.opacity = '0';
		};
		outerElement.clear = outerElement.clear.bind(outerElement);
		
		// Add appendButton function
		outerElement.appendButton = function(button) {
			button = outerElement.styleButton(button);
			// Create our cell
			var td = document.createElement('td');
			this.table.tr.appendChild(td);
			td.appendChild(button);
			this.initialize();
		};
		outerElement.appendButton = outerElement.appendButton.bind(outerElement);
		
		// Add getButtons function
		outerElement.getButtons = function() {
			var items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
			var buttonArray = new Array();
			for (var j = 0; j < items.length; j++) {
				buttonArray[j] = items[j].firstChild.innerHTML;					
			}				
			return buttonArray;
				};
		outerElement.getButtons = outerElement.getButtons.bind(outerElement);
		
		return outerElement;
    } 
};