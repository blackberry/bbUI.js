_bb10_checkbox = {
	apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.checkbox.style(elements[i]);
		}
	},
	
	style: function(input) {
		var touchTarget, 
			outerElement,
			innerElement,
			checkElement,
			color = bb.screen.controlColor;
			
		// Outside touch target
		touchTarget = document.createElement('div');
		touchTarget.setAttribute('class','bb-checkbox-target');
		if (input.parentNode) {
			input.parentNode.insertBefore(touchTarget, input);
		}
		input.style.display = 'none';
		touchTarget.appendChild(input);
		touchTarget.input = input;
		input.touchTarget = touchTarget;
		// Main outer border of the control
		outerElement = document.createElement('div');
		outerElement.setAttribute('class', 'bb-checkbox-outer bb-checkbox-outer-'+color);
		touchTarget.appendChild(outerElement);
		// Inner check area
		innerElement = document.createElement('div');
		innerElement.normal = 'bb-checkbox-inner bb-checkbox-inner-'+color;
		innerElement.setAttribute('class', innerElement.normal);
		outerElement.appendChild(innerElement);
		// Create our check element with the image
		checkElement = document.createElement('div');
		checkElement.hiddenClass = 'bb-checkbox-check-hidden bb-checkbox-check-image';
		checkElement.displayClass = 'bb-checkbox-check-display bb-checkbox-check-image';
		checkElement.setAttribute('class',checkElement.hiddenClass);
		checkElement.style['-webkit-transition-property'] = 'all';
		checkElement.style['-webkit-transition-duration'] = '0.1s';
		innerElement.appendChild(checkElement);
		touchTarget.checkElement = checkElement;
		
		// Set our coloring for later
		touchTarget.innerElement = innerElement;
		touchTarget.highlight = '-webkit-linear-gradient(top,  rgb('+ (bb.options.shades.R + 32) +', '+ (bb.options.shades.G + 32) +', '+ (bb.options.shades.B + 32) +') 0%, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 100%)';
		touchTarget.touchHighlight = '-webkit-linear-gradient(top,  rgba('+ (bb.options.shades.R - 64) +', '+ (bb.options.shades.G - 64) +', '+ (bb.options.shades.B - 64) +',0.25) 0%, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +',0.25) 100%)';

		touchTarget.ontouchstart = function() {
						if (!this.input.checked && !this.input.disabled) {	
							// Do our touch highlight
							this.innerElement.style.background = this.touchHighlight;
						}
					};
		touchTarget.ontouchend = function() {
						if (!this.input.checked && !this.input.disabled) {
							this.innerElement.style.background = '';
						}
					};
		touchTarget.onclick = function() {
						if (!this.input.disabled) {
						var evObj = document.createEvent('HTMLEvents');
						evObj.initEvent('change', false, true );
						// Set our checked state
						this.input.checked = !this.input.checked;
						this.drawChecked();
						this.input.dispatchEvent(evObj);
						}				
					};						
		touchTarget.drawChecked = function() {
						if (this.input.checked) {
							this.checkElement.setAttribute('class',this.checkElement.displayClass);
							this.innerElement.style['background-image'] = touchTarget.highlight;
						} else {
							this.checkElement.setAttribute('class',this.checkElement.hiddenClass);
							this.innerElement.style['background-image'] = '';
						}
						if (this.input.disabled){
							this.innerElement.parentNode.setAttribute('class', 'bb-checkbox-outer bb-checkbox-outer-disabled-'+color);
							this.innerElement.setAttribute('class', 'bb-checkbox-inner bb-checkbox-inner-disabled-'+color);
							this.innerElement.style.background = '#c0c0c0';
						} else{
							this.innerElement.parentNode.setAttribute('class', 'bb-checkbox-outer bb-checkbox-outer-'+color);
							this.innerElement.setAttribute('class', 'bb-checkbox-inner bb-checkbox-inner-'+color);
						}				
					};
		touchTarget.drawChecked = touchTarget.drawChecked.bind(touchTarget);
		
		// Add our set Checked function
		input.setChecked = function(value) {
					if (value == this.checked) return;
					this.checked = value;
					this.touchTarget.drawChecked();
				};
		input.setChecked = input.setChecked.bind(input);
		
		// Add our get Checked function
		input.getChecked = function() {
					return this.checked;
				};
		input.getChecked = input.getChecked.bind(input);
		
		// Add our enable function
		input.enable = function(){ 
			this.removeAttribute('disabled');
			this.enabled = true;
			this.touchTarget.drawChecked();
		};
		input.enable = input.enable.bind(input);
		
		// Add our disable function
		input.disable = function(){ 
			this.enabled = false;
			this.setAttribute('disabled','disabled');	
			this.touchTarget.drawChecked();			
		};
		input.disable = input.disable.bind(input);
		
		// Add our show function
		input.show = function(){ 
			this.touchTarget.style.display = 'block';
			bb.refresh();
		};
		input.show = input.show.bind(input);
		
		// Add our hide function
		input.hide = function(){ 
			this.touchTarget.style.display = 'none';
			bb.refresh();
		};
		input.hide = input.hide.bind(input);
		
		// Add our remove function
		input.remove = function(){ 
			this.touchTarget.parentNode.removeChild(this.touchTarget);
			bb.refresh();
		};
		input.remove = input.remove.bind(input);
		
		// Set our initial state
		touchTarget.drawChecked();	
		
		return touchTarget;
	}
};