/*
* Copyright 2010-2011 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

  var dislider =false;
  var rmvSlider =false;

 function moveSlider( myslider ){ 
	 if( dislider==false && rmvSlider==false ){ 
		 var value,
			 step = 5,
			 max,
			 slider;
			 myslider = myslider;
		     slider = document.getElementById("myslider");
		     value = parseInt(slider.value);
		     //step = parseInt(slider.step);
		     max = parseInt(slider.max);
		     if (value + step > max) return;
		     slider.setValue(value + step);	
		     setTimeout('moveSlider()', 100);  
	}
 }

 //Method that hides the slider 
 function hideSlider( myslider ) {
	 myslider = myslider;
	 document.getElementById('myslider').parentNode.style.display = "none" ; 
 }


 //Method that shows the slider again after hiding it
 function showSlider( myslider ) {
	 myslider = myslider ;
	 document.getElementById('myslider').parentNode.style.display = 'block' ;
}


//Method that disable the movement of the slider
 function disableSlider( myslider ) { 
	  myslider = myslider ;
	  myslider.isActivated =false;
	  dislider =true; 
 }


//Method that enable the movement of the slider
 function enableSlider( myslider ){
	 myslider =myslider;
	 dislider =false;
	 myslider.isActivated =true;
 }


//Method that remove all the container of the slider
 function removeSlider( myslider ) {
	 myslider =myslider;
	 var div =document.getElementById('myslider').parentNode.parentNode.parentNode;    
	 div.parentNode.removeChild(div) ;
	 rmvSlider =true; 	
 }