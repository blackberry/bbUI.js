bb.titleBar = {

	apply: function(titleBar) {
		
		if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				button,
				caption,
				details,
				topTitleArea = document.createElement('div'),
				img,
				accentText;
			
			// Insert our title area
			titleBar.topTitleArea = topTitleArea;
			titleBar.appendChild(topTitleArea);
			
			// Style our title bar
			topTitleArea.setAttribute('class', 'bb-bb10-title-bar-'+res +' bb-bb10-title-bar-' + bb.screen.controlColor);
			
			// Set our caption
			caption = document.createElement('div');
			titleBar.caption = caption;
			caption.setAttribute('class','bb-bb10-title-bar-caption-'+res);
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
					button.onclick = onactionclick;
				}
				bb.titleBar.styleBB10Button(button);
				button.style.right = '0px';
				topTitleArea.appendChild(button);
				titleBar.actionButton = button;
			}
			// Create an adjustment function for the widths
			if (titleBar.actionButton && titleBar.backButton) {
				titleBar.evenButtonWidths = function() {
										var backWidth = parseInt(window.getComputedStyle(this.backButton).width),
											actionWidth = parseInt(window.getComputedStyle(this.actionButton).width);
				
										if (backWidth > actionWidth) {
											this.actionButton.style.width = backWidth +'px';
										} else {
											this.backButton.style.width = actionWidth +'px';
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
					img.src = titleBar.getAttribute('data-bb-img');
					titleBar.img = img;
					topTitleArea.insertBefore(img, details);
					details.setAttribute('class', 'bb-bb10-title-bar-caption-details-img-'+res);
				} 
				// Next check for the accent text
				if (titleBar.hasAttribute('data-bb-accent-text')) {
					caption.style['line-height'] = bb.device.isPlayBook ? '40px' : '70px';
					accentText = document.createElement('div');
					accentText.setAttribute('class','bb-bb10-title-bar-accent-text-'+ res);
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
		var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			//disabledStyle,
			innerElement = document.createElement('div');
			//disabled = outerElement.hasAttribute('data-bb-disabled'),
			normal = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res,
			highlight = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb-bb10-titlebar-button-highlight-'+ bb.screen.controlColor + ' bb10Highlight',
			outerNormal = 'bb-bb10-titlebar-button-container-'+res+' bb-bb10-titlebar-button-container-' + bb.screen.controlColor;
			
		//outerElement.enabled = !disabled;
		outerElement.enabled = true;
		innerElement.innerHTML = outerElement.innerHTML;
		outerElement.innerHTML = '';
		outerElement.appendChild(innerElement);

		// Set our styles
		//disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
		normal = normal + ' bb-bb10-titlebar-button-' + bb.screen.controlColor;
		
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
