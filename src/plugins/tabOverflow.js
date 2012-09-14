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
		menu.res = (bb.device.isPlayBook) ? 'lowres' : 'hires';
		menu.setAttribute('class','bb-bb10-tab-overflow-menu bb-bb10-tab-overflow-menu-'+bb.actionBar.color);
		screen.parentNode.appendChild(menu);
		
		if (!bb.screen.tabOverlay) {
			overlay = document.createElement('div');
			overlay.menu = menu;
			bb.screen.tabOverlay = overlay;
			overlay.setAttribute('class','bb-bb10-tab-overflow-menu-overlay ');
			screen.appendChild(overlay);
			
			// Hide the menu on touch
			overlay.ontouchstart = function() {
						this.menu.hide();
					};
			
		}
		menu.overlay = bb.screen.tabOverlay;
		
		menu.show = function() {
					this.itemClicked = false;
					this.visible = true;
					var tabOverflowBtn = this.actionBar.tabOverflowBtn;
					this.tabOverflowState.display = tabOverflowBtn.tabHighlight.style.display;
					this.tabOverflowState.img = tabOverflowBtn.icon.src;
					this.tabOverflowState.caption = tabOverflowBtn.display.innerHTML;
					this.tabOverflowState.style = tabOverflowBtn.icon.getAttribute('class');
					this.setDimensions();					
					// Reset our overflow menu button
					tabOverflowBtn.reset();
				};
		menu.show = menu.show.bind(menu);	
		
		// Adjust the dimensions of the menu and screen
		menu.setDimensions = function() {
					var width = (bb.device.isPlayBook) ? bb.innerWidth() - 77 : bb.innerWidth() - 154;
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
					// Show our menu
					this.style.width = width + 'px';
					this.style['-webkit-transition'] = 'all 0.2s ease-out';
					this.style['-webkit-backface-visibility'] = 'hidden';
					// Slide our screen
					this.screen.style.left = width + 'px';
					this.screen.style.right = '-' + width +'px';
					this.screen.style['-webkit-transition'] = 'all 0.2s ease-out';
					this.screen.style['-webkit-backface-visibility'] = 'hidden';
				};
		menu.setDimensions = menu.setDimensions.bind(menu);	
		
		menu.hide = function() {
					this.visible = false;
					// Set our sizes
					this.style.width = '0px';
					this.screen.style.left = '0px';
					this.screen.style.right = '0px';
					// Make our overlay invisible
					this.overlay.style.display = 'none';
					
					// Re-apply the old button styling if needed
					if (!this.itemClicked) {
						var tabOverflowBtn = this.actionBar.tabOverflowBtn;
						tabOverflowBtn.icon.setAttribute('src',this.tabOverflowState.img);
						tabOverflowBtn.icon.setAttribute('class',this.tabOverflowState.style);
						tabOverflowBtn.tabHighlight.style.display = this.tabOverflowState.display;
						tabOverflowBtn.display.innerHTML = this.tabOverflowState.caption;
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
									itemHeight = (bb.device.isPlayBook) ? 53 : 111,
									margin;
								margin = windowHeight - Math.floor(windowHeight/2) - Math.floor((this.actions.length * itemHeight)/2) - itemHeight; //itemHeight is the header
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
		
		// Create our add item function
		menu.add = function(action) {
				var normal, 
					caption = action.innerHTML,
					accentTextValue = action.getAttribute('data-bb-accent-text'),
					inner = document.createElement('div'),
					innerClass = 'bb-bb10-tab-overflow-menu-item-inner-'+this.res,
					img = document.createElement('img'),
					table, tr, td;
				
				// set our styling
				normal = 'bb-bb10-tab-overflow-menu-item-'+this.res+' bb-bb10-tab-overflow-menu-item-'+this.res+'-' + bb.actionBar.color;
				this.appendChild(action);
				this.actions.push(action);
				// If it is the top item it needs a top border
				if (this.actions.length == 1) {
					normal = normal + ' bb-bb10-tab-overflow-menu-item-first-' + this.res + '-' + bb.actionBar.color;
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
				img.setAttribute('class','bb-bb10-tab-overflow-menu-item-image-'+this.res);
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
					innerClass = innerClass + ' bb-bb10-tab-overflow-menu-item-double-' + this.res;
				} else {
					innerClass = innerClass + ' bb-bb10-tab-overflow-menu-item-single-' + this.res;
				}
				// Set our styling
				inner.setAttribute('class',innerClass);
				tr.appendChild(td);
				
				//Set the overflow tab item
				action.setOverflowTab = function(hightlight) {
							var tabOverflowBtn = this.actionBar.tabOverflowBtn;
							if (hightlight) {
								bb.actionBar.highlightAction(this.visibleTab, this);
							}
							if (this.visibleTab == tabOverflowBtn) {
								tabOverflowBtn.icon.setAttribute('src',this.img.src);
								tabOverflowBtn.icon.setAttribute('class',tabOverflowBtn.icon.highlight);
								tabOverflowBtn.tabHighlight.style.display = 'block';
								tabOverflowBtn.display.innerHTML = this.caption;
							}
						};
				action.setOverflowTab = action.setOverflowTab.bind(action);

				// See if it was selected
				action.initialSelected = (action.hasAttribute('data-bb-selected') && (action.getAttribute('data-bb-selected').toLowerCase() == 'true'));
				
				// Trap the old click so that we can call it later
				action.oldClick = action.onclick;
				action.onclick = function() {
									var tabOverflowBtn = this.actionBar.tabOverflowBtn;
									this.menu.itemClicked = true;
									bb.actionBar.highlightAction(this.visibleTab, this);
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
	}
},