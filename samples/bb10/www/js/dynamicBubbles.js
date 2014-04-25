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

function showBubbles() {
	document.getElementById('myBBMBubble').show();
	document.getElementById('myBBMBubble1').show();
}

function hideBubbles() {
	document.getElementById('myBBMBubble').hide();
	document.getElementById('myBBMBubble1').hide();
}

function removeBubbles() {
	document.getElementById('myBBMBubble').remove();
	document.getElementById('myBBMBubble1').remove();
}

function swapBubbles() {
	document.getElementById('myBBMBubble').setStyle("left");
	document.getElementById('myBBMBubble1').setStyle("right");
}

function addRemoveBubble() {
	var container = document.getElementById('bubbleContainer'),
		button = document.getElementById('addRemove'),
		bubble,
		id = 'newBubble';
		
	// Add bubble
	if (!button.flag) {
		button.setCaption('Remove BBM Bubble');
		button.flag = true;
		
		// TODO: Add logic to add bubble
		
	} else {// Remove bubble
		button.setCaption('Add BBM Bubble');
		button.flag = false;
		/*bubble = document.getElementById(id);
		bubble.remove();*/
	}	
}

function getBubbles() {
	alert("BBM Bubble 1 direction: " + document.getElementById('myBBMBubble').getStyle() + "\nBBM Bubble 2 direction: " + document.getElementById('myBBMBubble1').getStyle());	
}