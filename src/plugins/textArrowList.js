bb.textArrowList = { 
    // Apply our transforms to all arrow lists passed in
    apply: function(elements) {
        if (bb.device.isBB10) {
			var i, 
				outerElement,
				res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}	
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.setAttribute('class','bb-bb10-text-arrow-list-'+res);
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j],
						text = innerChildNode.innerHTML;
					innerChildNode.normal = 'bb-bb10-text-arrow-list-item-'+res+' bb-bb10-text-arrow-list-item-'+bb.screen.listColor;
					innerChildNode.highlight = 'bb-bb10-text-arrow-list-item-'+res+' bb-bb10-text-arrow-list-item-hover bb10Highlight';
					innerChildNode.setAttribute('class',innerChildNode.normal);
					innerChildNode.innerHTML = '<div class="bb-bb10-text-arrow-list-item-value-'+res+'">'+ text + '</div>'+
											'<div class="bb-bb10-arrow-list-arrow-'+res+'"></div>';
					innerChildNode.ontouchstart = function() {
													this.setAttribute('class', this.highlight);
												};
					innerChildNode.ontouchend = function() {
													this.setAttribute('class', this.normal);
												};					
					// Create our separator <div>
					if (j < items.length - 1) {
						var placeholder = document.createElement('div');
						placeholder.setAttribute('class','bb-bb10-arrow-list-separator-'+res+'-'+bb.screen.listColor);
						outerElement.insertBefore(placeholder,innerChildNode.nextSibling);
					}
				}
			}
		}
		else {
			for (var i = 0; i < elements.length; i++) {
				var inEvent, 
					outEvent,
					outerElement = elements[i];
					
				// Set our highlight events
				if (bb.device.isPlayBook) {
					inEvent = 'ontouchstart';
					outEvent = 'ontouchend';
				} else {
					inEvent = 'onmouseover';
					outEvent = 'onmouseout';
				}
				outerElement.setAttribute('class','bb-text-arrow-list');
				// Gather our inner items
				var items = outerElement.querySelectorAll('[data-bb-type=item]');
				for (var j = 0; j < items.length; j++) {
					var innerChildNode = items[j],
						text = innerChildNode.innerHTML;
					innerChildNode.setAttribute('class','bb-text-arrow-list-item');
					innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-text-arrow-list-item-hover');");
					innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-text-arrow-list-item')");
					innerChildNode.setAttribute('x-blackberry-focusable','true');
					
					innerChildNode.innerHTML = '<span class="bb-text-arrow-list-item-value">'+ text + '</span>' +
											'<div class="bb-arrow-list-arrow"></div>';
					
					// Create our separator <div>
					if (j < items.length - 1) {
						var placeholder = document.createElement('div');
						placeholder.setAttribute('class','bb-arrow-list-separator');
						outerElement.insertBefore(placeholder,innerChildNode.nextSibling);
					}
				}
			}
		}
    }
};
