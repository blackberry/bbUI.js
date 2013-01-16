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
			res = '1280x768-1280x720',
			icon,
			color = bb.actionBar.color,
			j,
			orientation = bb.getOrientation();
			
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			res = '1024x600';
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			res = '1280x768-1280x720';
		}
			
		actionBar.res = res;
		actionBar.isVisible = true;
		actionBar.setAttribute('class','bb-bb10-action-bar-'+res+' bb-bb10-action-bar-'+orientation+'-'+res+' bb-bb10-action-bar-' + bb.actionBar.color);
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
				backslash,
				backHighlight;
			backBtn = document.createElement('div');
			backBtn.setAttribute('class','bb-bb10-action-bar-back-button-'+res+' bb-bb10-action-bar-back-button-'+res+'-' + color+' bb-bb10-action-bar-back-button-'+orientation+'-'+res);
			backBtn.onclick = function () {
					window.setTimeout(bb.popScreen,0);
				};
			actionBar.backBtn = backBtn;
			// Create and add the chevron to the back button
			chevron = document.createElement('div');
			chevron.setAttribute('class','bb-bb10-action-bar-back-chevron-'+res+'-'+color);
			backBtn.appendChild(chevron);
			// Create and add our back caption to the back button
			backCaption = document.createElement('div');
			backCaption.setAttribute('class','bb-bb10-action-bar-back-text-'+res+' bb-bb10-action-bar-back-text-'+orientation+'-'+res);
			backCaption.innerHTML = actionBar.getAttribute('data-bb-back-caption');
			backBtn.backCaption = backCaption;
			backBtn.appendChild(backCaption);
			// Create our highlight for touch
			backHighlight = document.createElement('div');
			backHighlight.setAttribute('class','bb-bb10-action-bar-back-button-highlight');
			backHighlight.style['position'] = 'absolute';
			backHighlight.style['width'] = bb.device.is1024x600 ? '4px' : '8px';
			backHighlight.style['background-color'] = 'transparent';
			
			// Use this to update dimentions on orientation change
			backBtn.updateHighlightDimensions = function(orientation) {
						if (bb.device.is1024x600) {
							backHighlight.style['height'] = orientation == 'portrait' ? '57px' : '57px';
							backHighlight.style['top'] = '8px';
						} else if (bb.device.is1280x768 || bb.device.is1280x720) {
							backHighlight.style['height'] = orientation == 'portrait' ? '110px' : '70px';
							backHighlight.style['top'] = '15px';
						} else {
							backHighlight.style['height'] = orientation == 'portrait' ? '110px' : '110px';
							backHighlight.style['top'] = '15px';
						}				
					};
			backBtn.updateHighlightDimensions = backBtn.updateHighlightDimensions.bind(backBtn);
			backBtn.backHighlight = backHighlight;
			backBtn.updateHighlightDimensions(orientation);
			
			backBtn.appendChild(backHighlight);
			backBtn.ontouchstart = function() {
					this.backHighlight.style['background-color'] = bb.options.highlightColor;				
			}
			backBtn.ontouchend = function() {
					this.backHighlight.style['background-color'] = 'transparent';				
			}
			
			// Create our backslash
			backslash = document.createElement('div');
			backslash.setAttribute('class','bb-bb10-action-bar-back-slash-'+res+'-'+color+' bb-bb10-action-bar-back-slash-'+orientation+'-'+res); 
			backBtn.backslash = backslash;
			
			// Create a table to hold the back button and our actions
			var table = document.createElement('table'),
				tr = document.createElement('tr'),
				td = document.createElement('td');
			actionBar.appendChild(table);
			table.appendChild(tr);
			table.setAttribute('class','bb-bb10-action-bar-table');
			// Set Back Button widths
			if (bb.device.is1024x600) {
				td.style.width = (bb.actionBar.getBackBtnWidth(backBtn) - 16)+'px';
			} else {
				td.style.width = (bb.actionBar.getBackBtnWidth(backBtn) - 33)+'px';
			}
			tr.appendChild(td);
			backBtn.innerChevron = td;
			td.appendChild(backBtn);
			// Create the container for our backslash
			td = document.createElement('td');
			// Set backslash widths
			td.style.width = bb.device.is1024x600 ? 16 + 'px' : 33+'px';
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
				return bb.innerWidth() - bb.actionBar.getBackBtnWidth(this.backBtn) - bb.actionBar.getActionOverflowBtnWidth(this.moreBtn) - bb.actionBar.getTabOverflowBtnWidth(this.tabOverflowBtn);		
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
		
		// This function replaces 'portrait' with 'landscape' or vica-versa
		actionBar.switchOrientationCSS = function (value) {
								if (value) {
									var index = value.indexOf('portrait');
									if (index > -1) {
										value = value.replace('portrait', 'landscape');
									} else {
										index = value.indexOf('landscape');
										if (index > -1) {
											value = value.replace('landscape', 'portrait');
										}
									}
								}
								return value;
							};
		actionBar.switchOrientationCSS = actionBar.switchOrientationCSS.bind(actionBar);
		
		// Make sure we move when the orientation of the device changes
		actionBar.orientationChanged = function(event) {
								var actionWidth = actionBar.calculateActionWidths(),
									i,
									action,
									actionType,
									length = this.shownActions.length,
									margins = 2,
									temp;
								
								// Set the style for the action bar
								temp = this.getAttribute('class');
								temp = this.switchOrientationCSS(temp);
								this.setAttribute('class',temp);
								if (this.isVisible) {
									bb.screen.currentScreen.outerScrollArea.style['bottom'] = bb.screen.getActionBarHeight() + 'px';
									if (bb.scroller) {
										bb.scroller.refresh();
									}
								}
								
								// Update our orientation for the back button
								if (this.backBtn) {
									// Back Button
									temp = this.backBtn.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.backBtn.setAttribute('class',temp);
									this.backBtn.updateHighlightDimensions();
									// Back caption
									temp = this.backBtn.backCaption.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.backBtn.backCaption.setAttribute('class',temp);
									// Back slash
									temp = this.backBtn.backslash.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.backBtn.backslash.setAttribute('class',temp);
									// Inner Chevron
									if (bb.device.is1024x600) {
										this.backBtn.innerChevron.style.width = (bb.actionBar.getBackBtnWidth(this.backBtn) - 16)+'px';
									} else {
										this.backBtn.innerChevron.style.width = (bb.actionBar.getBackBtnWidth(this.backBtn) - 33)+'px';
									}
								}
								
								for (i = 0; i < length; i++) {
									action = this.shownActions[i];
									actionType = (action.hasAttribute('data-bb-style')) ? action.getAttribute('data-bb-style').toLowerCase() : 'button';
									// Compute margins
									margins = (actionType == 'tab') ? 2 : 0;
									action.style.width = (actionWidth - margins) + 'px'; 
									if (action.highlight && (actionType != 'tab') && (action.getAttribute('data-bb-img') != 'overflow')) {
										action.highlight.style['width'] = (actionWidth * 0.6) + 'px';
										action.highlight.style['margin-left'] = (actionWidth * 0.2) + 'px';
										// Update tab orientation
										action.normal = this.switchOrientationCSS(action.normal);
										temp = action.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										action.setAttribute('class',temp);
									} else if (actionType == 'tab') {
										// Update tab orientation
										action.normal = this.switchOrientationCSS(action.normal);
										action.highlight = this.switchOrientationCSS(action.highlight);
										temp = action.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										action.setAttribute('class',temp);
										// Update display text orientation
										temp = action.display.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										action.display.setAttribute('class',temp);
									}
								}
								
								// Adjust our more button
								if (this.moreBtn && (this.shownActions.length > 0)) {
									if (actionType == 'tab') {
										// Stretch the last button if all tabs are before the overflow button  
										this.moreBtn.style.width = (bb.innerWidth() - (this.shownActions.length * actionWidth)) + 'px';
										this.moreBtn.highlight.style['width'] = (actionWidth * 0.6) + 'px';
										this.moreBtn.highlight.style['margin-left'] = (actionWidth * 0.2) + 'px';
									} else {
										this.moreBtn.style.width = bb.actionBar.getActionOverflowBtnWidth(this.moreBtn) + 'px'; 
										this.moreBtn.highlight.style['width'] = (bb.actionBar.getActionOverflowBtnWidth(this.moreBtn) * 0.6) + 'px';
										this.moreBtn.highlight.style['margin-left'] = (bb.actionBar.getActionOverflowBtnWidth(this.moreBtn) * 0.2) + 'px';
									}
								}
								
								// Adjust our action overflow button
								if (this.moreBtn) {
									// Update the action
									this.moreBtn.normal = this.switchOrientationCSS(this.moreBtn.normal);
									temp = this.moreBtn.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.moreBtn.setAttribute('class',temp);
									// Update the icon
									temp = this.moreBtn.icon.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.moreBtn.icon.setAttribute('class',temp);
								}
								
								// Adjust our tab overflow button
								if (this.tabOverflowBtn) {
									this.tabOverflowBtn.style.width = (bb.actionBar.getTabOverflowBtnWidth(this.tabOverflowBtn) -1) + 'px';
									
									// Update our tab
									this.tabOverflowBtn.normal = this.switchOrientationCSS(this.tabOverflowBtn.normal);
									this.tabOverflowBtn.highlight = this.switchOrientationCSS(this.tabOverflowBtn.highlight);
									temp = this.tabOverflowBtn.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.setAttribute('class',temp);
									temp = this.tabOverflowBtn.tabHighlight.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.tabHighlight.setAttribute('class',temp);
									// Update display text
									temp = this.tabOverflowBtn.display.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.display.setAttribute('class',temp);
									// Update our icon
									this.tabOverflowBtn.icon.normal = this.switchOrientationCSS(this.tabOverflowBtn.icon.normal);
									temp = this.tabOverflowBtn.icon.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.icon.setAttribute('class',temp);
								}
							};
		actionBar.orientationChanged = actionBar.orientationChanged.bind(actionBar);	
		window.addEventListener('orientationchange', actionBar.orientationChanged,false);
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'orientationchange', eventHandler: actionBar.orientationChanged});
				
		// Add setBackCaption function
		actionBar.setBackCaption = function(value) {
					this.setAttribute('data-bb-back-caption',value);
					backCaption.innerHTML = value;		
				};
		actionBar.setBackCaption = actionBar.setBackCaption.bind(actionBar);  
		
		// Add setSelectedTab function
		actionBar.setSelectedTab = function(tab) {
					if (tab.getAttribute('data-bb-style') != 'tab') return;
					bb.actionBar.highlightAction(tab);
					if (tab.onclick) {
						tab.onclick();
					}
				};
		actionBar.setSelectedTab = actionBar.setSelectedTab.bind(actionBar);  
		
		// Add our hide function
		actionBar.hide = function(tab) {
					if (!this.isVisible) return;
					this.style.display = 'none';
					// Make the scroll area go right to the bottom of the displayed content
					bb.screen.currentScreen.outerScrollArea.style['bottom'] = '0px';
					this.isVisible = false;
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
		actionBar.hide = actionBar.hide.bind(actionBar); 
		
		// Add our show function
		actionBar.show = function(tab) {
					if (this.isVisible) return;
					this.style.display = '';
					// Resize the screen scrolling area to stop at the top of the action bar
					bb.screen.currentScreen.outerScrollArea.style['bottom'] = bb.screen.getActionBarHeight() + 'px';
					this.isVisible = true;
					if (bb.scroller) {
						bb.scroller.refresh();
					}
				};
		actionBar.show = actionBar.show.bind(actionBar);
		
		
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
			action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res + ' bb-bb10-action-bar-tab-'+color+' bb-bb10-action-bar-tab-normal-'+color;
			action.highlight = action.normal + ' bb-bb10-action-bar-tab-selected-'+color;
			action.setAttribute('class',action.normal);

			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
			action.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res+' bb-bb10-action-bar-action-display-'+orientation+'-'+res);
			display.innerHTML = caption;
			action.display = display;
			action.appendChild(display);
			
			// See if it is our overflow tab
			if (action.getAttribute('data-bb-img') == 'overflow') {
				action.icon = icon;
				display.innerHTML = '&nbsp;';
				action.display = display;
				// Set our transparent pixel
				icon.setAttribute('src',bb.transparentPixel);
				icon.normal = 'bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-tab-overflow-'+res+'-'+color + ' bb-bb10-action-bar-tab-overflow-'+orientation+'-'+res;
				icon.highlight = 'bb-bb10-action-bar-icon-'+res;
				icon.setAttribute('class',icon.normal);
				// Crete our tab highlight div
				action.tabHighlight = document.createElement('div');
				action.tabHighlight.setAttribute('class','bb-bb10-action-bar-tab-overflow-'+res+'-'+color+' bb-bb10-action-bar-tab-overflow-highlight-'+res+' bb-bb10-action-bar-tab-overflow-highlight-'+ orientation +'-'+res);
				action.appendChild(action.tabHighlight);
				action.style.width = (bb.actionBar.getTabOverflowBtnWidth(action) - 1) + 'px';
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
				
				// Assign the getCaption function
				action.getCaption = function() {
									return this.display.innerHTML;
								};
				action.getCaption = action.getCaption.bind(action);				
				
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
				
				// Assign the getImage function
				action.getImage = function() {
									return this.icon.getAttribute('src');
								};
				action.getImage = action.getImage.bind(action);	
			}
			
			// Make the last tab have a smaller border and insert the shading
			if ((j == visibleTabs.length-1) && (j < 4)) {
				action.style['border-right-width'] = '1px';
			} 	
		}
		
		// Apply all our button styling
		lastStyle = (visibleTabs.length > 0) ? 'tab' : 'button';
		var actionWidth;
		for (j = 0; j < visibleButtons.length; j++) {
			actionWidth = btnWidth;
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
				icon.setAttribute('class','bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-overflow-button-'+res+'-'+color+' bb-bb10-action-bar-overflow-button-'+orientation+'-'+res);
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
					actionWidth	= (actionBar.tabOverflowMenu) ?  (bb.innerWidth() - ((numVisibleTabs-1) * btnWidth) - bb.actionBar.getTabOverflowBtnWidth(actionBar.tabOverflowBtn)) : (bb.innerWidth() - (numVisibleTabs * btnWidth) - bb.actionBar.getTabOverflowBtnWidth(actionBar.tabOverflowBtn));			
					action.style.width = actionWidth + 'px';
					action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res +' bb-bb10-action-bar-button-'+color+' bb-bb10-action-bar-button-tab-left-'+res+'-'+color;
				} else {
					actionWidth = (bb.actionBar.getActionOverflowBtnWidth(action) - 1);
					action.style.width = actionWidth + 'px'; 
					action.style.float = 'right';
					action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res + ' bb-bb10-action-bar-button-'+color;
				}
			} else {
				shownActions.push(action);
				icon.setAttribute('src',action.getAttribute('data-bb-img'));
				icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
				action.style.width = btnWidth + 'px'; 
				
				// set our shading if needed
				if (lastStyle == 'tab') {
					action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res + ' bb-bb10-action-bar-button-'+color+' bb-bb10-action-bar-button-tab-left-'+res+'-'+color;
				} else {
					action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res + ' bb-bb10-action-bar-button-'+color;
				}
				
				// Assign the setCaption function
				action.setCaption = function(value) {
									this.display.innerHTML = value;
								};
				action.setCaption = action.setCaption.bind(action);
				
				// Assign the getCaption function
				action.getCaption = function() {
									return this.display.innerHTML;
								};
				action.getCaption = action.getCaption.bind(action);	
				
				// Assign the setImage function
				action.setImage = function(value) {
									this.icon.setAttribute('src',value);
								};
				action.setImage = action.setImage.bind(action);
				
				// Assign the setImage function
				action.getImage = function() {
									return this.icon.getAttribute('src');
								};
				action.getImage = action.getImage.bind(action);
			}
			
			// Default settings
			action.icon = icon;
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

			// Set our highlight
			action.highlight = document.createElement('div');
			action.highlight.setAttribute('class','bb-bb10-action-bar-action-highlight');
			action.highlight.style['height'] = bb.device.is1024x600 ? '4px' : '8px';
			action.highlight.style['width'] = (actionWidth * 0.6) + 'px';
			action.highlight.style['margin-left'] = (actionWidth * 0.2) + 'px';
			action.highlight.style['background-color'] = 'transparent';
			action.appendChild(action.highlight);
			
			// Highlight on touch
			action.ontouchstart = function() {
					this.highlight.style['background-color'] = bb.options.highlightColor;				
			}
			// Remove highlight when touch ends
			action.ontouchend = function() {
					this.highlight.style['background-color'] = 'transparent';				
			}
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
	
	// Return the tab overflow button width based on orientation and screen resolution
	getTabOverflowBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 77 : 123;
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			return bb.getOrientation() == 'portrait' ? 154 : 256;
		} else {
			return bb.getOrientation() == 'portrait' ? 154 : 256;
		}
	},
	
	// Return the action overflow button width based on orientation and screen resolution
	getActionOverflowBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 77 : 123;
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			return bb.getOrientation() == 'portrait' ? 154 : 256;
		} else {
			return bb.getOrientation() == 'portrait' ? 154 : 256;
		}
	},
	
	// Return the back button width based on orientation and screen resolution
	getBackBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 93 : 150;
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			return bb.getOrientation() == 'portrait' ? 187 : 300;
		} else {
			return bb.getOrientation() == 'portrait' ? 187 : 300;
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
		if (action.actionBar.tabOverflowMenu) {
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