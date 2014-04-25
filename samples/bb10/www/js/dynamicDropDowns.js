/*
* Copyright 2011-2012 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function addDropDown() {
	// Create the element just like you would in a normal screen declaration
	var option,
		dropDown = document.createElement('select');
	dropDown.setAttribute('data-bb-label','Delete Me?');
	
	// Create our options for the select
	option = document.createElement('option');
	option.setAttribute('value','1');
	option.setAttribute('selected','true');
	option.innerHTML = 'No';
	dropDown.appendChild(option);
	option = document.createElement('option');
	option.setAttribute('value','2');
	option.innerHTML = 'Yes';
	dropDown.appendChild(option);
	
	// Assign our change handler
	dropDown.onchange = function() {
			if (this.value == 2) {
				this.remove();
			} 
		};
		
	// Apply our styling
	dropDown = bb.dropdown.style(dropDown);
	
	// Insert it into the screen and update the scroller
	document.getElementById('dropdownContainer').appendChild(dropDown);
	bb.refresh();
}

function addDropDownOption() {
	// Find out dropdown and add a new option
	var dropdown = document.getElementById('refreshTarget'),
		count = dropdown.options.length + 1,
		option = document.createElement('option');
	option.setAttribute('value',count);
	option.innerHTML = count;
	dropdown.appendChild(option);
	
	// Refresh the dropdown
	dropdown.refresh();
}

  
