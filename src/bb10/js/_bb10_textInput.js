_bb10_textInput = { 
    apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.textInput.style(elements[i]);
		}
	},
	
	style: function(outerElement) {
		var css = '',
			container = document.createElement('div');
		
		// Keep the developers existing styling
		if (outerElement.hasAttribute('class')) {
			css = outerElement.getAttribute('class');
		}
	  
		// Insert the input inside the new div
		if (outerElement.parentNode) {
			outerElement.parentNode.insertBefore(container, outerElement);
		}
		container.appendChild(outerElement);
		container.input = outerElement;
		container.setAttribute('data-bb-type','input');
		container.normal = 'bb-input-container';
		
		// Set our input styling
		outerElement.normal = css + ' bb-input';
		outerElement.focused = css + ' bb-input bb-input-focused';
		if (bb.device.newerThan10dot2) {
			container.normal += ' bb-input-container-10dot3 bb-input-container-10dot3-'+bb.screen.controlColor;
			outerElement.normal += ' bb-input-10dot3 bb-input-10dot3-'+bb.screen.controlColor;
			outerElement.focused += ' bb-input-10dot3 bb-input-10dot3-'+bb.screen.controlColor+' bb-input-focused-10dot3';
		}
		if (outerElement.disabled) {
			if (bb.device.newerThan10dot2) {
				outerElement.setAttribute('class', outerElement.normal + ' bb-input-disabled-10dot3-'+bb.screen.controlColor);
			} else {
				outerElement.setAttribute('class', outerElement.normal + ' bb-input-disabled');
			}
		} else {
			outerElement.setAttribute('class', outerElement.normal);
		}
		outerElement.isFocused = false;
		outerElement.clickCount = 0;
		outerElement.container = container;
		outerElement.clearBtn = outerElement.getAttribute('data-bb-clear') != 'none';
		outerElement.hasClearBtn = false;
		
		// Don't show the clear button on some input types
		if (outerElement.type) {
			var type = outerElement.type.toLowerCase();
			if ((type == 'date') || (type == 'time') || (type == 'datetime') || (type == 'month') || (type == 'datetime-local') || (type == 'color') || (type == 'search')) {
				outerElement.clearBtn = false;
				if (bb.device.newerThan10dot1) {
					container.style.padding = '0px';
					container.style['border-width'] = '0px';
					container.style['background-color'] = 'transparent';
				}
			}
		}
		
		// Set our container class
		if (outerElement.disabled) {
			container.setAttribute('class',container.normal + ' bb-input-container-disabled');
		} else {
			container.setAttribute('class',container.normal);
		}
		
		outerElement.doFocus = function() {
								if(this.readOnly == false) {
									if (bb.device.newerThan10dot2) {
										this.container.setAttribute('class',this.container.normal + ' bb-input-cancel-button-'+ bb.screen.controlColor +' bb-input-container-focused bb-input-container-focused-10dot3 bb-input-container-focused-10dot3-'+ bb.screen.controlColor);
									} else {
										this.container.setAttribute('class',this.container.normal + ' bb-input-cancel-button-light bb-input-container-focused');
									}
									if (this.clearBtn && this.value) {
										this.setAttribute('class', this.focused);
										this.hasClearBtn = true;
									} else {
										this.setAttribute('class', this.normal);
										this.hasClearBtn = false;
									}
									this.container.style['border-color'] = bb.options.highlightColor;
									this.isFocused = true;
									this.clickCount = 0;
									bb.screen.focusedInput = this;
								}
							};
		outerElement.doFocus = outerElement.doFocus.bind(outerElement);
		outerElement.addEventListener('focus', outerElement.doFocus, false);
			
		outerElement.doBlur = function() {
								this.container.setAttribute('class',this.container.normal);	
								if (this.clearBtn) {
									this.setAttribute('class',this.normal);
								}
								this.container.style['border-color'] = '';
								this.isFocused = false;
								bb.screen.focusedInput = null;
							};
		outerElement.doBlur = outerElement.doBlur.bind(outerElement);	
		outerElement.addEventListener('blur', outerElement.doBlur, false);
		
		// Monitor input to add or remove clear button
		outerElement.updateClearButton = function() {
											if (this.clearBtn) {
												if ((this.value.length == 0 && this.hasClearBtn) || (this.value.length > 0 && !this.hasClearBtn))
													outerElement.doFocus();
											}
		};
		outerElement.updateClearButton = outerElement.updateClearButton.bind(outerElement);  
		outerElement.addEventListener("input", outerElement.updateClearButton, false);
				
		// Add the clear button handler
		if (outerElement.clearBtn) {
			outerElement.container.ontouchstart = function(event) {
									if (event.target == this) {
										event.preventDefault();
										event.stopPropagation();
										this.input.value = '';
										outerElement.doFocus();
										// fire the onchange event
										var evObj = document.createEvent('HTMLEvents');
										evObj.initEvent('change', false, true );
										this.input.dispatchEvent(evObj);
									}
								};
		}

		// Add our Show funtion
		outerElement.show = function() {
					this.container.style.display = '';
				};
		outerElement.show = outerElement.show.bind(outerElement);	
		
		// Add our hide funtion
		outerElement.hide = function() {
					this.container.style.display = 'none';
				};
		outerElement.hide = outerElement.hide.bind(outerElement);
		
		// Add our remove funtion
		outerElement.remove = function() {
					if (this.container.parentNode) {
						this.container.parentNode.removeChild(this.container);
					}
				};
		outerElement.remove = outerElement.remove.bind(outerElement);
		
		// Add our enable funtion
		outerElement.enable = function() {
					if (!this.disabled) return;
					this.disabled = false;
					this.container.setAttribute('class',this.container.normal);
					this.setAttribute('class', this.normal);
				};
		outerElement.enable = outerElement.enable.bind(outerElement);
		
		// Add our disable funtion
		outerElement.disable = function() {
					if (this.disabled) return;
					this.disabled = true;
					if (bb.device.newerThan10dot2) {
						this.container.setAttribute('class',this.container.normal + ' bb-input-container-disabled-10dot3-'+bb.screen.controlColor);
						this.setAttribute('class', this.normal + ' bb-input-disabled-10dot3-'+bb.screen.controlColor);
					} else {
						this.container.setAttribute('class',this.container.normal + ' bb-input-container-disabled');
						this.setAttribute('class', this.normal + ' bb-input-disabled');
					}
				};
		outerElement.disable = outerElement.disable.bind(outerElement);
		
		return container;
    }
};