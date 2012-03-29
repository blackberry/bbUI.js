bb.imageList = {  
    apply: function(elements) {
        // Apply our transforms to all Dark Image Lists
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
            if (bb.device.isHiRes()) {
                outerElement.setAttribute('class','bb-hires-image-list');
            } else {
                outerElement.setAttribute('class','bb-lowres-image-list');
            }
            // Gather our inner items
            var items = outerElement.querySelectorAll('[data-bb-type=item]');
            for (var j = 0; j < items.length; j++) {
                var innerChildNode = items[j];
                if (innerChildNode.hasAttribute('data-bb-type')) {
                    var type = innerChildNode.getAttribute('data-bb-type').toLowerCase(),
                        description = innerChildNode.innerHTML;
                    
                    if (bb.device.isHiRes()) {
                        innerChildNode.setAttribute('class', 'bb-hires-image-list-item');
						innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-hires-image-list-item-hover')");
						innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-hires-image-list-item')");
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
                                        '<div class="details">\n'+
                                        '   <span class="title">' + innerChildNode.getAttribute('data-bb-title') + '</span>\n'+
                                        '   <div class="description">' + description + '</div>\n'+
                                        '</div>\n';
                    } else {
                        innerChildNode.setAttribute('class', 'bb-lowres-image-list-item');
                        innerChildNode.setAttribute(inEvent, "this.setAttribute('class','bb-lowres-image-list-item-hover')");
						innerChildNode.ontouchstart = innerChildNode.onmouseover;  
                        innerChildNode.ontouchend = innerChildNode.onmouseout;  
						innerChildNode.setAttribute(outEvent, "this.setAttribute('class','bb-lowres-image-list-item')");
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
                                        '<div class="details">\n'+
                                        '   <span class="title">' + innerChildNode.getAttribute('data-bb-title') + '</span>\n'+
                                        '   <div class="description">' + description + '</div>\n'+
                                        '</div>\n';
                    }
                    innerChildNode.removeAttribute('data-bb-img');
                    innerChildNode.removeAttribute('data-bb-title');
                }
            }
        }
    }
};