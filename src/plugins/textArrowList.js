bb.textArrowList = { 
    // Apply our transforms to all arrow lists passed in
    apply: function(elements) {
        if (bb.device.isBB10) {
			var i, 
				outerElement,
				res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				borderColor = (bb.screen.listColor == 'dark') ? '#3A3A3A' : 'Silver',
				borderWidth = (res == 'lowres') ? '1px' : '2px';

			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.setAttribute('class','bb-bb10-text-arrow-list-'+res);
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j];
					innerChildNode.normal = 'bb-bb10-text-arrow-list-item-' + res+' bb-bb10-text-arrow-list-item-'+bb.screen.listColor;
					innerChildNode.highlight = 'bb-bb10-text-arrow-list-item-' + res + ' bb-bb10-text-arrow-list-item-hover bb10Highlight';
					innerChildNode.setAttribute('class',innerChildNode.normal);
					// Handle our touch events
					innerChildNode.ontouchstart = function() {
													this.setAttribute('class', this.highlight);
												};
					innerChildNode.ontouchend = function() {
													this.setAttribute('class', this.normal);
												};					
					// Create our separator 
					if (j < items.length - 1) {
						innerChildNode.style['border-bottom'] = 'solid ' + borderWidth + ' ' + borderColor;
					}
				}
			}
		}
		else {
			for (var i = 0; i < elements.length; i++) {
				var inEvent, 
					outEvent,
					outerElement = elements[i];
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j];
					innerChildNode.setAttribute('class','bb-text-arrow-list-item');
					innerChildNode.setAttribute('x-blackberry-focusable','true');
					
					if (bb.device.isPlayBook) {
						innerChildNode.ontouchstart = function() {
														this.setAttribute('class','bb-text-arrow-list-item bb-text-arrow-list-item-hover');
													};
						innerChildNode.ontouchend = function() {
														this.setAttribute('class','bb-text-arrow-list-item');
													};
					} else {
						innerChildNode.onmouseover = function() {
														this.setAttribute('class','bb-text-arrow-list-item bb-text-arrow-list-item-hover');
													};
						innerChildNode.onmouseout = function() {
														this.setAttribute('class','bb-text-arrow-list-item');
													};
					}
					
					// Create our separator 
					if (j < items.length - 1) {
						innerChildNode.style['border-bottom'] = 'solid 1px Silver';
					}
				}	
			}
		}
    }
};