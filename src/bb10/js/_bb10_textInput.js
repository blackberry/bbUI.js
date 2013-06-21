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
		if (outerElement.disabled) {
			outerElement.setAttribute('class', outerElement.normal + ' bb-input-disabled');
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
									this.container.setAttribute('class',this.container.normal + ' bb-input-cancel-button bb-input-container-focused');
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
					this.container.setAttribute('class',this.container.normal + ' bb-input-container-disabled');
					this.setAttribute('class', this.normal + ' bb-input-disabled');
				};
		outerElement.disable = outerElement.disable.bind(outerElement);
		
		return container;
    }
};