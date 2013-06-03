_bb10_labelControlContainers = {
    apply: function(elements) {
		var i,
			outerElement,
			items,
			table,
			j,
			row,
			tr,
			tdLabel,
			label,
			tdControl,
			control,
			bbType,
			res = '1280x768-1280x720';
			
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			res = '1024x600';
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			res = '1280x768-1280x720';
		} else if (bb.device.is720x720) {
			res = '720x720';
		}
		
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			// Fetch all our rows
			items = outerElement.querySelectorAll('[data-bb-type=row]');
			if (items.length > 0 ) {
				// Create our containing table
				table = document.createElement('table');
				table.setAttribute('class','bb-bb10-label-control-rows');
				outerElement.insertBefore(table,items[0]);
				
				for (j = 0; j < items.length; j++) {
					row = items[j];
					tr = document.createElement('tr');
					tr.setAttribute('class','bb-bb10-label-control-label-row-'+res);
					table.appendChild(tr);
					
					// Get the label
					tdLabel = document.createElement('td');
					tr.appendChild(tdLabel);
					label = row.querySelectorAll('[data-bb-type=label]')[0];
					label.setAttribute('class','bb-bb10-label-control-label-'+res);
					row.removeChild(label);
					tdLabel.appendChild(label);
					
					// Get the control
					tr = document.createElement('tr');
					table.appendChild(tr);
					tdControl = document.createElement('td');
					tr.appendChild(tdControl);
					control = row.querySelectorAll('[data-bb-type=button],[data-bb-type=input],[data-bb-type=dropdown],textarea,input[type=file]')[0];
					if (control) {
						row.removeChild(control);
						tdControl.appendChild(control);
					}
					outerElement.removeChild(row);
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