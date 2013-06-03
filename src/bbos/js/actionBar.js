// Apply styling to an action bar
bb.actionBar = {

	apply: function(actionBar, screen) {
		
		var actions = actionBar.querySelectorAll('[data-bb-type=action]'),
			mainBarButtons = [],
			overflowButtons = [],
			mainBarTabs = [],
			overflowTabs = [],
			action,
			target,
			caption,
			display,
			style,
			lastStyle,
			tabRightShading,
			backBtn,
			actionContainer = actionBar,
			btnWidth,
			res = '1280x768-1280x720',
			icon,
			j,
			orientation = bb.getOrientation(),
			slideLabel = document.createElement('div'),
			slideText = document.createElement('div');
			
		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			res = '1024x600';
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			res = '1280x768-1280x720';
		} else if (bb.device.is720x720) {
			res = '720x720';
		}
			
		actionBar.res = res;
		actionBar.isVisible = true;
		actionBar.setAttribute('class','bb-bb10-action-bar-'+res+' bb-bb10-action-bar-'+orientation+'-'+res+' bb-bb10-action-bar-dark');
		actionBar.mainBarTabs = mainBarTabs;
		actionBar.mainBarButtons = mainBarButtons;
		actionBar.overflowButtons = overflowButtons;
		actionBar.overflowTabs = overflowTabs;
		
		// Handle any press-and-hold events
		actionBar.oncontextmenu = function(contextEvent) {
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
		actionBar.oncontextmenu = actionBar.oncontextmenu.bind(actionBar);
		window.addEventListener('contextmenu', actionBar.oncontextmenu);
		bb.windowListeners.push({name: 'contextmenu', eventHandler: actionBar.oncontextmenu});
		
		// Create our sliding label area for Q10
		slideLabel.setAttribute('class','bb-bb10-action-bar-slide-label-'+res);
		actionBar.slideLabel = slideLabel;
		slideText.setAttribute('class','bb-bb10-action-bar-slide-label-text-'+res);
		actionBar.slideText = slideText;
		actionBar.parentNode.appendChild(slideLabel);
		actionBar.parentNode.appendChild(slideText);
		actionBar.slideUpShown = false;
		
		// Timer for the slide up label for Q10
		actionBar.doLabelTimer = function() {
			this.slideUpShown = true;
			this.slideLabel.style.height = '48px';
			this.slideText.style.height = '48px';
			this.slideText.style.visibility = 'visible';
		};
		actionBar.doLabelTimer = actionBar.doLabelTimer.bind(actionBar);
		// Handles the closing of the label bar for Q10
		actionBar.doTouchEnd = function() {
			if (this.timer) clearTimeout(this.timer);
			if (this.slideUpShown) {
				this.slideUpShown = false;
				this.slideLabel.style.height = '0px';
				this.slideText.style.visibility = 'hidden';
				this.slideText.style.height = '0px';
			}
		}
		actionBar.doTouchEnd = actionBar.doTouchEnd.bind(actionBar);
		// Make the label appear on the press and hold for Q10
		actionBar.showLabel = function(actionItem, text) {
			if (bb.device.is720x720) {
				var computedStyle = window.getComputedStyle(actionItem);
				this.slideText.innerHTML = text;
				this.slideText.style.width = parseInt(computedStyle.width)+'px';
				this.slideText.style['margin-left'] = (bb.actionBar.getBackBtnWidth(this.backBtn) + actionItem.offsetLeft) + 'px';
				this.timer = setTimeout(this.doLabelTimer,1000);	
			}
		}
		actionBar.showLabel = actionBar.showLabel.bind(actionBar);
		
					
		// Gather our action bar and action overflow tabs and buttons
		for (j = 0; j < actions.length; j++) {
			action = actions[j];
			if (action.hasAttribute('data-bb-style')) {
				style = action.getAttribute('data-bb-style').toLowerCase();
				if (style == 'button') {
					if (action.hasAttribute('data-bb-overflow') && (action.getAttribute('data-bb-overflow').toLowerCase() == 'true')) {
						overflowButtons.push(action);
					} else {
						mainBarButtons.push(action);
					}
				} else {
					if (action.hasAttribute('data-bb-overflow') && (action.getAttribute('data-bb-overflow').toLowerCase() == 'true')) {
						overflowTabs.push(action);
					} else {
						mainBarTabs.push(action);
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
			backBtn.setAttribute('class','bb-bb10-action-bar-back-button-'+res+' bb-bb10-action-bar-back-button-'+res+'-dark bb-bb10-action-bar-back-button-'+orientation+'-'+res);
			backBtn.onclick = function () {
					window.setTimeout(bb.popScreen,0);
				};
			actionBar.backBtn = backBtn;
			// Create and add the chevron to the back button
			chevron = document.createElement('div');
			chevron.setAttribute('class','bb-bb10-action-bar-back-chevron-'+res+'-dark');
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
						} else if (bb.device.is720x720) {
							backHighlight.style['height'] = '78px';
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
			backslash.setAttribute('class','bb-bb10-action-bar-back-slash-'+res+'-dark bb-bb10-action-bar-back-slash-'+orientation+'-'+res); 
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
			// Assign our tab overflow button
			actionBar.tabOverflowBtn = action;
			// Insert our more button
			actionContainer.insertBefore(action, actionContainer.firstChild);
		}
		
		// If we have "button" actions marked as overflow we need to show the more menu button
		if (overflowButtons.length > 0) {
			actionBar.menu = bb.actionOverflow.create(screen);
			actionBar.appendChild(actionBar.menu);
			// Create our action bar overflow button
			action = document.createElement('div');
			action.menu = actionBar.menu;
			action.menu.actionBar = actionBar;
			
			action.setAttribute('data-bb-type','action');
			action.setAttribute('data-bb-style','button');
			action.setAttribute('data-bb-img','overflow');
			action.onclick = function() {
							this.menu.show();
						}
			// Assign our action overflow button
			actionBar.actionOverflowBtn = action;
			// Insert our action overflow button
			actionContainer.appendChild(action);
		}
		
		// Determines how much width there is to use not including built in system buttons on the bar
		actionBar.getUsableWidth = function() {
				return bb.innerWidth() - bb.actionBar.getBackBtnWidth(this.backBtn) - bb.actionBar.getActionOverflowBtnWidth(this.actionOverflowBtn) - bb.actionBar.getTabOverflowBtnWidth(this.tabOverflowBtn);		
			}
		actionBar.getUsableWidth = actionBar.getUsableWidth.bind(actionBar);
		
		// This function replaces 'portrait' with 'landscape' or vica-versa
		actionBar.switchOrientationCSS = function (value) {
								if (value) {
									var orientation = bb.getOrientation();
									if (orientation == 'portrait') {
										value = value.replace('landscape', 'portrait');
									} else {
										value = value.replace('portrait', 'landscape');
									}
								}
								return value;
							};
		actionBar.switchOrientationCSS = actionBar.switchOrientationCSS.bind(actionBar);
		
		// Make sure we move when the orientation of the device changes
		actionBar.reLayoutActionBar = function(event) {
								var i,
									action,
									tab,
									lastActionType = 'button',
									actionWidth = 0, 
									margins = 2,
									temp,
									max = 5,
									count = 0,
									totalUsedWidth = 0,
									calculatedWidth = 0,
									orientation = bb.getOrientation();
									
									
								// First calculate how many slots on the action bar are shown
								if (this.actionOverflowBtn) max--;
								if (this.backBtn) max--;
								if (this.tabOverflowBtn) max--;
								// Count our tabs that take priority
								for (i = 0; i < this.mainBarTabs.length; i++) {
									if (count == max) break;
									tab = this.mainBarTabs[i];
									if (tab.visible == true) {
										count++;
									}							
								}
								// Then count out buttons
								for (i = 0; i < this.mainBarButtons.length; i++) {
									if (count == max) break;
									action = this.mainBarButtons[i];
									if (action.visible == true) {
										count++;
									}							
								}
								// Calculate our action width
								count = (count == 0) ? 1 : count;
								actionWidth = Math.floor(this.getUsableWidth()/count);
								
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
									this.backBtn.updateHighlightDimensions(orientation);
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
								
								// Reset our count of available slots
								count = 0;
							
								// Style our visible tabs
								calculatedWidth = actionWidth - 2; // 2 represents the tab margins
								for (i = 0; i < this.mainBarTabs.length; i++) {
									tab = this.mainBarTabs[i];
									if ((count < max) && (tab.visible == true)){
										totalUsedWidth += calculatedWidth;
										tab.style.width = calculatedWidth + 'px'; 
										// Update tab orientation
										tab.normal = this.switchOrientationCSS(tab.normal);
										tab.highlight = this.switchOrientationCSS(tab.highlight);
										temp = tab.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										tab.setAttribute('class',temp);
										// Update display text orientation
										temp = tab.display.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										tab.display.setAttribute('class',temp);
										// Update our flags
										lastActionType = 'tab';
										count++;
									} else {
										tab.style.display = 'none';
										tab.visible = false;
									};
								}
								
								// Style our visible buttons
								calculatedWidth = actionWidth - 1; // 1 represents the button margins
								for (i = 0; i < this.mainBarButtons.length; i++) {
									action = this.mainBarButtons[i];
									if ((count < max) && (action.visible == true)){
										totalUsedWidth += calculatedWidth;
										action.style.width = calculatedWidth + 'px'; 
										action.highlight.style['width'] = (actionWidth * 0.6) + 'px';
										action.highlight.style['margin-left'] = (actionWidth * 0.2) + 'px';
										// If the last action is a tab then add our shading
										if (lastActionType == 'tab') {
											action.normal = 'bb-bb10-action-bar-action-'+action.res+' bb-bb10-action-bar-action-' + orientation + '-' + action.res + ' bb-bb10-action-bar-button-dark bb-bb10-action-bar-button-tab-left-'+action.res+'-dark';
										} else {
											action.normal = 'bb-bb10-action-bar-action-'+action.res+' bb-bb10-action-bar-action-' + orientation + '-' + action.res + ' bb-bb10-action-bar-button-dark';
										}
										action.setAttribute('class',action.normal);
										// Update button orientation
										action.normal = this.switchOrientationCSS(action.normal);
										temp = action.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										action.setAttribute('class',temp);
										// Update our flags
										lastActionType = 'button';
										count++;
									} else {
										action.style.display = 'none';
										action.visible = false;
									};
								}
								
								// Adjust our action overflow button
								if (this.actionOverflowBtn) {
									if (lastActionType == 'tab') {
										this.actionOverflowBtn.normal = 'bb-bb10-action-bar-action-'+this.actionOverflowBtn.res+' bb-bb10-action-bar-action-' + orientation + '-' + this.actionOverflowBtn.res +' bb-bb10-action-bar-button-dark bb-bb10-action-bar-button-tab-left-'+this.actionOverflowBtn.res+'-dark';
									} else {
										this.actionOverflowBtn.normal = 'bb-bb10-action-bar-action-'+this.actionOverflowBtn.res+' bb-bb10-action-bar-action-' + orientation + '-' + this.actionOverflowBtn.res + ' bb-bb10-action-bar-button-dark';
									}	
									this.actionOverflowBtn.style.width = (bb.actionBar.getActionOverflowBtnWidth(this.actionOverflowBtn) - 1 ) + 'px'; // 1 represents the button margins
									this.actionOverflowBtn.highlight.style['width'] = (bb.actionBar.getActionOverflowBtnWidth(this.actionOverflowBtn) * 0.6) + 'px';
									this.actionOverflowBtn.highlight.style['margin-left'] = (bb.actionBar.getActionOverflowBtnWidth(this.actionOverflowBtn) * 0.2) + 'px';
									this.actionOverflowBtn.style.float = 'right';
									this.actionOverflowBtn.setAttribute('class',this.actionOverflowBtn.normal);
									// Update the action
									this.actionOverflowBtn.normal = this.switchOrientationCSS(this.actionOverflowBtn.normal);
									temp = this.actionOverflowBtn.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.actionOverflowBtn.setAttribute('class',temp);
									// Update the icon
									temp = this.actionOverflowBtn.icon.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.actionOverflowBtn.icon.setAttribute('class',temp);
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
		actionBar.reLayoutActionBar = actionBar.reLayoutActionBar.bind(actionBar);	
		window.addEventListener('orientationchange', actionBar.reLayoutActionBar,false);
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'orientationchange', eventHandler: actionBar.reLayoutActionBar});
				
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
			for (j = 0; j < mainBarTabs.length; j++) {
				action = mainBarTabs[j];
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
		var tab;
		for (j = 0; j < mainBarTabs.length; j++) {
			tab = mainBarTabs[j];
			tab.res = res;
			caption = tab.innerHTML;
			tab.actionBar = actionBar;
			tab.visible = true;
			tab.innerHTML = '';
			tab.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res + ' bb-bb10-action-bar-tab-dark bb-bb10-action-bar-tab-normal-dark';
			tab.highlight = tab.normal + ' bb-bb10-action-bar-tab-selected-dark';
			tab.setAttribute('class',tab.normal);
			// Tab initial visibility
			tab.visible = true;
			if (tab.hasAttribute('data-bb-visible') && (tab.getAttribute('data-bb-visible').toLowerCase() == 'false')) {
				tab.visible = false;
			} 
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
			icon.setAttribute('src',tab.getAttribute('data-bb-img'));
			tab.icon = icon;
			tab.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res+' bb-bb10-action-bar-action-display-'+orientation+'-'+res);
			display.innerHTML = caption;
			tab.display = display;
			tab.appendChild(display);
		
			// Get our selected state			
			if (tab.hasAttribute('data-bb-selected') && (tab.getAttribute('data-bb-selected').toLowerCase() == 'true')) {
				bb.actionBar.highlightAction(tab);
			}
			// Add our click listener
			tab.addEventListener('click',function (e) {
				bb.actionBar.highlightAction(this);
			},false);
			// Assign the setCaption function
			tab.setCaption = function(value) {
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
			tab.setCaption = tab.setCaption.bind(tab);
			// Assign the getCaption function
			tab.getCaption = function() {
								return this.display.innerHTML;
							};
			tab.getCaption = tab.getCaption.bind(tab);	
			// Assign the setImage function
			tab.setImage = function(value) {
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
			tab.setImage = tab.setImage.bind(tab);
			// Assign the getImage function
			tab.getImage = function() {
								return this.icon.getAttribute('src');
							};
			tab.getImage = tab.getImage.bind(tab);	
			
			// Add our hide() function
			tab.hide = bb.actionBar.actionHide;
			tab.hide = tab.hide.bind(tab);
			
			// Add our show() function
			tab.show = bb.actionBar.actionShow;
			tab.show = tab.show.bind(tab);
			
			// Handle press-and-hold on Q10
			tab.ontouchstart = function() {
					this.actionBar.showLabel(this,this.display.innerHTML);				
			}
			// Remove highlight when touch ends
			tab.ontouchend = function() {
					this.actionBar.doTouchEnd();
			}			
		}
		
		// Add our tab overflow buton styling if one exists
		var tabOverflow;
		if (actionBar.tabOverflowBtn) {
			tabOverflow = actionBar.tabOverflowBtn;
			tabOverflow.res = res;
			caption = tabOverflow.innerHTML;
			tabOverflow.actionBar = actionBar;
			tabOverflow.visible = true;
			tabOverflow.innerHTML = '';
			tabOverflow.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res + ' bb-bb10-action-bar-tab-dark bb-bb10-action-bar-tab-normal-dark';
			tabOverflow.highlight = tabOverflow.normal + ' bb-bb10-action-bar-tab-selected-dark';
			tabOverflow.setAttribute('class',tabOverflow.normal);
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
			// Set our transparent pixel
			icon.setAttribute('src',bb.transparentPixel);
			icon.normal = 'bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-tab-overflow-'+res+'-dark bb-bb10-action-bar-tab-overflow-'+orientation+'-'+res;
			icon.highlight = 'bb-bb10-action-bar-icon-'+res;
			icon.setAttribute('class',icon.normal);
			tabOverflow.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res+' bb-bb10-action-bar-action-display-'+orientation+'-'+res);
			display.innerHTML = caption;
			tabOverflow.display = display;
			tabOverflow.appendChild(display);
			tabOverflow.icon = icon;
			display.innerHTML = '&nbsp;';
			tabOverflow.display = display;
			// Create our tab highlight div
			tabOverflow.tabHighlight = document.createElement('div');
			tabOverflow.tabHighlight.setAttribute('class','bb-bb10-action-bar-tab-overflow-'+res+'-dark bb-bb10-action-bar-tab-overflow-highlight-'+res+' bb-bb10-action-bar-tab-overflow-highlight-'+ orientation +'-'+res);
			tabOverflow.appendChild(tabOverflow.tabHighlight);
			tabOverflow.style.width = (bb.actionBar.getTabOverflowBtnWidth(tabOverflow) - 1) + 'px';
			// Set our reset function
			tabOverflow.reset = function() {
						this.icon.setAttribute('src',bb.transparentPixel);
						this.icon.setAttribute('class',this.icon.normal);
						this.tabHighlight.style.display = 'none';
						this.display.innerHTML = '&nbsp;';
					};
			tabOverflow.reset = tabOverflow.reset.bind(tabOverflow);
			
			// Handle press-and-hold on Q10
			tabOverflow.ontouchstart = function() {
					var text = ((this.display.innerHTML == '') || (this.display.innerHTML == '&nbsp;')) ? 'More' : this.display.innerHTML;
					this.actionBar.showLabel(this,text);				
			}
			// Remove highlight when touch ends
			tabOverflow.ontouchend = function() {
					this.actionBar.doTouchEnd();
			}			
		}
		
		// Apply all our button styling
		var button;
		for (j = 0; j < mainBarButtons.length; j++) {
			button = mainBarButtons[j];
			button.res = res;
			button.actionBar = actionBar;
			caption = button.innerHTML;
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('src',button.getAttribute('data-bb-img'));
			icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
			button.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res + ' bb-bb10-action-bar-button-dark';
			// Button initial visibility
			button.visible = true;
			if (button.hasAttribute('data-bb-visible') && (button.getAttribute('data-bb-visible').toLowerCase() == 'false')) {
				button.visible = false;
			} 
			// Default settings
			button.icon = icon;
			button.innerHTML = '';
			button.setAttribute('class',button.normal);
			button.appendChild(icon);	
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
			display.innerHTML = caption;
			button.display = display;
			button.appendChild(display);
			// Set our highlight
			button.highlight = document.createElement('div');
			button.highlight.setAttribute('class','bb-bb10-action-bar-action-highlight');
			button.highlight.style['height'] = bb.device.is1024x600 ? '4px' : '8px';
			button.highlight.style['background-color'] = 'transparent';
			button.appendChild(button.highlight);			
			// Assign the setCaption function
			button.setCaption = function(value) {
								this.display.innerHTML = value;
							};
			button.setCaption = button.setCaption.bind(button);	
			// Assign the getCaption function
			button.getCaption = function() {
								return this.display.innerHTML;
							};
			button.getCaption = button.getCaption.bind(button);	
			// Assign the setImage function
			button.setImage = function(value) {
								this.icon.setAttribute('src',value);
							};
			button.setImage = button.setImage.bind(button);
			// Assign the setImage function
			button.getImage = function() {
								return this.icon.getAttribute('src');
							};
			button.getImage = button.getImage.bind(button);
			// Add our hide() function
			button.hide = bb.actionBar.actionHide;
			button.hide = button.hide.bind(button);
			// Add our show() function
			button.show = bb.actionBar.actionShow;
			button.show = button.show.bind(button);
			
			// Highlight on touch
			button.ontouchstart = function() {
					this.highlight.style['background-color'] = bb.options.highlightColor;	
					this.actionBar.showLabel(this,this.display.innerHTML);				
			}
			// Remove highlight when touch ends
			button.ontouchend = function() {
					this.highlight.style['background-color'] = 'transparent';
					this.actionBar.doTouchEnd();
			}
		}
		
		// Style our action overflow button
		if (actionBar.actionOverflowBtn) {
			actionOverflow = actionBar.actionOverflowBtn;
			actionOverflow.res = res;
			actionOverflow.actionBar = actionBar;
			actionOverflow.visible = true;
			caption = actionOverflow.innerHTML;
			// Set our transparent icon
			icon = document.createElement('img');
			icon.setAttribute('src',bb.transparentPixel);
			icon.setAttribute('class','bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-overflow-button-'+res+'-dark bb-bb10-action-bar-overflow-button-'+orientation+'-'+res);
			actionOverflow.icon = icon;
			// Default settings
			actionOverflow.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-action-' + orientation + '-' + res + ' bb-bb10-action-bar-button-dark';
			actionOverflow.innerHTML = '';
			actionOverflow.setAttribute('class',actionOverflow.normal);
			actionOverflow.appendChild(icon);
			// Set our caption
			var display = document.createElement('div');
			display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
			display.innerHTML = caption;
			actionOverflow.display = display;
			actionOverflow.appendChild(display);
			// Set our highlight
			actionOverflow.highlight = document.createElement('div');
			actionOverflow.highlight.setAttribute('class','bb-bb10-action-bar-action-highlight');
			actionOverflow.highlight.style['height'] = bb.device.is1024x600 ? '4px' : '8px';
			actionOverflow.highlight.style['background-color'] = 'transparent';
			actionOverflow.appendChild(actionOverflow.highlight);
			// Highlight on touch
			actionOverflow.ontouchstart = function() {
					this.highlight.style['background-color'] = bb.options.highlightColor;	
					this.actionBar.showLabel(this,'More');						
			}
			// Remove highlight when touch ends
			actionOverflow.ontouchend = function() {
					this.highlight.style['background-color'] = 'transparent';	
					this.actionBar.doTouchEnd();					
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
		// Layout the action bar
		actionBar.reLayoutActionBar();
	},
	
	
	actionShow: function() {
		if (this.visible) return;
		this.style.display = '';
		this.visible = true;
		this.actionBar.reLayoutActionBar();
	},
	
	actionHide: function() {
		if (!this.visible) return;
		this.style.display = 'none';
		this.visible = false;
		this.actionBar.reLayoutActionBar();
	},
	
	// Return the tab overflow button width based on orientation and screen resolution
	getTabOverflowBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 77 : 123;
		} else if (bb.device.is1280x768 || bb.device.is1280x720) {
			return bb.getOrientation() == 'portrait' ? 154 : 256;
		} else if (bb.device.is720x720) {
			return 144;
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
		} else if (bb.device.is720x720) {
			return 144;
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
		} else if (bb.device.is720x720) {
			return 174;
		}else {
			return bb.getOrientation() == 'portrait' ? 187 : 300;
		}
	},

	// Apply the proper highlighting for the action
	highlightAction: function (action, overflowAction) {
		var i,
			target,
			tabs = action.actionBar.mainBarTabs;
		
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
			// Reset the overflow button
			action.actionBar.tabOverflowBtn.style['border-top-color'] = '';
			action.actionBar.tabOverflowBtn.setAttribute('class',action.actionBar.tabOverflowBtn.normal);
		}
		
		// Now highlight this action
		action.style['border-top-color'] = bb.options.highlightColor;
		action.setAttribute('class',action.highlight);
		action.selected = true;
		
		if (overflowAction) {
			overflowAction.setAttribute('class', overflowAction.normal + ' bb10Highlight');
			overflowAction.selected = true;
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
				target.selected = false;
			}
		}
	}
};