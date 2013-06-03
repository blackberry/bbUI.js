_bb5_pillButtons = {  
    // Apply our transforms to all pill buttons passed in
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			outerElement.setAttribute('class','bb-pill-buttons');

			// Gather our inner items
			var items = outerElement.querySelectorAll('[data-bb-type=pill-button]');
			for (var j = 0; j < items.length; j++) {
				var innerChildNode = items[j];
				innerChildNode.setAttribute('x-blackberry-focusable','true');
				var text = innerChildNode.innerHTML;
				innerChildNode.innerHTML = '<span>' + text + '</span>';
				
				if (j === 0) {
					innerChildNode.setAttribute('class','buttonLeft');
				}
				else if (j == items.length -1) {
					innerChildNode.setAttribute('class','buttonRight');
				}
				else {
					innerChildNode.setAttribute('class','buttonMiddle');
				}
				
				// See if the item is marked as selected
				if (innerChildNode.hasAttribute('data-bb-selected') && innerChildNode.getAttribute('data-bb-selected').toLowerCase() == 'true') {
					bb.pillButtons.selectButton(innerChildNode);
				}
				
				// Change the selected state when a user presses the button
				innerChildNode.onmousedown = function() {
					bb.pillButtons.selectButton(this);
					var buttons = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
					for (var i = 0; i < buttons.length; i++) {
						var button = buttons[i];
						if (button != this) {
							bb.pillButtons.deSelectButton(button);
						}
					}
				};
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
		}
    } 
};