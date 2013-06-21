_bb10_fileInput = {

	apply: function(elements) {
		var i,
			outerElement,
			btn,
			span,
			res = '1280x768-1280x720';
		
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			res = '1024x600';
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			res = '1280x768-1280x720';
		}
		
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			outerElement.setAttribute('class','bb-bb10-file-button-'+res);
			btn = document.createElement('div');
			btn.setAttribute('data-bb-type','button');
			btn.innerHTML = outerElement.hasAttribute('data-bb-caption') ? outerElement.getAttribute('data-bb-caption') : 'Choose File';
			btn.origCaption = btn.innerHTML;
			// Apply our styling
			bb.button.apply([btn]);
			btn.input = outerElement;
			// Add the button and insert the file input as an invisible node in the new button element
			outerElement.parentNode.insertBefore(btn, outerElement);
			btn.appendChild(outerElement);
			
			// Handle the file change
			btn.handleChange = function() {
				if ( this.input.value) {
					this.setCaption(this.input.value.replace(/^.*[\\\/]/, ''));
				
				} else {
					this.setCaption(this.origCaption);
				}
			};
			btn.handleChange = btn.handleChange.bind(btn);
			outerElement.addEventListener('change',btn.handleChange,false);
		}
	}
};