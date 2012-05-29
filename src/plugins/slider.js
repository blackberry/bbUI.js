bb.slider = {

	apply: function(elements) {
		if (bb.device.isBB10) {
			var i, 
				range,
				res,
				R,
				G,
				B,
				color = bb.options.bb10ControlsDark ? 'dark' : 'light';
			if (bb.device.isPlayBook) {
				res = 'lowres';
			} else {
				res = 'hires';
			}	
			// Get our highlight RGB colors
			R = parseInt((bb.slider.cutHex(bb.options.bb10HighlightColor)).substring(0,2),16)
			G = parseInt((bb.slider.cutHex(bb.options.bb10HighlightColor)).substring(2,4),16);
			B = parseInt((bb.slider.cutHex(bb.options.bb10HighlightColor)).substring(4,6),16);
			
			for (i = 0; i < elements.length; i++) {
				range = elements[i];
				// Create our container div
				outerElement = document.createElement('div');
				outerElement.range = range;
				range.parentNode.insertBefore(outerElement, range);
				range.style.display = 'none';
				outerElement.appendChild(range);
				// Get our values
				outerElement.minValue = range.hasAttribute('min') ? parseInt(range.getAttribute('min')) : 0;
				outerElement.maxValue = range.hasAttribute('max') ? parseInt(range.getAttribute('max')) : 0;
				outerElement.value = range.hasAttribute('value') ? parseInt(range.getAttribute('value')) : 0;
				outerElement.step = range.hasAttribute('step') ? parseInt(range.getAttribute('step')) : 0;
				outerElement.isActivated = false;
				outerElement.initialXPos = 0;
				outerElement.currentXPos = 0;
				outerElement.transientXPos = 0;
				// Set our styling and create the inner divs
				outerElement.className = 'bb-bb10-slider-'+res;
				outerElement.outer = document.createElement('div');
				outerElement.outer.setAttribute('class','outer bb-bb10-slider-outer-' + color);
				outerElement.appendChild(outerElement.outer);
				outerElement.fill = document.createElement('div');
				outerElement.fill.className = 'fill';
				outerElement.fill.style.background = '-webkit-linear-gradient(top, rgb('+ R +', '+ G +', '+ B +') 0%, rgb('+ (R + 16) +', '+ (G + 16) +', '+ (B + 16) +') 100%)';
				outerElement.outer.appendChild(outerElement.fill);
				outerElement.inner = document.createElement('div');
				outerElement.inner.className = 'inner';
				outerElement.outer.appendChild(outerElement.inner);
				outerElement.halo = document.createElement('div');
				outerElement.halo.className = 'halo';
				outerElement.halo.style.background = '-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 43, from(rgba('+ R +', '+ G +', '+ B +', 0.15)), color-stop(0.8, rgba('+ R +', '+ G +', '+ B +', 0.15)), to(rgba('+ R +', '+ G +', '+ B +', 0.7)))';
				outerElement.inner.appendChild(outerElement.halo);
				outerElement.indicator = document.createElement('div');
				outerElement.indicator.setAttribute('class','indicator bb-bb10-slider-indicator-' + color);
				outerElement.inner.appendChild(outerElement.indicator);
				// Assign our function to set the value for the control
				range.outerElement = outerElement;
				range.setValue = function(value) {
								var percent = 0,
									width,
									evObj;
								if (value && (value < parseInt(this.outerElement.minValue) || value > parseInt(this.outerElement.maxValue))) {
									return;
								} else if (value) {
									this.outerElement.value = value;
									this.value = value;
									evObj = document.createEvent('HTMLEvents');
									evObj.initEvent('change', false, true );
									this.dispatchEvent(evObj);
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
											outerElement.indicator.setAttribute('class','indicator bb-bb10-slider-indicator-' + color+ ' indicator-hover-'+color);
											outerElement.indicator.style.background = '-webkit-linear-gradient(top, rgb('+ R +', '+ G +', '+ B +') 0%, rgb('+ (R + 16) +', '+ (G + 16) +', '+ (B + 16) +') 100%)';
											
											
										}
									};
				outerElement.inner.animateBegin = outerElement.inner.animateBegin.bind(outerElement.inner);
				outerElement.inner.addEventListener("touchstart", outerElement.inner.animateBegin, false);
				outerElement.inner.animateEnd = function () {
										if (outerElement.isActivated === true) {
											outerElement.isActivated = false;
											outerElement.currentXPos = outerElement.transientXPos;
											outerElement.value = parseInt(outerElement.range.value);
											outerElement.halo.style['-webkit-transform'] = 'scale(0)';
											outerElement.halo.style['-webkit-animation-name'] = 'implode';
											outerElement.indicator.setAttribute('class','indicator bb-bb10-slider-indicator-' + color);   
											outerElement.indicator.style.background = '';											
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
										this.notifyUpdated();
										this.fill.style.width = outerElement.transientXPos + 'px';
										this.inner.style['-webkit-transform'] = 'translate3d(' + outerElement.transientXPos + 'px,0px,0px)';
									}
								};
				outerElement.moveSlider = outerElement.moveSlider.bind(outerElement);
				// Handle sending event to person trapping
				outerElement.notifyUpdated = function() {
									var percent = outerElement.transientXPos/parseInt(window.getComputedStyle(outerElement.outer).width),
										newValue = Math.ceil((parseInt(outerElement.minValue) + parseInt(outerElement.maxValue))*percent);
									// Fire our events based on the step provided
									if (Math.abs(newValue - parseInt(outerElement.range.value)) > outerElement.step) {
										outerElement.range.value = newValue;
										var evObj = document.createEvent('HTMLEvents');
										evObj.initEvent('change', false, true );
										outerElement.range.dispatchEvent(evObj);
									}
								};
				outerElement.doOrientationChange = function() {
									window.setTimeout(outerElement.range.setValue, 0);
								};
				outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
				// Assign our document event listeners
				document.addEventListener('touchmove', outerElement.moveSlider, false);
				document.addEventListener('touchend', outerElement.inner.animateEnd, false);
				window.addEventListener('orientationchange', outerElement.doOrientationChange,false); 
			}
		}	
	},
	
	cutHex : function(h) {
		return (h.charAt(0)=="#") ? h.substring(1,7):h
	}
};