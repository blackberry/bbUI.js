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

function showToggle() {
	document.getElementById('choiceOne').show();
}

function hideToggle() {
	document.getElementById('choiceOne').hide();
}

function enableToggle() {
	document.getElementById('choiceOne').enable();
}

function disableToggle() {
	document.getElementById('choiceOne').disable();
}

function checkToggle(value) {
	document.getElementById('choiceOne').setChecked(value);
}

function changeCaptions(){
	document.getElementById('choiceOne').setOffCaption('Non');
	document.getElementById('choiceOne').setOnCaption('Oui');
}

function addRemoveToggle() {
	var container = document.getElementById('toggleContainer'),
		button = document.getElementById('addRemove'),
		toggle,
		id = 'newToggle';
		
	// Add toggle
	if (!button.flag) {
		button.setCaption('Remove Toggle Button');
		button.flag = true;
		toggle = document.createElement('div');
		toggle.setAttribute('data-bb-type','toggle');
		toggle.setAttribute('data-bb-on', 'On');
		toggle.setAttribute('data-bb-off', 'Off');
		toggle.setAttribute('data-bb-checked', 'true');
		toggle.setAttribute('id',id);
		// Style the toggle
		toggle = bb.toggle.style(toggle);
		container.appendChild(toggle);
		bb.refresh();
	} else {// Remove Toggle
		button.setCaption('Add Toggle Button');
		button.flag = false;
		toggle = document.getElementById(id);
		container.removeChild(toggle);
	}	
}