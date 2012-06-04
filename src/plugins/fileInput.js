bb.fileInput = {
	apply: function(elements) {
		var i,
			outerElement,
			btn,
			resClass;
		if (bb.device.isBB10) {
			resClass = (bb.device.isPlayBook) ? 'bb-bb10-file-button-lowres' : 'bb-bb10-file-button-hires';
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				outerElement.setAttribute('class',resClass);
				btn = document.createElement('div');
				btn.setAttribute('data-bb-type','button');
				btn.innerHTML = outerElement.hasAttribute('data-bb-caption') ? outerElement.getAttribute('data-bb-caption') : 'Choose File';
				btn.input = outerElement;
				// Add the button and insert the file input as an invisible node in the new button element
				outerElement.parentNode.insertBefore(btn, outerElement);
				btn.appendChild(outerElement);
			}
		}
	}
};