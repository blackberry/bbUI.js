bb.titleBar = {

	apply: function(titleBar) {
		
		if (bb.device.isBB10) {
			var res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
				button;
			titleBar.setAttribute('class', 'bb-bb10-title-bar-'+res +' bb-bb10-title-bar-' + bb.actionBar.color);
			titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
			// Get our back button if provided
			if (titleBar.hasAttribute('data-bb-back-caption')) {
				button = document.createElement('div');
				button.innerHTML = titleBar.getAttribute('data-bb-back-caption');
				titleBar.appendChild(button);
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
					button.onactionclick = titleBar.getAttribute('onactionclick');
					button.onclick = function() {
									eval(this.onactionclick);
								};
				} else if (titleBar.onactionclick) {
					button.onclick = onactionclick;
				}
				//button.onclick = bb.popScreen;
				bb.titleBar.styleBB10Button(button);
				button.style.right = '0px';
				titleBar.appendChild(button);
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
				var outerStyle = titleBar.getAttribute('style');
				if (bb.device.isHiRes) {
					titleBar.setAttribute('class', 'bb-hires-screen-title');
					titleBar.setAttribute('style', outerStyle + ';padding-top:33px');
				} else {
					titleBar.setAttribute('class', 'bb-lowres-screen-title');
					titleBar.setAttribute('style', outerStyle + ';padding-top:27px');
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
			highlight = 'bb-bb10-titlebar-button bb-bb10-titlebar-button-'+res+' bb10-button-highlight',
			outerNormal = 'bb-bb10-titlebar-button-container-'+res+' bb-bb10-titlebar-button-container-' + bb.actionBar.color;
			
		//outerElement.enabled = !disabled;
		outerElement.enabled = true;
		innerElement.innerHTML = outerElement.innerHTML;
		outerElement.innerHTML = '';
		outerElement.appendChild(innerElement);

		// Set our styles
		//disabledStyle = normal + ' bb-bb10-button-disabled-'+bb.screen.controlColor;
		normal = normal + ' bb-bb10-titlebar-button-' + bb.actionBar.color;
		
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