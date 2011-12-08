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



function loadPushListeners() {
	if (blackberry.message) {
		blackberry.message.sms.addReceiveListener(onSMS);
	}
}

function unloadPushListeners() {
	if (blackberry.message) {
		blackberry.message.sms.removeReceiveListener();
	}
}

function onSMS(message, sender, dateTime) {
	insertText(message,'right');
}


function insertText(data, direction) {
	var topContent = document.getElementById('chatWindow');
	var newEntry= document.createElement('div');
	newEntry.setAttribute('data-bb-type', 'bbm-bubble');
	newEntry.setAttribute('data-bb-style', direction);
	var text = document.createElement('div');
	newEntry.appendChild(text);
	text.setAttribute('data-bb-type', 'item');
	text.setAttribute('data-bb-img', 'images/bbmBubbles/bullet.png');
	text.innerHTML = data;
	
	topContent.appendChild(newEntry);
	var elements = [];
	elements.push(newEntry);
	bb.bbmBubble.apply(elements);
}

loadPushListeners();