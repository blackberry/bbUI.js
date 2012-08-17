_bb_6_7_PlayBook_dropdown = { 
    apply: function(elements) {
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
};