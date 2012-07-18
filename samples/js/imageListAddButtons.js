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

function removeItem() {
	var selected = document.getElementById('bottomList').selected,
		item;
	if (selected) {
		item = createItemElement(selected.getTitle(), selected.getDescription(), selected.getImage());
		item.onbtnclick = prependItem;
		selected.remove();
		// Add it to the end of the top list
		document.getElementById('topList').appendItem(item);
	} else {
		alert('no item selected');
	}
}

function prependItem() {
	var selected = document.getElementById('topList').selected,
		item,
		topItem,
		listItems,
		bottomList;
	if (selected) {
		item = createItemElement(selected.getTitle(), selected.getDescription(), selected.getImage());
		item.setAttribute('onbtnclick','removeItem()');
		selected.remove();
		// Get the top 
		bottomList = document.getElementById('bottomList');
		listItems = bottomList.getItems();
		if (listItems.length == 0) {
			bottomList.appendItem(item);
		} else {
			topItem = listItems[0];
			bottomList.insertItemBefore(item,topItem);
		}
		listItems = null;
	} else {
		alert('no item selected');
	}
}

function createItemElement(title, description, img) {
	var item = document.createElement('div');
	item.setAttribute('data-bb-type','item');
	if (title) {
		item.setAttribute('data-bb-title',title);
	}
	if (description) {
		item.innerHTML = description;
	}
	if (img) {
		item.setAttribute('data-bb-img',img);
	}
	return item;
}