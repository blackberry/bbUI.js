bb.radio = {
	apply: function(elements) {
		if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				i,
				outerElement,
				containerDiv,
				innerDiv,
				dotDiv,
				centerDotDiv,
				radio,
				R,G,B,
				color = bb.screen.controlColor;
				
			// Get our highlight and accent RGB colors
			R = parseInt((bb.slider.cutHex(bb.options.bb10HighlightColor)).substring(0,2),16)
			G = parseInt((bb.slider.cutHex(bb.options.bb10HighlightColor)).substring(2,4),16);
			B = parseInt((bb.slider.cutHex(bb.options.bb10HighlightColor)).substring(4,6),16);
				
			// Apply our transforms to all Radio buttons
			for (i = 0; i < elements.length; i++) {
				outerElement = elements[i];
				input = outerElement;
				outerElement = document.createElement('div');
				outerElement.setAttribute('class','bb-bb10-radio-container-'+res + '-'+color);
				outerElement.input = input;

				// Make the existing <input[type=radio]> invisible so that we can hide it and create our own display
				input.style.display = 'none';
				
				// Create the dropdown container and insert it where the select was
				input.radio = outerElement;
				input.parentNode.insertBefore(outerElement, input);
				// Insert the select as an invisible node in the new dropdown element
                outerElement.appendChild(input);
				
				// Create our colored dot
				dotDiv = document.createElement('div');
				dotDiv.setAttribute('class','bb-bb10-radio-dot-'+res);
				dotDiv.highlight = '-webkit-linear-gradient(top,  rgb('+ (R + 32) +', '+ (G + 32) +', '+ (B + 32) +') 0%, rgb('+ R +', '+ G +', '+ B +') 100%)';
				dotDiv.touchHighlight = '-webkit-linear-gradient(top,  rgba('+ (R - 64) +', '+ (G - 64) +', '+ (B - 64) +',0.25) 0%, rgba('+ R +', '+ G +', '+ B +',0.25) 100%)';
				if (input.checked) {
					dotDiv.style.background = dotDiv.highlight;
				}
				outerElement.dotDiv = dotDiv;
				outerElement.appendChild(dotDiv);
				
				// Set up our center dot
				centerDotDiv = document.createElement('div');
				centerDotDiv.setAttribute('class','bb-bb10-radio-dot-center-'+res);
				if (!input.checked) {
					bb.radio.resetDot(centerDotDiv);
				}
				dotDiv.appendChild(centerDotDiv);
				dotDiv.centerDotDiv = centerDotDiv;
				
				dotDiv.slideOutUp = function() {
									if (bb.device.isPlayBook) {
										this.style.height = '0px';
										this.style.width = '10px';
										this.style.top = '9px';
										this.style.left = '15px';
									} else {
										this.style.height = '0px';
										this.style.width = '20px';
										this.style.top = '18px';
										this.style.left = '30px';
									}
									bb.radio.resetDot(this.centerDotDiv);
									this.style['-webkit-transition-property'] = 'all';
									this.style['-webkit-transition-duration'] = '0.1s';
									this.style['-webkit-transition-timing-function'] = 'linear';
									this.style['-webkit-backface-visibility'] = 'hidden';
									this.style['-webkit-perspective'] = 1000;
									this.style['-webkit-transform'] = 'translate3d(0,0,0)';
									// Adjust the container
									this.innerDiv.style['margin-top'] = '0px';
									this.innerDiv.style['-webkit-transition'] = 'margin-top 0.1s linear';
									this.innerDiv.style['-webkit-backface-visibility'] = 'hidden';
									this.innerDiv.style['-webkit-perspective'] = 1000;
									this.innerDiv.style['-webkit-transform'] = 'translate3d(0,0,0)';
								};
				dotDiv.slideOutUp = dotDiv.slideOutUp.bind(dotDiv);
				
				dotDiv.slideOutDown = function() {
									if (bb.device.isPlayBook) {
										this.style.height = '0px';
										this.style.width = '10px';
										this.style.top = '30px';
										this.style.left = '15px';
									} else {
										this.style.height = '0px';
										this.style.width = '20px';
										this.style.top = '60px';
										this.style.left = '30px';
									}
									bb.radio.resetDot(this.centerDotDiv);
									this.style['-webkit-transition-property'] = 'all';
									this.style['-webkit-transition-duration'] = '0.1s';
									this.style['-webkit-transition-timing-function'] = 'linear';
									this.style['-webkit-backface-visibility'] = 'hidden';
									this.style['-webkit-perspective'] = 1000;
									this.style['-webkit-transform'] = 'translate3d(0,0,0)';
									// Adjust the container
									this.innerDiv.style['margin-top'] = '0px';
									this.innerDiv.style['-webkit-transition'] = 'margin-top 0.1s linear';
									this.innerDiv.style['-webkit-backface-visibility'] = 'hidden';
									this.innerDiv.style['-webkit-perspective'] = 1000;
									this.innerDiv.style['-webkit-transform'] = 'translate3d(0,0,0)';
								};
				dotDiv.slideOutDown = dotDiv.slideOutDown.bind(dotDiv);
				
				dotDiv.slideIn = function() {
									if (bb.device.isPlayBook) {
										this.style.height = '20px';
										this.style.width = '20px';
										this.style.top = '10px';
										this.style.left = '9px';
										this.centerDotDiv.style.height = '10px';
										this.centerDotDiv.style.width = '10px';
										this.centerDotDiv.style.top = '5px';
										this.centerDotDiv.style.left = '5px';
										this.innerDiv.style['margin-top'] = '-20px';
									} else {
										this.style.height = '40px';
										this.style.width = '40px';
										this.style.top = '19px';
										this.style.left = '19px';
										this.centerDotDiv.style.height = '18px';
										this.centerDotDiv.style.width = '18px';
										this.centerDotDiv.style.top = '11px';
										this.centerDotDiv.style.left = '11px';
										this.innerDiv.style['margin-top'] = '-40px';
									}
									this.style['-webkit-transition-property'] = 'all';
									this.style['-webkit-transition-duration'] = '0.1s';
									this.style['-webkit-transition-timing-function'] = 'ease-in';
									this.style['-webkit-backface-visibility'] = 'hidden';
									this.style['-webkit-perspective'] = 1000;
									this.style['-webkit-transform'] = 'translate3d(0,0,0)';
									// Adjust the container
									this.innerDiv.style['-webkit-transition'] = 'margin-top 0.1s linear';
									this.innerDiv.style['-webkit-backface-visibility'] = 'hidden';
									this.innerDiv.style['-webkit-perspective'] = 1000;
									this.innerDiv.style['-webkit-transform'] = 'translate3d(0,0,0)';
									// Make our center white dot visible
									this.centerDotDiv.style['-webkit-transition-delay'] = '0.2s';
									this.centerDotDiv.style['-webkit-transition-property'] = 'all';
									this.centerDotDiv.style['-webkit-transition-duration'] = '0.1s';
									this.centerDotDiv.style['-webkit-transition-timing-function'] = 'ease-in';
									this.centerDotDiv.style['-webkit-backface-visibility'] = 'hidden';
									this.centerDotDiv.style['-webkit-perspective'] = 1000;
									this.centerDotDiv.style['-webkit-transform'] = 'translate3d(0,0,0)';
									
								};
				dotDiv.slideIn = dotDiv.slideIn.bind(dotDiv);
						
				innerDiv = document.createElement('div');
				dotDiv.innerDiv = innerDiv;
				outerElement.innerDiv = innerDiv;
				innerDiv.setAttribute('class','bb-bb10-radio-inner-'+res+'-'+color);
				outerElement.appendChild(innerDiv);
				
				// Set up properties
				outerElement.selectedRadio = undefined;		
				outerElement.slideFromTop = true;
				outerElement.ontouchstart = function() {
												if (!this.input.checked) {	
													this.slideFromTop = true;
													// See if it should slide from top or bottom
													this.selectedRadio = this.getCurrentlyChecked();
													if (this.selectedRadio) {
														if (this.getTop(this.selectedRadio.radio) >= this.getTop(this)) {
															this.slideFromTop = false;
														}
													} 
													// Reset for our highlights
													this.dotDiv.style['-webkit-transition'] = 'none';
													this.innerDiv.style['-webkit-transition'] = 'none';
													if (bb.device.isPlayBook) {
														this.dotDiv.style.height = '20px';
														this.dotDiv.style.width = '20px';
														this.dotDiv.style.top = '10px';
														this.dotDiv.style.left = '9px';
														this.innerDiv.style['margin-top'] ='-20px';
													} else {
														this.dotDiv.style.height = '40px';
														this.dotDiv.style.width = '40px';
														this.dotDiv.style.top = '19px';
														this.dotDiv.style.left = '19px';
														this.innerDiv.style['margin-top'] ='-40px';
													}
													// Reset our center white dot
													bb.radio.resetDot(this.dotDiv.centerDotDiv);
													// Do our touch highlight
													this.dotDiv.style.background = this.dotDiv.touchHighlight;
												}
											};
				outerElement.ontouchend = function() {
												if (!this.input.checked) {
													this.dotDiv.style['-webkit-transition'] = 'none';
													this.innerDiv.style['-webkit-transition'] = 'none';
													if (bb.device.isPlayBook) {
														this.dotDiv.style.height = '0px';
														this.dotDiv.style.width = '9px';
														this.dotDiv.style.left = '16px';
														this.innerDiv.style['margin-top'] ='0px';
													} else {
														this.dotDiv.style.height = '0px';
														this.dotDiv.style.width = '18px';
														this.dotDiv.style.left = '32px';
														this.innerDiv.style['margin-top'] ='0px';
													}
													// Reset top position
													if (this.slideFromTop) {
														this.dotDiv.style.top = bb.device.isPlayBook ? '9px' : '18px';
													} else {
														this.dotDiv.style.top = bb.device.isPlayBook ? '30px' : '60px';
													}
												}
											};
				outerElement.onclick = function() {
												if (!this.input.checked) {
													var evObj = document.createEvent('HTMLEvents');
													evObj.initEvent('change', false, true );
													this.dotDiv.style.background = this.dotDiv.highlight;
													this.dotDiv.slideIn();
													if (this.selectedRadio) {
														this.selectedRadio.removeAttribute('checked');
														// fire the changed event for the previously checked radio
														this.selectedRadio.dispatchEvent(evObj);
														if (this.slideFromTop) {
															this.selectedRadio.radio.dotDiv.slideOutDown();
														} else {
															this.selectedRadio.radio.dotDiv.slideOutUp();
														}
													}
													this.input.setAttribute('checked','true');
													this.input.dispatchEvent(evObj);
												}
											};
				
				outerElement.getCurrentlyChecked = function() {
												var inputs = document.querySelectorAll('input[type=radio][name='+ this.input.name +'][checked=true]');
												if (inputs.length > 0) {
													return inputs[0];
												} else {
													return undefined;
												}
											};
				outerElement.getCurrentlyChecked = outerElement.getCurrentlyChecked.bind(outerElement);
				
				outerElement.getTop = function(element) {
									var top = 0;
									while (element) {
										top = top + element.offsetTop;
										element = element.offsetParent;
									}
									return top;
								};	
			}
		}
	},
	
	resetDot : function(dot) {
		dot.style['-webkit-transition'] = 'none';
		if (bb.device.isPlayBook) {
			dot.style.height = '0px';
			dot.style.width = '0px';
			dot.style.top = '10px';
			dot.style.left = '9px';
		} else {
			dot.style.height = '0px';
			dot.style.width = '0px';
			dot.style.top = '20px';
			dot.style.left = '20px';
		}
	}
};