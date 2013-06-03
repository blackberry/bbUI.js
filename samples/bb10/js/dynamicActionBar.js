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

function setActionCaptions(caption) {
	document.getElementById('tabAction').setCaption(caption);
	document.getElementById('tabOverflowAction').setCaption(caption);
	document.getElementById('findAction').setCaption(caption);
	document.getElementById('actionOverflowAction').setCaption(caption);
}

function setActionImages(img) {
	document.getElementById('tabAction').setImage(img);
	document.getElementById('tabOverflowAction').setImage(img);
	document.getElementById('findAction').setImage(img);
	document.getElementById('actionOverflowAction').setImage(img);
}

function setTab(tab) {
	document.getElementById('myActionBar').setSelectedTab(tab);
}

function toggleActionVisibility(id, buttonId) {
	var action = document.getElementById(id),
		button = document.getElementById(buttonId);
	
	if (!button.hiding) {
		action.hide();
		button.hiding = true;
		button.setCaption('Show '+buttonId);
	} else {
		action.show();
		button.hiding = false;
		button.setCaption('Hide '+buttonId);
	}
}
  
