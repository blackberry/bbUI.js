_bb10_roundPanel = {  
    apply: function(elements) {
		if (bb.device.isBB10) {
			var i,
				j,
				outerElement,
				items,
				header,
				res = '1280x768-1280x720',
				color = bb.screen.listColor;	

			// Set our 'res' for known resolutions, otherwise use the default
			if (bb.device.is1024x600) {
				res = '1024x600';
			} else if (bb.device.is1280x768 || bb.device.is1280x720) {
				res = '1280x768-1280x720';
			}
				
			for (i = 0; i < elements.length; i++) {
                outerElement = elements[i];
                outerElement.setAttribute('class','bb-bb10-round-panel-'+res);
                items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
                for (j = 0; j < items.length; j++) {
                     header = items[j];
					 header.setAttribute('class','bb-bb10-panel-header-'+res+' bb-bb10-panel-header-'+res+'-'+color);
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
        else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
                outerElement.setAttribute('class','bb-playbook-round-panel');
                var items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
                for (var j = 0; j < items.length; j++) {
                    if (bb.device.isHiRes) {
                        items[j].setAttribute('class','bb-hires-panel-header');
                    } else {
                        items[j].setAttribute('class','bb-lowres-panel-header');
                    }
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
    }
};