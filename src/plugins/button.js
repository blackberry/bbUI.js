bb.button = { 
    
    // Apply our transforms to all arrow buttons passed in
    apply: function(elements) {
		
        if (bb.device.isBB5) {
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
        } else if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? res = 'lowres' : 'hires';
			for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
					disabledStyle,
					imgSrc,
					caption,
					imgElement,
					captionElement = document.createElement('div'),
					innerElement = document.createElement('div');
                    disabled = outerElement.hasAttribute('data-bb-disabled'),
                    normal = 'bb-bb10-button bb-bb10-button-'+res,
                    highlight = 'bb-bb10-button bb-bb10-button-'+res+' bb10-button-highlight',
					outerNormal = 'bb-bb10-button-container-'+res+' bb-bb10-button-container-' + bb.screen.controlColor,
					outerNormalWithoutImageOnly = outerNormal;
					
                outerElement.isImageOnly = false;
				outerElement.enabled = !disabled;
				caption = outerElement.innerHTML;
				captionElement.innerHTML = caption;
				outerElement.innerHTML = '';
				outerElement.captionElement = captionElement;
				outerElement.appendChild(innerElement);
				outerElement.innerElement = innerElement;
				
                if (outerElement.hasAttribute('data-bb-style')) {
                    var style = outerElement.getAttribute('data-bb-style');
                    if (style == 'stretch') {
					    outerNormal = outerNormal + ' bb-bb10-button-stretch';
                    }
                }
				// look for our image
				imgSrc = outerElement.hasAttribute('data-bb-img') ? outerElement.getAttribute('data-bb-img') : undefined;
				if (imgSrc) {
					if (!caption || caption.length == 0) {
						outerNormal = outerNormal + ' bb-bb10-button-container-image-only-'+res;
						captionElement.style['background-image'] = 'url("'+imgSrc+'")';
						outerElement.style['line-height'] = '0px';
						captionElement.setAttribute('class','bb-bb10-button-caption-with-image-only-'+res);
						outerElement.isImageOnly = true;
					} else {
						// Configure our caption element
						captionElement.setAttribute('class','bb-bb10-button-caption-with-image-'+res);
						imgElement = document.createElement('div');
						outerElement.imgElement = imgElement;
						imgElement.setAttribute('class','bb-bb10-button-image-'+res);
						imgElement.style['background-image'] = 'url("'+imgSrc+'")';
						innerElement.appendChild(imgElement);
					}
				}
				// Insert caption after determining what to do with the image
				innerElement.appendChild(captionElement);
			
				// Set our styles
				disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
				normal = normal + ' bb-bb10-button-' + bb.screen.controlColor;
				
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
							this.captionElement.setAttribute('class','bb-bb10-button-caption-with-image-'+res);
							var imgElement = document.createElement('div');
							this.imgElement = imgElement;
							imgElement.setAttribute('class','bb-bb10-button-image-'+res);
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
							this.captionElement.setAttribute('class','bb-bb10-button-caption-with-image-only-'+res);
							// Reset our image only styling
							this.setAttribute('class',this.outerNormalWithoutImageOnly + ' bb-bb10-button-container-image-only-'+res);
							this.captionElement.style['background-image'] = this.imgElement.style['background-image'];
							this.isImageOnly = true;
							// Remove the image div
							this.innerElement.removeChild(this.imgElement);
							this.imgElement = null;
						}
						this.captionElement.innerHTML = value;
					};
					
				// Assign our set image function
				outerElement.setImage = function(value) {
						if (this.isImageOnly) {
							this.captionElement.style['background-image'] = 'url("'+value+'")';
						} else if (this.imgElement && (value.length > 0)) {
							this.imgElement.style['background-image'] = 'url("'+value+'")';
						} else if (value.length > 0){
							// Configure our caption element
							this.captionElement.setAttribute('class','bb-bb10-button-caption-with-image-'+res);
							var imgElement = document.createElement('div');
							this.imgElement = imgElement;
							imgElement.setAttribute('class','bb-bb10-button-image-'+res);
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
                // Assign our disable function
                outerElement.disable = function(){ 
                        if (!this.enabled) return;
                        this.innerElement.setAttribute('class', this.innerElement.disabledStyle);
						this.ontouchstart = null;
                        this.ontouchend = null;
                        this.enabled = false;
                    };
            }
		} else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    disabled = outerElement.hasAttribute('data-bb-disabled'),
                    normal = 'bb-bb7-button',
                    highlight = 'bb-bb7-button-highlight',
					inEvent,
					outEvent;
					
				// Set our highlight events
				if (bb.device.isPlayBook) {
					inEvent = 'ontouchstart';
					outEvent = 'ontouchend';
				} else {
					inEvent = 'onmouseover';
					outEvent = 'onmouseout';
				}
                    
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
                        normal = normal + ' button-stretch';
                        highlight = highlight + ' button-stretch';
                    }
                }
                outerElement.setAttribute('class',normal);
                if (!disabled) {
                    outerElement.setAttribute('x-blackberry-focusable','true');
					outerElement.setAttribute(inEvent,"this.setAttribute('class','" + highlight +"')");
					outerElement.setAttribute(outEvent,"this.setAttribute('class','" + normal + "')");
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
				
                // Assign our enable function
                outerElement.enable = function(){
                        if (this.enabled) return;
                        var normal = 'bb-bb7-button',
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
						this.setAttribute(inEvent,"this.setAttribute('class','" + highlight +"')");
						this.setAttribute(outEvent,"this.setAttribute('class','" + normal + "')");
                        this.enabled = true;
                    };
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
                        this.removeAttribute('onmouseover');
                        this.removeAttribute('onmouseout');
						this.removeAttribute('ontouchstart');
                        this.removeAttribute('ontouchend');
                        this.enabled = false;
                    };
            }
        }
    }
};