_bb5_button = {
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var outerElement = elements[i],
				caption = outerElement.innerHTML,
				normal = 'bb5-button',
				highlight = 'bb5-button-highlight';

			outerElement.innerHTML = '';
			outerElement.setAttribute('class','bb-bb5-button');
			var button = document.createElement('a');
			button.setAttribute('class',normal);
			button.setAttribute('x-blackberry-focusable','true');
			button.setAttribute('onmouseover',"this.setAttribute('class','" + highlight +"')");
			button.setAttribute('onmouseout',"this.setAttribute('class','" + normal + "')");
			outerElement.appendChild(button);
			var span = document.createElement('span');
			span.innerHTML = caption;
			button.appendChild(span);
		}
	}
}