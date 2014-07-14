// Apply styling to an action bar
bb.actionBar10dot3 = {

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
			icon,
			j,
			orientation = bb.getOrientation(),
			slideLabel = document.createElement('div'),
			slideText = document.createElement('div');
			
		actionBar.isVisible = true;
		actionBar.setAttribute('class','bb-action-bar-10dot3 bb-action-bar-10dot3-'+orientation+' bb-action-bar-10dot3-'+bb.screen.controlColor);
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
		slideLabel.setAttribute('class','bb-action-bar-10dot3-slide-label');
		actionBar.slideLabel = slideLabel;
		slideText.setAttribute('class','bb-action-bar-10dot3-slide-label-text');
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
				this.slideText.style['margin-left'] = (bb.actionBar10dot3.getBackBtnWidth(this.backBtn) + actionItem.offsetLeft) + 'px';
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
				backslash,
				versionStyling,
				slash;
			backBtn = document.createElement('div');
			backBtn.setAttribute('class','bb-action-bar-10dot3-back-button bb-action-bar-10dot3-back-button-'+orientation);
			backBtn.onclick = function () {
					window.setTimeout(bb.popScreen,0);
				};
			actionBar.backBtn = backBtn;
			// Create and add the chevron to the back button
			chevron = document.createElement('div');
			chevron.setAttribute('class','bb-action-bar-10dot3-back-chevron-'+bb.screen.controlColor);
			backBtn.appendChild(chevron);
			
			backBtn.ontouchstart = function() {	
				if (bb.screen.controlColor == 'light') {
					this.style['background-color'] = '#DDDDDD';
					this.backslash.style['background-color'] = '#DDDDDD';					
				} else {
					this.style['background-color'] = '#3A3A3A';
					this.backslash.style['background-color'] = '#3A3A3A';	
				}				
			}
			backBtn.ontouchend = function() {
				this.style['background-color'] = '';	
				this.backslash.style['background-color'] = '';					
			}
			
			// Create our backslash area
			backslash = document.createElement('div');
			versionStyling = 'bb-action-bar-10dot3-back-slash-'+bb.screen.controlColor;
			backslash.setAttribute('class',versionStyling + ' bb-action-bar-10dot3-back-slash-'+orientation); 
			backBtn.backslash = backslash;
			
			// Create our colored slash
			slash = document.createElement('div');
			slash.setAttribute('class', 'bb-action-bar-10dot3-colored-slash');
			slash.style['background-color'] = bb.options.highlightColor;
			backslash.appendChild(slash);
			
			// Create a table to hold the back button and our actions
			var table = document.createElement('table'),
				tr = document.createElement('tr'),
				td = document.createElement('td');
			actionBar.appendChild(table);
			table.appendChild(tr);
			table.setAttribute('class','bb-action-bar-10dot3-table');
			// Set Back Button widths
			if (bb.device.is1024x600) {
				td.style.width = (bb.actionBar10dot3.getBackBtnWidth(backBtn) - 16)+'px';
			} else {
				td.style.width = (bb.actionBar10dot3.getBackBtnWidth(backBtn) - 33)+'px';
			}
			tr.appendChild(td);
			backBtn.innerChevron = td;
			td.appendChild(backBtn);
			// Create the container for our backslash
			td = document.createElement('td');
			// Set backslash widths
			td.style.width = bb.device.is1024x600 ? 16 + 'px' : 33+'px';
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
			actionBar.moreCaption = actionBar.hasAttribute('data-bb-more-caption') ? actionBar.getAttribute('data-bb-more-caption') : 'More';
				
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
				return bb.innerWidth() - bb.actionBar10dot3.getBackBtnWidth(this.backBtn) - bb.actionBar10dot3.getActionOverflowBtnWidth(this.actionOverflowBtn) - bb.actionBar10dot3.getTabOverflowBtnWidth(this.tabOverflowBtn);		
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
									orientation = bb.getOrientation(),
									signatureActionList = [],
									noVisibleTabs = false;
									
								// First calculate how many slots on the action bar are shown
								if (this.actionOverflowBtn) max--;
								if (this.backBtn) max--;
								if (this.tabOverflowBtn) {
									max--;
								}
								// Count our tabs that take priority
								for (i = 0; i < this.mainBarTabs.length; i++) {
									if (count == max) break;
									tab = this.mainBarTabs[i];
									if (tab.visible == true) {
										count++;
									}							
								}
								noVisibleTabs = (count == 0) ? true : false;
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
								if (noVisibleTabs) {
									max = 3;
									if (bb.device.is1280x720) {
										if (this.signatureAction) {
											actionWidth = 133;
										} else if (count >= max) {
											actionWidth = 133;
										} else if (count == 2) {
											actionWidth = 200;
										} else {
											actionWidth = 430;
										}
									} else if (bb.device.is1440x1440) {
										if (this.signatureAction) {
											actionWidth = 192;
										} else if (count >= max) {
											actionWidth = 192;
										} else if (count == 2) {
											actionWidth = 300;
										} else {
											actionWidth = 500;
										}
									} else if (bb.device.is720x720) {
										if (this.signatureAction) {
											actionWidth = 144;
										} else if (count >= max) {
											actionWidth = 144;
										} else if (count == 2) {
											actionWidth = 280;
										} else {
											actionWidth = 350;
										}
									} else {
										if (this.signatureAction) {
											actionWidth = 163;
										} else if (count >= max) {
											actionWidth = 163;
										} else if (count == 2) {
											actionWidth = 230;
										} else {
											actionWidth = 460;
										}
									}
								} else {
									actionWidth = Math.floor(this.getUsableWidth()/count);
								}
								
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
									// Back slash
									temp = this.backBtn.backslash.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.backBtn.backslash.setAttribute('class',temp);
									// Inner Chevron
									if (bb.device.is1024x600) {
										this.backBtn.innerChevron.style.width = (bb.actionBar10dot3.getBackBtnWidth(this.backBtn) - 16)+'px';
									} else {
										this.backBtn.innerChevron.style.width = (bb.actionBar10dot3.getBackBtnWidth(this.backBtn) - 33)+'px';
									}
								}
								
								// Reset our count of available slots
								count = 0;
							
								// Style our visible tabs
								calculatedWidth = actionWidth - 2; // 2 represents the tab margins
								for (i = 0; i < this.mainBarTabs.length; i++) {
									tab = this.mainBarTabs[i];
									if ((count < max) && (tab.visible == true)){
										totalUsedWidth += calculatedWidth + 2;
										tab.style.width = calculatedWidth + 'px'; 
										// Update tab orientation
										tab.normal = this.switchOrientationCSS(tab.normal);
										tab.highlight = this.switchOrientationCSS(tab.highlight);
										temp = tab.tabInner.getAttribute('class');
										temp = this.switchOrientationCSS(temp);
										tab.tabInner.setAttribute('class',temp);
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
								var firstAction = undefined;
								for (i = 0; i < this.mainBarButtons.length; i++) {
									action = this.mainBarButtons[i];
									if ((count < max) && (action.visible == true)){
										// If it is the signature action and there are visible tabs then hide it
										if ((action.isSignatureAction === true) && (noVisibleTabs == false)) {
											action.visible = false;
											action.signatureDiv.style.display = 'none';
											continue;
										}
										
										if (firstAction == undefined) {
											firstAction = action;
										}
										signatureActionList.push(action);
										action.style['margin-left'] = '';
										totalUsedWidth += calculatedWidth + 1;
										action.style.width = calculatedWidth + 'px'; 
										action.normal = 'bb-action-bar-10dot3-action bb-action-bar-10dot3-action-' + orientation + ' bb-action-bar-10dot3-button-'+bb.screen.controlColor;
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
								
								// Align our actions to be centered if there are no tabs
								if (noVisibleTabs && firstAction) {
									if (this.signatureAction) {
										var signatureWidth,
											signatureIndex = signatureActionList.indexOf(this.signatureAction),
											multiplier = (3 - count);
										// Make sure that our signature action is centered and the first Element is set appropriately
										if (count == 3) {
											if (signatureIndex != 1) {
												if (signatureIndex === 0) {
													firstAction = signatureActionList[1];
													this.signatureAction.parentNode.insertBefore(this.signatureAction, signatureActionList[2]);
												} else {
													firstAction = signatureActionList[0];
													this.signatureAction.parentNode.insertBefore(this.signatureAction, signatureActionList[1]);
												}
											}
										} else if (count == 2) {
											if (signatureIndex != 0) {
												this.signatureAction.parentNode.insertBefore(this.signatureAction, signatureActionList[0]);
												firstAction = this.signatureAction;
											}
										} 
										
										// Determine our circle size based on resolution	
										if (bb.device.is1280x720) {
											signatureWidth = 96;
										} else if (bb.device.is1440x1440) {
											signatureWidth = 144;
										} else {
											signatureWidth = 120;
										}
										this.signatureAction.signatureDiv.style['margin-left'] = ((bb.innerWidth()/2) - (signatureWidth/2)) + 'px';
										// Set our margin to center our actions
										var leftBuffer = 0;
										if (this.backBtn) {
											leftBuffer += bb.actionBar10dot3.getBackBtnWidth(this.backBtn);
										} else if (this.tabOverflowBtn) {
											leftBuffer += bb.actionBar10dot3.getTabOverflowBtnWidth(this.tabOverflowBtn);
										}
										if (count == 1) {
											firstAction.style['margin-left'] = (((bb.innerWidth() - actionWidth)/2) - leftBuffer) + 'px';
										} else {
											firstAction.style['margin-left'] = ((((bb.innerWidth() - (3 * actionWidth))/2) + (multiplier * actionWidth)) - leftBuffer) + 'px';
										}
									} else {
										firstAction.style['margin-left'] = ((this.getUsableWidth() - (count * actionWidth))/2) + 'px';
									}
								} 
								
								// Adjust our tab overflow button
								if (this.tabOverflowBtn) {
									var tempWidth = bb.actionBar10dot3.getTabOverflowBtnWidth(this.tabOverflowBtn) -1;
									totalUsedWidth += tempWidth + 2;
									this.tabOverflowBtn.style.width = (tempWidth) + 'px';
									// Update our tab
									this.tabOverflowBtn.normal = this.switchOrientationCSS(this.tabOverflowBtn.normal);
									this.tabOverflowBtn.highlight = this.switchOrientationCSS(this.tabOverflowBtn.highlight);
									temp = this.tabOverflowBtn.getAttribute('class');
									temp = this.switchOrientationCSS(temp);
									this.tabOverflowBtn.setAttribute('class',temp);
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
								
								// Adjust our action overflow button
								if (this.actionOverflowBtn) {
									this.actionOverflowBtn.normal = 'bb-action-bar-10dot3-action bb-action-bar-10dot3-action-' + orientation + ' bb-action-bar-10dot3-button-'+bb.screen.controlColor;
									this.actionOverflowBtn.style.width = (bb.actionBar10dot3.getActionOverflowBtnWidth(this.actionOverflowBtn) - 1 ) + 'px'; // 1 represents the button margins
									
									this.actionOverflowBtn.highlight.style['width'] = (bb.actionBar10dot3.getActionOverflowBtnWidth(this.actionOverflowBtn) * 0.6) + 'px';
									this.actionOverflowBtn.highlight.style['margin-left'] = (bb.actionBar10dot3.getActionOverflowBtnWidth(this.actionOverflowBtn) * 0.2) + 'px';
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
							};
		actionBar.reLayoutActionBar = actionBar.reLayoutActionBar.bind(actionBar);	
		window.addEventListener('orientationchange', actionBar.reLayoutActionBar,false);
		// Add listener for removal on popScreen
		bb.windowListeners.push({name: 'orientationchange', eventHandler: actionBar.reLayoutActionBar});
				
		// Add setBackCaption function
		actionBar.setBackCaption = function(value) {
					this.setAttribute('data-bb-back-caption',value);
				};
		actionBar.setBackCaption = actionBar.setBackCaption.bind(actionBar);  
		
		// Add setSelectedTab function
		actionBar.setSelectedTab = function(tab) {
					if (tab.getAttribute('data-bb-style') != 'tab') return;
					bb.actionBar10dot3.highlightAction(tab);
					if (tab.onclick) {
						tab.onclick();
					}
				};
		actionBar.setSelectedTab = actionBar.setSelectedTab.bind(actionBar);  
		
		// Add our hide function
		actionBar.hide = function(tab) {
					if (!this.isVisible) return;
					this.style.display = 'none';
					this.slideLabel.style.display = 'none';
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
					this.slideLabel.style.display = '';
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
					clone.actionBar = actionBar;
					actionBar.tabOverflowMenu.add(clone);
				}
			}		
			// Now add all our tabs marked as overflow
			for (j = 0; j < overflowTabs.length; j++) {
				action = overflowTabs[j];
				action.actionBar = actionBar;
				actionBar.tabOverflowMenu.add(action);
			}
		}

		// Add all of our overflow button actions
		for (j = 0; j < overflowButtons.length; j++) {
			action = overflowButtons[j];
			actionBar.menu.add(action);
		}
		
		// Apply all our tab styling
		var tab,
			tabInner;
		for (j = 0; j < mainBarTabs.length; j++) {
			tab = mainBarTabs[j];
			caption = tab.innerHTML;
			tab.actionBar = actionBar;
			tab.visible = true;
			tab.innerHTML = '';
			tabInner = document.createElement('div');
			tab.tabInner = tabInner;
			tab.appendChild(tabInner);
			tab.setAttribute('class','bb-action-bar-10dot3-tab-outer' );
			tab.normal = 'bb-action-bar-10dot3-action bb-action-bar-10dot3-action-' + orientation + ' bb-action-bar-10dot3-tab-'+bb.screen.controlColor+' bb-action-bar-10dot3-tab-normal-'+bb.screen.controlColor;
			tab.highlight = tab.normal + ' bb-action-bar-10dot3-tab-selected-'+bb.screen.controlColor;
			tabInner.setAttribute('class',tab.normal);
			// Tab initial visibility
			tab.visible = true;
			if (tab.hasAttribute('data-bb-visible') && (tab.getAttribute('data-bb-visible').toLowerCase() == 'false')) {
				tab.visible = false;
			} 
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-action-bar-10dot3-icon');
			icon.setAttribute('src',tab.getAttribute('data-bb-img'));
			tab.icon = icon;
			tabInner.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-action-bar-10dot3-action-display bb-action-bar-10dot3-action-display-'+orientation);
			display.innerHTML = caption;
			tab.display = display;
			tabInner.appendChild(display);
		
			// Get our selected state			
			if (tab.hasAttribute('data-bb-selected') && (tab.getAttribute('data-bb-selected').toLowerCase() == 'true')) {
				bb.actionBar10dot3.highlightAction(tab);
			}
			// Add our click listener
			tab.addEventListener('click',function (e) {
				bb.actionBar10dot3.highlightAction(this);
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
			tab.hide = bb.actionBar10dot3.actionHide;
			tab.hide = tab.hide.bind(tab);
			
			// Add our show() function
			tab.show = bb.actionBar10dot3.actionShow;
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
		
		// Add our tab overflow button styling if one exists
		var tabOverflow;
		if (actionBar.tabOverflowBtn) {
			tabOverflow = actionBar.tabOverflowBtn;
			caption = tabOverflow.innerHTML;
			tabOverflow.actionBar = actionBar;
			tabOverflow.visible = true;
			tabOverflow.innerHTML = '';
			tabInner = document.createElement('div');
			tabOverflow.tabInner = tabInner;
			tabOverflow.appendChild(tabInner);
			tabOverflow.setAttribute('class','bb-action-bar-10dot3-tab-outer' );
			tabOverflow.normal = 'bb-action-bar-10dot3-action bb-action-bar-10dot3-action-' + orientation +' bb-action-bar-10dot3-tab-'+bb.screen.controlColor+' bb-action-bar-10dot3-tab-normal-'+bb.screen.controlColor;
			tabOverflow.highlight = tabOverflow.normal + ' bb-action-bar-10dot3-tab-selected-'+bb.screen.controlColor;
			tabInner.setAttribute('class',tabOverflow.normal);
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('class','bb-action-bar-10dot3-icon');
			// Set our transparent pixel
			icon.setAttribute('src',bb.transparentPixel);
			icon.normal = 'bb-action-bar-10dot3-icon bb-action-bar-10dot3-tab-overflow-'+bb.screen.controlColor+' bb-action-bar-10dot3-tab-overflow-'+orientation;
			icon.highlight = 'bb-action-bar-10dot3-icon';
			icon.setAttribute('class',icon.normal);
			tabInner.appendChild(icon);
			// Set our caption
			display = document.createElement('div');
			display.setAttribute('class','bb-action-bar-10dot3-action-display bb-action-bar-10dot3-action-display-'+orientation);
			display.innerHTML = caption;
			tabOverflow.display = display;
			tabInner.appendChild(display);
			tabOverflow.icon = icon;
			display.innerHTML = '&nbsp;';
			tabOverflow.display = display;
			tabOverflow.style.width = (bb.actionBar10dot3.getTabOverflowBtnWidth(tabOverflow) - 1) + 'px';
			// Set our reset function
			tabOverflow.reset = function() {
						this.icon.setAttribute('src',bb.transparentPixel);
						this.icon.setAttribute('class',this.icon.normal);
						this.display.innerHTML = '&nbsp;';
					};
			tabOverflow.reset = tabOverflow.reset.bind(tabOverflow);
			
			// Handle press-and-hold on Q10
			tabOverflow.ontouchstart = function() {
				if (bb.screen.controlColor == 'light') {
					this.tabInner.style['background-color'] = '#DDDDDD';
				} else {
					this.tabInner.style['background-color'] = '#3A3A3A';
				}
				var text = ((this.display.innerHTML == '') || (this.display.innerHTML == '&nbsp;')) ? this.actionBar.moreCaption : this.display.innerHTML;
				this.actionBar.showLabel(this,text);				
			}
			// Remove highlight when touch ends
			tabOverflow.ontouchend = function() {
				this.tabInner.style['background-color'] = '';
				this.actionBar.doTouchEnd();
			}			
		}
		
		// Apply all our button styling
		var button;
		for (j = 0; j < mainBarButtons.length; j++) {
			button = mainBarButtons[j];
			button.actionBar = actionBar;
			button.isSignatureAction = false;
			caption = button.innerHTML;
			if (actionBar.signatureAction == undefined) {
				if (button.hasAttribute('data-bb-signature')) {
					if (button.getAttribute('data-bb-signature').toLowerCase() == 'true') {
						actionBar.signatureAction = button;
						button.isSignatureAction = true;
					}
				}
			}
			
			// Add the icon
			icon = document.createElement('img');
			icon.setAttribute('src',button.getAttribute('data-bb-img'));
			icon.setAttribute('class','bb-action-bar-10dot3-icon');
			button.normal = 'bb-action-bar-10dot3-action bb-action-bar-10dot3-action-' + orientation + ' bb-action-bar-10dot3-button-'+bb.screen.controlColor;
			// Button initial visibility
			button.visible = true;
			if (button.hasAttribute('data-bb-visible') && (button.getAttribute('data-bb-visible').toLowerCase() == 'false')) {
				button.visible = false;
			} 
			
			// Default settings
			button.icon = icon;
			button.innerHTML = '';
			if (button.isSignatureAction === true) {
				button.signatureDiv = document.createElement('div');
				button.signatureDiv.setAttribute('class','bb-action-bar-10dot3-signature-icon');
				button.signatureDiv.style['background-color'] = bb.options.highlightColor;
				button.signatureDiv.style['background-image'] = 'url("'+button.getAttribute('data-bb-img')+'")';
				//button.signatureDiv.appendChild(icon);
				screen.appendChild(button.signatureDiv);
				button.signatureDiv.highlight = function() {
								this.style['background-color'] = bb.options.shades.darkHighlight;
							};
				button.signatureDiv.highlight = button.signatureDiv.highlight.bind(button.signatureDiv);	
				button.signatureDiv.unhighlight = function() {
								this.style['background-color'] = bb.options.highlightColor;
							};
				button.signatureDiv.unhighlight = button.signatureDiv.unhighlight.bind(button.signatureDiv);	
				// Set our events
				button.signatureDiv.ontouchstart = function() {
					this.highlight();
				}
				button.signatureDiv.ontouchend = function() {
					this.unhighlight();
				}
				button.signatureDiv.onclick = button.onclick;
			} else {
				button.appendChild(icon);
			}
			button.setAttribute('class',button.normal);
			
			// Set our caption
			display = document.createElement('div');
			if (button.isSignatureAction === true) {
				display.setAttribute('class','bb-action-bar-10dot3-action-display bb-action-bar-10dot3-signature-action-display');
			} else {
				display.setAttribute('class','bb-action-bar-10dot3-action-display');
			}
			display.innerHTML = caption;
			button.display = display;
			button.appendChild(display);
			// Set our highlight
			button.highlight = document.createElement('div');
			button.highlight.setAttribute('class','bb-action-bar-10dot3-action-highlight');
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
								if (this.isSignatureAction) {
									this.signatureDiv.style['background-image'] = 'url("'+value+'")';
								} else {
									this.icon.setAttribute('src',value);
								}
								this.setAttribute('data-bb-img',value);
							};
			button.setImage = button.setImage.bind(button);
			// Assign the setImage function
			button.getImage = function() {
								return this.getAttribute('data-bb-img');;
							};
			button.getImage = button.getImage.bind(button);
			// Add our hide() function
			button.hide = bb.actionBar10dot3.actionHide;
			button.hide = button.hide.bind(button);
			// Add our show() function
			button.show = bb.actionBar10dot3.actionShow;
			button.show = button.show.bind(button);
			
			// Highlight on touch
			button.ontouchstart = function() {
				if (this.isSignatureAction === true) {
					this.signatureDiv.style['background-color'] = bb.options.shades.darkHighlight;
				} else {
					if (bb.screen.controlColor == 'light') {
						this.style['background-color'] = '#DDDDDD';
					} else {
						this.style['background-color'] = '#3A3A3A';
					}
				}
				this.actionBar.showLabel(this,this.display.innerHTML);				
			}
			// Remove highlight when touch ends
			button.ontouchend = function() {
				if (this.isSignatureAction === true) {
					this.signatureDiv.style['background-color'] = bb.options.highlightColor;
				} else {
					this.style['background-color'] = 'transparent';
					this.actionBar.doTouchEnd();
				}
			}
		}
		
		// Style our action overflow button
		if (actionBar.actionOverflowBtn) {
			actionOverflow = actionBar.actionOverflowBtn;
			actionOverflow.actionBar = actionBar;
			actionOverflow.visible = true;
			caption = actionOverflow.innerHTML;
			// Set our transparent icon
			icon = document.createElement('img');
			icon.setAttribute('src',bb.transparentPixel);
			icon.setAttribute('class','bb-action-bar-10dot3-icon bb-action-bar-10dot3-overflow-button-'+bb.screen.controlColor+' bb-action-bar-10dot3-overflow-button-'+orientation);
			actionOverflow.icon = icon;
			// Default settings
			actionOverflow.normal = 'bb-action-bar-10dot3-action bb-action-bar-10dot3-action-' + orientation + ' bb-action-bar-10dot3-button-'+bb.screen.controlColor;
			actionOverflow.innerHTML = '';
			actionOverflow.setAttribute('class',actionOverflow.normal);
			actionOverflow.appendChild(icon);
			// Set our caption
			var display = document.createElement('div');
			display.setAttribute('class','bb-action-bar-10dot3-action-display');
			actionOverflow.display = display;
			actionOverflow.appendChild(display);
			// Set our highlight
			actionOverflow.highlight = document.createElement('div');
			actionOverflow.highlight.setAttribute('class','bb-action-bar-10dot3-action-highlight');
			actionOverflow.highlight.style['height'] = bb.device.is1024x600 ? '4px' : '8px';
			actionOverflow.highlight.style['background-color'] = 'transparent';
			actionOverflow.appendChild(actionOverflow.highlight);
			// Highlight on touch
			actionOverflow.ontouchstart = function() {
				if (bb.screen.controlColor == 'light') {
					this.style['background-color'] = '#DDDDDD';
				} else {
					this.style['background-color'] = '#3A3A3A';
				}
				this.actionBar.showLabel(this,this.actionBar.moreCaption);						
			}
			// Remove highlight when touch ends
			actionOverflow.ontouchend = function() {
				this.style['background-color'] = 'transparent';	
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
		} else if (bb.device.is720x720) {
			if (bb.device.newerThan10dot2) {
				return 109;
			} else {
				return 144;
			}
		} else if (bb.device.is1280x720) {
			return 96;
		} else if (bb.device.is1440x1440) {
			return 144;
		} else {
			return 120;
		}
	},
	
	// Return the action overflow button width based on orientation and screen resolution
	getActionOverflowBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 77 : 123;
		} else if (bb.device.is720x720) {
			if (bb.device.newerThan10dot2) {
				return 109;
			} else {
				return 144;
			}
		} else if (bb.device.is1280x720) {
			return 96;
		} else if (bb.device.is1440x1440) {
			return 144;
		} else {
			return 120;
		}
	},
	
	// Return the back button width based on orientation and screen resolution
	getBackBtnWidth: function(button) {
		if (!button) return 0;
		
		if (bb.device.is1024x600) {
			return bb.getOrientation() == 'portrait' ? 93 : 150;
		} else if (bb.device.is720x720) {
			if (bb.device.newerThan10dot2) {
				return 121;
			} else {
				return 174;
			}
		} else if (bb.device.is1280x720) {
			return 104;
		} else if (bb.device.is1440x1440) {
			return 168;
		} else {
			return 129;
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
				bb.actionBar10dot3.unhighlightAction(target);
			}					
		}

		// Un-highlight the overflow menu items
		if (action.actionBar.tabOverflowMenu) {
			tabs = action.actionBar.tabOverflowMenu.actions;
			for (i = 0; i < tabs.length; i++) {
				target = tabs[i];
				if (target != overflowAction)  {
					bb.actionBar10dot3.unhighlightAction(target);
				} 
			}
		}
		
		// Now highlight this action
		if (action.tabInner) {
			if (action.tabInner != action.actionBar.tabOverflowBtn.tabInner) {
				action.tabInner.style['border-top-color'] = bb.options.highlightColor;
				action.tabInner.setAttribute('class',action.highlight);
			}
		} else {
			action.style['border-top-color'] = bb.options.highlightColor;
			action.setAttribute('class',action.highlight);
		}
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
		// Check if it is a tab
		if (action.tabInner) {
			action.tabInner.style['border-top-color'] = '';
			action.tabInner.setAttribute('class',action.normal);
		} else {
			action.style['border-top-color'] = '';
			action.setAttribute('class',action.normal);
		}
		// See if there was a tab overflow
		if (action.actionBar && action.actionBar.tabOverflowMenu) {
			tabs = action.actionBar.tabOverflowMenu.actions;
			for (i = 0; i < tabs.length; i++) {
				target = tabs[i];
				if (target.tabInner) {
					target.tabInner.setAttribute('class', target.normal);
				} else {
					target.setAttribute('class', target.normal);
				}
				target.selected = false;
			}
		}
	}
};