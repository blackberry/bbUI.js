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
function enableCheckbox() {
	document.getElementById('checkOne').enable();
}

function disableCheckbox() {
	document.getElementById('checkOne').disable();
}

function showCheckbox() {
	document.getElementById('checkOne').show();
}

function hideCheckbox() {
	document.getElementById('checkOne').hide();
}

function checkCheckbox(value) {
	document.getElementById('checkOne').setChecked(value);
}

function addRemoveCheckBox() {
	var container = document.getElementById('checkboxContainer'),
		button = document.getElementById('addRemove'),
		checkbox,
		id = 'newCheckBox';
		
	// Add checkbox
	if (!button.flag) {
		button.setCaption('Remove CheckBox');
		button.flag = true;
		checkbox = document.createElement('input');
		checkbox.setAttribute('type','checkbox');
		checkbox.setAttribute('checked', 'true');
		checkbox = bb.checkbox.style(checkbox);
		checkbox.setAttribute('id',id);
		container.appendChild(checkbox);
	} else {// Remove Checkbox
		button.setCaption('Add CheckBox');
		button.flag = false;
		checkbox = document.getElementById(id);
		container.removeChild(checkbox);
	}	
}