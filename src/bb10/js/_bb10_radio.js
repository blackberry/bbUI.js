_bb10_radio = {
	apply: function(elements) {
		// Apply our transforms to all Radio buttons
		for (var i = 0; i < elements.length; i++) {
			bb.radio.style(elements[i]);
		};
	},
	
	style: function(outerElement) {
		var outerElement,
			containerDiv,
			dotDiv,
			centerDotDiv,
			radio,
			color = bb.screen.controlColor,	
			input = outerElement;
		
		outerElement = document.createElement('div');
		outerElement.setAttribute('class','bb-radio-container-'+color);
		if (bb.device.newerThan10dot2 === true) {
			outerElement.setAttribute('class','bb-radio-container-'+color + ' bb-radio-container-10dot3-' + color);
		}
		outerElement.input = input;
		input.outerElement = outerElement;

		// Make the existing <input[type=radio]> invisible so that we can hide it and create our own display
		input.style.display = 'none';
		
		// Create the dropdown container and insert it where the select was
		input.radio = outerElement;
		if (input.parentNode) {
			input.parentNode.insertBefore(outerElement, input);
		}
		// Insert the select as an invisible node in the new radio element
		outerElement.appendChild(input);
		
		// Create our colored dot
		dotDiv = document.createElement('div');
		if (bb.device.newerThan10dot2 === true) {
			dotDiv.setAttribute('class','bb-radio-dot bb-radio-dot-10dot3 bb-radio-dot-10dot3-'+color);
			dotDiv.highlight = '-webkit-linear-gradient(top, '+ bb.options.highlightColor +' , '+ bb.options.highlightColor+')';
			if (color == 'light') {
				dotDiv.touchHighlight = '-webkit-linear-gradient(top, #C6C6C6 , #C6C6C6)';
			} else {
				dotDiv.touchHighlight = '-webkit-linear-gradient(top, #303030 , #303030)';
			}
		} else {
			dotDiv.setAttribute('class','bb-radio-dot');
			dotDiv.highlight = '-webkit-linear-gradient(top,  rgb('+ (bb.options.shades.R + 32) +', '+ (bb.options.shades.G + 32) +', '+ (bb.options.shades.B + 32) +') 0%, rgb('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +') 100%)';
			dotDiv.touchHighlight = '-webkit-linear-gradient(top,  rgba('+ (bb.options.shades.R - 64) +', '+ (bb.options.shades.G - 64) +', '+ (bb.options.shades.B - 64) +',0.25) 0%, rgba('+ bb.options.shades.R +', '+ bb.options.shades.G +', '+ bb.options.shades.B +',0.25) 100%)';
		}
		if (input.checked) {
			dotDiv.style.background = dotDiv.highlight;
		}
		outerElement.dotDiv = dotDiv;
		outerElement.appendChild(dotDiv);
		
		// Set up our center dot
		centerDotDiv = document.createElement('div');
		if (bb.device.newerThan10dot2 === true) {
			centerDotDiv.setAttribute('class','bb-radio-dot-center bb-radio-dot-center-10dot3');
		} else {
			centerDotDiv.setAttribute('class','bb-radio-dot-center');
		}
		if (!input.checked) {
			bb.radio.resetDot(centerDotDiv);
		}
		dotDiv.appendChild(centerDotDiv);
		dotDiv.centerDotDiv = centerDotDiv;
		
		dotDiv.slideOutUp = function() {
							if (bb.device.newerThan10dot2 != true) {
								if (bb.device.is1024x600) {
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
							} else {
								this.style.background = '';
							}
							bb.radio.resetDot(this.centerDotDiv);
							this.style['-webkit-transition-property'] = 'all';
							this.style['-webkit-transition-duration'] = '0.1s';
							this.style['-webkit-transition-timing-function'] = 'linear';
							this.style['-webkit-backface-visibility'] = 'hidden';
							this.style['-webkit-perspective'] = 1000;
							this.style['-webkit-transform'] = 'translate3d(0,0,0)';
						};
		dotDiv.slideOutUp = dotDiv.slideOutUp.bind(dotDiv);
		
		dotDiv.slideOutDown = function() {
							if (bb.device.newerThan10dot2 != true) {
								if (bb.device.is1024x600) {
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
							} else {
								this.style.background = '';
							}
							bb.radio.resetDot(this.centerDotDiv);
							this.style['-webkit-transition-property'] = 'all';
							this.style['-webkit-transition-duration'] = '0.1s';
							this.style['-webkit-transition-timing-function'] = 'linear';
							this.style['-webkit-backface-visibility'] = 'hidden';
							this.style['-webkit-perspective'] = 1000;
							this.style['-webkit-transform'] = 'translate3d(0,0,0)';
						};
		dotDiv.slideOutDown = dotDiv.slideOutDown.bind(dotDiv);
		
		dotDiv.slideIn = function() {
							if (bb.device.newerThan10dot2 != true) {
								if (bb.device.is1024x600) {
									this.style.height = '20px';
									this.style.width = '20px';
									this.style.top = '10px';
									this.style.left = '9px';
									this.centerDotDiv.style.height = '10px';
									this.centerDotDiv.style.width = '10px';
									this.centerDotDiv.style.top = '5px';
									this.centerDotDiv.style.left = '5px';
								} else {
									this.style.height = '40px';
									this.style.width = '40px';
									this.style.top = '19px';
									this.style.left = '19px';
									this.centerDotDiv.style.height = '18px';
									this.centerDotDiv.style.width = '18px';
									this.centerDotDiv.style.top = '11px';
									this.centerDotDiv.style.left = '11px';
								}
							} else {
								this.centerDotDiv.style.opacity = '1.0';
							}
							this.style['-webkit-transition-property'] = 'all';
							this.style['-webkit-transition-duration'] = '0.1s';
							this.style['-webkit-transition-timing-function'] = 'ease-in';
							this.style['-webkit-backface-visibility'] = 'hidden';
							this.style['-webkit-perspective'] = 1000;
							this.style['-webkit-transform'] = 'translate3d(0,0,0)';
							// Make our center white dot visible
							this.centerDotDiv.style['-webkit-transition-delay'] = '0.1s';
							this.centerDotDiv.style['-webkit-transition-property'] = 'all';
							this.centerDotDiv.style['-webkit-transition-duration'] = '0.1s';
							this.centerDotDiv.style['-webkit-transition-timing-function'] = 'ease-in';
							this.centerDotDiv.style['-webkit-perspective'] = 1000;
							this.centerDotDiv.style['-webkit-transform'] = 'translate3d(0,0,0)';
							
						};
		dotDiv.slideIn = dotDiv.slideIn.bind(dotDiv);
		
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
											if (bb.device.newerThan10dot2 != true) {
												if (bb.device.is1024x600) {
													this.dotDiv.style.height = '20px';
													this.dotDiv.style.width = '20px';
													this.dotDiv.style.top = '10px';
													this.dotDiv.style.left = '9px';
												} else {
													this.dotDiv.style.height = '40px';
													this.dotDiv.style.width = '40px';
													this.dotDiv.style.top = '19px';
													this.dotDiv.style.left = '19px';
												}
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
											if (bb.device.newerThan10dot2 != true) {
												if (bb.device.is1024x600) {
													this.dotDiv.style.height = '0px';
													this.dotDiv.style.width = '9px';
													this.dotDiv.style.left = '16px';
												} else {
													this.dotDiv.style.height = '0px';
													this.dotDiv.style.width = '18px';
													this.dotDiv.style.left = '32px';
												}
												// Reset top position
												if (this.slideFromTop) {
													this.dotDiv.style.top = bb.device.is1024x600 ? '9px' : '18px';
												} else {
													this.dotDiv.style.top = bb.device.is1024x600 ? '30px' : '60px';
												}
											} else {
												this.dotDiv.style.background = '';
											}
											// Fire our click
											window.setTimeout(this.doclick,0);
										}
									};
		outerElement.doclick = function() {
										if ((!this.input.checked) && (!this.input.disabled)) {
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
		outerElement.doclick = outerElement.doclick.bind(outerElement);
		
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
						
		// Add our set Checked function
		input.setChecked = function() {							
					if (!this.checked) {
						// Emulate Touch Start
						this.slideFromTop = true;
						this.outerElement.selectedRadio = this.outerElement.getCurrentlyChecked();
						if (this.outerElement.selectedRadio) {
							if (this.outerElement.getTop(this.outerElement.selectedRadio.radio) >= this.outerElement.getTop(this.outerElement)) {
								this.outerElement.slideFromTop = false;
							}
						} 
						// Emulate TouchEnd
						this.outerElement.dotDiv.style['-webkit-transition'] = 'none';
						if (bb.device.newerThan10dot2 != true) {
							if (bb.device.is1024x600) {
								this.outerElement.dotDiv.style.height = '0px';
								this.outerElement.dotDiv.style.width = '9px';
								this.outerElement.dotDiv.style.left = '16px';
							} else {
								this.outerElement.dotDiv.style.height = '0px';
								this.outerElement.dotDiv.style.width = '18px';
								this.outerElement.dotDiv.style.left = '32px';
							}
							// Reset top position
							if (this.outerElement.slideFromTop) {
								this.outerElement.dotDiv.style.top = bb.device.is1024x600 ? '9px' : '18px';
							} else {
								this.outerElement.dotDiv.style.top = bb.device.is1024x600 ? '30px' : '60px';
							}
						} else {
							this.outerElement.dotDiv.style.background = '';
							this.outerElement.dotDiv.centerDotDiv.style.opacity = '0.0';
						}
						// Fire our click
						window.setTimeout(this.outerElement.doclick,0);
					}
					
				};
		input.setChecked = input.setChecked.bind(input);
		// Add our get Checked function
		input.getChecked = function() {
					return this.checked;
				};
		input.setChecked = input.setChecked.bind(input);
		
		// Add our function to enable a radio button
		input.enable = function() {
				if (!this.disabled) return;
				this.disabled = false;
				if (bb.device.newerThan10dot2 === true) {
					this.outerElement.dotDiv.setAttribute('class', 'bb-radio-dot bb-radio-dot-10dot3 bb-radio-dot-10dot3-'+bb.screen.controlColor);
				} else {
					this.outerElement.dotDiv.setAttribute('class', 'bb-radio-dot');
				}
			};
		input.enable = input.enable.bind(input);
			
		// Add our function to disable a radio button
		input.disable = function() {
				if (this.disabled) return;
				this.disabled = true;
				if (bb.device.newerThan10dot2 === true) {
					this.outerElement.dotDiv.setAttribute('class', 'bb-radio-dot-disabled bb-radio-dot-disabled-10dot3');
				} else {
					this.outerElement.dotDiv.setAttribute('class', 'bb-radio-dot-disabled');
				}
			};
		input.disable = input.disable.bind(input);
		
		//Add our function to check if an individual radio buttons in enabled
		input.isEnabled = function() {
				return (!this.disabled);
			}
		input.isEnabled = input.isEnabled.bind(input);
		
		// Add our show function
		input.show = function() {
			this.outerElement.style.display = 'block';
			bb.refresh();
			};
		input.show = input.show.bind(input);
		
		// Add our hide function
		input.hide = function() {
			this.outerElement.style.display = 'none';
			bb.refresh();
			};
		input.hide = input.hide.bind(input);
		
		// Add our remove function
		input.remove = function() {
			this.outerElement.parentNode.removeChild(this.outerElement);
			bb.refresh();
			};
		input.remove = input.remove.bind(input);
			
		return outerElement;		
	},
	
	resetDot : function(dot) {
		dot.style['-webkit-transition'] = 'none';
		
		if (bb.device.newerThan10dot2 != true) {
			if (bb.device.is1024x600) {
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
		}  else {
			dot.style.opacity = '0.0';
		}
	},
	
	//Function to enable a group of radio buttons
	enableGroup : function(groupName) {
		var radios = document.getElementsByName( groupName );
		for( i = 0; i < radios.length; i++ ) {
			if (radios[i].type === 'radio') radios[i].enable();
		}
	},
	
	//Function to disable a group of radio buttons
	disableGroup : function(groupName) {
		var radios = document.getElementsByName( groupName );
		for( i = 0; i < radios.length; i++ ) {
			if (radios[i].type === 'radio') radios[i].disable();
		}
	}
	
};