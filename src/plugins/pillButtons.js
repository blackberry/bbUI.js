bb.pillButtons = {
    // Apply our transforms to all pill buttons passed in
    apply: function(elements) {
        if (bb.device.isBB5()) {
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
                var items = outerElement.querySelectorAll('[data-bb-type=pill-button]'),
                    percentWidth = Math.floor(98 / items.length),
                    sidePadding = 102-(percentWidth * items.length);
                    
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
                            innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left " + buttonStyle +"')");
                            innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left " + buttonStyle +"')");
                        }
                    } else if (j == items.length -1) { // Right button
                        if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right '+ buttonStyle);
                        } else {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right ' + buttonStyle);
                            innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right " + buttonStyle +"')");
                            innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right " + buttonStyle +"')");
                        }
                    } else { // Middle Buttons
                        if (innerChildNode.getAttribute('data-bb-selected') == 'true') {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight '+ buttonStyle);
                        } else {
                            innerChildNode.setAttribute('class','bb-bb7-pill-button ' + buttonStyle);
                            innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight " + buttonStyle +"')");
                            innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button " + buttonStyle +"')");
                        }
                    }
                    // Set our width
                    innerChildNode.style.width = percentWidth + '%';
                    // Add our subscription for click events to change highlighting
                    innerChildNode.addEventListener('click',function (e) {
                            var items = this.parentNode.querySelectorAll('[data-bb-type=pill-button]');
                            for (var j = 0; j < items.length; j++) {
                                var innerChildNode = items[j];
                                
                                if (j === 0) {  // First button
                                    if (innerChildNode == this) {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left '+ buttonStyle);
                                        innerChildNode.onmouseover = null;
                                        innerChildNode.onmouseout = null;
                                    } else {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left '+ buttonStyle);
                                        innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-left " + buttonStyle +"')");
                                        innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-left " + buttonStyle +"')");
                                    }
                                } else if (j == items.length -1) { // Right button
                                    if (innerChildNode == this) {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right '+ buttonStyle);
                                        innerChildNode.onmouseover = null;
                                        innerChildNode.onmouseout = null;
                                    } else {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right ' + buttonStyle);
                                        innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight bb-bb7-pill-button-right " + buttonStyle +"')");
                                        innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button bb-bb7-pill-button-right " + buttonStyle +"')");
                                    }
                                } else { // Middle Buttons
                                    if (innerChildNode == this) {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button-highlight '+ buttonStyle);
                                        innerChildNode.onmouseover = null;
                                        innerChildNode.onmouseout = null;
                                    } else {
                                        innerChildNode.setAttribute('class','bb-bb7-pill-button ' + buttonStyle);
                                        innerChildNode.setAttribute('onmouseover',"this.setAttribute('class','bb-bb7-pill-button-highlight " + buttonStyle +"')");
                                        innerChildNode.setAttribute('onmouseout',"this.setAttribute('class','bb-bb7-pill-button " + buttonStyle +"')");
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
