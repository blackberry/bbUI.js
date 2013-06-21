_bb_bbmBubble = {
    // Apply our transforms to all BBM Bubbles
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            bb.bbmBubble.style(elements[i]);
        }
    },

    style: function(outerElement) {
		var placeholder, 
			insidepanel, 
			image, 
			innerChildNode,
			details; 
		
		// Style an indiviual item
		outerElement.styleItem = function(innerChildNode) {
			image = document.createElement('img');
			image.setAttribute('src', innerChildNode.getAttribute('data-bb-img'));
			
			details = document.createElement('div');
			details.setAttribute('class','details');
			details.innerHTML = innerChildNode.innerHTML;
			
			innerChildNode.innerHTML = '';
			
			innerChildNode.appendChild(image);
			innerChildNode.appendChild(details);
			
			// Set our variables
			innerChildNode.image = image;
			innerChildNode.details = details;
			innerChildNode.outerElement = outerElement;

			// Get bubble item caption
			innerChildNode.getCaption = function() {
				return this.details.innerText;
			};
			innerChildNode.getCaption = innerChildNode.getCaption.bind(innerChildNode);
			
			// Set bubble item caption
			innerChildNode.setCaption = function(value) {
				this.details.innerHTML = value;
				bb.refresh();
			};
			innerChildNode.setCaption = innerChildNode.setCaption.bind(innerChildNode);
			
			// Get bubble item image
			innerChildNode.getImage = function() {
				return this.image.src;
			};
			innerChildNode.getImage = innerChildNode.getImage.bind(innerChildNode);
			
			// Set bubble item image
			innerChildNode.setImage = function(value) {
				this.image.setAttribute('src', value);
				bb.refresh();
			};
			innerChildNode.setImage = innerChildNode.setImage.bind(innerChildNode);
			
			// Remove item
			innerChildNode.remove = function(value) {
				this.outerHTML = "";
				bb.refresh();
			};
			innerChildNode.remove = innerChildNode.remove.bind(innerChildNode); 
		
			return innerChildNode;
		};
		outerElement.styleItem = outerElement.styleItem.bind(outerElement);
		
        if (outerElement.hasAttribute('data-bb-style')) {
            var style = outerElement.getAttribute('data-bb-style').toLowerCase(), j;
            if (style == 'left') {
                outerElement.setAttribute('class','bb-bbm-bubble-left');
            } else {
                outerElement.setAttribute('class','bb-bbm-bubble-right');
            }

            var innerElements = outerElement.querySelectorAll('[data-bb-type=item]');
            for (j = 0; j > innerElements.length; j++) {
                outerElement.removeChild(innerElements[j]);
            }
            
            // Create our new <div>'s
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','top-left image');
            outerElement.appendChild(placeholder);
			
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','top-right image');
            outerElement.appendChild(placeholder);
			
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','inside');
            outerElement.appendChild(placeholder);
			
            insidePanel = document.createElement('div');
            insidePanel.setAttribute('class','nogap');
            placeholder.appendChild(insidePanel);
			
			outerElement.insidePanel = insidePanel;
			
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','bottom-left image');
            outerElement.appendChild(placeholder);
			
            placeholder = document.createElement('div');
            placeholder.setAttribute('class','bottom-right image');
            outerElement.appendChild(placeholder);
				
            // Add our previous children back to the insidePanel
            for (j = 0; j < innerElements.length; j++) {
                innerChildNode = innerElements[j];
				insidePanel.appendChild(outerElement.styleItem(innerChildNode));
            }
        }
        
        // Add our get Style function
        outerElement.getStyle = function() {
                    return this.getAttribute('data-bb-style');
		};
        outerElement.getStyle = outerElement.getStyle.bind(outerElement);
        
        // Add setStyle function (left or right)
        outerElement.setStyle = function(value) {
            if (value == 'left'){
                this.setAttribute('data-bb-style', value);
                this.setAttribute('class','bb-bbm-bubble-left');
            }
            else if (value == 'right'){
                this.setAttribute('data-bb-style', value);
                this.setAttribute('class','bb-bbm-bubble-right');
            }
            bb.refresh();
        };
        outerElement.setStyle = outerElement.setStyle.bind(outerElement);
        
        // Add show function
        outerElement.show = function() {
            this.style.display = 'block';
            bb.refresh();
        };
        outerElement.show = outerElement.show.bind(outerElement);

        // Add hide function
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
		
        // Remove all the items in a bubble
        outerElement.clear = function() {
            this.insidePanel.innerHTML = "";
            bb.refresh();
        };
        outerElement.clear = outerElement.clear.bind(outerElement);
    
        // Get all the items in a bubble
        outerElement.getItems = function() {
            return this.querySelectorAll('[data-bb-type=item]');
        };
        outerElement.getItems = outerElement.getItems.bind(outerElement); 
        
        return outerElement;
    }
};