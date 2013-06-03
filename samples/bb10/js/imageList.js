/*
* Copyright 2013 Research In Motion Limited.
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

function createHeader() {
	var header = document.createElement('div');
	header.setAttribute('data-bb-type','header');
	header.innerText = 'New Header';
	return header;
}

function createItem() {
	var item = document.createElement('div');
	item.setAttribute('data-bb-type', 'item');
	item.setAttribute('data-bb-img', 'images/imageList/4.jpg');
	item.setAttribute('data-bb-title', 'New Item');
	item.innerText = 'New Caption';
	return item;
}