bb.dropdown = { 
    // Apply our transforms to all dropdowns passed in
    apply: function(elements) {
        if (bb.device.isBB5) {

        } else if (bb.device.isBB10) {
            var res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}			
			var options,
				option,
                caption,
				img,
				i,j,
				innerElement,
				select,
				innerContainer,
				buttonOuter,
				dropdown,
				labelElement,
				captionElement,
				itemsElement,
				item,
				normal = 'bb-bb10-dropdown bb-bb10-dropdown-'+res+' bb-bb10-dropdown-' + bb.screen.controlColor + ' bb-bb10-dropdown-'+res,
				highlight = 'bb-bb10-dropdown bb-bb10-dropdown-'+res+' bb10-button-highlight bb-bb10-dropdown-'+res,  //********************************* TODO: currently using Button highlight ********************
				outerContainerStyle = 'bb-bb10-dropdown-container-'+res+' bb-bb10-dropdown-container-' + bb.screen.controlColor + ' bb-bb10-dropdown-container-'+res,
				innerContainerStyle = 'bb-bb10-dropdown-container-inner-'+res+' bb-bb10-dropdown-container-inner-'+bb.screen.controlColor,
				innerButtonStyle = 'bb-bb10-dropdown-inner-'+res+' bb-bb10-dropdown-inner-'+bb.screen.controlColor;

			for (i = 0; i < elements.length; i++) {
                select = elements[i]
				caption = '';
				options = select.getElementsByTagName('option')
				// Make the existing <select> invisible so that we can hide it and create our own display
				select.style.display = 'none';
				 // Get our selected item in case they haven't specified "selected";
                if (options.length > 0) {
                    caption = options[0].innerHTML;
                }

				// Create the dropdown container and insert it where the select was
				dropdown = document.createElement('div');
				dropdown.setAttribute('data-bb-type','dropdown');
				select.dropdown = dropdown;
				select.parentNode.insertBefore(dropdown, select);
				// Insert the select as an invisible node in the new dropdown element
                dropdown.appendChild(select);
				
				// Create the innerContainer for the dual border
				innerContainer = document.createElement('div');
				innerContainer.setAttribute('class',innerContainerStyle);
				dropdown.appendChild(innerContainer);
				
				if (select.hasAttribute('data-bb-style')) {
                    var style = select.getAttribute('data-bb-style');
                    if (style == 'stretch') {
                        normal = normal + ' bb-bb10-dropdown-stretch';
                        highlight = highlight + ' bb-bb10-dropdown-stretch';
                    }
                }
				
				// Create our button container for the outer part of the dual border
				buttonOuter = document.createElement('div');
				buttonOuter.setAttribute('class',normal);
				innerContainer.appendChild(buttonOuter);
				
				// Create the inner button element
				innerElement = document.createElement('div');
				innerElement.setAttribute('class',innerButtonStyle);
				buttonOuter.appendChild(innerElement);

				// Create the optinal label for the dropdown
				labelElement = document.createElement('div');
				labelElement.setAttribute('class','bb-bb10-dropdown-label');
				if (select.hasAttribute('data-bb-label')) {
					labelElement.innerHTML = select.getAttribute('data-bb-label');
				}
				innerElement.appendChild(labelElement);
				
				// Create our dropdown arrow
				img = document.createElement('div');
				img.setAttribute('class','bb-bb10-dropdown-arrow-'+res+'-'+bb.screen.controlColor);
				innerElement.appendChild(img);
				dropdown.img = img;
				
				// Create the caption for the dropdown
				captionElement = document.createElement('div');
				captionElement.setAttribute('class','bb-bb10-dropdown-caption-'+res);
				captionElement.innerHTML = caption;
				innerElement.appendChild(captionElement);
                
				// Create the scrolling area
				var scrollArea = document.createElement('div');
				scrollArea.style.position = 'relative';
				scrollArea.style['margin-top'] = '10px';
				scrollArea.style.overflow = 'hidden';
				innerContainer.appendChild(scrollArea);
				var innerScroller = document.createElement('div');
				scrollArea.appendChild(innerScroller);
				
				// Create our drop down items
				itemsElement = document.createElement('div');
				itemsElement.setAttribute('class','bb-bb10-dropdown-items');
				innerScroller.appendChild(itemsElement);
                for (j = 0; j < options.length; j++) {
					option = options[j];
					item = document.createElement('div');
					item.slectedStyle = 'bb-bb10-dropdown-item-'+res+' bb-bb10-dropdown-item-'+bb.screen.controlColor+' bb-bb10-dropdown-item-selected-'+ bb.screen.controlColor;
					item.normalStyle = 'bb-bb10-dropdown-item-'+res+' bb-bb10-dropdown-item-'+bb.screen.controlColor;
					item.index = j;
					item.select = select;
					item.dropdown = dropdown;
					if (!item.dropdown.selected) {
						item.dropdown.selected = item;
					}
					item.innerHTML = option.innerHTML;
					itemsElement.appendChild(item);
					// Create the image
					img = document.createElement('div');
					img.setAttribute('class','bb-bb10-dropdown-selected-image-'+res+'-'+bb.screen.controlColor);
					item.img = img;
					item.appendChild(img);
					
					// See if it was specified as the selected item
                    if (option.hasAttribute('selected')) {
                        captionElement.innerHTML = option.innerHTML;
						item.setAttribute('class',item.slectedStyle);
						img.style.visibility = 'visible';
						item.dropdown.selected = item;
                    } else {
						item.setAttribute('class',item.normalStyle);
					}
					// Assign our item handlers
					item.ontouchstart = function(event) {
											this.style['background-color'] = bb.options.bb10HighlightColor;
											this.style['color'] = 'white';
										};
					
					item.ontouchend = function(event) {
											this.style['background-color'] = 'transparent';
											this.style['color'] = '';
										};			
					item.onclick = function() {
										// Style the previously selected item as no longer selected
										if (this.dropdown.selected) {
											this.dropdown.selected.setAttribute('class',this.normalStyle);
											this.dropdown.selected.img.style.visibility = 'hidden';
										}
										// Style this item as selected
										this.setAttribute('class',this.slectedStyle);
										this.img.style.visibility = 'visible';
										this.dropdown.selected = this;
										// Set our index and fire the event
										this.select.setSelectedItem(this.index);
										this.dropdown.hide();
								   };
                }
				
				// set our outward styling
				dropdown.setAttribute('class',outerContainerStyle);
				dropdown.buttonOuter = buttonOuter;
				dropdown.isRefreshed = false;
				dropdown.select = select;
				dropdown.caption = captionElement;
				dropdown.options = options;
				buttonOuter.dropdown = dropdown;
				dropdown.open = false;
				buttonOuter.normal = normal;
				buttonOuter.highlight = highlight;

				// Create our scroller
				dropdown.scroller = new iScroll(scrollArea, {vScrollbar: false,
									onBeforeScrollStart: function (e) {
										if (bb.scroller) {
											bb.scroller.disable();
										}
										e.preventDefault();
									}, 
									onBeforeScrollEnd: function(e) {
										if (bb.scroller) {
											bb.scroller.enable();
										}
									}});
				bb.dropdownScrollers.push(dropdown.scroller);
				dropdown.scrollArea = scrollArea;
                
				// Assign our touch handlers to out-most div
				buttonOuter.ontouchstart = function(event) {
										this.setAttribute('class', this.highlight);
									};
				buttonOuter.ontouchend = function(event) {
										this.setAttribute('class', this.normal);
									};
				buttonOuter.onclick = function(event) {
										if (!this.dropdown.open) {
											this.dropdown.show();
										} else {
											this.dropdown.hide();
										}
									};
				// Collapse the combo-box			
				dropdown.show = function() {
										var scrollHeight;
										this.open = true;
										// Figure out how many items to show
										if (this.options.length > 5) {
											this.numItems = 5;
										} else {
											this.numItems = this.options.length;
										}
										// Set the open height
										if (bb.device.isPlayBook) {
											scrollHeight = (this.numItems * 54);
											this.style.height = 60 + scrollHeight +'px';
										} else {
											scrollHeight = (this.numItems * 99);
											this.style.height = 95 + scrollHeight +'px';
										}
										// Refresh our scroller based on the height only once
										this.scrollArea.style.height = scrollHeight - 10 + 'px';
										if (!this.isRefreshed) {
											this.scroller.refresh();
											this.isRefreshed = true;
										}
										this.scroller.scrollToElement(this.selected,0);
										
										// Animate our caption change
										this.caption.style.opacity = '0.0';
										this.caption.style['-webkit-transition'] = 'opacity 0.5s linear';
										this.caption.style['-webkit-backface-visibility'] = 'hidden';
										this.caption.style['-webkit-perspective'] = 1000;
										this.caption.style['-webkit-transform'] = 'translate3d(0,0,0)';
										  
										// Animate our arrow
										this.img.style.opacity = '1.0';
										this.img.style['-webkit-transition'] = 'all 0.5s ease-in-out';
										this.img.style['-webkit-transform'] = 'rotate(-720deg)';
									};
				dropdown.show = dropdown.show.bind(dropdown);
				// Collapse the combo-box
				dropdown.hide = function() {
										this.open = false;
										this.style.height = '59px';
										
										if (bb.device.isPlayBook) {
											this.style.height = '60px';
										} else {
											this.style.height = '95px';
										}
											
										// Animate our caption change
										this.caption.style.opacity = '1.0';
										this.caption.style['-webkit-transition'] = 'opacity 0.5s linear';
										this.caption.style['-webkit-backface-visibility'] = 'hidden';
										this.caption.style['-webkit-perspective'] = 1000;
										
										// Animate our arrow
										this.img.style.opacity = '0.0';
										this.img.style['-webkit-transition'] = 'all 0.5s ease-in-out';
										this.img.style['-webkit-transform'] = 'rotate(0deg)';
									};
				dropdown.hide = dropdown.hide.bind(dropdown);

				// Assign our functions to be able to set the value
                select.setSelectedItem = function(index) {
                    if (this.selectedIndex != index) {
                        this.selectedIndex = index;
						this.dropdown.caption.innerHTML = this.options[index].text;
						
                        window.setTimeout(this.fireEvent,0);
                    }
                };
				// Have this function so we can asynchronously fire the change event
				select.fireEvent = function() {
									// Raise the DOM event
									var evObj = document.createEvent('HTMLEvents');
									evObj.initEvent('change', false, true );
									this.dispatchEvent(evObj);
								};
				select.fireEvent = select.fireEvent.bind(select);
			}
		} else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i],
                    options = outerElement.getElementsByTagName('option'),
                    caption = '',
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

                outerElement.style.display = 'none';
                // Get our selected item
                if (options.length > 0) {
                    caption = options[0].innerHTML;
                }
                for (var j = 0; j < options.length; j++) {
                    if (options[j].hasAttribute('selected')) {
                        caption = options[j].innerHTML;
                        break;
                    }
                }

                // Create our new dropdown button
                var dropdown = document.createElement('div');
                dropdown.innerHTML = '<div data-bb-type="caption"><span>' + caption + '</span></div>';

                var normal = 'bb-bb7-dropdown',
                    highlight = 'bb-bb7-dropdown-highlight';

                if (bb.device.isHiRes) {
                    normal = normal + ' bb-bb7-dropdown-hires';
                    highlight = highlight + ' bb-bb7-dropdown-hires';
                } else {
                    normal = normal + ' bb-bb7-dropdown-lowres';
                    highlight = highlight + ' bb-bb7-dropdown-lowres';
                }

                if (outerElement.hasAttribute('data-bb-style')) {
                    var style = outerElement.getAttribute('data-bb-style');
                    if (style == 'stretch') {
                        normal = normal + ' dropdown-stretch';
                        highlight = highlight + ' dropdown-stretch';
                    }
                }
                dropdown.setAttribute('data-bb-type','dropdown');
                dropdown.setAttribute('class',normal);
                dropdown.setAttribute('x-blackberry-focusable','true');
				dropdown.setAttribute(inEvent,"this.setAttribute('class','" + highlight +"')");
				dropdown.setAttribute(outEvent,"this.setAttribute('class','" + normal + "')");
                outerElement.parentNode.insertBefore(dropdown, outerElement);
                dropdown.appendChild(outerElement);

                // Assign our functions to be able to set the value
                outerElement.dropdown = dropdown;
                outerElement.setSelectedItem = function(index) {
                    var select = this.dropdown.getElementsByTagName('select')[0];
                    if (select && select.selectedIndex != index) {
                        select.selectedIndex = index;
                        // Change our button caption
                        var caption = this.dropdown.querySelectorAll('[data-bb-type=caption]')[0];
                        if (caption) {
                            caption.innerHTML = '<span>' + select.options[index].text + '</span>';
                        }
                        // Raise the DOM event
                        var evObj = document.createEvent('HTMLEvents');
                        evObj.initEvent('change', false, true );
                        select.dispatchEvent(evObj);
                    }
                };

                // Set our click handler
                dropdown.onclick = function() {
                        var select = this.getElementsByTagName('select')[0];
                        // Add our emulation for Ripple
                        if (bb.device.isPlayBook || bb.device.isRipple) {
                            // Create the overlay to trap clicks on the screen
                            var overlay = document.createElement('div');
                            overlay.setAttribute('id', 'ripple-dropdown-overlay');
                            overlay.setAttribute('style', 'position: absolute;left: 0px;top: ' + document.body.scrollTop + 'px;width:100%;height:100%;z-index: 1000000;');
                            // Close the overlay if they click outside of the select box
                            overlay.onclick = function () {
                                if (this.parentNode !== null) {
                                    this.parentNode.removeChild(this);
                                }
                            };

                            // Create our dialog
                            var dialog = document.createElement('div');
                            if (bb.device.isHiRes) {
                                dialog.setAttribute('class', 'ripple-dropdown-dialog bb-hires-screen');
                            } else {
                                dialog.setAttribute('class', 'ripple-dropdown-dialog');
                            }
                            overlay.appendChild(dialog);
                            dialog.onclick = function() {
                                this.parentNode.parentNode.removeChild(this.parentNode);
                            };

                            // Add our options
                            for (var i = 0; i < select.options.length; i++) {
                                var item = select.options[i],
                                    highlight = document.createElement('div');

                                dialog.appendChild(highlight);
                                var option = document.createElement('div');
                                if (item.selected) {
                                    option.setAttribute('class', 'item selected');
                                    highlight.setAttribute('class','backgroundHighlight backgroundSelected');
                                } else {
                                    option.setAttribute('class', 'item');
                                    highlight.setAttribute('class','backgroundHighlight');
                                }

                                option.innerHTML = '<span>' + item.text + '</span>';
                                option.setAttribute('x-blackberry-focusable','true');
                                option.setAttribute('data-bb-index', i);
                                // Assign our dropdown for when the item is clicked
                                option.dropdown = this;
                                option.onclick = function() {
                                    var index = this.getAttribute('data-bb-index');
                                    // Retrieve our select
                                    var select = this.dropdown.getElementsByTagName('select')[0];
                                    if (select) {
                                        select.setSelectedItem(index);
                                    }
                                };
                                // Add to the DOM
                                highlight.appendChild(option);
                            }

                            var height = (select.options.length * 45) + 20,
                                maxHeight = window.innerHeight - 80;
                            if (height > maxHeight) {
                                height = maxHeight;
                                dialog.style.height = maxHeight + 'px';
                            }

                            var top = (window.innerHeight/2) - (height/2);
                            dialog.style.top = top + 'px';

                            // Add the overlay to the DOM now that we are done
                            document.body.appendChild(overlay);
                        } else {
                            //On Smartphones, use the new Select Asynch dialog in blackberry.ui.dialog
                            var inputs = [];
                            for (var i = 0; i < select.options.length; i++) {
                                inputs[i] = { label : select.options[i].text, selected : i == select.selectedIndex, enabled : true, type : "option"};
                            }
                            try {
                                blackberry.ui.dialog.selectAsync(false, inputs,
                                    function (indices) {
                                        if (indices.length > 0 && indices[0] < select.options.length) {
                                            select.setSelectedItem(indices[0]);
                                        }
                                    }
                                );
                            } catch (e) {
                                console.log("Exception in selectAsync: " + e);
                            }
                        }
                    };
            }
        }
    }
};