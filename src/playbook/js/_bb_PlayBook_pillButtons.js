_bb_PlayBook_pillButtons = {  
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i],
				containerStyle = 'pb-pill-buttons pb-pill-buttons',
				buttonStyle = 'pb-pill-button';	
			
			outerElement.setAttribute('class',containerStyle);	
			// Gather our inner items
			var inEvent = 'ontouchstart', 
				outEvent = 'ontouchend', 
				items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
				percentWidth = Math.floor(98 / items.length),
				sidePadding = 102-(percentWidth * items.length);

			outerElement.style['padding-left'] = sidePadding + '%';
			outerElement.style['padding-right'] = sidePadding + '%';
			for (var j = 0; j < items.length; j++) {
				var innerChildNode = items[j];
				if (j === 0) {  // First button
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','pb-pill-button-highlight pb-pill-button-left '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','pb-pill-button pb-pill-button-left '+ buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight pb-pill-button-left " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button pb-pill-button-left " + buttonStyle +"')");
					}
				} else if (j == items.length -1) { // Right button
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','pb-pill-button-highlight pb-pill-button-right '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','pb-pill-button pb-pill-button-right ' + buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight pb-pill-button-right " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button pb-pill-button-right " + buttonStyle +"')");
					}
				} else { // Middle Buttons
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class','pb-pill-button-highlight '+ buttonStyle);
					} else {
						innerChildNode.setAttribute('class','pb-pill-button ' + buttonStyle);
						innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight " + buttonStyle +"')");
						innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button " + buttonStyle +"')");
					}
				}
				// Set our width
				innerChildNode.style.width = percentWidth + '%';
				// Add our subscription for click events to change highlighting
				innerChildNode.addEventListener('click',function (e) {
						var inEvent = 'ontouchstart', 
							outEvent = 'ontouchend', 
							items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
						
						for (var j = 0; j < items.length; j++) {
							var innerChildNode = items[j];
							
							if (j === 0) {  // First button
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','pb-pill-button-highlight pb-pill-button-left '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','pb-pill-button pb-pill-button-left '+ buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight pb-pill-button-left " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button pb-pill-button-left " + buttonStyle +"')");
								}
							} else if (j == items.length -1) { // Right button
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','pb-pill-button-highlight pb-pill-button-right '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','pb-pill-button pb-pill-button-right ' + buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight pb-pill-button-right " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button pb-pill-button-right " + buttonStyle +"')");
								}
							} else { // Middle Buttons
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class','pb-pill-button-highlight '+ buttonStyle);
									innerChildNode.onmouseover = null;
									innerChildNode.onmouseout = null;
								} else {
									innerChildNode.setAttribute('class','pb-pill-button ' + buttonStyle);
									innerChildNode.setAttribute(inEvent,"this.setAttribute('class','pb-pill-button-highlight " + buttonStyle +"')");
									innerChildNode.setAttribute(outEvent,"this.setAttribute('class','pb-pill-button " + buttonStyle +"')");
								}
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
						var items = this.querySelectorAll('[data-bb-type=pill-button]');
						var buttonArray = new Array();
						for (var j = 0; j < items.length; j++) {
							buttonArray[j] = items[j].innerHTML;					
						}				
						return buttonArray;
					};
			outerElement.getButtons = outerElement.getButtons.bind(outerElement);
		}
    } 
};
