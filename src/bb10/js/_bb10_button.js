_bb10_button = { 
    // Apply styling for a list of buttons
	apply: function(elements) {	
		for (var i = 0; i < elements.length; i++) {
			bb.button.style(elements[i]);
		}
	},
	// Style an individual button
	style: function(outerElement) {
		var disabledStyle,
			imgSrc,
			caption,
			imgElement,
			outerNormalWithoutImageOnly,
			highlight,
			captionElement = document.createElement('div'),
			innerElement = document.createElement('div');
			disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal = 'bb-button',
			outerNormal = 'bb-button-container bb-button-container-' + bb.screen.controlColor;

		if (bb.device.newerThan10dot1) {
			normal += ' bb-button-10dot2';
			outerNormal += ' bb-button-container-10dot2';
			highlight = 'bb-button bb-button-10dot2 bb-button-'+ bb.screen.controlColor + ' bb-button-'+ bb.screen.controlColor + '-highlight-10dot2';
		} else {
			highlight = 'bb-button bb10-button-highlight';
		}
		outerNormalWithoutImageOnly = outerNormal;	
		outerElement.isImageOnly = false;
		outerElement.enabled = !disabled;
		caption = outerElement.innerHTML;
		captionElement.innerHTML = caption;
		outerElement.innerHTML = '';
		outerElement.stretched = false;
		outerElement.captionElement = captionElement;
		outerElement.appendChild(innerElement);
		outerElement.innerElement = innerElement;
		
		if (outerElement.hasAttribute('data-bb-style')) {
			var style = outerElement.getAttribute('data-bb-style');
			if (style == 'stretch') {
				outerNormal = outerNormal + ' bb-button-stretch';
				outerElement.stretched = true;
			}
		}
		// look for our image
		imgSrc = outerElement.hasAttribute('data-bb-img') ? outerElement.getAttribute('data-bb-img') : undefined;
		if (imgSrc) {
			if (!caption || caption.length == 0) {
				if (bb.device.newerThan10dot1) {
					outerNormal = outerNormal + ' bb-button-container-image-only bb-button-caption-with-image-only_10dot2';
					captionElement.setAttribute('class','bb-button-caption-with-image-only bb-button-caption-with-image-only_10dot2');
				} else {
					outerNormal = outerNormal + ' bb-button-container-image-only';
					captionElement.setAttribute('class','bb-button-caption-with-image-only');
				}
				captionElement.style['background-image'] = 'url("'+imgSrc+'")';
				outerElement.style['line-height'] = '0px';
				
				outerElement.isImageOnly = true;
			} else {
				// Configure our caption element
				captionElement.setAttribute('class','bb-button-caption-with-image');
				imgElement = document.createElement('div');
				outerElement.imgElement = imgElement;
				if (bb.device.newerThan10dot1) {
					imgElement.setAttribute('class','bb-button-image bb-button-image-10dot2');
				} else {
					imgElement.setAttribute('class','bb-button-image');
				}
				
				imgElement.style['background-image'] = 'url("'+imgSrc+'")';
				innerElement.appendChild(imgElement);
			}
		}
		// Insert caption after determining what to do with the image
		innerElement.appendChild(captionElement);
	
		// Set our styles
		disabledStyle = normal + ' bb-button-disabled-'+bb.screen.controlColor;
		normal = normal + ' bb-button-' + bb.screen.controlColor;
		
		if (disabled) {
			outerElement.removeAttribute('data-bb-disabled');
			innerElement.setAttribute('class',disabledStyle);
		} else {
			innerElement.setAttribute('class',normal);
		}
		// Set our variables on the elements
		outerElement.setAttribute('class',outerNormal);
		outerElement.outerNormal = outerNormal;
		outerElement.outerNormalWithoutImageOnly = outerNormalWithoutImageOnly;
		outerElement.innerElement = innerElement;
		innerElement.normal = normal;
		innerElement.highlight = highlight;
		innerElement.disabledStyle = disabledStyle;
		if (!disabled) {
			outerElement.ontouchstart = function() {
									this.innerElement.setAttribute('class', this.innerElement.highlight);
									
								};
			outerElement.ontouchend = function() {
									this.innerElement.setAttribute('class', this.innerElement.normal);
								};
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
				if (this.isImageOnly && (value.length > 0)) {
					// Configure our caption element
					this.captionElement.setAttribute('class','bb-button-caption-with-image');
					var imgElement = document.createElement('div');
					this.imgElement = imgElement;
					imgElement.setAttribute('class','bb-button-image');
					imgElement.style['background-image'] = this.captionElement.style['background-image'];
					// Remove and re-order the caption element
					this.innerElement.removeChild(this.captionElement);
					this.innerElement.appendChild(imgElement);
					this.innerElement.appendChild(this.captionElement);
					// Reset our image only styling
					this.setAttribute('class',this.outerNormalWithoutImageOnly);
					this.captionElement.style['background-image'] = '';
					this.isImageOnly = false;
				} else if ((value.length == 0) && this.imgElement) {
					this.captionElement.setAttribute('class','bb-button-caption-with-image-only');
					// Reset our image only styling
					this.setAttribute('class',this.outerNormalWithoutImageOnly + ' bb-button-container-image-only');
					this.captionElement.style['background-image'] = this.imgElement.style['background-image'];
					this.isImageOnly = true;
					// Remove the image div
					this.innerElement.removeChild(this.imgElement);
					this.imgElement = null;
				}
				this.captionElement.innerHTML = value;
			};
			
		// Returns the caption of the button
		outerElement.getCaption = function() {
			return this.captionElement.innerHTML;
		};
		outerElement.getCaption = outerElement.getCaption.bind(outerElement);
			
		// Assign our set image function
		outerElement.setImage = function(value) {
				if (this.isImageOnly) {
					this.captionElement.style['background-image'] = 'url("'+value+'")';
				} else if (this.imgElement && (value.length > 0)) {
					this.imgElement.style['background-image'] = 'url("'+value+'")';
				} else if (value.length > 0){
					// Configure our caption element
					this.captionElement.setAttribute('class','bb-button-caption-with-image');
					var imgElement = document.createElement('div');
					this.imgElement = imgElement;
					imgElement.setAttribute('class','bb-button-image');
					imgElement.style['background-image'] = 'url("'+value+'")';
					// Remove and re-order the caption element
					this.innerElement.removeChild(this.captionElement);
					this.innerElement.appendChild(imgElement);
					this.innerElement.appendChild(this.captionElement);
				} else if (this.imgElement && (value.length == 0)){
					// Supplied an empty image value
					this.innerElement.removeChild(this.imgElement);
					this.imgElement = null;
					this.captionElement.setAttribute('class','');
				}
			};
			
		// Returns image url
		outerElement.getImage = function() {
			if (this.isImageOnly) {
				return this.captionElement.style['background-image'].slice(4, -1);
			} else if (this.imgElement) {
				return this.imgElement.style['background-image'].slice(4, -1);
			} else {
				return '';
			}
		};
		outerElement.getImage = outerElement.getImage.bind(outerElement);
		
		// Assign our enable function
		outerElement.enable = function(){ 
				if (this.enabled) return;
				this.innerElement.setAttribute('class', this.innerElement.normal);
				this.ontouchstart = function() {
									this.innerElement.setAttribute('class', this.innerElement.highlight);
									
								};
				this.ontouchend = function() {
									this.innerElement.setAttribute('class', this.innerElement.normal);
								};
				this.enabled = true;
			};
		outerElement.enable = outerElement.enable.bind(outerElement);
		
		// Assign our disable function
		outerElement.disable = function(){ 
				if (!this.enabled) return;
				this.innerElement.setAttribute('class', this.innerElement.disabledStyle);
				this.ontouchstart = null;
				this.ontouchend = null;
				this.enabled = false;
			};
		outerElement.disable = outerElement.disable.bind(outerElement);
		
		// Assign our show function
		outerElement.show = function(){ 
				this.style.display = this.stretched ? 'block' : 'inline-block';
				bb.refresh();
			};
		outerElement.show = outerElement.show.bind(outerElement);
		
		// Assign our hide function
		outerElement.hide = function(){ 
				this.style.display = 'none';
				bb.refresh();
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