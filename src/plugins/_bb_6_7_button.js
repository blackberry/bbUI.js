_bb_6_7_button = { 
    apply: function(elements) {  
		for (var i = 0; i < elements.length; i++) {
			bb.button.style(elements[i]);
		}
	},
	
	style: function(outerElement) {
		var disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal = 'bb-bb7-button',
			highlight = 'bb-bb7-button-highlight';

		outerElement.stretched = false;
		outerElement.enabled = !disabled;
		if (disabled) {
			normal = 'bb-bb7-button-disabled';
			outerElement.removeAttribute('data-bb-disabled');
		}	
		if (bb.device.isHiRes) {
			normal = normal + ' bb-bb7-button-hires';
			highlight = highlight + ' bb-bb7-button-hires';
		} else {
			normal = normal + ' bb-bb7-button-lowres';
			highlight = highlight + ' bb-bb7-button-lowres';
		}
		if (outerElement.hasAttribute('data-bb-style')) {
			var style = outerElement.getAttribute('data-bb-style');
			if (style == 'stretch') {
				outerElement.stretched = true;
				normal = normal + ' button-stretch';
				highlight = highlight + ' button-stretch';
			}
		}
		outerElement.highlight = highlight;
		outerElement.normal = normal;
		outerElement.setAttribute('class',normal);
		if (!disabled) {
			outerElement.setAttribute('x-blackberry-focusable','true');
			outerElement.onmouseover = function() {
								this.setAttribute('class',this.highlight);
							}
			outerElement.onmouseout = function() {
								this.setAttribute('class',this.normal);
							}
		}
						
		// Trap the click and call it only if the button is enabled
		outerElement.trappedClick = outerElement.onclick;
		outerElement.onclick = undefined;
		if (outerElement.trappedClick !== null) {
			outerElement.addEventListener('click',function (e) {
					if (this.enabled) {
						this.trappedClick();
					}
				},false);
		}
		
		// Assign our set caption function
		outerElement.setCaption = function(value) {
				this.innerHTML = value;
			};
		outerElement.setCaption = outerElement.setCaption.bind(outerElement);
		
		// Assign our get caption function
		outerElement.getCaption = function(value) {
				return this.innerHTML;
			};
		outerElement.getCaption = outerElement.getCaption.bind(outerElement);
		
		// Assign our set image function
		outerElement.setImage = function(value) {
				// Not yet implemented
			};
		outerElement.setImage = outerElement.setImage.bind(outerElement);
		
		// Assign our get image function
		outerElement.getImage = function(value) {
				return '';
			};
		outerElement.getImage = outerElement.getImage.bind(outerElement);
		
		// Assign our enable function
		outerElement.enable = function(){
				if (this.enabled) return;
			/*	var normal = 'bb-bb7-button',
					highlight = 'bb-bb7-button-highlight';
				
				if (bb.device.isHiRes) {
					normal = normal + ' bb-bb7-button-hires';
					highlight = highlight + ' bb-bb7-button-hires';
				} else {
					normal = normal + ' bb-bb7-button-lowres';
					highlight = highlight + ' bb-bb7-button-lowres';
				}

				if (this.hasAttribute('data-bb-style')) {
					var style = this.getAttribute('data-bb-style');
					if (style == 'stretch') {
						normal = normal + ' button-stretch';
						highlight = highlight + ' button-stretch';
					}
				}
				this.setAttribute('class',normal);
				this.setAttribute('x-blackberry-focusable','true');
				this.setAttribute('onmouseover',"this.setAttribute('class','" + highlight +"')");
				this.setAttribute('onmouseout',"this.setAttribute('class','" + normal + "')");*/
				this.setAttribute('class',normal);
				this.setAttribute('x-blackberry-focusable','true');
				this.onmouseover = function() {
								this.setAttribute('class',this.highlight);
							}
				this.onmouseout = function() {
								this.setAttribute('class',this.normal);
							}
				this.enabled = true;
			};
		outerElement.enable = outerElement.enable.bind(outerElement);
		
		// Assign our disable function
		outerElement.disable = function(){
				if (!this.enabled) return;
				var normal = 'bb-bb7-button-disabled';
				
				if (bb.device.isHiRes) {
					normal = normal + ' bb-bb7-button-hires';
				} else {
					normal = normal + ' bb-bb7-button-lowres';
				}

				if (this.hasAttribute('data-bb-style')) {
					var style = this.getAttribute('data-bb-style');
					if (style == 'stretch') {
						normal = normal + ' button-stretch';
						highlight = highlight + ' button-stretch';
					}
				}
				this.setAttribute('class',normal);
				this.removeAttribute('x-blackberry-focusable');
				this.onmouseover = null;
				this.onmouseout = null;
				this.enabled = false;
			};
		outerElement.disable = outerElement.disable.bind(outerElement);

		// Assign our show function
		outerElement.show = function(){ 
				this.style.display = this.stretched ? 'block' : 'inline-block';
			};
		outerElement.show = outerElement.show.bind(outerElement);
		
		// Assign our hide function
		outerElement.hide = function(){ 
				this.style.display = 'none';
			};
		outerElement.hide = outerElement.hide.bind(outerElement);	
		
		// Assign our remove function
		outerElement.remove = function(){ 
				this.parentNode.removeChild(this);
				bb.refresh();
			};
		outerElement.remove = outerElement.remove.bind(outerElement);		

		return outerElement;
    }
};