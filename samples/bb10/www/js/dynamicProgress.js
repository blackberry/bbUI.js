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

var percent = 4,
	paused = false;
		  
function setValuesToPercent(percent) {
	gauge = document.getElementById('progress1');
	gauge.setValue(percent);
}
  
function doTimedEvent() {
	if (paused) {
		document.getElementById('reset').enable();
		document.getElementById('pause').disable();
		document.getElementById('error').disable();
		document.getElementById('watch').enable();
		return;
	}
	if (percent > document.getElementById('progress1').max) {
		percent = 4;
		document.getElementById('reset').enable();
		document.getElementById('pause').disable();
		document.getElementById('error').disable();
		document.getElementById('watch').enable();
		return;
	}
	setValuesToPercent(percent);
	percent = percent + 4;
	setTimeout('doTimedEvent()', 100);          
}

function watchProgress() {
	paused = false;
	document.getElementById('progress1').setState(bb.progress.NORMAL);
	document.getElementById('watch').disable();
	document.getElementById('reset').disable();
	document.getElementById('pause').enable();
	document.getElementById('error').enable();
	doTimedEvent();
}

function showProgress() {
	document.getElementById('progress2').show();
}

function hideProgress() {
	document.getElementById('progress2').hide();
}

function addRemoveIndicator() {
	var container = document.getElementById('progressContainer'),
		button = document.getElementById('addRemove'),
		progress,
		id = 'newIndicator';
		
	// Add indicator
	if (!button.flag) {
		button.setCaption('Remove Progress Bar');
		button.flag = true;
		// Create our progress bar
		progress = document.createElement('progress');
		progress.setAttribute('max','100');
		progress.setAttribute('value','10');
		progress.setAttribute('id',id);
		progress = bb.progress.style(progress);
		container.appendChild(progress);
		bb.refresh();
	} else {// Remove indicator
		button.setCaption('Add Progress Bar');
		button.flag = false;
		progress = document.getElementById(id);
		progress.remove();
	}	
}



  
