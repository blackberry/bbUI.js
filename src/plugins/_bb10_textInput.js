_bb10_textInput = { 
    apply: function(elements) {
		var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			i,
			outerElement,
			css;
			
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			css = '';
			// Keep the developers existing styling
			if (outerElement.hasAttribute('class')) {
				css = outerElement.getAttribute('class');
			}
		  
			outerElement.normal = css + ' bb-bb10-input bb-bb10-input-'+res;
			outerElement.focused = css + ' bb-bb10-input-focused bb-bb10-input-focused-'+res+' bb-bb10-input-'+res;
			outerElement.setAttribute('class', outerElement.normal);
			outerElement.isFocused = false;
			outerElement.clickCount = 0;
			outerElement.addEventListener('focus', function() {
														if(this.readOnly == false) {
															this.setAttribute('class',this.focused);
															this.style['border-color'] = bb.options.highlightColor;
															this.isFocused = true;
															this.clickCount = 0;
															}
													}, false);
													
			outerElement.addEventListener('blur', function() {
														this.setAttribute('class',this.normal);	
														this.style['border-color'] = '';
														this.isFocused = false;
														this.removeEventListener('click',outerElement.handleDeleteClick , false);
													}, false);
													
			outerElement.addEventListener('click',function (event) {
												// Don't handle the first click which is the focus
												if (this.clickCount == 0) {
													this.clickCount++;
													return;
												}
												if (event.target == this && this.isFocused) {
													var deleteClicked = false;
													if (bb.device.isPlayBook && event.clientX > (this.clientWidth - 40) && this.readOnly == false) {
														deleteClicked = true;
													} else if(event.clientX > (this.clientWidth - 45) && this.readOnly == false){
														deleteClicked = true;
													}
													if (deleteClicked) {
														this.value = '';
													}
												}
											} , false);
		}
    }
};
