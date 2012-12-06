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
			
			// Gather our inner items
			var items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
				percentWidth = Math.floor(100 / items.length),
				sidePadding = 101-(percentWidth * items.length),
				sidePadding,
				innerChildNode,
				j;
			
			outerElement.style['padding-left'] = sidePadding + '%';
			outerElement.style['padding-right'] = sidePadding + '%';
			for (j = 0; j < items.length; j++) {
				innerChildNode = items[j];
				containerDiv.appendChild(innerChildNode);
				
				// Set our styling
				innerChildNode.selected = buttonStyle + ' bb-bb10-pill-button-selected-'+res+'-'+ bb.screen.controlColor;
				innerChildNode.normal = buttonStyle;
				innerChildNode.highlight = buttonStyle + ' bb-bb10-pill-button-highlight-'+res+'-'+ bb.screen.controlColor +' bb10Highlight';
				if (j == items.length - 1) {
					innerChildNode.style.float = 'right';
					if (j == 1) {
						innerChildNode.style.width = percentWidth-2 + '%';
					} else {
						innerChildNode.style.width = (100-j) - (j * percentWidth) + '%';
					}						
				} else {
					innerChildNode.style.width = percentWidth + '%';
				}
				
				// Create our inner container to have double borders
				innerBorder = document.createElement('div');
				innerBorder.normal = 'bb-bb10-pill-button-inner-'+res;
				innerBorder.selected = innerBorder.normal +' bb-bb10-pill-button-inner-selected-'+res+'-'+bb.screen.controlColor;
				
				innerBorder.innerHTML = innerChildNode.innerHTML;
				innerChildNode.innerHTML = '';
				innerChildNode.appendChild(innerBorder);
				
				if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
					innerChildNode.setAttribute('class',innerChildNode.selected);
					innerBorder.setAttribute('class',innerBorder.selected);
				} else {
					innerChildNode.setAttribute('class',innerChildNode.normal);
					innerBorder.setAttribute('class',innerBorder.normal);
					innerChildNode.ontouchstart = function() {
												this.setAttribute('class',this.highlight);
											};
					innerChildNode.ontouchend = function() {
												this.setAttribute('class',this.normal);
											};
				}
				
				// Add our subscription for click events to change highlighting
				innerChildNode.addEventListener('click',function (e) {
						var innerChildNode,
							innerBorder,
							items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
						for (var j = 0; j < items.length; j++) {
							innerChildNode = items[j];
							innerBorder = innerChildNode.firstChild;
							if (innerChildNode == this) {
								innerChildNode.setAttribute('class',innerChildNode.selected);
								innerBorder.setAttribute('class',innerBorder.selected);
							} else {
								innerBorder.setAttribute('class',innerBorder.normal);
								innerChildNode.setAttribute('class',innerChildNode.normal);
								innerChildNode.ontouchstart = function() {
												this.setAttribute('class',this.highlight);
											};
								innerChildNode.ontouchend = function() {
												this.setAttribute('class',this.normal);
											};
							}
						}
					},false);
			}
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