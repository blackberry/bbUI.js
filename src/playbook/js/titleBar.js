bb.titleBar = {

	apply: function(titleBar) {
		titleBar.setAttribute('class', 'pb-title-bar');
		titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
		if (titleBar.hasAttribute('data-bb-back-caption')) {
			var button = document.createElement('div'), 
				buttonInner = document.createElement('div');
			button.setAttribute('class', 'pb-title-bar-back');
			button.onclick = bb.popScreen;
			buttonInner.setAttribute('class','pb-title-bar-back-inner');
			buttonInner.innerHTML = titleBar.getAttribute('data-bb-back-caption'); 
			button.appendChild(buttonInner);
			titleBar.appendChild(button);
		}
	}
};