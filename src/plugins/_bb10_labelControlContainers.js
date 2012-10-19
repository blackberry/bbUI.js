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
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires';
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
					control = row.querySelectorAll('[data-bb-type=button],input,[data-bb-type=dropdown],textarea')[0];
					row.removeChild(control);
					tdControl.appendChild(control);
					outerElement.removeChild(row);
				}
			}
		}	
    }
};