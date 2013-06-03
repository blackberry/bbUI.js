_bb_progress = {

	NORMAL : 0,
	PAUSED : 1,
	ERROR : 2,
	
	apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.progress.style(elements[i], true);
		}
	},
	
	// Style individual item
	style: function(progress, offdom) {
		var color = bb.screen.controlColor,
			highlightColor = bb.options.highlightColor,
			accentColor = bb.options.shades.darkHighlight,
			NORMAL = 0,
			PAUSED = 1,
			ERROR = 2;
	
		// Create our container div
		outerElement = document.createElement('div');
		outerElement.progress = progress;
		outerElement.state = bb.progress.NORMAL;
		if (progress.parentNode) {
			progress.parentNode.insertBefore(outerElement, progress);
		}
		progress.style.display = 'none';
		outerElement.appendChild(progress);
		// Get our values
		outerElement.maxValue = progress.hasAttribute('max') ? parseInt(progress.getAttribute('max')) : 0;
		outerElement.value = progress.hasAttribute('value') ? parseInt(progress.getAttribute('value')) : 0;
		// Set our styling and create the inner divs
		outerElement.className = 'bb-progress';
		outerElement.outer = document.createElement('div');
		outerElement.outer.setAttribute('class','outer bb-progress-outer-' + color + ' bb-progress-outer-idle-background-' + color);
		outerElement.appendChild(outerElement.outer);
		outerElement.fill = document.createElement('div');
		outerElement.fill.normal = 'bb-progress-fill bb10Highlight';
		outerElement.fill.setAttribute('class',outerElement.fill.normal);
		outerElement.outer.appendChild(outerElement.fill);
		outerElement.inner = document.createElement('div');
		outerElement.inner.className = 'inner';
		outerElement.outer.appendChild(outerElement.inner);
				
		// Assign our function to set the value for the control
		progress.outerElement = outerElement;
		progress.setValue = function(value) {
						var percent = 0,
							width,
							xpos;
						if ((value && (value < 0)) || (value && (value > parseInt(this.outerElement.maxValue)))) {
							return;
						} else if (value) {
							this.outerElement.value = value;
							this.value = value;
						} else if (value == 0) {
							this.outerElement.value = 0;
							this.value = 0;
						} else {
							value = parseInt(this.outerElement.value);
						}

						// Calculate percentage and styling
						if (value == this.outerElement.maxValue) {
							this.outerElement.fill.style.background = '-webkit-gradient(linear, center top, center bottom, from(' + accentColor+ '), to('+highlightColor+'))';
							percent = 1;
						} else if (value == 0) {
							this.outerElement.outer.setAttribute('class','outer bb-progress-outer-' + color + ' bb-progress-outer-idle-background-' + color);
						} else {
							if (this.outerElement.state == bb.progress.PAUSED) {
								this.outerElement.fill.style.background = '-webkit-gradient(linear, center top, center bottom, from(#EDC842), to(#BA991E))';
							} else if (this.outerElement.state == bb.progress.ERROR) {
								this.outerElement.fill.style.background = '-webkit-gradient(linear, center top, center bottom, from( #E04242), to(#D91111))';
							} else {
								this.outerElement.outer.setAttribute('class','outer bb-progress-outer-' + color);
								this.outerElement.fill.setAttribute('class',this.outerElement.fill.normal);
								this.outerElement.fill.style.background ='';	
							} 
							percent = (this.outerElement.value/parseInt(this.outerElement.maxValue));
						}	
						
						// Determine width by percentage
						xpos = Math.floor(parseInt(window.getComputedStyle(this.outerElement.outer).width) * percent);
						this.outerElement.fill.style.width = xpos + 'px';						
					};
		progress.setValue = progress.setValue.bind(progress);
		
		// Set the state of the control
		progress.setState = function(state) {
						this.outerElement.state = state;
						this.setValue();
					};
		progress.setState = progress.setState.bind(progress);
		
		// Add our show function
		progress.show = function() {
			this.outerElement.style.display = 'block';
			bb.refresh();
				};
		progress.show = progress.show.bind(progress);
		
		// Add our hide function
		progress.hide = function() {
			this.outerElement.style.display = 'none';
			bb.refresh();
				};
		progress.hide = progress.hide.bind(progress);
		
		// Add remove function
		progress.remove = function() {
			this.outerElement.parentNode.removeChild(this.outerElement);
			bb.refresh();
				};
		progress.remove = progress.remove.bind(progress);
		
		// Add setMax function
		progress.setMax = function(value) {
					if (!value || (value < 0) || (value == this.max)) return;
					this.max = value;
					this.outerElement.maxValue = value;
				};
		progress.setMax = progress.setMax.bind(progress);
		
		if (offdom) {
			// Load our image once onbbuidomready 
			progress.onbbuidomready = function() {
						this.setValue();
						document.removeEventListener('bbuidomready', this.onbbuidomready,false);
					};
			progress.onbbuidomready = progress.onbbuidomready.bind(progress);
			document.addEventListener('bbuidomready', progress.onbbuidomready,false);
		} else {
			window.setTimeout(progress.setValue, 0);
		}
		
		// Re-calculate on orientation change
		outerElement.doOrientationChange = function() {
							window.setTimeout(this.progress.setValue, 0);
						};
		outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
		window.addEventListener('resize', outerElement.doOrientationChange,false); 
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'resize', eventHandler: outerElement.doOrientationChange});
			
		return outerElement;
	}
};