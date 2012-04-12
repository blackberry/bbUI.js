bb.textArrowList = { 
    // Apply our transforms to all arrow lists passed in
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var inEvent, 
				outEvent,
				outerElement = elements[i];
				
			// Set our highlight events
			if (bb.device.isPlayBook()) {
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
				innerChildNode.setAttribute('class', 'bb-text-arrow-list-item');
                innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-text-arrow-list-item-hover');");
                innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-text-arrow-list-item')");
                innerChildNode.setAttribute('x-blackberry-focusable','true');
                
                innerChildNode.innerHTML = '<div class="bb-text-arrow-list-item-value">'+ text + '</div>' +
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
};