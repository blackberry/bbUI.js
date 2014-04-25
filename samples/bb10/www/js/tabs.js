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

addEventListener('load',doInputLoad,false);

var addressTab = null;
var contactTab = null;
var phoneTab = null;
var selectedButton = 'btnContact';

function doInputLoad() {
    var items = document.getElementsByTagName('input');
    for (var i = 0; i < items.length; i++) {
        var element = items[i];
        element.style.width = screen.width - element.offsetLeft - 50 + 'px';
    }  
    // All the sections are visible to start off with so that the above 
    // size calculations work 
    var width = (screen.width - 20) + 'px';
    addressTab = document.getElementById('address');
    addressTab.style.width = width;
    addressTab.style.display = 'none';
    phoneTab = document.getElementById('phone');
    phoneTab.style.width = width;
    phoneTab.style.display = 'none';
    contactTab = document.getElementById('contact');
    contactTab.style.width = width;
    contactTab.style.display = 'none';
    contactTab.style.display = 'inline';
    // Select our tab
    doSelect('btnContact');
}

function resetImages() {
    doSelect(selectedButton);
}

function doSelect(id) {
 
    var button = document.getElementById(id);
    button.style.backgroundPosition = 'bottom right';
    button.childNodes[1].style.backgroundPosition = 'bottom left';
        
    if (id == 'btnContact') {
        // Reset phone and address
        resetButton('btnAddress');
        resetButton('btnPhone');  
    }
    else if (id == 'btnAddress'){
        // Reset phone and contact
        resetButton('btnPhone');
        resetButton('btnContact');   
    }    
    else if(id == 'btnPhone') {
        // Reset address and contact
        resetButton('btnAddress');
        resetButton('btnContact');
    }    
}

function doHover(id) {
    if (blackberry.focus.getFocus() != id) 
        return;
        
    var button = document.getElementById(id);
    button.style.backgroundPosition = 'bottom right';
    button.childNodes[1].style.backgroundPosition  = 'bottom left';
        
    if (id == 'btnContact') {
        // Reset phone and address
        if (selectedButton != 'btnAddress') resetButton('btnAddress');
        if (selectedButton != 'btnPhone') resetButton('btnPhone');  
    }
    else if (id == 'btnAddress'){
        // Reset phone and contact
        if (selectedButton != 'btnPhone') resetButton('btnPhone');
        if (selectedButton != 'btnContact') resetButton('btnContact');   
    }    
    else if(id == 'btnPhone') {
        // Reset address and contact
        if (selectedButton != 'btnAddress') resetButton('btnAddress');
        if (selectedButton != 'btnContact') resetButton('btnContact');
    }   
}


function resetButton(id) {
    var button = document.getElementById(id);
    button.style.backgroundPosition = 'top right';
    button.childNodes[1].style.backgroundPosition  = 'top left'; 
}

function selectPhone() {
    selectedButton = 'btnPhone';
    doSelect(selectedButton);
    phoneTab.style.display = 'inline';
    addressTab.style.display = 'none';
    contactTab.style.display = 'none';
}

function selectAddress() {
    selectedButton = 'btnAddress';
    doSelect(selectedButton);
    addressTab.style.display = 'inline';
    phoneTab.style.display = 'none';
    contactTab.style.display = 'none';
}

function selectContact() {
    selectedButton = 'btnContact';
    doSelect(selectedButton);
    addressTab.style.display = 'none';
    phoneTab.style.display = 'none';
    contactTab.style.display = 'inline';
}