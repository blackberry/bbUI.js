bb.button = { 
    
    // Apply our transforms to all arrow buttons passed in
    apply: function(elements) {
		
        if (bb.device.isBB5) {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    caption = outerElement.innerHTML,
                    normal = 'bb5-button',
                    highlight = 'bb5-button-highlight';

                /*if (outerElement.hasAttribute('data-bb-style')) {
                    var style = outerElement.getAttribute('data-bb-style');
                    if (style == 'stretch') {
                        normal = normal + ' button-stretch';
                        highlight = highlight + ' button-stretch';
                    }
                }*/
                outerElement.innerHTML = '';
                outerElement.setAttribute('class','bb-bb5-button');
                var button = document.createElement('a');
                //button.setAttribute('href','#');
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
			var res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
			for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
					disabledStyle,
					innerElement = document.createElement('div');
                    disabled = outerElement.hasAttribute('data-bb-disabled'),
                    normal = 'bb-bb10-button bb-bb10-button-'+res,
                    highlight = 'bb-bb10-button bb-bb10-button-'+res+' bb10-button-highlight',
					outerNormal = 'bb-bb10-button-container-'+res+' bb-bb10-button-container-' + bb.screen.controlColor;
					
                outerElement.enabled = !disabled;
				innerElement.innerHTML = outerElement.innerHTML;
				outerElement.innerHTML = '';
				outerElement.appendChild(innerElement);

                if (outerElement.hasAttribute('data-bb-style')) {
                    var style = outerElement.getAttribute('data-bb-style');
                    if (style == 'stretch') {
                        normal = normal + ' bb-bb10-button-stretch';
                        highlight = highlight + ' bb-bb10-button-stretch';
                    }
                }
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
