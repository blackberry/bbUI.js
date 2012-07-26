_bb5_labelControlContainers = {
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			outerElement.setAttribute('class','bb-label-control-horizontal-row');
			// Gather our inner items
			var items = outerElement.querySelectorAll('[data-bb-type=label]');
			for (var j = 0; j < items.length; j++) {
				var label = items[j];
				label.setAttribute('class', 'bb-label');
			}
		}
    }
};