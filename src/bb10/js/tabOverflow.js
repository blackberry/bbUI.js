bb.tabOverflow = {

	create : function(screen) {
		var menu = document.createElement('div'),
			overlay;
		menu.screen = screen;
		menu.itemClicked = false;
		menu.visible = false;
		menu.actions = [];
		menu.tabOverflowState = {
			display : undefined,
			img : undefined,
			style : undefined,
			caption : undefined
		};
		
		menu.setAttribute('class','bb-tab-overflow-menu bb-tab-overflow-menu-dark');
		screen.parentNode.appendChild(menu);
		
		// Set our initial styling
		menu.style['z-index'] = '-100';
		menu.style.display = 'none';
		menu.style.width = menu.width + 'px';
		
		// Handle any press-and-hold events
		menu.oncontextmenu = function(contextEvent) {
			var node = contextEvent.srcElement,
				parentNode = node.parentNode;
			// Loop up to the parent node.. if it is this action bar then prevent default
			if (!parentNode) return;
			while (parentNode) {
				if (parentNode == this) {
					contextEvent.preventDefault();
					break;
				}
				parentNode = parentNode.parentNode;
			}			
		};
		menu.oncontextmenu = menu.oncontextmenu.bind(menu);
		window.addEventListener('contextmenu', menu.oncontextmenu);
		bb.windowListeners.push({name: 'contextmenu', eventHandler: menu.oncontextmenu});
		
		if (!bb.screen.tabOverlay) {
			overlay = document.createElement('div');
			overlay.menu = menu;
			bb.screen.tabOverlay = overlay;
			overlay.setAttribute('class','bb-tab-overflow-menu-overlay ');
			screen.appendChild(overlay);
			
			// Hide the menu on touch
			overlay.ontouchstart = function(e) {
						e.preventDefault();
						e.stopPropagation();
						this.menu.hide();
					};
		}
		menu.overlay = bb.screen.tabOverlay;

		// Apply styling at the begining and end of animation
		menu.doEndTransition = function() {
			if (this.visible) {
				this.style['z-index'] = '';
			} else {
				this.style.display = 'none';
				this.style.width = '0px';
				this.screen.removeEventListener('webkitTransitionEnd',menu.doEndTransition);
				this.screen.style['-webkit-transition'] = '';
				this.screen.style['-webkit-transform'] = '';
				this.screen.style['-webkit-backface-visibility'] = '';
			}
		};
		menu.doEndTransition = menu.doEndTransition.bind(menu);	
			
		menu.show = function() {
					this.itemClicked = false;
					this.visible = true;
					var tabOverflowBtn = this.actionBar.tabOverflowBtn;
					if (bb.device.newerThan10dot2 === false) {
						this.tabOverflowState.display = tabOverflowBtn.tabHighlight.style.display;
						this.tabOverflowState.img = tabOverflowBtn.icon.src;
						this.tabOverflowState.caption = tabOverflowBtn.display.innerHTML;
						this.tabOverflowState.style = tabOverflowBtn.icon.getAttribute('class');
					}
					this.screen.addEventListener('webkitTransitionEnd',menu.doEndTransition);
					this.setDimensions();					
					// Reset our overflow menu button
					tabOverflowBtn.reset();
					if(bb.device.isPlayBook){
						blackberry.app.event.onSwipeDown();
					} else {
						blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
					}
				};
		menu.show = menu.show.bind(menu);	
		
		// Adjust the dimensions of the menu and screen
		menu.setDimensions = function() {
					this.style.display = '';
					this.style.width = bb.tabOverflow.getWidth() + 'px';
					// Set our screen's parent to have no overflow so the browser doesn't think it needs to scroll
					this.screen.parentNode.style.position = 'absolute';
					this.screen.parentNode.style.left = '0px';
					this.screen.parentNode.style.top = '0px';
					this.screen.parentNode.style.bottom = '0px';
					this.screen.parentNode.style.right = '0px';
					this.screen.parentNode.style.width = '100%';
					this.screen.parentNode.style['overflow'] = 'hidden';
					// Make our overlay visible
					this.overlay.style.display = 'block';
					
					// Slide our screen
					this.screen.style['-webkit-transition'] = '0.2s ease-out';
					this.screen.style['-webkit-transform'] = 'translate3d(' + bb.tabOverflow.getWidth() + 'px,0px,0px)';
					this.screen.style['-webkit-backface-visibility'] = 'hidden';
				};
		menu.setDimensions = menu.setDimensions.bind(menu);	
		
		menu.hide = function() {
					this.visible = false;
					this.style['z-index'] = '-100';
					this.screen.style['-webkit-transform'] = 'translate3d(0px,0px,0px)';
					
					// Make our overlay invisible
					this.overlay.style.display = 'none';
					
					// Re-apply the old button styling if needed
					if (bb.device.newerThan10dot2 === false) {
						if (!this.itemClicked) {
							var tabOverflowBtn = this.actionBar.tabOverflowBtn;
							tabOverflowBtn.icon.setAttribute('src',this.tabOverflowState.img);
							tabOverflowBtn.icon.setAttribute('class',this.tabOverflowState.style);
							tabOverflowBtn.tabHighlight.style.display = this.tabOverflowState.display;
							tabOverflowBtn.display.innerHTML = this.tabOverflowState.caption;
						}
					}
					if(bb.device.isPlayBook){
						blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
					} else {
						blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
					}
				};
		menu.hide = menu.hide.bind(menu);
		
		// Hide the menu
		menu.onclick = function() {
					this.hide();
				};
				
		// Center the items in the list
		menu.centerMenuItems = function() {
								var windowHeight = bb.innerHeight(),
									itemHeight = 111,
									margin;
								if (bb.device.is1024x600) {
									itemHeight = 53;
								} else if (bb.device.is720x720) {
									itemHeight = 80;
								} else if (bb.device.is1280x720) {
									itemHeight = 91;
								} else if (bb.device.is1440x1440) {
									itemHeight = 132;
								} else {
									itemHeight = 111;
								}
								margin = windowHeight - Math.floor(windowHeight/2) - Math.floor((this.actions.length * itemHeight)/2); 
								if (margin < 0) margin = 0;
								this.actions[0].style['margin-top'] = margin + 'px';
							};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
		// Initialize any selected items
		menu.initSelected = function() {
								var i,
									action;
								for (i = 0; i < this.actions.length; i++) {
									action = this.actions[i];
									if (action.initialSelected) {
										action.setOverflowTab(true);
										break;
									}
								}
							};
		menu.initSelected = menu.initSelected.bind(menu);

		// Make sure we move when the orientation of the device changes
		menu.orientationChanged = function(event) {
								this.centerMenuItems();
								// Resize the menu if it is currently open
								if (this.visible) {
									this.setDimensions();
								}
							};
		menu.orientationChanged = menu.orientationChanged.bind(menu);	
		window.addEventListener('orientationchange', menu.orientationChanged,false); 
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'orientationchange', eventHandler: menu.orientationChanged});
		
		// Create our add item function
		menu.add = function(action) {
				var normal, 
					caption = action.innerHTML,
					accentTextValue = action.getAttribute('data-bb-accent-text'),
					inner = document.createElement('div'),
					innerClass = 'bb-tab-overflow-menu-item-inner',
					img = document.createElement('img'),
					table, tr, td;
				
				// set our styling
				normal = 'bb-tab-overflow-menu-item bb-tab-overflow-menu-item-dark';
				this.appendChild(action);
				
				// Check for our visibility
				if (action.hasAttribute('data-bb-visible') && action.getAttribute('data-bb-visible').toLowerCase() == 'false') {
					action.visible = false;
					action.style.display = 'none';
				} else {
					action.visible = true;
					this.actions.push(action);
				}
				// If it is the top item it needs a top border
				if (this.actions.length == 1) {
					normal = normal + ' bb-tab-overflow-menu-item-first-dark';
				}
				// Set our inner information
				action.normal = normal;
				action.accentText = null;
				action.menu = this;
				action.caption = caption;
				action.setAttribute('class',action.normal);
				action.innerHTML = '';
				if (!action.visibleTab) {
						action.visibleTab = action.actionBar.tabOverflowBtn;
				}
				// Create our layout
				table = document.createElement('table');
				tr = document.createElement('tr');
				table.appendChild(tr);
				action.appendChild(table);
				// Add our image
				td = document.createElement('td');
				img.setAttribute('src', action.getAttribute('data-bb-img'));
				img.setAttribute('class','bb-tab-overflow-menu-item-image');
				action.img = img;
				td.appendChild(img);
				tr.appendChild(td);
				// Add our caption
				td = document.createElement('td');
				inner.innerHTML = caption;
				action.display = inner;
				td.appendChild(inner);
				// See if there is accent text
				if (accentTextValue) {
					action.accentText = document.createElement('div');
					action.accentText.innerHTML = accentTextValue;
					action.accentText.setAttribute('class','tab-accent-text');
					td.appendChild(action.accentText);	
					innerClass = innerClass + ' bb-tab-overflow-menu-item-double';
				} else {
					innerClass = innerClass + ' bb-tab-overflow-menu-item-single';
				}
				// Set our styling
				inner.setAttribute('class',innerClass);
				tr.appendChild(td);
				
				//Set the overflow tab item
				action.setOverflowTab = function(hightlight) {
							var tabOverflowBtn = this.actionBar.tabOverflowBtn;
							if (hightlight) {
								if (bb.device.newerThan10dot2 === true) {
									bb.actionBar10dot3.highlightAction(this.visibleTab, this);
								} else {
									bb.actionBar.highlightAction(this.visibleTab, this);
								}
							}
							if (this.visibleTab == tabOverflowBtn) {
								if (bb.device.newerThan10dot2 === false) {
									tabOverflowBtn.icon.setAttribute('src',this.img.src);
									tabOverflowBtn.icon.setAttribute('class',tabOverflowBtn.icon.highlight);
									tabOverflowBtn.tabHighlight.style.display = 'block';
									tabOverflowBtn.display.innerHTML = this.caption;
								}
							}
						};
				action.setOverflowTab = action.setOverflowTab.bind(action);

				// See if it was selected
				action.initialSelected = (action.hasAttribute('data-bb-selected') && (action.getAttribute('data-bb-selected').toLowerCase() == 'true'));
				action.selected = action.initialSelected;
				
				// Trap the old click so that we can call it later
				action.oldClick = action.onclick;
				action.onclick = function() {
									var tabOverflowBtn = this.actionBar.tabOverflowBtn;
									this.menu.itemClicked = true;
									if (bb.device.newerThan10dot2 === true) {
										bb.actionBar10dot3.highlightAction(this.visibleTab, this);
									} else {
										bb.actionBar.highlightAction(this.visibleTab, this);
									}
									if (this.visibleTab == tabOverflowBtn) {
										this.setOverflowTab(false);
									} 
									if (this.oldClick) {
										this.oldClick();
									}
								};
								
				// Assign the setCaption function
				action.setCaption = function(value) {
									this.display.innerHTML = value;
									this.caption = value;
									
									// Update the overflow button if this tab is selected
									var tabOverflowBtn = this.actionBar.tabOverflowBtn;
									if ((this.visibleTab == tabOverflowBtn) && (this.selected == true)) {
										tabOverflowBtn.display.innerHTML = this.caption;
									}
								};
				action.setCaption = action.setCaption.bind(action);
				
				// Assign the setImage function
				action.setImage = function(value) {
									this.img.setAttribute('src',value);
								};
				action.setImage = action.setImage.bind(action);
				
				// Assign the show function
				action.show = function() {
									if (this.visible) return;
									this.visible = true;
									this.menu.actions.push(this);
									this.style.display = '';
									this.menu.centerMenuItems();
								};
				action.show = action.show.bind(action);
				
				// Assign the hide function
				action.hide = function() {
									if (!this.visible) return;
									this.visible = false;
									var index = this.menu.actions.indexOf(this);
									this.menu.actions.splice(index,1);
									this.style.display = 'none';	
									this.menu.centerMenuItems();
								};
				action.hide = action.hide.bind(action);
		};
		menu.add = menu.add.bind(menu);
		return menu;
	},
	
	// Get the preferred width of the overflow
	getWidth: function() {
		if (bb.device.is1024x600) {
			return (bb.getOrientation() == 'portrait') ? bb.innerWidth() - 77 : 400;
		} else if (bb.device.is720x720) {
			return 550;
		} else if (bb.device.is1280x720) {
			return 488;
		} else if (bb.device.is1440x1440) {
			return 732;
		} else {
			return (bb.getOrientation() == 'portrait') ? bb.innerWidth() - 154 : 700;
		}
	}
};