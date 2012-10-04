// BlackBerry 10 Context Menu
bb.contextMenu = {
	
	// Create an instance of the menu and pass it back to the caller
	create : function(screen) {
		var res,
			swipeThreshold;
		if (bb.device.isPlayBook) {
			res = 'lowres';
			swipeThreshold = 100;
		} else {
			res = 'hires';
			swipeThreshold = 300;
		}
		
		// Create the oveflow menu container
		var menu = document.createElement('div'), 
			title = document.createElement('div'),
			description = document.createElement('div'),
			header;
		menu.setAttribute('class','bb-bb10-context-menu bb-bb10-context-menu-' + res + '-' + bb.actionBar.color);
		menu.actions = [];
		menu.hideEvents = [];
		menu.res = res;
		menu.threshold = swipeThreshold;
		menu.visible = false;
		
		// Create our overlay for touch events
		menu.overlay = document.createElement('div');
		menu.overlay.threshold = swipeThreshold;
		menu.overlay.setAttribute('class','bb-bb10-context-menu-overlay');
		menu.overlay.menu = menu;
		screen.appendChild(menu.overlay);
		
		menu.overlay.ontouchmove = function(event) {
										// Only care about moves if peeking
										if (!this.menu.peeking) return;
										var touch = event.touches[0];
										if (this.startPos && (this.startPos - touch.pageX > this.threshold)) {
											this.menu.show(this.menu.selected);
											this.closeMenu = false;
										}
									};
		menu.overlay.ontouchend = function() {
										if (this.closeMenu) {
											this.menu.hide();
										}
									};
		menu.overlay.ontouchstart = function(event) {
											this.closeMenu = true;
											if (!this.menu.peeking) return;
											
											var touch = event.touches[0];
											this.startPos = touch.pageX;
											event.preventDefault();
										};
		
		// Create the menu header
		header = document.createElement('div');
		header.setAttribute('class','bb-bb10-context-menu-item-'+res+' bb-bb10-context-menu-header-'+bb.actionBar.color);
		menu.header = header;
		menu.appendChild(header);
		
		// Create our title container
		title.setAttribute('class','bb-bb10-context-menu-header-title-'+res+' bb-bb10-context-menu-header-title-'+bb.actionBar.color);
		title.style.width = bb.contextMenu.getWidth() - 20 + 'px';
		menu.topTitle = title;
		header.appendChild(title);
		
		// Create our description container
		description.setAttribute('class','bb-bb10-context-menu-header-description-'+res);
		description.style.width = bb.contextMenu.getWidth() - 20 + 'px';
		menu.description = description;
		header.appendChild(description);

		// Set our first left position
		menu.style.left = bb.contextMenu.getLeft();
		
		// Display the menu
		menu.show = function(data){
						if (data) {
							this.header.style.display = '';
							this.header.style.visibility = '';
							if (data.title) {
								this.topTitle.innerHTML = data.title;
							}
							if (data.description) {
								this.description.innerHTML = data.description;
							}
							this.selected = data;
						} else {
							this.header.style.display = 'none';	
							this.selected = undefined;							
						}
						this.peeking = false;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + bb.contextMenu.getWidth() + 'px, 0)';	
						this.addEventListener("touchstart", this.touchHandler, false);		
						// Remove the header click handling while peeking
						this.header.addEventListener("click", this.hide, false);
						this.style.visibility = 'visible';
						this.visible = true;
					};
		menu.show = menu.show.bind(menu);
		// Hide the menu
		menu.hide = function(){
						
						this.overlay.style.display = 'none';
						this.removeEventListener("touchstart", this.touchHandler, false);
						this.removeEventListener("touchmove", this.touchMoveHandler, false);
						this.style['-webkit-transition'] = 'all 0.5s ease-in-out';
						this.style['-webkit-transform'] = 'translate(' + bb.contextMenu.getWidth() + 'px, 0px)';
						if (!this.peeking) {
							// Remove the header click handling 
							this.header.removeEventListener("click", this.hide, false);	
						}
						this.peeking = false;
						this.visible = false;
						
						// See if there was anyone listenting for hide events and call them
						// starting from the last one registered and pop them off
						for (var i = menu.hideEvents.length-1; i >= 0; i--) {
							menu.hideEvents[i]();
							menu.hideEvents.pop();
						}
					};
		menu.hide = menu.hide.bind(menu);
		// Peek the menu
		menu.peek = function(data){
						if (data) {
							this.header.style.display = '';
							if (data.title) {
								this.topTitle.innerHTML = data.title;
							}
							if (data.description) {
								this.description.innerHTML = data.description;
							}
							this.selected = data;
						}
						this.header.style.visibility = 'hidden';	
						this.header.style['margin-bottom'] = '-'+ Math.floor(this.header.offsetHeight/2) + 'px';
						this.peeking = true;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + bb.contextMenu.getPeekWidth() + ', 0)';	
						this.addEventListener("touchstart", this.touchHandler, false);	
						this.addEventListener("touchmove", this.touchMoveHandler, false);						
						// Remove the header click handling while peeking
						this.header.removeEventListener("click", this.hide, false);		
						this.style.visibility = 'visible';
						this.visible = true;
					};
		menu.peek = menu.peek.bind(menu);
		
		// Trap touch start events in a way that we can add and remove the handler
		menu.touchHandler = function(event) {
								if (this.peeking) {
									var touch = event.touches[0];
									this.startPos = touch.pageX;
									if (event.target == this) {
										//event.stopPropagation();
									} else if (event.target.parentNode == this && event.target != this.header)  {
										event.preventDefault();
										event.stopPropagation();
									} 						
								} else {
									if (event.target == this) {
										this.hide();
									} 
								}
							};
		menu.touchHandler = menu.touchHandler.bind(menu);
		
		// Trap touch move events in a way that we can add and remove the handler
		menu.touchMoveHandler = function(event) {
								// Only care about moves if peeking
								if (!this.peeking) return;
								var touch = event.touches[0];
								if (this.startPos && (this.startPos - touch.pageX > this.threshold)) {
									this.show(this.selected);
								}
							};
		menu.touchMoveHandler = menu.touchMoveHandler.bind(menu);
		
		// Handle the case of clicking the context menu while peeking
		menu.onclick = function(event) {
			if (this.peeking) {
				this.show(this.selected);
				event.stopPropagation();
			}
		}
		
		// Center the items in the list
		menu.centerMenuItems = function() {
								var windowHeight = bb.innerHeight(),
									itemHeight = (bb.device.isPlayBook) ? 53 : 111,
									margin,
									numActions;
								// See how many actions to use for calculations
								numActions = (this.pinnedAction) ? this.actions.length - 1 : this.actions.length;
								margin = windowHeight - Math.floor(windowHeight/2) - Math.floor((numActions * itemHeight)/2) - itemHeight; //itemHeight is the header
								this.actions[0].style['margin-top'] = margin + 'px';
							};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
		
		// Make sure we move when the orientation of the device changes
		menu.orientationChanged = function(event) {
								this.style['-webkit-transition'] = '';
								this.style.left = bb.innerWidth() + 'px';
								this.style.height = bb.innerHeight() + 'px';
								this.centerMenuItems();
							};
		menu.orientationChanged = menu.orientationChanged.bind(menu);	
		window.addEventListener('orientationchange', menu.orientationChanged,false); 
		
		// Listen for when the animation ends so that we can make it invisible to avoid orientation change artifacts
		menu.addEventListener('webkitTransitionEnd', function() { 
						if (!this.visible) {
							this.style.visibility = 'hidden';
						}
					});
		
		// Create our add item function
		menu.add = function(action) {
				var normal, 
					highlight,
					caption = action.innerHTML,
					pin = false;
				
				// set our styling
				normal = 'bb-bb10-context-menu-item-'+this.res+' bb-bb10-context-menu-item-'+this.res+'-' + bb.actionBar.color;
				this.appendChild(action);
				this.actions.push(action);
				// See if this item should be pinned to the bottom
				pin = (action.hasAttribute('data-bb-pin') && action.getAttribute('data-bb-pin').toLowerCase() == 'true');
				if (pin && !this.pinnedAction) {
					normal = normal + ' bb-bb10-context-menu-item-first-' + this.res + '-' + bb.actionBar.color;
					action.style['bottom'] = '-2px';
					action.style.position = 'absolute';
					action.style.width = '100%';
					this.pinnedAction = action;
				}				
				// If it is the top item it needs a top border
				if (this.actions.length == 1) {
					normal = normal + ' bb-bb10-context-menu-item-first-' + this.res + '-' + bb.actionBar.color;
				}
				highlight = normal + ' bb-bb10-context-menu-item-hover-'+this.res;
				action.normal = normal;
				action.highlight = highlight;
				// Set our inner information
				action.innerHTML = '';
				var inner = document.createElement('div'),
					img = document.createElement('img');
				img.setAttribute('src', action.getAttribute('data-bb-img'));
				img.setAttribute('class','bb-bb10-context-menu-item-image-'+this.res);
				action.img = img;
				action.appendChild(img);
				inner.setAttribute('class','bb-bb10-context-menu-item-inner-'+this.res);
				action.appendChild(inner);
				inner.innerHTML = caption;
				action.display = inner;
				
				action.setAttribute('class',normal);
				action.ontouchstart = function () {
										this.setAttribute('class',this.highlight);
										this.style['border-left-color'] = bb.options.highlightColor;
									}
				action.ontouchend = function () {
										this.setAttribute('class',this.normal);
										this.style['border-left-color'] = 'transparent';
									}
				action.addEventListener("click", this.hide, false);
				
				// Assign the setCaption function
				action.setCaption = function(value) {
									this.display.innerHTML = value;
								};
				action.setCaption = action.setCaption.bind(action);
				
				// Assign the setImage function
				action.setImage = function(value) {
									this.img.setAttribute('src',value);
								};
				action.setImage = action.setImage.bind(action);
		};
		menu.add = menu.add.bind(menu);
		return menu;
	},
	
	// Calculate the proper width of the context menu
	getWidth : function() {
		if (bb.device.isPlayBook) {
			return '300';
		} else {
			return '563';		
		}
	},
	
	// Calculate the proper width of the context menu when peeking
	getPeekWidth : function() {
		if (bb.device.isPlayBook) {
			return '55px';
		} else {
			return '121px';		
		}
	},
	
	// Calculate the proper left of the context menu
	getLeft : function() {
		return window.innerWidth + 3 + 'px';	
	}
};
