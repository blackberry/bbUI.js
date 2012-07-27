_bb_progress = {

	NORMAL : 0,
	PAUSED : 1,
	ERROR : 2,
	
	apply: function(elements) {
		
		var i, 
			progress,
			res,
			color,
			highlightColor,
			accentColor,
			NORMAL = 0,
			PAUSED = 1,
			ERROR = 2;
			
		if (bb.device.isBB10) {
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			color = bb.screen.controlColor;
			highlightColor = bb.options.highlightColor;
			accentColor = bb.options.shades.darkHighlight;
		} else {
			res = 'lowres';
			color = 'light';
			highlightColor = (bb.device.isPlayBook) ? bb.options.highlightColor : '#92B43B';
			accentColor = '#8FB03B';
		}
		
		for (i = 0; i < elements.length; i++) {
			progress = elements[i];
			// Create our container div
			outerElement = document.createElement('div');
			outerElement.progress = progress;
			outerElement.state = bb.progress.NORMAL;
			progress.parentNode.insertBefore(outerElement, progress);
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
			if (bb.device.isBB10) {
				outerElement.fill.normal = 'bb-progress-fill bb10Highlight';
			} else {
				outerElement.fill.normal = 'bb-progress-fill bbProgressHighlight';
			}
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
			
			// Set our value on a timeout so that it can calculate width once in the DOM
			window.setTimeout(progress.setValue, 0);
			outerElement.doOrientationChange = function() {
								window.setTimeout(this.progress.setValue, 0);
							};
			outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
			// Assign our document event listeners
			window.addEventListener('resize', outerElement.doOrientationChange,false); 
		}
	}
};
