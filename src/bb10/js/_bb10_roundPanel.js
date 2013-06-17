_bb10_roundPanel = {  
    apply: function(elements) {	
		var i,
			j,
			outerElement,
			items,
			header,
			color = bb.screen.listColor;	
			
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			outerElement.setAttribute('class','bb-round-panel');
			items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
			for (j = 0; j < items.length; j++) {
				 header = items[j];
				 header.setAttribute('class','bb-panel-header bb-panel-header-'+color);
				 header.style['border-bottom-color'] = bb.options.shades.darkOutline;
			}
		// Add our show function
		outerElement.show = function() {
			this.style.display = 'block';
			bb.refresh();
				};
		outerElement.show = outerElement.show.bind(outerElement);
		
		// Add our hide function
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