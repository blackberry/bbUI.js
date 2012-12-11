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
function enableRadioButton() {
	document.getElementById('control1').enable();
}

function disableRadioButton() {
	document.getElementById('control1').disable();
}

function disableGroup() {
	bb.radio.disableGroup('group1');
}

function enableGroup() {
	bb.radio.enableGroup('group1');
}

function showRadioButtons() {
	document.getElementById('control1').show();
	document.getElementById('control2').show();
}

function hideRadioButtons() {
	document.getElementById('control1').hide();
	document.getElementById('control2').hide();
}

function checkRadioButton() {
	document.getElementById('control2').setChecked(true);
}

function addRemoveRadioButton() {
	var container = document.getElementById('radioContainer'),
		button = document.getElementById('addRemove'),
		radio,
		id = 'newRadio';
		
	// Add checkbox
	if (!button.flag) {
		button.setCaption('Remove Radio Button');
		button.flag = true;
		radio = document.createElement('input');
		radio.setAttribute('type','radio');
		radio.setAttribute('name','group2');
		radio.setAttribute('checked', 'true');
		radio = bb.radio.style(radio);
		radio.setAttribute('id',id);
		container.appendChild(radio);
	} else {// Remove Checkbox
		button.setCaption('Add Radio Button');
		button.flag = false;
		radio = document.getElementById(id);
		container.removeChild(radio);
	}	
}