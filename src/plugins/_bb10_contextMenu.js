// BlackBerry 10 Context Menu
_bb10_contextMenu = {
	// Create an instance of the menu and pass it back to the caller
	create : function(screen) {
	
		var menu = document.createElement('div');
		menu.style.display = 'none';
		menu.actions = [];
		menu.pinnedAction = undefined;
		
		// Handle our context open event
		menu.oncontextmenu = function(contextEvent) {
				this.centerMenuItems();
				
				var node = contextEvent.srcElement,
					found = false,
					bbuiType = '',
					data;
				while (node) {
					if (node.hasAttribute) {
						bbuiType = node.hasAttribute('data-bb-type') ? node.getAttribute('data-bb-type').toLowerCase() : undefined;
						if (bbuiType == 'item') {
							found = true;
							break;
						} 
					}
					node = node.parentNode;
				}
				// If we found our item then we highlight it
				if (found) {
					node.drawSelected();
					data = node.getAttribute('data-webworks-context');
					data = JSON.parse(data);
					this.selected = {
							title : data.header,
							description : data.subheader,
							selected : node
						};
				}
				
			};
		menu.oncontextmenu = menu.oncontextmenu.bind(menu);
		window.addEventListener('contextmenu', menu.oncontextmenu);
		bb.windowListeners.push({name: 'oncontextmenu', eventHandler: menu.oncontextmenu});

		// Handle our context closed event
		menu.oncontextmenuclosed = function(contextEvent) {
				if (this.selected && this.selected.selected) {
					this.selected.selected.drawUnselected();
				}
			};
		menu.oncontextmenuclosed = menu.oncontextmenuclosed.bind(menu);
		document.addEventListener('bbui.contextClosed', menu.oncontextmenuclosed);
		bb.documentListeners.push({name: 'bbui.contextClosed', eventHandler: menu.oncontextmenuclosed});
		
		
		// Add a menu item
		menu.add = function(action) {
				this.actions.push(action);
				this.appendChild(action);
				var menuItem = {
						actionId: bb.guidGenerator(),
						label: action.innerHTML,
						icon: action.getAttribute('data-bb-img')
					};
				// Assign a pointer to the menu item
				action.menuItem = menuItem;
				action.menu = this;
				action.visible = action.hasAttribute('data-bb-visible') ? (action.getAttribute('data-bb-visible').toLowerCase() != 'false') : true;
				
				// Check for the pinned item
				if (!this.pinnedAction) {
					if (action.hasAttribute('data-bb-pin') && (action.getAttribute('data-bb-pin').toLowerCase() == 'true')) {
						this.pinnedAction = action;
					}
				}
				// Handle the click of the menu item
				action.doclick = function(id) {
					var element = document.querySelectorAll('[data-bb-context-menu-id='+ id +']'),
							data;
					if (element.length > 0) {
						element = element[0];
						data = element.getAttribute('data-webworks-context');
						data = JSON.parse(data);
						this.menu.selected = {
							title : data.header,
							description : data.subheader,
							selected : element
						};
						if (action.onclick) {
							action.onclick();
						}
					}
				};
				action.doclick = action.doclick.bind(action);
				
				// Handle the show
				action.show = function() {
					if (this.visible) return;
					this.visible = true;
					this.removeAttribute('data-bb-visible');
				}
				action.show = action.show.bind(action);
				
				// Handle the hide
				action.hide = function() {
					if (!this.visible) return;
					this.visible = false;
					this.setAttribute('data-bb-visible','false');
				}
				action.hide = action.hide.bind(action);
			};
		menu.add = menu.add.bind(menu);
		
		// This function refreshes the menu witht the current state
		menu.centerMenuItems = function() {
				var contexts = [blackberry.ui.contextmenu.CONTEXT_ALL],
					i,
					action,
					options = {
						includeContextItems: [blackberry.ui.contextmenu.CONTEXT_ALL],
						includePlatformItems: false,
						includeMenuServiceItems: false
					};
				// See if we have a pinned action
				if (this.pinnedAction) {
					options.pinnedItemId = this.pinnedAction.menuItem.actionId;
				}
				// First clear any items that exist
				this.clearWWcontextMenu();
				// Define our custom context
				blackberry.ui.contextmenu.defineCustomContext('bbui-context',options);
				
				// Add our visible context menu items
				for (i = this.actions.length -1; i >= 0;i--) {
					action = this.actions[i];
					if (action.visible) {
						blackberry.ui.contextmenu.addItem(contexts, action.menuItem, action.doclick);
					}
				}
			};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
		// This function clears all the items from the context menu.  Typically
		// called internally when the screen is popped
		menu.clearWWcontextMenu = function() {
				var contexts = [blackberry.ui.contextmenu.CONTEXT_ALL],
					i,
					action;
				for (i = 0; i < this.actions.length;i++) {
					action = this.actions[i];
					blackberry.ui.contextmenu.removeItem(contexts, action.menuItem.actionId);
				}
			};
		menu.centerMenuItems = menu.centerMenuItems.bind(menu);
		
		menu.show = function() {
				// Do nothing, just here for compatibility
			};
		menu.show = menu.show.bind(menu);
		
		menu.peek = function() {
				// Do nothing, just here for compatibility
			};
		menu.peek = menu.peek.bind(menu);
		
		return menu;
	}
};