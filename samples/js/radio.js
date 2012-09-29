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

radioStatus = "enabled";

function enableDisableGroup(groupName){
		
		radios = document.getElementsByName( groupName );
    	
		if (radioStatus == "enabled"){
			document.getElementById('group-status').innerHTML = "Disabled";
			radioStatus = "disabled";
			for( i = 0; i < radios.length; i++ ) {
		    	radios[i].disabled = true;
		    	radios[i].nextSibling.style.background = 'rgba(89,89,89,0.5)';
		    }
		}
		else{
			document.getElementById('group-status').innerHTML = "Enabled";
			radioStatus = "enabled";
			for( i = 0; i < radios.length; i++ ) {
		    	radios[i].disabled = false;
		    	if (radios[i].checked){
		    		radios[i].nextSibling.style.background = '-webkit-linear-gradient(top,  rgb('+ (bb.options.shades.R + 32) +', '+ (bb.options.shades.G + 32) +', '+ (bb.options.shades.B + 32) +') 0%, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 100%)';
		    	}
		    	else{
		    		radios[i].nextSibling.style.background = '';
		    	}
		    }
		}
}

function getGroupStatus(groupName){
	var radios = document.getElementsByName( groupName );
	var status = "";
	for (i = 0; i < radios.length; i++){
		if (status == ""){
			status = radios[i].disabled;
		}
		else{
			if (status != radios[i].disabled){
				return null;
			}
		}
	}
	return status;
}

function getRadioStatus(radioId){
	return document.getElementById(radioId).disabled;
}
