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

var percent = 3;
		  
function setValuesToPercent(percent) {
   var gauge = document.getElementById('gauge0');
	setPercent(gauge, percent);
	gauge = document.getElementById('gauge1');
	setPercent(gauge, percent);
	gauge = document.getElementById('gauge2');
	setPercent(gauge, percent);
}
  
function doTimedEvent() {
	if (percent > 100) {
		percent = 3;
		return;
	}
	setValuesToPercent(percent);
	percent = percent + 3;
	setTimeout('doTimedEvent()', 100);          
}
  
function setPercent(gauge, percent) {
	var percentValue = percent / 100;
	var gaugeWidth = percentValue * gauge.parentNode.clientWidth;
	gauge.style.width = gaugeWidth + 'px';
}