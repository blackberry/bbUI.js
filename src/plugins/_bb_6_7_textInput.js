_bb_6_7_textInput = { 
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			var style = outerElement.getAttribute('class');
			style = style + ' bb-bb7-input';
			
			if (bb.device.isHiRes) {
				style = style + ' bb-bb7-input-hires';
			} else {
				style = style + ' bb-bb7-input-lowres';
			}
			// Apply our style
			outerElement.setAttribute('class', style);
		}
    }
};