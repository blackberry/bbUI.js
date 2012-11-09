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
		
	// Add checkbox
	if (!button.flag) {
		button.setCaption('Remove Toggle Button');
		button.flag = true;
		/*toggle = document.createElement('input');
		toggle.setAttribute('type','checkbox');
		toggle.setAttribute('id',id);
		container.appendChild(toggle);*/
	} else {// Remove Checkbox
		button.setCaption('Add Toggle Button');
		button.flag = false;
		/*toggle = document.getElementById(id);
		toggle.removeChild(checkbox);*/
	}	
}