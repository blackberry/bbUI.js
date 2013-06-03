_bb_6_7_PlayBook_labelControlContainers = {
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i];
			
			// Fetch all our rows
			var items = outerElement.querySelectorAll('[data-bb-type=row]');
			if (items.length > 0 ) {
				// Create our containing table
				var table = document.createElement('table');
				table.setAttribute('class','bb-bb7-label-control-rows');
				outerElement.insertBefore(table,items[0]);
				
				for (var j = 0; j < items.length; j++) {
					var row = items[j],
						tr = document.createElement('tr');
					table.appendChild(tr);
					// Get the label
					var tdLabel = document.createElement('td');
					tr.appendChild(tdLabel);
					var label = row.querySelectorAll('[data-bb-type=label]')[0];
					row.removeChild(label);
					tdLabel.appendChild(label);
					// Get the control
					var tdControl = document.createElement('td');
					tr.appendChild(tdControl);
					var control = row.querySelectorAll('[data-bb-type=button],input,[data-bb-type=dropdown],textarea')[0];
					row.removeChild(control);
					tdControl.appendChild(control);
					outerElement.removeChild(row);
					var bbType = control.getAttribute('data-bb-type');
					if (bbType == 'button' || bbType == 'dropdown') {
						control.style.float = 'right';
					} else if (control.tagName == 'INPUT') {
						control.style.width = '100%';
					}
				}
			}
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