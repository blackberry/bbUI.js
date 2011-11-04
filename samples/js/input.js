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

// Pre-load our images for hover effects
image3 = new Image();
image3.src =  'images/input/no.png';
image4 = new Image();
image4.src = 'images/input/noSel.png';
image5 = new Image();
image5.src = 'images/input/off.png';
image6 = new Image();
image6.src = 'images/input/offSel.png';
image7 = new Image();
image7.src = 'images/input/on.png';
image8 = new Image();
image8.src =  'images/input/onSel.png';	
image9 = new Image();
image9.src =  'images/input/yes.png';
image10 = new Image();
image10.src =  'images/input/yesSel.png';

var cityIndex = 2;


addEventListener('load',doInputLoad,false);

function doInputLoad() {
    var element = document.getElementById('edit1');
    element.style.width = screen.width - element.offsetLeft - 30 + 'px';
    element = document.getElementById('edit2');
    element.style.width = screen.width - element.offsetLeft - 30 + 'px';
}

function doSelect() {
    resetImages();
    var button = document.getElementById('button');
    button.style.backgroundPosition = 'bottom right';
    button.firstChild.style.backgroundPosition = 'bottom left';
}

function evaluateYesNo(id) {
    var element = document.getElementById(id);
    if (element.src.indexOf('/yes') > -1)
        return true;	
    else if (element.src.indexOf('/on') > -1)
        return true;	
    else
        return false;		    
}

function doYesNoClick(id) {
    resetImages();  
    var element = document.getElementById(id);
    if (element.src.indexOf('images/input/yes') > -1)
        element.src = 'images/input/noSel.png';	
    else if (element.src.indexOf('images/input/on') > -1)
        element.src = 'images/input/offSel.png';	
    else if (element.src.indexOf('images/input/no') > -1)
        element.src = 'images/input/yesSel.png';	
    else if (element.src.indexOf('images/input/off') > -1)
        element.src = 'images/input/onSel.png';	    
}

function doYesNoSelect(id) {
    if (blackberry.focus.getFocus() != id) 
        return;
    resetImages();

    var element = document.getElementById(id);
    if (element.src.indexOf('/yes.png') > -1)
        element.src = 'images/input/yesSel.png';	
    else if (element.src.indexOf('/on.png') > -1)
        element.src = 'images/input/onSel.png';	
    else if (element.src.indexOf('/off.png') > -1)
        element.src = 'images/input/offSel.png';
    else if (element.src.indexOf('/no.png') > -1)
        element.src = 'images/input/noSel.png';
}

function doYesNoUnSelect(element) {
    if (element.src.indexOf('images/input/yes') > -1)
        element.src = 'images/input/yes.png';	
    else if (element.src.indexOf('images/input/on') > -1)
        element.src = 'images/input/on.png';	 
    else if (element.src.indexOf('images/input/off') > -1)
        element.src = 'images/input/off.png';
    else if (element.src.indexOf('images/input/no') > -1)
        element.src = 'images/input/no.png';	 	 
}


function resetImages() {
    var button = document.getElementById('button');
    button.style.backgroundPosition = 'top right';
    button.firstChild.style.backgroundPosition = 'top left';
    doYesNoUnSelect(document.getElementById('a'));
    doYesNoUnSelect(document.getElementById('b'));
    doYesNoUnSelect(document.getElementById('c'));
    doYesNoUnSelect(document.getElementById('d'));
}

function openSpinner() {
    doSelect();   
	
	var rowHeight;
    var visibleRows;

    // Populate our items
    var items = new Array('Barcelona', 'Beijing', 'Brasilia', 'Melbourne', 'Moscow', 'New York', 'Paris' );

    // Figure out our height and rows based on screen size
    if (screen.height < 480){
      rowHeight = 60;
      visibleRows = 3;
    }
    else {
      rowHeight = 75;
      visibleRows = 4;
    }

    // Configure the options 
    var options = {'title': 'Choose A City:',
      'rowHeight': rowHeight,
      'visibleRows': visibleRows,
      'selectedIndex': 2,
      'items' : items};

	blackberry.ui.Spinner.open(options, function (selectedIndex) {
          if (selectedIndex != undefined)
			document.getElementById('button').firstChild.innerHTML = items[selectedIndex]; }     
    );  
}