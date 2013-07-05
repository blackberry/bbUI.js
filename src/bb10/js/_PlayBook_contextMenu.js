// BlackBerry 10 Context Menu for PlayBook
// Also acts as the action overflow menu for BlackBerry 10 Action Bar
_PlayBook_contextMenu = {
	// Create an instance of the menu and pass it back to the caller
	create : function(screen) {
		var swipeThreshold = 300;
				
		// Set our swipeThreshold for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			swipeThreshold = 100;
		} else if (bb.device.is720x720) {
			swipeThreshold = 300;
		}
		
		// Create the oveflow menu container
		var menu = document.createElement('div'), 
			title = document.createElement('div'),
			description = document.createElement('div'),
			header;
		menu.setAttribute('class','bb-context-menu bb-context-menu-dark');
	
		menu.actions = [];
		menu.hideEvents = [];
		menu.threshold = swipeThreshold;
		menu.visible = false;
		
		// Create our overlay for touch events
		menu.overlay = document.createElement('div');
		menu.overlay.threshold = swipeThreshold;
		menu.overlay.setAttribute('class','bb-context-menu-overlay');
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
											event.preventDefault();
										}
									};
		menu.overlay.ontouchstart = function(event) {
											this.closeMenu = true;
											if (!this.menu.peeking && this.menu.visible) {
												event.preventDefault();
											} else if (!this.menu.peeking) return;
											
											var touch = event.touches[0];
											this.startPos = touch.pageX;
											event.preventDefault();
										};
		
		// Create the menu header
		header = document.createElement('div');
		header.setAttribute('class','bb-context-menu-item bb-context-menu-header-dark');
		menu.header = header;
		menu.appendChild(header);
		
		// Create our title container
		title.setAttribute('class','bb-context-menu-header-title bb-context-menu-header-title-dark');
		title.style.width = _PlayBook_contextMenu.getWidth() - 20 + 'px';
		menu.topTitle = title;
		header.appendChild(title);
		
		// Create our description container
		description.setAttribute('class','bb-context-menu-header-description');
		description.style.width = _PlayBook_contextMenu.getWidth() - 20 + 'px';
		menu.description = description;
		header.appendChild(description);
		
		// Create our scrolling container
		menu.scrollContainer = document.createElement('div');
		menu.scrollContainer.setAttribute('class', 'bb-context-menu-scroller');
		menu.appendChild(menu.scrollContainer);

		// Set our first left position
		menu.style.left = _PlayBook_contextMenu.getLeft();
		
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
							// Adjust our scroll container top
							menu.scrollContainer.style.top = (bb.device.isPlayBook) ? '64px' : '130px';
						} else {
							this.header.style.display = 'none';	
							this.selected = undefined;
							// Adjust our scroll container top
							menu.scrollContainer.style.top = '0px';							
						}
						// Set our scroller
						menu.scrollContainer.style['overflow-y'] = 'scroll';
						menu.scrollContainer.style['overflow-x'] = 'hidden'
						menu.scrollContainer.style['-webkit-overflow-scrolling'] = '-blackberry-touch';
						
						this.peeking = false;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + _PlayBook_contextMenu.getWidth() + 'px, 0)';
						this.style['-webkit-backface-visibility'] = 'hidden';
						this.style['-webkit-perspective'] = '1000';
						this.addEventListener("touchstart", this.touchHandler, false);	
						this.onclick = function() {	this.hide();}
						// Remove the header click handling while peeking
						this.header.addEventListener("click", this.hide, false);
						this.style.visibility = 'visible';
						this.visible = true;
						if(bb.device.isPlayBook){
							blackberry.app.event.onSwipeDown('');
						} else {
							blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
						}
					};
		menu.show = menu.show.bind(menu);
		// Hide the menu
		menu.hide = function(){
						
						this.overlay.style.display = 'none';
						this.removeEventListener("touchstart", this.touchHandler, false);
						this.removeEventListener("touchmove", this.touchMoveHandler, false);
						this.style['-webkit-transition'] = 'all 0.5s ease-in-out';
						this.style['-webkit-transform'] = 'translate(' + _PlayBook_contextMenu.getWidth() + 'px, 0px)';
						this.style['-webkit-backface-visibility'] = 'hidden';
						this.style['-webkit-perspective'] = '1000';
						if (!this.peeking) {
							// Remove the header click handling 
							this.header.removeEventListener("click", this.hide, false);	
						}
						this.peeking = false;
						this.visible = false;
						
						// Remove our scroller
						menu.scrollContainer.style['overflow-y'] = '';
						menu.scrollContainer.style['overflow-x'] = ''
						menu.scrollContainer.style['-webkit-overflow-scrolling'] = '';
						
						// See if there was anyone listenting for hide events and call them
						// starting from the last one registered and pop them off
						for (var i = menu.hideEvents.length-1; i >= 0; i--) {
							menu.hideEvents[i]();
							menu.hideEvents.pop();
						}
						
						// Hack because PlayBook doesn't seem to get all the touch end events
						if (bb.device.isPlayBook) {
							for (var i = 0; i < this.actions.length; i++) {
								this.actions[i].ontouchend();
							}
						}
						if(bb.device.isPlayBook){
							blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
						} else {
							blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
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
							// Adjust our scroller top
							menu.scrollContainer.style.top = (bb.device.isPlayBook) ? '64px' : '130px';
						} else {
							// Adjust our scroller top
							menu.scrollContainer.style.top = '0px';
						}
						
						this.header.style.visibility = 'hidden';	
						this.header.style['margin-bottom'] = '-'+ Math.floor(this.header.offsetHeight/2) + 'px';
						this.peeking = true;
						this.overlay.style.display = 'inline';
						this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
						this.style['-webkit-transform'] = 'translate(-' + _PlayBook_contextMenu.getPeekWidth() + ', 0)';	
						this.style['-webkit-backface-visibility'] = 'hidden';
						this.style['-webkit-perspective'] = '1000';
						this.addEventListener("touchstart", this.touchHandler, false);	
						this.addEventListener("touchmove", this.touchMoveHandler, false);		
						this.onclick = function(event) {
									if ((event.target == this) || (event.target == this.scrollContainer)){;
										this.show(this.selected);
									}
								};
						// Remove the header click handling while peeking
						this.header.removeEventListener("click", this.hide, false);		
						this.style.visibility = 'visible';
						this.visible = true;
						if(bb.device.isPlayBook){
							blackberry.app.event.onSwipeDown('');
						} else {
							blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
						}
					};
		menu.peek = menu.peek.bind(menu);
		
		menu.clearWWcontextMenu = function() {
				// Here because the interface is needed on BB10 WebWorks context menu
			};
		menu.clearWWcontextMenu = menu.clearWWcontextMenu.bind(menu);
		
		// Trap touch start events in a way that we can add and remove the handler
		menu.touchHandler = function(event) {
								if (this.peeking) {
									var touch = event.touches[0];
									this.startPos = touch.pageX;
									if (event.target == this.scrollContainer) {
										//event.stopPropagation();
									} else if (event.target.parentNode == this.scrollContainer && event.target != this.header)  {
										event.preventDefault();
										event.stopPropagation();
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
									itemHeight = 111,
									margin,
									numActions = 0,
									headerHeight = 0,
									i,
									isFirst = true,
									action;
									
								if (bb.device.isPlayBook) {
									itemHeight = 53;
								} else if (bb.device.is720x720) {
									itemHeight = 80;
								} 								
								headerHeight = (this.actionBar == undefined) ? itemHeight : 0;
							
								// See how many actions to use for calculations
								
								for (i = 0; i < this.actions.length; i++) {
									action = this.actions[i];
									if (action.visible == true) {
										numActions++;
										if (isFirst && (this.pinnedAction != action)) {
											isFirst = false;
											action.setAttribute('class',action.normal + ' bb-context-menu-item-first-dark');
											action.isFirst = true;
										} else if (this.pinnedAction != action){
											action.setAttribute('class',action.normal);
										}
									}
								}
								numActions = (this.pinnedAction) ? numActions - 1 : numActions;
								margin = windowHeight - Math.floor(windowHeight/2) - Math.floor((numActions * itemHeight)/2) - headerHeight;
								if (margin < 0) margin = 0;
								this.scrollContainer.style['padding-top'] = margin +'px';
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
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'orientationchange', eventHandler: menu.orientationChanged});
		
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
				normal = 'bb-context-menu-item bb-context-menu-item-dark';

				// Check for our visibility
				if (action.hasAttribute('data-bb-visible') && action.getAttribute('data-bb-visible').toLowerCase() == 'false') {
					action.visible = false;
					action.style.display = 'none';
				} else {
					action.visible = true;
				}
				this.actions.push(action);
				
				// See if this item should be pinned to the bottom
				pin = (action.hasAttribute('data-bb-pin') && action.getAttribute('data-bb-pin').toLowerCase() == 'true');
				if (pin && !this.pinnedAction) {
					normal = normal + ' bb-context-menu-item-first-dark';
					action.style['bottom'] = '-2px';
					action.style.position = 'absolute';
					action.style.width = '100%';
					this.pinnedAction = action;
					this.appendChild(action);
					if (bb.device.isPlayBook) {
						this.scrollContainer.style.bottom = '64px';
					} else if (bb.device.is720x720) {
						this.scrollContainer.style.bottom = '95px';
					} else {
						this.scrollContainer.style.bottom = '130px';
					}
				} else {
					this.scrollContainer.appendChild(action);
				}

				highlight = normal + ' bb-context-menu-item-hover';
				action.normal = normal;
				action.highlight = highlight;
				// Set our inner information
				action.innerHTML = '';
				var inner = document.createElement('div'),
					img = document.createElement('img');
				img.setAttribute('src', action.getAttribute('data-bb-img'));
				img.setAttribute('class','bb-context-menu-item-image');
				action.img = img;
				action.appendChild(img);
				inner.setAttribute('class','bb-context-menu-item-inner');
				action.appendChild(inner);
				inner.innerHTML = caption;
				action.display = inner;
				action.menu = this;
				
				action.setAttribute('class',normal);
				action.ontouchstart = function (e) {
										if (this.menu.peeking) {
											this.style['border-left-color'] = bb.options.highlightColor;
										} else {
											this.style['background-color'] = bb.options.highlightColor;
										}
										
										e.stopPropagation();
										// Hack because PlayBook doesn't seem to get all the touch end events
										if (bb.device.isPlayBook) {
											var existingAction, 
												i;
											for (i = 0; i < this.menu.actions.length; i++) {
												existingAction = this.menu.actions[i];
												if (existingAction != this) {
													existingAction.ontouchend();
												}
											}
										}
									}
				action.ontouchend = function () {
										if (this.menu.peeking) {
											this.style['border-left-color'] = 'transparent';
										} else {
											this.style['background-color'] = '';
										}
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
				
				// Assign the hide function
				action.hide = function() {
									if (!this.visible) return;
									this.visible = false;
									// Change style
									this.style.display = 'none';
									this.menu.centerMenuItems();
								};
				action.hide = action.hide.bind(action);
				
				// Assign the show function
				action.show = function() {
									if (this.visible) return;
									this.visible = true;   
									// Change style
									this.style.display = '';
									this.menu.centerMenuItems();
								};
				action.show = action.show.bind(action);
				
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