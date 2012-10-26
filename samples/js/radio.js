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
function hideRadios(){
	document.getElementById('control1').hide();
	document.getElementById('control2').hide();
	document.getElementById('control3').hide();
}

function showRadios(){
	document.getElementById('control1').show();
	document.getElementById('control2').show();
	document.getElementById('control3').show();
}

function removeRadios(){
	document.getElementById('control1').remove();
	document.getElementById('control2').remove();
	document.getElementById('control3').remove();
}
