bb.slider = {

	apply: function(elements) {
		if (bb.device.isBB10) {
			var i, 
				range,
				res;
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}	
			for (i = 0; i < elements.length; i++) {
				range = elements[i];
				// Create our container div
				outerElement = document.createElement('div');
				outerElement.range = range;
				range.parentNode.insertBefore(outerElement, range);
				range.style.display = 'none';
				outerElement.appendChild(range);
				// Get our values
				outerElement.minValue = range.hasAttribute('min') ? range.getAttribute('min').toLowerCase() : 0;
				outerElement.maxValue = range.hasAttribute('max') ? range.getAttribute('max').toLowerCase() : 0;
				outerElement.value = range.hasAttribute('value') ? range.getAttribute('value').toLowerCase() : 0;
				outerElement.isActivated = false;
				outerElement.initialXPos = 0;
				outerElement.currentXPos = 0;
				outerElement.transientXPos = 0;
				// Set our styling and create the inner divs
				outerElement.className = 'slider';
				outerElement.outer = document.createElement('div');
				outerElement.outer.className = 'outer';
				outerElement.appendChild(outerElement.outer);
				outerElement.fill = document.createElement('div');
				outerElement.fill.className = 'fill';
				outerElement.outer.appendChild(outerElement.fill);
				outerElement.inner = document.createElement('div');
				outerElement.inner.className = 'inner';
				outerElement.outer.appendChild(outerElement.inner);
				outerElement.halo = document.createElement('div');
				outerElement.halo.className = 'halo';
				outerElement.inner.appendChild(outerElement.halo);
				outerElement.indicator = document.createElement('div');
				outerElement.indicator.className = 'indicator';
				outerElement.inner.appendChild(outerElement.indicator);
				// Assign our function to set the value for the control
				range.outerElement = outerElement;
				range.setValue = function(value) {
								var percent = 0,
									width;
								if (value && (value < parseInt(this.outerElement.minValue) || value > parseInt(this.outerElement.maxValue))) {
									return;
								} else if (value) {
									this.outerElement.value = value;
								}
								// Calculate our percentage
								if (this.outerElement.value == this.outerElement.maxValue) {
									percent = 1;
								} else {
									percent = this.outerElement.value/(parseInt(this.outerElement.maxValue) + parseInt(this.outerElement.minValue));								
								}	
								// Determine width by percentage
								range.outerElement.currentXPos = Math.floor(parseInt(window.getComputedStyle(this.outerElement.outer).width) * percent);
								this.outerElement.fill.style.width = outerElement.currentXPos + 'px';
								this.outerElement.inner.style['-webkit-transform'] = 'translate3d(' + range.outerElement.currentXPos + 'px,0px,0px)';
							};
				range.setValue = range.setValue.bind(range);
				// Set our value on a timeout so that it can calculate width once in the DOM
				window.setTimeout(range.setValue, 0);
				// Setup our touch events
				outerElement.inner.animateBegin = function(event) {
										if (outerElement.isActivated === false) {
											outerElement.isActivated = true;
											outerElement.initialXPos = event.touches[0].pageX;										
											outerElement.halo.style['-webkit-transform'] = 'scale(1)';
											outerElement.halo.style['-webkit-animation-name'] = 'explode';
											outerElement.indicator.setAttribute('class','indicator indicator_hover');
										}
									};
				outerElement.inner.animateBegin = outerElement.inner.animateBegin.bind(outerElement.inner);
				outerElement.inner.addEventListener("touchstart", outerElement.inner.animateBegin, false);
				outerElement.inner.animateEnd = function () {
										if (outerElement.isActivated === true) {
											outerElement.isActivated = false;
											outerElement.currentXPos = outerElement.transientXPos;
											outerElement.halo.style['-webkit-transform'] = 'scale(0)';
											outerElement.halo.style['-webkit-animation-name'] = 'implode';
											outerElement.indicator.setAttribute('class','indicator');                 
										}
									};
				outerElement.inner.animateEnd = outerElement.inner.animateEnd.bind(outerElement.inner);
				outerElement.inner.addEventListener("touchend", outerElement.inner.animateEnd, false);
				// Handle moving the slider
				outerElement.moveSlider = function (event) {
									if (outerElement.isActivated === true) {
										event.stopPropagation();
										event.preventDefault();
										outerElement.transientXPos = outerElement.currentXPos + event.touches[0].pageX - outerElement.initialXPos;
										outerElement.transientXPos = Math.max(0, Math.min(outerElement.transientXPos, parseInt(window.getComputedStyle(outerElement.outer).width)));
										/*
										notifyUpdated();*/
										this.notifyUpdated();
										this.fill.style.width = outerElement.transientXPos + 'px';
										this.inner.style['-webkit-transform'] = 'translate3d(' + outerElement.transientXPos + 'px,0px,0px)';
									}
								};
				outerElement.moveSlider = outerElement.moveSlider.bind(outerElement);
				// Handle sending event to person trapping
				outerElement.notifyUpdated = function() {
									var percent = outerElement.transientXPos/parseInt(window.getComputedStyle(outerElement.outer).width);
									outerElement.range.value = Math.ceil((parseInt(outerElement.minValue) + parseInt(outerElement.maxValue))*percent);
									var evObj = document.createEvent('HTMLEvents');
									evObj.initEvent('change', false, true );
									outerElement.range.dispatchEvent(evObj);
								};
								
				// Assign our document event listeners
				document.addEventListener("touchmove", outerElement.moveSlider, false);
				document.addEventListener("touchend", outerElement.inner.animateEnd, false);
			}
		}	
	}
};