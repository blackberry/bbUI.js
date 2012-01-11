bb.labelControlContainers = {
    // Apply our transforms to all label control rows
    apply: function(elements) {
        if (bb.device.isBB5()) {
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
        } else {
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
                        var control = row.querySelectorAll('[data-bb-type=button],input,[data-bb-type=dropdown]')[0];
                        row.removeChild(control);
                        tdControl.appendChild(control);
                        outerElement.removeChild(row);
                        var bbType = control.getAttribute('data-bb-type');
                        if (bbType == 'button' || bbType == 'dropdown') {
                            control.style.float = 'right';
                        }
                    }
                }
            }
        }
    }
};
