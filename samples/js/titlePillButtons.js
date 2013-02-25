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

// Assign our document event listeners
function titlePillButtons_Init(element) {
	window.addEventListener('orientationchange', titlePillButtons_HandleResize,false);
	titlePillButtons_HandleResize(element, true);
}

// Remove our document event listeners
function titlePillButtons_UnInit() {
	window.removeEventListener('orientationchange', titlePillButtons_HandleResize,false);
}

// Adjust the height of the scroller based on orientation
function titlePillButtons_HandleResize(element, init) {
	var actionBarHeight = bb.screen.getActionBarHeight(),
		headerHeight = bb.device.isPlayBook ? 64 : 101,
		scrollerHeight = 0,
		scroller = (init == true) ? element.getElementById('myScroller') : document.getElementById('myScroller');
	// Calculate the height of the scroller
	scrollerHeight = window.innerHeight - bb.screen.getTitleBarHeight() - actionBarHeight - headerHeight;
	scroller.style.height = scrollerHeight + 'px';
	if (!init) {
		scroller.refresh();
	}
}

// Show the proper display based on the pill button
function titlePillButtons_showList(id) {
	if (id == 'sent') {
		document.getElementById('sent').style.display = 'inline';
		document.getElementById('received').style.display = 'none';
	} else if (id == 'received') {
		document.getElementById('received').style.display = 'inline';
		document.getElementById('sent').style.display = 'none';
	}
}