bb.titleBar = {

	apply: function(titleBar) {	
		var orientation = bb.getOrientation(),
			button,
			caption,
			titleBarClass,
			details,
			topTitleArea = document.createElement('div'),
			img,
			accentText;
		
		// Insert our title area
		titleBar.topTitleArea = topTitleArea;
		titleBar.appendChild(topTitleArea);
		
		// Create our box shadow below the title bar
		if (titleBar.parentNode) {
			titleBar.dropShadow = document.createElement('div');
			titleBar.dropShadow.setAttribute('class','bb-title-bar-drop-shadow');
			titleBar.dropShadow.style.top = (bb.screen.getTitleBarHeight() - 1) + 'px';
			titleBar.parentNode.appendChild(titleBar.dropShadow);
		}
		
		// Style our title bar
		if (bb.options.coloredTitleBar) {
			titleBarClass = 'bb-title-bar bb-title-bar-'+ orientation + ' bb10-title-colored';
		} else {
			titleBarClass = 'bb-title-bar bb-title-bar-'+ orientation + ' bb-title-bar-' + bb.screen.controlColor;
		}
		topTitleArea.setAttribute('class', titleBarClass);
		
		// Set our caption
		caption = document.createElement('div');
		titleBar.caption = caption;
		caption.setAttribute('class','bb-title-bar-caption bb-title-bar-caption-'+ orientation);
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
			caption.setAttribute('class','bb-title-bar-caption-left');
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
				details.setAttribute('class', 'bb-title-bar-caption-details-img');
				
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
				accentText.setAttribute('class','bb-title-bar-accent-text');
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
	},
	
	styleBB10Button: function(outerElement) {
		var innerElement = document.createElement('div'),
			normal,
			highlight, 
			outerNormal;
		
		if (bb.options.coloredTitleBar) {
			normal = 'bb-titlebar-button bb10-title-button-colored';
			highlight = 'bb-titlebar-button bb10-title-button-colored-highlight';
			outerNormal = 'bb-titlebar-button-container bb10-title-button-container-colored';
		} else {
			normal = 'bb-titlebar-button bb-titlebar-button-' + bb.screen.controlColor;
			highlight = 'bb-titlebar-button bb-titlebar-button-highlight-'+ bb.screen.controlColor;
			outerNormal = 'bb-titlebar-button-container bb-titlebar-button-container-' + bb.screen.controlColor;
		}

		//outerElement.enabled = !disabled;
		outerElement.enabled = true;
		innerElement.innerHTML = outerElement.innerHTML;
		outerElement.innerHTML = '';
		outerElement.appendChild(innerElement);
		innerElement.setAttribute('class',normal);
		
		// Set our variables on the elements
		outerElement.setAttribute('class',outerNormal);
		outerElement.outerNormal = outerNormal;
		outerElement.innerElement = innerElement;
		innerElement.normal = normal;
		innerElement.highlight = highlight;

		outerElement.ontouchstart = function() {
								this.innerElement.setAttribute('class', this.innerElement.highlight);
							};
		outerElement.ontouchend = function() {
								this.innerElement.setAttribute('class', this.innerElement.normal);
							};

						
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
        
	
	}
};