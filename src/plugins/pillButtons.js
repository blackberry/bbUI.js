bb.pillButtons = {  
    // Apply our transforms to all pill buttons passed in
    apply: function(elements) {
        if (bb.device.isBB5) {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
                outerElement.setAttribute('class','bb-pill-buttons');

                // Gather our inner items
                var items = outerElement.querySelectorAll('[data-bb-type=pill-button]');
                for (var j = 0; j < items.length; j++) {
                    var innerChildNode = items[j];
                    innerChildNode.setAttribute('x-blackberry-focusable','true');
                    var text = innerChildNode.innerHTML;
                    innerChildNode.innerHTML = '<span>' + text + '</span>';
                    
                    if (j === 0) {
                        innerChildNode.setAttribute('class','buttonLeft');
                    }
                    else if (j == items.length -1) {
                        innerChildNode.setAttribute('class','buttonRight');
                    }
                    else {
                        innerChildNode.setAttribute('class','buttonMiddle');
                    }
                    
                    // See if the item is marked as selected
                    if (innerChildNode.hasAttribute('data-bb-selected') && innerChildNode.getAttribute('data-bb-selected').toLowerCase() == 'true') {
                        bb.pillButtons.selectButton(innerChildNode);
                    }
                    
                    // Change the selected state when a user presses the button
                    innerChildNode.onmousedown = function() {
                        bb.pillButtons.selectButton(this);
                        var buttons = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
                        for (var i = 0; i < buttons.length; i++) {
                            var button = buttons[i];
                            if (button != this) {
                                bb.pillButtons.deSelectButton(button);
                            }
                        }
                    };
                }
            }
		} else if (bb.device.isBB10) {
			var res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}
			var i,
				outerElement,
				containerStyle = 'bb-bb10-pill-buttons-container-'+res+' bb-bb10-pill-buttons-container-' + bb.screen.controlColor,
				buttonStyle = 'bb-bb10-pill-button-'+res,
				containerDiv,
				innerBorder;
	
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
                outerElement.setAttribute('class','bb-bb10-pill-buttons-'+res);
				containerDiv = document.createElement('div');
				outerElement.appendChild(containerDiv);
				containerDiv.setAttribute('class',containerStyle);
                
                // Gather our inner items
                var items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
                    percentWidth = Math.floor(100 / items.length),
					sidePadding = 102-(percentWidth * items.length),
                    sidePadding,
					innerChildNode,
					j;
				
                outerElement.style['padding-left'] = sidePadding + '%';
                outerElement.style['padding-right'] = sidePadding + '%';
                for (j = 0; j < items.length; j++) {
                    innerChildNode = items[j];
					containerDiv.appendChild(innerChildNode);
					
                    // Set our styling
					innerChildNode.selected = buttonStyle + ' bb-bb10-pill-button-selected-'+res+'-'+ bb.screen.controlColor;
					innerChildNode.normal = buttonStyle;
					innerChildNode.highlight = buttonStyle + ' bb-bb10-pill-button-highlight-'+res+'-'+ bb.screen.controlColor +' bb10Highlight';
					if (j == items.length - 1) {
						innerChildNode.style.float = 'right';
						if (!bb.device.isPlayBook && j > 2) {
							innerChildNode.style.width = percentWidth-2 + '%';
						} else {
							innerChildNode.style.width = percentWidth-1 + '%';
						}						
					} else {
						innerChildNode.style.width = percentWidth + '%';
					}
					
					// Create our inner container to have double borders
					innerBorder = document.createElement('div');
					innerBorder.normal = 'bb-bb10-pill-button-inner-'+res;
					innerBorder.selected = innerBorder.normal +' bb-bb10-pill-button-inner-selected-'+res+'-'+bb.screen.controlColor;
					
					innerBorder.innerHTML = innerChildNode.innerHTML;
					innerChildNode.innerHTML = '';
					innerChildNode.appendChild(innerBorder);
					
					if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
						innerChildNode.setAttribute('class',innerChildNode.selected);
						innerBorder.setAttribute('class',innerBorder.selected);
					} else {
						innerChildNode.setAttribute('class',innerChildNode.normal);
						innerBorder.setAttribute('class',innerBorder.normal);
						innerChildNode.ontouchstart = function() {
													this.setAttribute('class',this.highlight);
												};
						innerChildNode.ontouchend = function() {
													this.setAttribute('class',this.normal);
												};
					}
					
                    // Add our subscription for click events to change highlighting
                    innerChildNode.addEventListener('click',function (e) {
                            var innerChildNode,
								innerBorder,
								items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
                            for (var j = 0; j < items.length; j++) {
                                innerChildNode = items[j];
								innerBorder = innerChildNode.firstChild;
								if (innerChildNode == this) {
									innerChildNode.setAttribute('class',innerChildNode.selected);
									innerBorder.setAttribute('class',innerBorder.selected);
								} else {
									innerBorder.setAttribute('class',innerBorder.normal);
									innerChildNode.setAttribute('class',innerChildNode.normal);
									innerChildNode.ontouchstart = function() {
													this.setAttribute('class',this.highlight);
												};
									innerChildNode.ontouchend = function() {
													this.setAttribute('class',this.normal);
												};
								}
                            }
                        },false);
                }
            }
        } else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    containerStyle = 'bb-bb7-pill-buttons',
                    buttonStyle = '';
                
                // Set our container style
                if (bb.device.isHiRes) {
                    containerStyle = containerStyle + ' bb-bb7-pill-buttons-hires';
                    buttonStyle = 'bb-bb7-pill-button-hires';
                } else {
                    containerStyle = containerStyle + ' bb-bb7-pill-buttons-lowres';
                    buttonStyle = 'bb-bb7-pill-button-lowres';
                }
                outerElement.setAttribute('class',containerStyle);
                
                
                // Gather our inner items
                var inEvent, 
					outEvent, 
					items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
                    percentWidth = Math.floor(98 / items.length),
                    sidePadding = 102-(percentWidth * items.length);
					
				if (bb.device.isPlayBook) {
					inEvent = 'ontouchstart';
					outEvent = 'ontouchend';
				} else {
					inEvent = 'onmouseover';
					outEvent = 'onmouseout';
				}
                    
                outerElement.style['padding-left'] = sidePadding + '%';
                outerElement.style['padding-right'] = sidePadding + '%';
                for (var j = 0; j < items.length; j++) {
                    var innerChildNode = items[j];
                    innerChildNode.setAttribute('x-blackberry-focusable','true');
                    if (j === 0) {  // First button
                        if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left '+ buttonStyle);
                        } else {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left '+ buttonStyle);
                            innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left " + buttonStyle +"')");
                            innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left " + buttonStyle +"')");
                        }
                    } else if (j == items.length -1) { // Right button
                        if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right '+ buttonStyle);
                        } else {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right ' + buttonStyle);
                            innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right " + buttonStyle +"')");
                            innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right " + buttonStyle +"')");
                        }
                    } else { // Middle Buttons
                        if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight '+ buttonStyle);
                        } else {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button ' + buttonStyle);
                            innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight " + buttonStyle +"')");
                            innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button " + buttonStyle +"')");
                        }
                    }
										
                    // Set our width
                    innerChildNode.style.width = percentWidth + '%';
                    // Add our subscription for click events to change highlighting
                    innerChildNode.addEventListener('click',function (e) {
                            var inEvent, outEvent, items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
							
							if (bb.device.isPlayBook) {
								inEvent = 'ontouchstart';
								outEvent = 'ontouchend';
							} else {
								inEvent = 'onmouseover';
								outEvent = 'onmouseout';
							}
							
                            for (var j = 0; j < items.length; j++) {
                                var innerChildNode = items[j];
                                
                                if (j === 0) {  // First button
                                    if (innerChildNode == this) {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left '+ buttonStyle);
                                        innerChildNode.onmouseover = null;
                                        innerChildNode.onmouseout = null;
                                    } else {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left '+ buttonStyle);
                                        innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left " + buttonStyle +"')");
                                        innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left " + buttonStyle +"')");
                                    }
                                } else if (j == items.length -1) { // Right button
                                    if (innerChildNode == this) {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right '+ buttonStyle);
                                        innerChildNode.onmouseover = null;
                                        innerChildNode.onmouseout = null;
                                    } else {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right ' + buttonStyle);
                                        innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right " + buttonStyle +"')");
                                        innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right " + buttonStyle +"')");
                                    }
                                } else { // Middle Buttons
                                    if (innerChildNode == this) {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight '+ buttonStyle);
                                        innerChildNode.onmouseover = null;
                                        innerChildNode.onmouseout = null;
                                    } else {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button ' + buttonStyle);
                                        innerChildNode.setAttribute(inEvent,"this.setAttribute('class','bb-bb7-pill-button-highlight " + buttonStyle +"')");
                                        innerChildNode.setAttribute(outEvent,"this.setAttribute('class','bb-bb7-pill-button " + buttonStyle +"')");
                                    }
                                }
                            }
                            
                        },false);
                }
            }
        }
    } /*,
    
    // Reset the button back to its un-selected state
    deSelectButton: function(button) {
        var cssClass = button.getAttribute('class');
        if (cssClass == 'buttonLeft') {
            button.style.backgroundPosition = 'top right';
            button.firstChild.style.backgroundPosition = 'top left'; 
        }
        else if (cssClass == 'buttonRight') {
            button.style.backgroundPosition = 'top right';
            button.firstChild.style.backgroundPosition = '-10px 0px';
        }
        else if (cssClass == 'buttonMiddle') {
            button.style.backgroundPosition = 'top right';
            button.firstChild.style.backgroundPosition = '-10px 0px';
        }
    },
    
    // Highlight the button
    selectButton: function(button) {
        var cssClass = button.getAttribute('class');
        if (cssClass == 'buttonLeft') {
            button.style.backgroundPosition = 'bottom right';
            button.firstChild.style.backgroundPosition = 'bottom left';
        }
        else if (cssClass == 'buttonRight') {
            button.style.backgroundPosition = 'bottom right';
            button.firstChild.style.backgroundPosition = '-10px -39px';
        }
        else if (cssClass == 'buttonMiddle') {
            button.style.backgroundPosition = 'bottom right';
            button.firstChild.style.backgroundPosition = '-10px -39px';
        }
    }*/
};