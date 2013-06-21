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

function addRemoveTextInput() {
	// Create the element just like you would in a normal screen declaration
	var input = document.getElementById('MyInput');
	
	if (input) {
		input.remove();
		// Change our button text
		document.getElementById('addRemoveBtn').setCaption('Add Text Input');
	} else {
		input = document.createElement('input');
		input.setAttribute('type','text');
		input.setAttribute('id','MyInput');
		input.setAttribute('value', 'Hello World');
		// Apply our styling
		input = bb.textInput.style(input);
		// Insert it into the screen and update the scroller
		document.getElementById('inputContainer').appendChild(input);
		// Change our button text
		document.getElementById('addRemoveBtn').setCaption('Remove Text Input');
	}
	// Refresh for PlayBook scroller
	bb.refresh();
}

  
