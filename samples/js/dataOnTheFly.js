/*
* Copyright 2010-2011 Research In Motion Limited.
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

function dataOnTheFly_initialLoad(element) {
	// I'm just doing a setTimeout to mimic processing some data
	// in a background worker thread
	setTimeout(dataOnTheFly_loadAfterTimeout,2000);
}

function dataOnTheFly_loadAfterTimeout() {
	document.getElementById('waiting').style.display = 'none';
	dataOnTheFly_addListItem()
	dataOnTheFly_addListItem()
	dataOnTheFly_addListItem()
}

function dataOnTheFly_addListItem() {
	var listItem, container, dataList = document.getElementById('dataList');
	// Create our list item
	listItem = document.createElement('div');
	listItem.setAttribute('data-bb-type', 'item');
	listItem.setAttribute('data-bb-img', 'images/icons/icon11.png');
	listItem.setAttribute('data-bb-title', 'Title ');
	listItem.innerHTML = 'My description';
	// Create a dummy container
	container = document.createElement('div');
	container.appendChild(listItem);
	// Apply the styling
	bb.imageList.apply([container]);
	// Append the item
	dataList.appendChild(container.firstChild);
	// re-compute the scrolling area
	if (bb.scroller) {
		bb.scroller.refresh();
	}
}

function dataOnTheFly_addDropDown() {
	var dropdown, option, buttonPanel = document.getElementById('buttonpanel');
	// Create our list item
	dropdown = document.createElement('select');
	dropdown.setAttribute('data-bb-style', 'stretch');
	option = document.createElement('option');
	option.setAttribute('value','bbalphasans');
	option.setAttribute('selected','true');
	option.innerHTML = 'BBAlpha Sans';
	dropdown.appendChild(option);
	option = document.createElement('option');
	option.setAttribute('value','arial');
	option.innerHTML = 'Arial';
	dropdown.appendChild(option);
	option = document.createElement('option');
	option.setAttribute('value','andalemono');
	option.innerHTML = 'Andale Mono';
	dropdown.appendChild(option);	
	// Create a dummy container
	container = document.createElement('div');
	container.appendChild(dropdown);
	// Apply the styling
	bb.dropdown.apply([dropdown]);
	// Append the item
	buttonPanel.appendChild(container);
	// re-compute the scrolling area
	if (bb.scroller) {
		bb.scroller.refresh();
	}
}