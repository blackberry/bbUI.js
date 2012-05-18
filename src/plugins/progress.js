bb.progress = {

	apply: function(elements) {
		
		var i, 
			progress,
			res,
			R,
			G,
			B,
			color,
			highlightColor,
			accentColor;
			
		if (bb.device.isBB10) {
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			color = bb.options.bb10ControlsDark ? 'dark' : 'light';
			highlightColor = bb.options.bb10HighlightColor;
			accentColor = bb.options.bb10AccentColor;
		} else {
			res = 'lowres';
			color = 'light';
			highlightColor = '#92B43B';
			accentColor = '#8FB03B';
		}
		
		// Get our highlight RGB colors
		R = parseInt((bb.progress.cutHex(highlightColor)).substring(0,2),16)
		G = parseInt((bb.progress.cutHex(highlightColor)).substring(2,4),16);
		B = parseInt((bb.progress.cutHex(highlightColor)).substring(4,6),16);
		
		for (i = 0; i < elements.length; i++) {
			progress = elements[i];
			// Create our container div
			outerElement = document.createElement('div');
			outerElement.progress = progress;
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
								alert('should not be in here');
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
							
							// Calculate our percentage
							if (value == this.outerElement.maxValue) {
								percent = 1;
								this.outerElement.fill.style.background ='-webkit-linear-gradient(top,  '+accentColor+' 0%, '+highlightColor+' 100%)';
							} else if (value == 0) {
								this.outerElement.outer.setAttribute('class','outer bb-progress-outer-' + color + ' bb-progress-outer-idle-background-' + color);
							} else {
								this.outerElement.outer.setAttribute('class','outer bb-progress-outer-' + color);
								this.outerElement.fill.setAttribute('class',this.outerElement.fill.normal);
								this.outerElement.fill.style.background ='';
								percent = (this.outerElement.value/parseInt(this.outerElement.maxValue));								
							}	
							
							// Determine width by percentage
							xpos = Math.floor(parseInt(window.getComputedStyle(this.outerElement.outer).width) * percent);
							this.outerElement.fill.style.width = xpos + 'px';
							this.outerElement.inner.style['-webkit-transform'] = 'translate3d(' + xpos + 'px,0px,0px)';
						};
			progress.setValue = progress.setValue.bind(progress);
			// Display the control paused
			progress.pause = function() {
							this.outerElement.fill.style.background ='-webkit-linear-gradient(top,  '+accentColor+' 0%, '+highlightColor+' 100%)';
						};
			progress.pause = progress.pause.bind(progress);
			// Set our value on a timeout so that it can calculate width once in the DOM
			window.setTimeout(progress.setValue, 0);
			outerElement.doOrientationChange = function() {
								window.setTimeout(outerElement.progress.setValue, 0);
							};
			outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
			// Assign our document event listeners
			window.addEventListener('orientationchange', outerElement.doOrientationChange,false); 
		}
	},
	
	cutHex : function(h) {
		return (h.charAt(0)=="#") ? h.substring(1,7):h
	}
};