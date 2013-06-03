_bbPlayBook_textInput = { 
    apply: function(elements) {
		var i,
			outerElement,
			css;
			
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			css = '';
			// Keep the developers existing styling
			if (outerElement.hasAttribute('class')) {
				css = outerElement.getAttribute('class');
			}
		  
			outerElement.normal = css + ' bb-pb-input';
			outerElement.focused = css + ' bb-pb-input-focused bb-pb-input';
			outerElement.setAttribute('class', outerElement.normal);
			outerElement.isFocused = false;
			outerElement.clickCount = 0;
			outerElement.addEventListener('focus', function() {
														if(this.readOnly == false) {
															this.setAttribute('class',this.focused);
															this.isFocused = true;
															this.clickCount = 0;
														}
													}, false);
													
			outerElement.addEventListener('blur', function() {
														this.setAttribute('class',this.normal);	
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
													if (event.clientX > (this.clientWidth - 40) && this.readOnly == false) {
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