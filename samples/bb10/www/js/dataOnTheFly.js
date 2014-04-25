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

function dataOnTheFly_onScreenReady(element) {
	// Make the proper activity indicator appear
	if (bb.device.isBB10) {
		element.getElementById('bb7Loading').style.display = 'none';
	} else {
		element.getElementById('bb10Loading').style.display = 'none';
	}
}

function dataOnTheFly_initialLoad(element) {
	var i,
		listItem, 
		container, 
		items = [],
		dataList = document.getElementById('dataList');
	
	for (i = 0; i < 3; i++) {
		// Create our list item
		listItem = document.createElement('div');
		listItem.setAttribute('data-bb-type', 'item');
		listItem.setAttribute('data-bb-img', 'images/icons/icon11.png');
		listItem.setAttribute('data-bb-title', 'Title ');
		listItem.innerHTML = 'My description';
		listItem.onclick = function() {alert('foo');};
		items.push(listItem);
	}
	// Remove our waiting and refresh the list
	document.getElementById('waiting').style.display = 'none';
	dataList.refresh(items);
	// re-compute the scrolling area
	if (bb.scroller) {
		bb.scroller.refresh();
	}
}

function dataOnTheFly_addListItem() {
	var listItem, 
		dataList = document.getElementById('dataList');
	// Create our list item
	listItem = document.createElement('div');
	listItem.setAttribute('data-bb-type', 'item');
	listItem.setAttribute('data-bb-img', 'images/icons/icon11.png');
	listItem.setAttribute('data-bb-title', 'Title ');
	listItem.innerHTML = 'My description';
	listItem.onclick = function() {alert('foo');};
	dataList.appendItem(listItem);
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
	// Apply the styling
	dropdown = bb.dropdown.style(dropdown);
	// Append the item
	buttonPanel.appendChild(dropdown);
	// re-compute the scrolling area
	if (bb.scroller) {
		bb.scroller.refresh();
	}
}