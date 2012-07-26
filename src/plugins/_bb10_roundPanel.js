_bb10_roundPanel = {  
    apply: function(elements) {
		if (bb.device.isBB10) {
			var i,
				j,
				outerElement,
				items,
				res;	

			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
				
			for (i = 0; i < elements.length; i++) {
                outerElement = elements[i];
                outerElement.setAttribute('class','bb-bb10-round-panel-'+res+' bb-bb10-round-panel-light');
                items = outerElement.querySelectorAll('[data-bb-type=panel-header]');
                for (j = 0; j < items.length; j++) {
                     items[j].setAttribute('class','bb-bb10-panel-header-'+res+' bb-bb10-panel-header-'+res+'-light');
                }
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
            }
        }
    }
};