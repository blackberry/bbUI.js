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

var imgChart1 = new Image();
var imgChart2 = new Image();
var urlChart1 = "http://chart.apis.google.com/chart?cht=p3&chs=250x100&chd=t:60,40&chl=Hello|World";            
var urlChart2 = "http://chart.apis.google.com/chart?cht=bvg&chs=170x100&chd=t:20,30,40|25,35,45&chco=4D89F9,C6D9FD&chdl=Cats|Dogs&chbh=10,1,6&chxt=x,y&chxl=0:|Jan|Feb|Mar";

setTimeout('loadCharts()', 300);

function loadCharts() {
// Configure our first chart to display once it has loaded
imgChart1.onload = function () {
		document.getElementById('chart1').innerHTML = '<img src="'+ urlChart1 + '" />';
	}
imgChart1.src = urlChart1;

// Configure our second chart to display once it has loaded
imgChart2.onload = function () {
		document.getElementById('chart2').innerHTML = '<img src="'+ urlChart2 + '" />';
	}
imgChart2.src = urlChart2;
}     