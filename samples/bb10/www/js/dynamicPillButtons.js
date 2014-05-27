/*
* Copyright 2010-2012 Research In Motion Limited.
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

function addRemovePillButtons() {
	var container = document.getElementById('pillButtonContainer'),
		button = document.getElementById('addRemove'),
		btn,
		pillButtons,
		id = 'newPillButtons';
		
	// Add Pill Buttons
	if (!button.flag) {
		button.setCaption('Remove Pill Buttons');
		button.flag = true;
		
		// Create the pill buttons container
		pillButtons = document.createElement('div');
		pillButtons.setAttribute('data-bb-type','pill-buttons');
		
		// Create 1st button
		btn = document.createElement('div');
		btn.setAttribute('data-bb-type','pill-button');
		btn.setAttribute('data-bb-selected','true');
		btn.innerHTML = 'Option 1';
		pillButtons.appendChild(btn);
		// Create 1st button
		btn = document.createElement('div');
		btn.setAttribute('data-bb-type','pill-button');
		btn.innerHTML = 'Option 2';
		pillButtons.appendChild(btn);
		
		pillButtons.setAttribute('id',id);
		pillButtons = bb.pillButtons.style(pillButtons);
		container.appendChild(pillButtons);
		
	} else {// Remove Pill Buttons
		button.setCaption('Add Pill Buttons');
		button.flag = false;
		pillButtons = document.getElementById(id);
		pillButtons.remove();
	}	
	
	if (bb.scroller) {
		bb.refresh();
	}
}

function appendButton() {
	var btn = document.createElement('div'),
		pill = document.getElementById('myPillButtons');
	btn.setAttribute('data-bb-type','pill-button');
	btn.innerHTML = 'Append';
	pill.appendButton(btn);
}

function removePillButtons() {
	document.getElementById('myPillButtons').remove();
	document.getElementById('show').disable();
	document.getElementById('hide').disable();
	document.getElementById('get').disable();
	document.getElementById('remove').disable();
	document.getElementById('clear').disable();
	document.getElementById('append').disable();
}
