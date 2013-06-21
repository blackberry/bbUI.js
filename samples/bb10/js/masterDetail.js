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

function doMasterDetailClick() {
	var list = document.getElementById('imageList'),
		selected = list.selected;
		
	document.getElementById('title').innerHTML = selected.getTitle();
	document.getElementById('description').innerHTML = selected.getDescription();
	document.getElementById('imgHolder').src = selected.getImage();
	document.getElementById('details').scrollTo(0,0,100);
}

function masterDetail_initialLoad(element) {
	if (bb.device.isBB10 && !bb.device.isPlayBook) {
		var imgHolder = element.getElementById('imgHolder');
		imgHolder.style.height = '119px';
		imgHolder.style.width = '119px';	
	}
	// Update our sizing
	var height = masterDetail_getHeight()+'px';
	element.getElementById('master').style.height = height;
	element.getElementById('details').style.height = height;
	
	// Set our resize listener
	window.addEventListener('resize', masterDetail_onResize,false); 
}

function masterDetail_onResize() {
	var height = masterDetail_getHeight()+'px',
		master = document.getElementById('master'),
		details = document.getElementById('details');
	master.style.height = height;
	details.style.height = height;
	master.refresh();
	details.refresh();
}

function masterDetail_getHeight() {
	var titleAndActionHeight = 0;
	
	if (bb.device.isBB10 && !bb.device.isPlayBook) {
		titleAndActionHeight = 74; // Action Bar Height on Dev Alpha
	} else if (bb.device.isBB10) {
		titleAndActionHeight = 74; // Action Bar Height on PlayBook
	} else {
		titleAndActionHeight = 55; // Title Bar height on PlayBook regular styling
	}
	
	if (bb.device.isPlayBook) {
		// Hack for ripple
		if (!window.orientation) {
			return window.innerHeight - titleAndActionHeight;
		} else if (window.orientation == 0 || window.orientation == 180) {
			return 1024 - titleAndActionHeight;
		} else if (window.orientation == -90 || window.orientation == 90) {
			return 600 - titleAndActionHeight;
		}
	} else {
		if (!window.orientation) {
			return window.innerHeight - titleAndActionHeight;
		} else if (window.orientation == 0 || window.orientation == 180) {
			return 768 - titleAndActionHeight;
		} else if (window.orientation == -90 || window.orientation == 90) {
			return 1280 - titleAndActionHeight;
		}
	}
}

function masterDetail_onUnload() {
	window.removeEventListener('resize', masterDetail_onResize); 
}
  
