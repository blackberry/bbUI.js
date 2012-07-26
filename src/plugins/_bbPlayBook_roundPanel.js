_bbPlayBook_roundPanel = {  
    apply: function(elements) {
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
		}    
    }
};