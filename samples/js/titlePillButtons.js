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
function titlePillButtons_Init() {
	window.addEventListener('resize', titlePillButtons_HandleResize,false);
	titlePillButtons_HandleResize();
}

// Remove our document event listeners
function titlePillButtons_UnInit() {
	window.removeEventListener('resize', titlePillButtons_HandleResize,false);
}

// Adjust the height of the scroller based on orientation
function titlePillButtons_HandleResize() {
	var headerHeight = bb.device.isPlayBook ? 65 : 120,
		actionBarHeight = bb.device.isPlayBook ? 73 : 140,
		scrollerHeight = 0,
		scroller = document.getElementById('myScroller');
	// Calculate the height of the scroller
	scrollerHeight = window.innerHeight - headerHeight - actionBarHeight - document.getElementById('header').offsetHeight;
	scroller.style.height = scrollerHeight + 'px';
	scroller.refresh();
	scroller.style['-webkit-transition'] = 'all 0.2s ease-in-out';
	scroller.style['-webkit-backface-visibility'] = 'hidden';
	scroller.style['-webkit-perspective'] = '1000';
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