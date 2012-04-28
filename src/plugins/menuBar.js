bb.menuBar = {
	height: 103,
	activeClick: false,
	ignoreClick: false,
	menuOpen: false,
	menu: false,

	apply: function(menuBar,screen){
		if ((window.blackberry && blackberry.app.event) && (bb.device.isPlayBook || bb.device.isBB10)) {
			bb.menuBar.createSwipeMenu(menuBar,screen);
			if (bb.device.isPlayBook && !bb.device.isBB10) {
				menuBar.parentNode.removeChild(menuBar);
			}
			document.addEventListener("click", bb.menuBar.globalClickHandler, false);
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar); 
		}else if(window.blackberry && blackberry.ui.menu){
			bb.menuBar.createBlackberryMenu(menuBar);
			menuBar.parentNode.removeChild(menuBar);
		}else{
			console.log('Unable to create Blackberry/onSwipeDown menu.');
		}
	},

	createBlackberryMenu: function(menuBar){
		var items, 
			item, 
			title,
			div;
		
		items = menuBar.getElementsByTagName('div');
		
		for (var j = 0; j < items.length; j++) {
			div = items[j];
			if(div.getAttribute('data-bb-type') === "menu-item"){
				title = div.innerHTML;
				if(title){
					item = new blackberry.ui.menu.MenuItem(false, j, title, div.onclick);
					blackberry.ui.menu.addMenuItem(item);
					if(div.hasAttribute('data-bb-selected') && div.getAttribute('data-bb-selected') === "true"){
						blackberry.ui.menu.setDefaultMenuItem(item);
					}
				}else{
					console.log("can't add menu item without data-bb-caption");
				}
			}else if(div.getAttribute('data-bb-type') === "menu-separator"){
				item = new blackberry.ui.menu.MenuItem(true, j);
				blackberry.ui.menu.addMenuItem(item);
			}else{
				console.log('invalid menu item type');
			}
		}		
	},
	
	createSwipeMenu: function(menuBar, screen){
		
		// Get our resolution text for BB10 styling			
		if (bb.device.isBB10) {
			var res,
				i,
				type,
				item,
				foundItems = [],
				img,
				imgPath,
				caption,
				div,
				width;
				
			if (bb.device.isPlayBook) {
				res = 'lowres';
				bb.menuBar.height = 100;
			} else {
				res = 'hires';
				bb.menuBar.height = 140;
			}
			//screen.appendChild(menuBar);
			menuBar.setAttribute('class','bb-bb10-menu-bar-'+res+' bb-bb10-menu-bar-'+bb.actionBar.color);
			items = menuBar.querySelectorAll('[data-bb-type=menu-item]');
			for (i = 0; i < items.length; i++) {
				item = items[i];
				type = item.hasAttribute('data-bb-type') ? item.getAttribute('data-bb-type').toLowerCase() : undefined;
				// Get our menu items
				if (type == 'menu-item') {
					caption = item.innerHTML;
					imgPath = item.getAttribute('data-bb-img');
					// If the item doesn't have both an image and text then remove it
					if ((caption && imgPath) && (foundItems.length < 5)) {
						// BB10 menus only allow 5 items max
						foundItems.push(item);
						// Set our item information
						item.setAttribute('class','bb-bb10-menu-bar-item-'+res);
						item.innerHTML = '';
						// Add the image
						img = document.createElement('img');
						img.setAttribute('src',imgPath);
						item.appendChild(img);
						// Add the caption
						div = document.createElement('div');
						div.setAttribute('class','bb-bb10-menu-bar-item-caption-'+res);
						div.innerHTML = caption;
						item.appendChild(div);
					} else {
						item.style.display = 'none';
					}
				} else {
					item.style.display = 'none';
				}
			}
			// Now apply the widths since we now know how many there are
			if (foundItems.length > 0) {
				width = Math.floor(100/foundItems.length);
				for (i = 0; i < foundItems.length;i++) {
					item = foundItems[i];
					if (i == foundItems.length -1) {
						item.style.width = width - 1 +'%';
						item.style.float = 'right';
					} else {
						item.style.width = width +'%';
					}				
				}	
			} else {
				menuBar.style.display = 'none';
				bb.menuBar.menu = null;
			}
			// Remove any separators
			if (bb.menuBar.menu) {
				items = menuBar.querySelectorAll('[data-bb-type=menu-separator]');
				for (i = 0; i < items.length; i++) {
					items[i].style.display = 'none';
				}
			}
			// Set the size of the menu bar and assign the lstener
			menuBar.style['-webkit-transform']	= 'translate(0,0)';
			menuBar.addEventListener('click', bb.menuBar.onMenuBarClicked, false);
			// Assign the menu
			bb.menuBar.menu	= menuBar;	
		} else {
			var pbMenu = document.createElement('div'), 
				items, 
				pbMenuInner, 
				j,
				item,
				img, 
				title, 
				div, 
				br, 
				pbMenuItem;
			pbMenu.setAttribute('class','pb-menu-bar');
			// See if there are any items declared
			items = menuBar.getElementsByTagName('div');
			if(items.length > 0){
				pbMenuInner	= document.createElement("ul");
				pbMenu.appendChild(pbMenuInner);				
				// Loop through our menu items
				for (j = 0; j < items.length; j++) {
					item = items[j];
					if(item.getAttribute('data-bb-type') === "menu-item"){
						// Assign our values
						title = item.innerHTML
						iconPath = item.getAttribute('data-bb-img');

						// If they don't hav both an icon and a title ignore the item
						if (title && iconPath) {
							// Create our item
							pbMenuItem = document.createElement("li");
							item.innerHTML = '';
							
							// Get our image
							img	= new Image();
							img.src	= iconPath;
							pbMenuItem.appendChild(img);
								
							// Add our caption
							div = document.createElement('div');
							div.setAttribute('class','pb-menu-bar-caption');
							div.innerText = title;
							pbMenuItem.appendChild(div);
							
							// Assign any click handlers
							pbMenuItem.onclick	= item.onclick;
							pbMenuInner.appendChild(pbMenuItem);
						}
					} else if(item.getAttribute('data-bb-type') === "menu-separator"){
						pbMenuInner	= document.createElement('ul');
						pbMenu.appendChild(pbMenuInner);
					} else{
						console.log('invalid menu item type');
					}
					
				}
				
			}
			// Set the size of the menu bar and assign the lstener
			pbMenu.style['-webkit-transform']	= 'translate(0,0)';
			pbMenu.addEventListener('click', bb.menuBar.onMenuBarClicked, false);
			document.body.appendChild(pbMenu);
			// Assign the menu
			bb.menuBar.menu	= pbMenu;	
		}
		
		// Add the overlay for trapping clicks on items below
		if (!bb.screen.overlay) {
			bb.screen.overlay = document.createElement('div');
			bb.screen.overlay.setAttribute('class','bb-bb10-context-menu-overlay');
			screen.appendChild(bb.screen.overlay);
			bb.menuBar.menu.overlay = bb.screen.overlay;	
		}
	},

	showMenuBar: function(){
		if(!bb.menuBar.menuOpen){
			bb.menuBar.menu.overlay.style.display = 'inline';
			blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);
			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate(0, ' + (bb.menuBar.height + 3) + 'px)';
			bb.menuBar.menuOpen = true;
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.menuOpen){
			bb.menuBar.menu.overlay.style.display = 'none';
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate(0, -' + (bb.menuBar.height + 3) + 'px)';
			bb.menuBar.menuOpen = false;
		}
	},

	globalClickHandler: function(){
		if (bb.menuBar.menuOpen && !bb.menuBar.activeClick && !bb.menuBar.ignoreClick) {
			bb.menuBar.hideMenuBar();
		}
		bb.menuBar.activeClick = false;
		bb.menuBar.ignoreClick = false;
	},

	onMenuBarClicked: function () {
		bb.menuBar.activeClick = true;
		bb.menuBar.hideMenuBar();
	},

	clearMenu: function(){
		if(window.blackberry){
			if(bb.menuBar.menu && (bb.device.isPlayBook || bb.device.isBB10) && blackberry.app.event){
				blackberry.app.event.onSwipeDown('');
				document.removeEventListener("click", bb.menuBar.globalClickHandler, false);
				bb.menuBar.menu.parentNode.removeChild(bb.menuBar.menu);
				bb.menuBar.menu = false;
			}else if(blackberry.ui && blackberry.ui.menu){
				blackberry.ui.menu.clearMenuItems();
			}
		}
	}
};