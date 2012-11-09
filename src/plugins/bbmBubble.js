_bb_bbmBubble = {
    // Apply our transforms to all BBM Bubbles
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var outerElement = elements[i];
                
            if (outerElement.hasAttribute('data-bb-style')) {
                var style = outerElement.getAttribute('data-bb-style').toLowerCase();
                if (style == 'left')
                    outerElement.setAttribute('class','bb-bbm-bubble-left');
                else
                    outerElement.setAttribute('class','bb-bbm-bubble-right');
                    
                var innerElements = outerElement.querySelectorAll('[data-bb-type=item]');
                for (var j = 0; j > innerElements.length; j++) {
                    outerElement.removeChild(innerElements[j]);
                }
                
                // Create our new <div>'s
                var placeholder = document.createElement('div');
                placeholder.setAttribute('class','top-left image');
                outerElement.appendChild(placeholder);
                placeholder = document.createElement('div');
                placeholder.setAttribute('class','top-right image');
                outerElement.appendChild(placeholder);
                
                placeholder = document.createElement('div');
                placeholder.setAttribute('class','inside');
                outerElement.appendChild(placeholder);
                
                var insidePanel = document.createElement('div');
                insidePanel.setAttribute('class','nogap');
                placeholder.appendChild(insidePanel);
                
                placeholder = document.createElement('div');
                placeholder.setAttribute('class','bottom-left image');
                outerElement.appendChild(placeholder);
                placeholder = document.createElement('div');
                placeholder.setAttribute('class','bottom-right image');
                outerElement.appendChild(placeholder);
                // Add our previous children back to the insidePanel
                for (var j = 0; j < innerElements.length; j++) {
                    var innerChildNode = innerElements[j],
                        description = innerChildNode.innerHTML;
                    innerChildNode.innerHTML = '<img src="'+ innerChildNode.getAttribute('data-bb-img') +'" />\n' +
                            '<div class="details">'+ description +'</div>\n';
                    insidePanel.appendChild(innerChildNode); 
                }
                
            }
			
			// Add our get Checked function
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
        }   
    }
};