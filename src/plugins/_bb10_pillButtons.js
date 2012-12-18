_bb10_pillButtons = {  
    apply: function(elements) {
		var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			i,
			outerElement,
			containerStyle = 'bb-bb10-pill-buttons-container-'+res+' bb-bb10-pill-buttons-container-' + bb.screen.controlColor,
			buttonStyle = 'bb-bb10-pill-button-'+res,
			containerDiv,
			innerBorder;

		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			outerElement.setAttribute('class','bb-bb10-pill-buttons-'+res);
			containerDiv = document.createElement('div');
			outerElement.appendChild(containerDiv);
			containerDiv.setAttribute('class',containerStyle);
			
			// Set our selected color
			outerElement.selectedColor = (bb.screen.controlColor == 'dark') ? '#909090' : '#555555';
			
			// Gather our inner items
			var items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
				percentWidth = Math.floor(100 / items.length),
				sidePadding = 101-(percentWidth * items.length),
				sidePadding,
				innerChildNode,
				table,
				tr,
				td,
				j;
			
			// Create our selection pill
			pill = document.createElement('div');
			pillInner = document.createElement('div');
			pill.appendChild(pillInner);
			pill.setAttribute('class',buttonStyle + ' bb-bb10-pill-button-selected-'+res+'-'+ bb.screen.controlColor + ' bb-bb10-pill-buttons-pill');
			pillInner.setAttribute('class','bb-bb10-pill-button-inner-'+res +' bb-bb10-pill-button-inner-selected-'+res+'-'+bb.screen.controlColor);
			pill.style.width = percentWidth + '%';
			outerElement.pill = pill;
			containerDiv.appendChild(pill);
						
			// Set our left and right padding
			outerElement.style['padding-left'] = sidePadding + '%';
			outerElement.style['padding-right'] = sidePadding + '%';
			
			// create our containing table
			table = document.createElement('table');
			tr = document.createElement('tr');
			table.appendChild(tr);
			table.setAttribute('class','bb-bb10-pill-buttons-table');
			table.style.width = (99 - (2*sidePadding)) + '%';
			containerDiv.appendChild(table);				
			
			// Loop through all our buttons
			for (j = 0; j < items.length; j++) {
				innerChildNode = items[j];
				innerChildNode.isSelected = false;
				
				// Create our cell
				td = document.createElement('td');
				tr.appendChild(td);
				td.appendChild(innerChildNode);
				td.style.width = percentWidth + '%';
							
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
				innerBorder.setAttribute('class','bb-bb10-pill-button-inner-'+res);
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
			}
			
			// Set our pill left
			outerElement.setPillLeft = function(element) {
						if (!element) {
							element = this.selected;
						}
						this.pill.style['-webkit-transform'] = 'translate3d(' + element.parentNode.offsetLeft + 'px,0px,0px)';
					};
			outerElement.setPillLeft = outerElement.setPillLeft.bind(outerElement);	
			
			// Create our event handler for when the dom is ready
			outerElement.onbbuidomready = function() {
						this.setPillLeft();
						document.removeEventListener('bbuidomready', outerElement.onbbuidomready,false);
					};
			outerElement.onbbuidomready = outerElement.onbbuidomready.bind(outerElement);
			
			/* Add our event listener for the domready to move our selected item.  We want to
			   do it this way because it will ensure the screen transition animation is finished before
			   the pill button move transition happens. This will help for any animation stalls/delays */
			document.addEventListener('bbuidomready', outerElement.onbbuidomready,false);

			// Handle pill sizing on orientation change
			outerElement.doOrientationChange = function() {
						//var outerStyle = window.getComputedStyle(this),
						//	pillLeft = this.parentNode.offsetLeft;
						// Set our styles
						//this.pill.style['-webkit-transform'] = 'translate3d(' + pillLeft + 'px,0px,0px)';
						this.setPillLeft();
					};
			outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
			window.addEventListener('resize', outerElement.doOrientationChange,false); 
			
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
		}
    } 
};