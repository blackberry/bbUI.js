bb.labelControlContainers = {
    // Apply our transforms to all label control rows
    apply: function(elements) {
        if (bb.device.isBB5) {
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
    } else if (bb.device.isBB10) {
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
        res;
      if (bb.device.isPlayBook) {
        res = 'lowres';
      } else {
        res = 'hires';
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
                        control = row.querySelectorAll('[data-bb-type=button],input,[data-bb-type=dropdown]')[0];
                        row.removeChild(control);
                        tdControl.appendChild(control);
                        outerElement.removeChild(row);
                        /*bbType = control.getAttribute('data-bb-type');
                        if (bbType == 'button' || bbType == 'dropdown') {
                            control.style.float = 'right';
                        }*/
                    }
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
