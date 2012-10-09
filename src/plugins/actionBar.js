// Apply styling to an action bar
bb.actionBar = {

	color: '',
	
	apply: function(actionBar, screen) {
		
		var actions = actionBar.querySelectorAll('[data-bb-type=action]'),
			visibleButtons = [],
			overflowButtons = [],
			visibleTabs = [],
			overflowTabs = [],
			shownActions = [],
			action,
			target,
			caption,
			style,
			lastStyle,
			tabRightShading,
			backBtn,
			actionContainer = actionBar,
			btnWidth,
			res = (bb.device.isPlayBook) ? 'lowres' : 'hires',
			icon,
			color = bb.actionBar.color,
			j;
			
		actionBar.backBtnWidth = 0;
		actionBar.actionOverflowBtnWidth = 0;
		actionBar.tabOverflowBtnWidth = 0;
		actionBar.setAttribute('class','bb-bb10-action-bar-'+res+' bb-bb10-action-bar-' + bb.actionBar.color);
		actionBar.visibleTabs = visibleTabs;
		actionBar.visibleButtons = visibleButtons;
		actionBar.overflowButtons = overflowButtons;
		actionBar.shownActions = shownActions;
		actionBar.overflowTabs = overflowTabs;
		
		// Gather our visible and overflow tabs and buttons
		for (j = 0; j < actions.length; j++) {
			action = actions[j];
			if (action.hasAttribute('data-bb-style')) {
				style = action.getAttribute('data-bb-style').toLowerCase();
				if (style == 'button') {
					if (action.hasAttribute('data-bb-overflow') && (action.getAttribute('data-bb-overflow').toLowerCase() == 'true')) {
						overflowButtons.push(action);
					} else {
						visibleButtons.push(action);
					}
				} else {
					if (action.hasAttribute('data-bb-overflow') && (action.getAttribute('data-bb-overflow').toLowerCase() == 'true')) {
						overflowTabs.push(action);
					} else {
						visibleTabs.push(action);
					}
				}
			}
		}
					
		// Create the back button if it has one and there are no tabs in the action bar
		if (actionBar.hasAttribute('data-bb-back-caption') && actionBar.querySelectorAll('[data-bb-style=tab]').length == 0) {		
			var chevron,
				backCaption,
				backslash;
			backBtn = document.createElement('div');
			backBtn.setAttribute('class','bb-bb10-action-bar-back-button-'+res+' bb-bb10-action-bar-back-button-'+res+'-' + color);
			backBtn.onclick = bb.popScreen;
			actionBar.backBtn = backBtn;
			// Create and add the chevron to the back button
			chevron = document.createElement('div');
			chevron.setAttribute('class','bb-bb10-action-bar-back-chevron-'+res+'-'+color);
			backBtn.appendChild(chevron);
			// Create and add our back caption to the back button
			backCaption = document.createElement('div');
			backCaption.setAttribute('class','bb-bb10-action-bar-back-text-'+res);
			backCaption.innerHTML = actionBar.getAttribute('data-bb-back-caption');
			backBtn.appendChild(backCaption);
			// Create our backslash
			backslash = document.createElement('div');
			backslash.setAttribute('class','bb-bb10-action-bar-back-slash-'+res+'-'+color); 
			
			// Create a table to hold the back button and our actions
			var table = document.createElement('table'),
				tr = document.createElement('tr'),
				td = document.createElement('td');
			actionBar.appendChild(table);
			table.appendChild(tr);
			table.setAttribute('class','bb-bb10-action-bar-table');
			// Set Back Button widths
			if (bb.device.isPlayBook) {
				actionBar.backBtnWidth = 93;
				td.style.width = 77+'px';
			} else {
				actionBar.backBtnWidth = 187;
				td.style.width = 154+'px';
			}
			tr.appendChild(td);
			td.appendChild(backBtn);
			// Create the container for our backslash
			td = document.createElement('td');
			// Set backslash widths
			td.style.width = bb.device.isPlayBook ? 16 + 'px' : 33+'px';
			backslash.style['background-color'] = bb.options.shades.darkOutline;
			tr.appendChild(td);
			td.appendChild(backslash);
			// Create the container for the rest of the actions
			td = document.createElement('td');
			td.style.width = '100%';
			tr.appendChild(td);
			actionContainer = td;
			// Add the rest of the actions to the second column
			for (j = 0; j < actions.length; j++) {
				action = actions[j];
				td.appendChild(action);
			}
		}

		// If we have "tab" actions marked as overflow we need to show the more tab button
		if (overflowTabs.length > 0) {
			actionBar.tabOverflowBtnWidth = (bb.device.isPlayBook) ? 77: 154;
			actionBar.tabOverflowMenu = bb.tabOverflow.create(screen);
			actionBar.tabOverflowMenu.actionBar = actionBar;
			// Create our action bar overflow button
			action = document.createElement('div');
			action.actionBar = actionBar;
			action.tabOverflowMenu = actionBar.tabOverflowMenu;
			action.setAttribute('data-bb-type','action');
			action.setAttribute('data-bb-style','tab');
			action.setAttribute('data-bb-img','overflow');
			action.onclick = function() {
							this.tabOverflowMenu.show();
						}
			actionBar.tabOverflowBtn = action;
			// Insert our more button
			actionContainer.insertBefore(action, actionContainer.firstChild);
			visibleTabs.push(action);
		}
		
		// If we have "button" actions marked as overflow we need to show the more menu button
		if (overflowButtons.length > 0) {
			actionBar.actionOverflowBtnWidth = (bb.device.isPlayBook) ? 77: 154;
			actionBar.menu = bb.contextMenu.create(screen);
			actionBar.appendChild(actionBar.menu);
			// Create our action bar overflow button
			action = document.createElement('div');
			action.menu = actionBar.menu;
			actionBar.moreBtn = action;
			action.setAttribute('data-bb-type','action');
			action.setAttribute('data-bb-style','button');
			action.setAttribute('data-bb-img','overflow');
			action.onclick = function() {
							this.menu.show();
						}
			// Insert our action overflow button
			actionContainer.appendChild(action);
			visibleButtons.push(action);
		}
		
		// Determines how much width there is to use not including built in system buttons on the bar
		actionBar.getUsableWidth = function() {
				return bb.innerWidth() - this.backBtnWidth - this.actionOverflowBtnWidth - this.tabOverflowBtnWidth;		
			}
		actionBar.getUsableWidth = actionBar.getUsableWidth.bind(actionBar);
		
		// Create our function to calculate the widths of the inner action items 
		actionBar.calculateActionWidths = function() {
							var result,
								numUserActions,
								numSystemActions = 0,
								totalWidth = this.getUsableWidth(),
								visibleActions = this.visibleButtons.length + this.visibleTabs.length;
							
							// Get our non system actions
							numUserActions = (this.moreBtn) ? visibleActions - 1 : visibleActions; // Remove the more button from the equation
							numUserActions = (this.tabOverflowBtn) ? numUserActions - 1 : numUserActions; // Remove the tab overflow button from the equation
							
							// Count our visible system actions
							numSystemActions = (this.moreBtn) ? numSystemActions + 1 : numSystemActions;
							numSystemActions = (this.tabOverflowBtn) ? numSystemActions + 1 : numSystemActions;
							numSystemActions = (this.backBtn) ? numSystemActions + 1 : numSystemActions;
							
							if ((numSystemActions + numUserActions) < 5) {
								result = Math.floor(totalWidth/numUserActions);
							} else {
								result = Math.floor(totalWidth/(5-numSystemActions));
							}
							
							return result;
						};
		actionBar.calculateActionWidths = actionBar.calculateActionWidths.bind(actionBar);
		// Get our button width
		btnWidth = actionBar.calculateActionWidths();
		
		// Make sure we move when the orientation of the device changes
		actionBar.orientationChanged = function(event) {
								var actionWidth = actionBar.calculateActionWidths(),
									i,
									action,
									actionType,
									length = this.shownActions.length,
									margins = 2;
								for (i = 0; i < length; i++) {
									action = this.shownActions[i];
									actionType = (action.hasAttribute('data-bb-style')) ? action.getAttribute('data-bb-style').toLowerCase() : 'button';
									// Compute margins
									margins = (actionType == 'tab') ? 2 : 0;
									action.style.width = (actionWidth - margins) + 'px'; 
								}
								// Adjust our more button
								if (this.moreBtn && (this.shownActions.length > 0)) {
									if (actionType == 'tab') {
										// Stretch the last button if all tabs are before the overflow button  
										this.moreBtn.style.width = (bb.innerWidth() - (this.shownActions.length * actionWidth)) + 'px';
									} else {
										this.moreBtn.style.width = this.actionOverflowBtnWidth + 'px'; 
									}
								}
							};
		actionBar.orientationChanged = actionBar.orientationChanged.bind(actionBar);	
		window.addEventListener('orientationchange', actionBar.orientationChanged,false); 
		
		// Add all our overflow tab actions
		if (overflowTabs.length > 0 ) {
			var clone;
			// Add all our visible tabs if any so they are at the top of the list
			for (j = 0; j < visibleTabs.length; j++) {
				action = visibleTabs[j];
				// Don't add the visible overflow tab
				if (action.getAttribute('data-bb-img') != 'overflow') {
					clone = action.cloneNode(true);					
					clone.visibleTab = action;
					clone.res = res;
					clone.actionBar = actionBar;
					actionBar.tabOverflowMenu.add(clone);
				}
			}		
			// Now add all our tabs marked as overflow
			for (j = 0; j < overflowTabs.length; j++) {
				action = overflowTabs[j];
				action.res = res;
				action.actionBar = actionBar;
				actionBar.tabOverflowMenu.add(action);
			}
		}

		// Add all of our overflow button actions
		for (j = 0; j < overflowButtons.length; j++) {
			action = overflowButtons[j];
			action.res = res;
			actionBar.menu.add(action);
		}
		
		// Apply all our tab styling
		var tabMargins = 2,
			numVisibleTabs = visibleTabs.length,
			display;
		for (j = 0; j < numVisibleTabs; j++) {
			action = visibleTabs[j];
			// Don't add any more than 5 items on the action bar
			if (j > 4) {
				action.style.display = 'none';
				continue;			
			}
			action.res = res;
			caption = action.innerHTML;
			// Size our last visible tab differently
			if ((j == visibleTabs.length -1) && (j == 4)) {
				// Stretch the last tab if actionbar only has tabs in case of any kind of rounding errors based on division  
				action.style.width = (actionBar.getUsableWidth() - (4 * btnWidth) - tabMargins) + 'px';
			} else {
				action.style.width = (btnWidth - tabMargins) + 'px'; 
			}
			action.actionBar = actionBar;
			action.innerHTML = '';
			action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-tab-'+color+' bb-bb10-action-bar-tab-normal-'+color;
			action.highlight = action.normal + ' bb-bb10-action-bar-tab-selected-'+color;
			action.setAttribute('class',action.normal);

			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
			action.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
			display.innerHTML = caption;
			action.display = display;
			action.appendChild(display);
			
			// See if it is our overflow tab
			if (action.getAttribute('data-bb-img') == 'overflow') {
				action.style.width = actionBar.tabOverflowBtnWidth + 'px'; 
				action.icon = icon;
				display.innerHTML = '&nbsp;';
				action.display = display;
				// Set our transparent pixel
				icon.setAttribute('src',bb.transparentPixel);
				icon.normal = 'bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-tab-overflow-'+res+'-'+color;
				icon.highlight = 'bb-bb10-action-bar-icon-'+res;
				icon.setAttribute('class',icon.normal);
				// Crete our tab highlight div
				action.tabHighlight = document.createElement('div');
				action.tabHighlight.setAttribute('class','bb-bb10-action-bar-tab-overflow-'+res+'-'+color+' bb-bb10-action-bar-tab-overflow-highlight-'+res);
				action.appendChild(action.tabHighlight);
				action.style.width = (actionBar.tabOverflowBtnWidth - 1) + 'px';
				// Set our reset function
				action.reset = function() {
							this.icon.setAttribute('src',bb.transparentPixel);
							this.icon.setAttribute('class',this.icon.normal);
							this.tabHighlight.style.display = 'none';
							this.display.innerHTML = '&nbsp;';
						};
				action.reset = action.reset.bind(action);	
			} // See if it was a selected tab
			else {
				shownActions.push(action);
				// Set our image
				icon.setAttribute('src',action.getAttribute('data-bb-img'));
				action.icon = icon;
				
				if (action.hasAttribute('data-bb-selected') && (action.getAttribute('data-bb-selected').toLowerCase() == 'true')) {
					bb.actionBar.highlightAction(action);
				}
				// Add our click listener
				action.addEventListener('click',function (e) {
					bb.actionBar.highlightAction(this);
				},false);
				
				// Assign the setCaption function
				action.setCaption = function(value) {
									this.display.innerHTML = value;
									// Change the associated overflow item if one exists
									if (this.actionBar.tabOverflowMenu) {
										var tabs = this.actionBar.tabOverflowMenu.actions,
											i,
											target;
										for (i = 0; i < tabs.length; i++) {
											target = tabs[i];
											if (target.visibleTab == this)  {
												target.setCaption(value);
											} 
										}
									}
								};
				action.setCaption = action.setCaption.bind(action);
				
				// Assign the setImage function
				action.setImage = function(value) {
									this.icon.setAttribute('src', value);
									
									// Change the associated overflow item if one exists
									if (this.actionBar.tabOverflowMenu) {
										var tabs = this.actionBar.tabOverflowMenu.actions,
											i,
											target;
										for (i = 0; i < tabs.length; i++) {
											target = tabs[i];
											if (target.visibleTab == this)  {
												target.setImage(value);
											} 
										}
									}
								};
				action.setImage = action.setImage.bind(action);
			}
			
			// Make the last tab have a smaller border and insert the shading
			if ((j == visibleTabs.length-1) && (j < 4)) {
				action.style['border-right-width'] = '1px';
			} 	
		}
		
		// Apply all our button styling
		lastStyle = (visibleTabs.length > 0) ? 'tab' : 'button';
		for (j = 0; j < visibleButtons.length; j++) {
			action = visibleButtons[j];
			action.res = res;
			caption = action.innerHTML;
			// Don't add any more than 5 items on the action bar
			if ((((numVisibleTabs + j) > 4)) || (actionBar.backBtn && (j > 3))) {
				action.style.display = 'none';
				continue;			
			}
			
			// Add the icon
			icon = document.createElement('img');
			if (action.getAttribute('data-bb-img') == 'overflow') {
				// Set our transparent pixel
				icon.setAttribute('src',bb.transparentPixel);
				icon.setAttribute('class','bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-overflow-button-'+res+'-'+color);
				// Stretch to the last tab as long as the only tab isn't the tab overflow 
				var stretchToTab = false;
				if ((lastStyle == 'tab') && actionBar.tabOverflowMenu && (visibleTabs.length == 1) && (visibleButtons.length == 1)) {
					stretchToTab = false;
				} else if (lastStyle == 'tab') {
					stretchToTab = true;
				}
				// If it is next to a tab, stretch it so that the right shading lines up
				if (stretchToTab) {
					// Stretch the last button if all tabs are before the overflow button  
					action.style.width = (actionBar.tabOverflowMenu) ?  (bb.innerWidth() - ((numVisibleTabs-1) * btnWidth) - actionBar.tabOverflowBtnWidth) + 'px' : (bb.innerWidth() - (numVisibleTabs * btnWidth) - actionBar.tabOverflowBtnWidth) + 'px';
					action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-button-'+color+' bb-bb10-action-bar-button-tab-left-'+res+'-'+color;
				} else {
					action.style.width = (actionBar.actionOverflowBtnWidth - 1) + 'px'; 
					action.style.float = 'right';
					action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-button-'+color;
				}
			} else {
				shownActions.push(action);
				icon.setAttribute('src',action.getAttribute('data-bb-img'));
				icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
				action.icon = icon;
				action.style.width = btnWidth + 'px'; 
				
				// set our shading if needed
				if (lastStyle == 'tab') {
					action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-button-'+color+' bb-bb10-action-bar-button-tab-left-'+res+'-'+color;
				} else {
					action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-button-'+color;
				}
				
				// Assign the setCaption function
				action.setCaption = function(value) {
									this.display.innerHTML = value;
								};
				action.setCaption = action.setCaption.bind(action);
				
				// Assign the setImage function
				action.setImage = function(value) {
									this.icon.setAttribute('src',value);
								};
				action.setImage = action.setImage.bind(action);
			}
			
			
			action.innerHTML = '';
			action.setAttribute('class',action.normal);
			
			action.appendChild(icon);
			lastStyle = 'button';
			
			// Set our caption
			var display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
			display.innerHTML = caption;
			action.display = display;
			action.appendChild(display);	
		}
		// Center the action overflow items
		if (actionBar.menu) {
			actionBar.menu.centerMenuItems();
		}
		// Initialize the Tab Overflow
		if (actionBar.tabOverflowMenu) {
			actionBar.tabOverflowMenu.centerMenuItems();
			actionBar.tabOverflowMenu.initSelected();
		}
	},

	// Apply the proper highlighting for the action
	highlightAction: function (action, overflowAction) {
		var i,
			target,
			tabs = action.actionBar.visibleTabs;
		
		// First un-highlight the rest
		for (i = 0; i < tabs.length; i++) {
			target = tabs[i];
			if (target != action) { 
				bb.actionBar.unhighlightAction(target);
			}					
		}
		// Un-highlight the overflow menu items
		if (action.actionBar.tabOverlowMenu) {
			tabs = action.actionBar.tabOverflowMenu.actions;
			for (i = 0; i < tabs.length; i++) {
				target = tabs[i];
				if (target != overflowAction)  {
					bb.actionBar.unhighlightAction(target);
				} 
			}
		}
		
		// Now highlight this action
		action.style['border-top-color'] = bb.options.highlightColor;
		action.setAttribute('class',action.highlight);
		
		if (overflowAction) {
			overflowAction.setAttribute('class', overflowAction.normal + ' bb10Highlight');
		}
		
		// See if there was a tab overflow
		if (action.actionBar.tabOverflowMenu && !overflowAction) {
			if (action.actionBar.tabOverflowBtn && (action == action.actionBar.tabOverflowBtn)) {
				overflowAction.setAttribute('class', overflowAction.normal + ' bb10Highlight');
			} else {
				tabs = action.actionBar.tabOverflowMenu.actions;
				for (i = 0; i < tabs.length; i++) {
					target = tabs[i];
					if (target.visibleTab == action)  {
						target.setAttribute('class', target.normal + ' bb10Highlight');
					}
				}
			}
		}
		
		// Reset the tab overflow
		if (action.actionBar.tabOverflowBtn && action.actionBar.tabOverflowBtn.reset) {
			action.actionBar.tabOverflowBtn.reset();
		}
	},
	
	// Apply the proper styling for an action that is no longer highlighted
	unhighlightAction: function(action) {
		var target;
		action.style['border-top-color'] = '';
		action.setAttribute('class',action.normal);
		// See if there was a tab overflow
		if (action.actionBar && action.actionBar.tabOverflowMenu) {
			tabs = action.actionBar.tabOverflowMenu.actions;
			for (i = 0; i < tabs.length; i++) {
				target = tabs[i];
				target.setAttribute('class', target.normal);
			}
		}
	}
};