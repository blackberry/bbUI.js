
function dataOnLoad_initialLoad(element) {
	var listItem, dataList = element.getElementById('dataList');
	for (var i = 1; i < 10; i++) {
		listItem = document.createElement('div');
		listItem.setAttribute('data-bb-type', 'item');
		listItem.setAttribute('data-bb-img', 'images/icons/icon11.png');
		listItem.setAttribute('data-bb-title', 'Title ' + i);
		listItem.innerHTML = 'My description ' + i;
		dataList.appendChild(listItem);
	}
}