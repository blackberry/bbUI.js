_bb10_textInput = { 
	apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.textInput.style(elements[i]);
		}
	},
	
	style: function(outerElement) {
		var res = '1280x768-1280x720',
			css = '',
			container = document.createElement('div');
		
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			res = '1024x600';
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			res = '1280x768-1280x720';
		} else if (bb.device.is720x720) {
			res = '720x720';
		}
		
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
		container.normal = 'bb-bb10-input-container bb-bb10-input-container-'+ res;
		container.stylePasswd = ' bb-bb10-input-container-passwd-focused-'+ res;
		container.stylePasswdShown = container.stylePasswd + " show-passwd";
		container.passwdIsShown = false;
		container.disableBlur = false;
		
		// Set our input styling
		outerElement.normal = css + ' bb-bb10-input bb-bb10-input-'+res;
		outerElement.focused = css + ' bb-bb10-input bb-bb10-input-focused-'+res;


		if (outerElement.disabled) {
			outerElement.setAttribute('class', outerElement.normal + ' bb-bb10-input-disabled');
		} else {
			outerElement.setAttribute('class', outerElement.normal);
		}
		outerElement.isFocused = false;
		outerElement.clickCount = 0;
		outerElement.container = container;
		outerElement.clearBtn = outerElement.getAttribute('data-bb-clear') != 'none';
		outerElement.hasClearBtn = false;
		outerElement.showPasswdBtn = outerElement.getAttribute('data-bb-show-password') != 'none';
		outerElement.hasShowPasswdBtn = false;
		
		// Don't show the clear button on some input types
		if (outerElement.type) {
			var type = outerElement.type.toLowerCase();
			if ((type == 'date') || (type == 'time') || (type == 'datetime') || (type == 'month') || (type == 'datetime-local') || (type == 'color') || (type == 'search')) {
				outerElement.clearBtn = false;
			}
		}
		
		// Set our container class
		if (outerElement.disabled) {
			container.setAttribute('class',container.normal + ' bb-bb10-input-container-disabled');
		} else {
			container.setAttribute('class',container.normal);
		}
		
		outerElement.doFocus = function() {
<<<<<<< HEAD
			if(this.readOnly != false) return;

			// non-password inputs show the clear button
			if(outerElement.type.toLowerCase() != "password" && !this.hasShowPasswdBtn) {
				this.container.setAttribute('class',this.container.normal + ' bb-bb10-input-container-focused-'+res);

				if (this.clearBtn && this.value) {
					this.setAttribute('class', this.focused);
					this.hasClearBtn = true;
				} else {
					this.setAttribute('class', this.normal);
					this.hasClearBtn = false;
				}

			// password fields have the show/hide password button
			} else {
				if (!this.container.passwdIsShown) {
					this.container.setAttribute('class',this.container.normal + this.container.stylePasswd);
				} else {
					this.container.setAttribute('class',this.container.normal + this.container.stylePasswdShown);
				}
				this.setAttribute('class', this.focused);

				if (this.showPasswdBtn && this.value) {
					this.hasShowPasswdBtn = true;
				} else {
					
					this.hasShowPasswdBtn = false;
				}
			}
			this.container.style['border-color'] = bb.options.highlightColor;
			this.isFocused = true;
			this.clickCount = 0;

			bb.screen.focusedInput = this;
		};

=======
								if(this.readOnly == false) {
									this.container.setAttribute('class',this.container.normal + ' bb-bb10-input-cancel-button bb-bb10-input-container-focused-'+res);
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
>>>>>>> upstream/master
		outerElement.doFocus = outerElement.doFocus.bind(outerElement);
		outerElement.addEventListener('focus', outerElement.doFocus, false);
			
		outerElement.doBlur = function(e) {
			// Retain focus on input if we clicked on its control
			// e.g. the password button
			if (this.container.disableBlur) {
				this.container.disableBlur = false;
				this.focus();
				return;
			}

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
		
		// View password button behaviour
		if (outerElement.showPasswdBtn) {
			outerElement.container.ontouchstart = 
				function(event) {
					if (event.target == this) {
						event.preventDefault();
						event.stopPropagation();

						this.passwdIsShown = !this.passwdIsShown;
						var inputType = (this.passwdIsShown) ? 'text' : 'password';
						outerElement.setAttribute('type', inputType);
						
						this.setAttribute('class', this.normal + this.stylePasswdShown);
						this.disableBlur = true;
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
					this.container.setAttribute('class',this.container.normal + ' bb-bb10-input-container-disabled');
					this.setAttribute('class', this.normal + ' bb-bb10-input-disabled');
				};
		outerElement.disable = outerElement.disable.bind(outerElement);
		
		return container;
	}
};
