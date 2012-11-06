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
function hideToggle(){
	document.getElementById('choiceOne').hide();
	document.getElementById('choiceTwo').hide();
	document.getElementById('choiceThree').hide();
}

function showToggle(){
	document.getElementById('choiceOne').show();
	document.getElementById('choiceTwo').show();
	document.getElementById('choiceThree').show();
}

function removeToggle(){
	document.getElementById('choiceOne').remove();
	document.getElementById('choiceTwo').remove();
	document.getElementById('choiceThree').remove();
}

function changeCaptions(){
	document.getElementById('choiceOne').setOffCaption('Non');
	document.getElementById('choiceOne').setOnCaption('Oui');
	document.getElementById('choiceTwo').setOffCaption('No');
	document.getElementById('choiceTwo').setOnCaption('Yes');
	document.getElementById('choiceThree').setOffCaption('Off');
	document.getElementById('choiceThree').setOnCaption('On');
}
