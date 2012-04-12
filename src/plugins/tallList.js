bb.tallList = { 
    // Apply our transforms to all Tall Lists
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var inEvent,
				outEvent,
				outerElement = elements[i];
            outerElement.setAttribute('class','bb-tall-list');
			// Set our highlight events
			if (bb.device.isPlayBook()) {
				inEvent = 'ontouchstart';
				outEvent = 'ontouchend';
			} else {
				inEvent = 'onmouseover';
				outEvent = 'onmouseout';
			}
            // Gather our inner items
            var items = outerElement.querySelectorAll('[data-bb-type=item]');
            for (var j = 0; j < items.length; j++) {
                var innerChildNode = items[j];
                if (innerChildNode.hasAttribute('data-bb-type')) {
                    var type = innerChildNode.getAttribute('data-bb-type').toLowerCase();
                    
                    if (type == 'item') {
                        var description = innerChildNode.innerHTML;
                        innerChildNode.setAttribute('class', 'bb-tall-list-item');
                        innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-tall-list-item-hover')");
                        innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-tall-list-item')");
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
                                        '<div class="details">\n'+
                                        '   <span class="title">' + innerChildNode.getAttribute('data-bb-title') + '</span>\n'+
                                        '   <span class="description">' + description + '</span>\n'+
                                        '   <div class="time">' + innerChildNode.getAttribute('data-bb-time')+ '</div>\n'+
                                        '</div>\n';
                                        
                        innerChildNode.removeAttribute('data-bb-img');
                        innerChildNode.removeAttribute('data-bb-title');
                        innerChildNode.removeAttribute('data-bb-time');
                    
                    }
                }
            }
        }
    }
};
