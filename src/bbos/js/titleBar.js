bb.titleBar = {

	apply: function(titleBar) {
		
		if (bb.device.isBB10) {
			var res = '1280x768-1280x720',
				orientation = bb.getOrientation(),
				button,
				caption,
				titleBarClass,
				details,
				topTitleArea = document.createElement('div'),
				img,
				accentText;
			
			// Set our 'res' for known resolutions, otherwise use the default
			if (bb.device.is1024x600) {
				res = '1024x600';
			} else if (bb.device.is1280x768 || bb.device.is1280x720) {
				res = '1280x768-1280x720';
			} else if (bb.device.is720x720) {
				res = '720x720';
			}
			
			// Insert our title area
			titleBar.topTitleArea = topTitleArea;
			titleBar.appendChild(topTitleArea);
			
			// Style our title bar
			
			if (bb.options.coloredTitleBar) {
				titleBarClass = 'bb-bb10-title-bar-'+res +' bb-bb10-title-bar-'+ orientation + '-' +res +' bb10-title-colored';
			} else {
				titleBarClass = 'bb-bb10-title-bar-'+res +' bb-bb10-title-bar-'+ orientation + '-' +res +' bb-bb10-title-bar-' + bb.screen.controlColor;
			}
			topTitleArea.setAttribute('class', titleBarClass);
			
			// Set our caption
			caption = document.createElement('div');
			titleBar.caption = caption;
			caption.setAttribute('class','bb-bb10-title-bar-caption-'+res+ ' bb-bb10-title-bar-caption-'+ orientation+ '-'+res);
			caption.innerHTML = titleBar.getAttribute('data-bb-caption');
			topTitleArea.appendChild(caption);
			
			// Get our back button if provided
			if (titleBar.hasAttribute('data-bb-back-caption')) {
				button = document.createElement('div');
				button.innerHTML = titleBar.getAttribute('data-bb-back-caption');
				topTitleArea.appendChild(button);
				titleBar.backButton = button;
				button.onclick = bb.popScreen;
				bb.titleBar.styleBB10Button(button);
				button.style.left = '0px';
			}
			// Get our action button if provided
			if (titleBar.hasAttribute('data-bb-action-caption')) {
				button = document.createElement('div');
				button.innerHTML = titleBar.getAttribute('data-bb-action-caption');
				if (titleBar.hasAttribute('onactionclick')) {
					button.titleBar = titleBar;
					button.onactionclick = titleBar.getAttribute('onactionclick');
					titleBar.onactionclick = function() {
									eval(this.actionButton.onactionclick);
								};
					button.onclick = function() {
									if (this.titleBar.onactionclick) {
										this.titleBar.onactionclick();
									}
								};
				} else if (titleBar.onactionclick) {
					button.onclick = titleBar.onactionclick;
				}
				bb.titleBar.styleBB10Button(button);
				button.style.right = '0px';
				topTitleArea.appendChild(button);
				titleBar.actionButton = button;
			}
			// Create an adjustment function for the widths
			if (titleBar.actionButton || titleBar.backButton) {
				titleBar.evenButtonWidths = function() {
										var backWidth = this.backButton ? parseInt(window.getComputedStyle(this.backButton).width) : 0,
											actionWidth = this.actionButton ? parseInt(window.getComputedStyle(this.actionButton).width) : 0,
											commonWidth;
										
										if (this.actionButton && this.backButton) {
											commonWidth = (backWidth > actionWidth) ? backWidth : actionWidth;
											this.backButton.style.width = commonWidth +'px';
											this.actionButton.style.width = commonWidth +'px';
											this.caption.style['margin-left'] = (commonWidth + 24) +'px';
											this.caption.style['margin-right'] = (commonWidth + 24) +'px';
										} else if (this.actionButton) {
											this.caption.style['margin-left'] = '0px';
											this.caption.style['margin-right'] = (actionWidth + 24) +'px';
										} else if (this.backButton) {
											this.caption.style['margin-right'] = '0px';
											this.caption.style['margin-left'] = (backWidth + 24) +'px';
										}
									};
				titleBar.evenButtonWidths = titleBar.evenButtonWidths.bind(titleBar);
				window.setTimeout(titleBar.evenButtonWidths,0);
			}
			
			// Display our image ONLY if there are no title bar images
			if ((!titleBar.actionButton && !titleBar.backButton) && (titleBar.hasAttribute('data-bb-img') || titleBar.hasAttribute('data-bb-accent-text'))){
				caption.setAttribute('class','bb-bb10-title-bar-caption-left-'+res);
				details = document.createElement('div');
				titleBar.details = details;
				topTitleArea.appendChild(details);
				details.appendChild(caption);
				
				// First check for the image
				if (titleBar.hasAttribute('data-bb-img')) {
					img = document.createElement('img');
					//img.src = titleBar.getAttribute('data-bb-img');
					titleBar.img = img;
					topTitleArea.insertBefore(img, details);
					details.setAttribute('class', 'bb-bb10-title-bar-caption-details-img-'+res);
					
					// Create our display image
					img.style.opacity = '0';
					img.style['-webkit-transition'] = 'opacity 0.5s linear';
					img.style['-webkit-backface-visibility'] = 'hidden';
					img.style['-webkit-perspective'] = 1000;
					img.style['-webkit-transform'] = 'translate3d(0,0,0)';
	
					// Load our image once onbbuidomready 
					titleBar.onbbuidomready = function() {
								// Animate its visibility once loaded
								this.img.onload = function() {
									this.style.opacity = '1.0';
								}
								this.img.src = this.getAttribute('data-bb-img');
								document.removeEventListener('bbuidomready', this.onbbuidomready,false);
							};
					titleBar.onbbuidomready = titleBar.onbbuidomready.bind(titleBar);
					document.addEventListener('bbuidomready', titleBar.onbbuidomready,false);		
				} 
				// Next check for the accent text
				if (titleBar.hasAttribute('data-bb-accent-text')) {
					if (bb.device.is1024x600) {
						caption.style['line-height'] = '40px';
					} else if (bb.device.is1280x768 || bb.device.is1280x720) {
						caption.style['line-height'] = '70px';
					} else if (bb.device.is720x720) {
						caption.style['line-height'] = '55px';
					}else {
						caption.style['line-height'] = '70px';
					}
					accentText = document.createElement('div');
					accentText.setAttribute('class','bb-bb10-title-bar-accent-text-'+ res);
					if (bb.options.coloredTitleBar) {
						accentText.style.color = 'silver';
					}
					titleBar.accentText = accentText;
					accentText.innerHTML = titleBar.getAttribute('data-bb-accent-text');
					details.appendChild(accentText);
				} 
			
			}

			// Assign the setCaption function
			titleBar.setCaption = function(value) {
					this.caption.innerHTML = value;
				};
			titleBar.setCaption = titleBar.setCaption.bind(titleBar);
			// Assign the getCaption function
			titleBar.getCaption = function() {
					return this.caption.innerHTML;
				};
			titleBar.getCaption = titleBar.getCaption.bind(titleBar);
			// Assign the setBackCaption function
			titleBar.setBackCaption = function(value) {
					this.backButton.firstChild.innerHTML = value;
					if (this.actionButton) {
						this.backButton.style.width = '';
						this.evenButtonWidths();
					}
				};
			titleBar.setBackCaption = titleBar.setBackCaption.bind(titleBar);
			// Assign the getBackCaption function
			titleBar.getBackCaption = function() {
					return this.backButton.firstChild.innerHTML;
				};
			titleBar.getBackCaption = titleBar.getBackCaption.bind(titleBar);
			// Assign the setActionCaption function
			titleBar.setActionCaption = function(value) {
					this.actionButton.firstChild.innerHTML = value;
					if (this.backButton) {
						this.actionButton.style.width = '';
						this.evenButtonWidths();
					}
				};
			titleBar.setActionCaption = titleBar.setActionCaption.bind(titleBar);
			// Assign the getActionCaption function
			titleBar.getActionCaption = function() {
					return this.actionButton.firstChild.innerHTML;
				};
			titleBar.getActionCaption = titleBar.getActionCaption.bind(titleBar);
			// Assign the getAccentText function
			titleBar.getAccentText = function() {
					return this.accentText.innerHTML;
				};
			titleBar.getAccentText = titleBar.getAccentText.bind(titleBar);
			
			
		} else if (bb.device.isPlayBook) {
			titleBar.setAttribute('class', 'pb-title-bar');
			titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
			if (titleBar.hasAttribute('data-bb-back-caption')) {
				var button = document.createElement('div'), 
					buttonInner = document.createElement('div');
				button.setAttribute('class', 'pb-title-bar-back');
				button.onclick = bb.popScreen;
				buttonInner.setAttribute('class','pb-title-bar-back-inner');
				buttonInner.innerHTML = titleBar.getAttribute('data-bb-back-caption'); 
				button.appendChild(buttonInner);
				titleBar.appendChild(button);
			}
		} else {
			//device is legacy

            // assign a setCaption function
            titleBar.setCaption = function(value) {

                if(!value) {
                    // if no value specified, pull from attribute

                    value = this.getAttribute('data-bb-caption');
                    this.innerHTML = value;
                    return;
                }

                // update the innerHTML and the attribute to be through
                this.setAttribute('data-bb-caption', value);
                this.innerHTML = value;
            };

            titleBar.setCaption = titleBar.setCaption.bind(titleBar);

            // Assign the getCaption function
            titleBar.getCaption = function() {
                return this.innerHTML;
            };

            titleBar.getCaption = titleBar.getCaption.bind(titleBar);


			if (titleBar.hasAttribute('data-bb-caption')) {
				if (bb.device.isHiRes) {
					titleBar.setAttribute('class', 'bb-hires-screen-title');
				} else {
					titleBar.setAttribute('class', 'bb-lowres-screen-title');
				}
				titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
			}
		}
	},
	
	styleBB10Button: function(outerElement) {
		var res = '1280x768-1280x720',
			//disabledStyle,
			innerElement = document.createElement('div'),
			//disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal,
			highlight, 
			outerNormal;
		
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			res = '1024x600';
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			res = '1280x768-1280x720';
		} else if (bb.device.is720x720) {
			res = '720x720';
		}
		
		if (bb.options.coloredTitleBar) {
			normal = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb10-title-button-colored';
			highlight = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb10-title-button-colored-highlight';
			outerNormal = 'bb-bb10-titlebar-button-container-'+res+' bb10-title-button-container-colored';
			// Set our styles
			//disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
		} else {
			normal = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb-bb10-titlebar-button-' + bb.screen.controlColor;
			highlight = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb-bb10-titlebar-button-highlight-'+ bb.screen.controlColor;
			outerNormal = 'bb-bb10-titlebar-button-container-'+res+' bb-bb10-titlebar-button-container-' + bb.screen.controlColor;
			// Set our styles
			//disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
		}

		//outerElement.enabled = !disabled;
		outerElement.enabled = true;
		innerElement.innerHTML = outerElement.innerHTML;
		outerElement.innerHTML = '';
		outerElement.appendChild(innerElement);
		
		/*if (disabled) {
			outerElement.removeAttribute('data-bb-disabled');
			innerElement.setAttribute('class',disabledStyle);
		} else {*/
			innerElement.setAttribute('class',normal);
		//}
		// Set our variables on the elements
		outerElement.setAttribute('class',outerNormal);
		outerElement.outerNormal = outerNormal;
		outerElement.innerElement = innerElement;
		innerElement.normal = normal;
		innerElement.highlight = highlight;
		//innerElement.disabledStyle = disabledStyle;
		//if (!disabled) {
			outerElement.ontouchstart = function() {
									this.innerElement.setAttribute('class', this.innerElement.highlight);
								};
			outerElement.ontouchend = function() {
									this.innerElement.setAttribute('class', this.innerElement.normal);
								};
		//}
						
		// Trap the click and call it only if the button is enabled
		outerElement.trappedClick = outerElement.onclick;
		outerElement.onclick = undefined;
		if (outerElement.trappedClick !== null) {
			outerElement.addEventListener('click',function (e) {
					if (this.enabled) {
						this.trappedClick();
					}
				},false);
		}
		
		// Assign our enable function
	  /*  outerElement.enable = function(){ 
				if (this.enabled) return;
				this.innerElement.setAttribute('class', this.innerElement.normal);
				this.ontouchstart = function() {
									this.innerElement.setAttribute('class', this.innerElement.highlight);
									
								};
				this.ontouchend = function() {
									this.innerElement.setAttribute('class', this.innerElement.normal);
								};
				this.enabled = true;
			};
		// Assign our disable function
		outerElement.disable = function(){ 
				if (!this.enabled) return;
				this.innerElement.setAttribute('class', this.innerElement.disabledStyle);
				this.ontouchstart = null;
				this.ontouchend = null;
				this.enabled = false;
			};*/
        
	
	}
};