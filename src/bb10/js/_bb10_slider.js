_bb10_slider = {

	apply: function(elements) {
		var i, 
			range,
			color = bb.screen.controlColor;
			
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
			outerElement.className = 'bb-slider';
			outerElement.outer = document.createElement('div');
			outerElement.outer.setAttribute('class','outer bb-slider-outer-' + color);
			outerElement.appendChild(outerElement.outer);
			outerElement.fill = document.createElement('div');
			outerElement.fill.className = 'fill';
			outerElement.fill.active = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
			outerElement.fill.dormant = '-webkit-linear-gradient(top, '+ bb.options.highlightColor +' 0%, '+ bb.options.shades.darkHighlight +' 100%)';
			outerElement.fill.style.background = outerElement.fill.dormant;
			outerElement.outer.appendChild(outerElement.fill);
			outerElement.inner = document.createElement('div');
			outerElement.inner.className = 'inner';
			outerElement.inner.outerElement = outerElement;
			outerElement.outer.appendChild(outerElement.inner);
			outerElement.halo = document.createElement('div');
			outerElement.halo.className = 'halo';
			outerElement.halo.style.background = '-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 43, from(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), color-stop(0.8, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.15)), to(rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +', 0.7)))';
			outerElement.inner.appendChild(outerElement.halo);
			outerElement.indicator = document.createElement('div');
			outerElement.indicator.setAttribute('class','indicator bb-slider-indicator-' + color);
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
							this.outerElement.currentXPos = Math.floor(parseInt(window.getComputedStyle(this.outerElement.outer).width) * percent);
							this.outerElement.fill.style.width = this.outerElement.currentXPos + 'px';
							this.outerElement.inner.style['-webkit-transform'] = 'translate3d(' + this.outerElement.currentXPos + 'px,0px,0px)';
						};
			range.setValue = range.setValue.bind(range);
			// Set our value on a timeout so that it can calculate width once in the DOM
			window.setTimeout(range.setValue, 0);
			// Setup our touch events
			outerElement.inner.animateBegin = function(event) {
									if (this.outerElement.isActivated === false) {
										this.outerElement.isActivated = true;
										this.outerElement.initialXPos = event.touches[0].pageX;	
										this.outerElement.halo.style['-webkit-transform'] = 'scale(1)';
										this.outerElement.halo.style['-webkit-animation-name'] = 'explode';
										this.outerElement.indicator.setAttribute('class','indicator bb-slider-indicator-' + color+ ' indicator-hover-'+color);
										this.outerElement.indicator.style.background = '-webkit-linear-gradient(top, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 0%, rgb('+ (bb.options.shades.R + 16) +', '+ (bb.options.shades.G + 16) +', '+ (bb.options.shades.B + 16) +') 100%)';
										this.outerElement.fill.style.background = this.outerElement.fill.active;
									}
								};
			outerElement.inner.animateBegin = outerElement.inner.animateBegin.bind(outerElement.inner);
			outerElement.inner.addEventListener("touchstart", outerElement.inner.animateBegin, false);
			outerElement.inner.animateEnd = function () {
									if (this.outerElement.isActivated === true) {
										this.outerElement.isActivated = false;
										this.outerElement.currentXPos = this.outerElement.transientXPos;
										this.outerElement.value = parseInt(this.outerElement.range.value);
										this.outerElement.halo.style['-webkit-transform'] = 'scale(0)';
										this.outerElement.halo.style['-webkit-animation-name'] = 'implode';
										this.outerElement.indicator.setAttribute('class','indicator bb-slider-indicator-' + color);   
										this.outerElement.indicator.style.background = '';	
										this.outerElement.fill.style.background = this.outerElement.fill.dormant;
									}
								};
			outerElement.inner.animateEnd = outerElement.inner.animateEnd.bind(outerElement.inner);
			outerElement.inner.addEventListener("touchend", outerElement.inner.animateEnd, false);
			// Handle moving the slider
			outerElement.moveSlider = function (event) {
								if (this.isActivated === true) {
									event.stopPropagation();
									event.preventDefault();
									this.transientXPos = this.currentXPos + event.touches[0].pageX - this.initialXPos;
									this.transientXPos = Math.max(0, Math.min(this.transientXPos, parseInt(window.getComputedStyle(this.outer).width)));
									this.notifyUpdated();
									this.fill.style.width = this.transientXPos + 'px';
									this.inner.style['-webkit-transform'] = 'translate3d(' + this.transientXPos + 'px,0px,0px)';
								}
							};
			outerElement.moveSlider = outerElement.moveSlider.bind(outerElement);
			// Handle sending event to person trapping
			outerElement.notifyUpdated = function() {
								var percent = this.transientXPos/parseInt(window.getComputedStyle(this.outer).width),
									newValue = Math.ceil((parseInt(this.minValue) + parseInt(this.maxValue))*percent);
								// Fire our events based on the step provided
								if (Math.abs(newValue - parseInt(this.range.value)) > this.step) {
									this.range.value = newValue;
									var evObj = document.createEvent('HTMLEvents');
									evObj.initEvent('change', false, true );
									this.range.dispatchEvent(evObj);
								}
							};
			outerElement.notifyUpdated = outerElement.notifyUpdated.bind(outerElement);
			outerElement.doOrientationChange = function() {
								window.setTimeout(outerElement.range.setValue, 0);
							};
			outerElement.doOrientationChange = outerElement.doOrientationChange.bind(outerElement);
			// Assign our document & windows event listeners
			document.addEventListener('touchmove', outerElement.moveSlider, false);
			bb.documentListeners.push({name: 'touchmove', eventHandler: outerElement.moveSlider});
			
			document.addEventListener('touchend', outerElement.inner.animateEnd, false);
			bb.documentListeners.push({name: 'touchend', eventHandler: outerElement.inner.animateEnd});
			
			window.addEventListener('resize', outerElement.doOrientationChange,false); 
			bb.windowListeners.push({name: 'resize', eventHandler: outerElement.doOrientationChange});
		}
	}
};