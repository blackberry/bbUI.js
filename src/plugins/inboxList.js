bb.inboxList = {
    // Apply our transforms to all Inbox lists
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var outerElement = elements[i];
            outerElement.setAttribute('class','bb-inbox-list');
            // Gather our inner items
            var items = outerElement.querySelectorAll('[data-bb-type=item], [data-bb-type=header]');
            for (var j = 0; j < items.length; j++) {
                var innerChildNode = items[j];
                if (innerChildNode.hasAttribute('data-bb-type')) {
                    var type = innerChildNode.getAttribute('data-bb-type').toLowerCase();
                    
                    if (type == 'header') {
                        var description = innerChildNode.innerHTML;
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<p>'+ description +'</p>';
                        if (bb.device.isHiRes) {
                            innerChildNode.setAttribute('class', 'bb-hires-inbox-list-header');
                            innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-hires-inbox-list-header-hover')");
                            innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-hires-inbox-list-header')");
                        } else {
                            innerChildNode.setAttribute('class', 'bb-lowres-inbox-list-header');
                            innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-lowres-inbox-list-header-hover')");
                            innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-lowres-inbox-list-header')");
                        }
                    }
                    else if (type == 'item') {
                        var description = innerChildNode.innerHTML,
                            title = innerChildNode.getAttribute('data-bb-title');
                        if (innerChildNode.hasAttribute('data-bb-accent') && innerChildNode.getAttribute('data-bb-accent').toLowerCase() == 'true') {
                            title = '<b>' + title + '</b>';
                        }
                        innerChildNode.setAttribute('x-blackberry-focusable','true');
                        innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n'+
                                        '<div class="title">'+ title +'</div>\n'+
                                        '<div class="time">' + innerChildNode.getAttribute('data-bb-time') + '</div>\n'+
                                        '<div class="description">' + description + '</div>\n';
                        innerChildNode.removeAttribute('data-bb-img');
                        innerChildNode.removeAttribute('data-bb-title');    
                        
                        if (bb.device.isHiRes) {
                            innerChildNode.setAttribute('class', 'bb-hires-inbox-list-item');
                            innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-hires-inbox-list-item-hover')");
                            innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-hires-inbox-list-item')");
                        } else {
                            innerChildNode.setAttribute('class', 'bb-lowres-inbox-list-item');
                            innerChildNode.setAttribute('onmouseover', "this.setAttribute('class','bb-lowres-inbox-list-item-hover')");
                            innerChildNode.setAttribute('onmouseout', "this.setAttribute('class','bb-lowres-inbox-list-item')");
                        }               
                    }
                }               
            }           
        }   
    }
};
