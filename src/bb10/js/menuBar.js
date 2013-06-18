bb.menuBar = {
	height: 140,
	itemWidth: 143,
	visible: false,
	menu: false,
	screen: false,

	apply: function(menuBar,screen){
		if (bb.device.isPlayBook || bb.device.isBB10) {
			bb.menuBar.createSwipeMenu(menuBar,screen);
			menuBar.parentNode.removeChild(menuBar);
			if (window.blackberry){
				if(bb.device.isPlayBook && blackberry.app.event) {
					blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
				}else if(bb.device.isBB10 && blackberry.app){
					blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
				}
			}
		}else{
			console.log('Unable to create Application/onSwipeDown menu.');
		}
	},
	
	createSwipeMenu: function(menuBar, screen){
		bb.menuBar.screen = screen;
		var bb10Menu = document.createElement('div'),
			maxItems = 5,
			i,
			len,
			type,
			item,
			pinLeft = false,
			pinRight = false,
			menuItems = [],
			img,
			imgPath,
			caption,
			div,
			width,
			margin,
			bb10MenuItem;

		// Set our 'res' for known resolutions, otherwise use the default
		if (bb.device.is1024x600) {
			bb.menuBar.height = 100;
			bb.menuBar.itemWidth = 96; 
		} else if (bb.device.is720x720) {
			bb.menuBar.height = 110;
			bb.menuBar.itemWidth = 143;
		} else {
			bb.menuBar.height = 140;
			bb.menuBar.itemWidth = 143;
		} 

		// Handle any press-and-hold events
		bb10Menu.oncontextmenu = function(contextEvent) {
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
		bb10Menu.oncontextmenu = bb10Menu.oncontextmenu.bind(bb10Menu);
		window.addEventListener('contextmenu', bb10Menu.oncontextmenu);
		bb.windowListeners.push({name: 'contextmenu', eventHandler: bb10Menu.oncontextmenu});
		
		bb10Menu.setAttribute('class','bb-menu-bar bb-menu-bar-dark');
		items = menuBar.querySelectorAll('[data-bb-type=menu-item]');
		if(items.length > 0){
			//pre-process and collect valid menu items + identify pinned items
			for(i = 0, len = items.length; i < items.length; i++){
				item = items[i];
				type = item.hasAttribute('data-bb-type') ? item.getAttribute('data-bb-type').toLowerCase() : undefined;
				// Get our menu items
				if (type == 'menu-item') {
					caption = item.innerHTML;
					imgPath = item.getAttribute('data-bb-img');
					if (caption && imgPath) {
						if(item.hasAttribute('data-bb-pin')){
							pinType = item.getAttribute('data-bb-pin').toLowerCase();
							if(pinType === 'left' && !pinLeft){
								pinLeft = item;
								maxItems--;
							} else if(pinType === 'right' && !pinRight){
								pinRight = item;
								maxItems--;
							} else {
								console.log('Unknown value from menu-item data-bb-pin: ' + pinType + ' or value already defined.');
								menuItems.push(item); //add to the regular menu array
							}
						} else {
							menuItems.push(item);
						}
					} else {
						console.log('missing menu item caption or image.');
					}
				} else {
					console.log('invalid menu item type for bb10');
				}
			}

			//trim down items if too many
			if(menuItems.length >= maxItems){
				menuItems = menuItems.slice(0, maxItems);
			}

			//add back left and right pinned items if they exist
			if(pinLeft){
				menuItems.unshift(pinLeft);
			}

			if(pinRight){
				menuItems.push(pinRight);
			}

			width = bb.menuBar.itemWidth + 'px';
			margin = Math.floor((window.innerWidth - (bb.menuBar.itemWidth  * menuItems.length)) / (menuItems.length-1)) + 'px';
			for (i = 0, len = menuItems.length; i < len; i++) {
				item = menuItems[i];
				caption = item.innerHTML;
				imgPath = item.getAttribute('data-bb-img');

				bb10MenuItem = document.createElement("div");
				// Set our item information
				bb10MenuItem.setAttribute('class','bb-menu-bar-item');
				item.innerHTML = '';
				// Add the image
				img = document.createElement('img');
				img.setAttribute('src',imgPath);
				bb10MenuItem.appendChild(img);
				// Add the caption
				div = document.createElement('div');
				div.setAttribute('class','bb-menu-bar-item-caption');
				div.innerHTML = caption;
				bb10MenuItem.appendChild(div);

				// Assign any click handlers
				bb10MenuItem.onclick	= item.onclick;
				//set menu item width
				bb10MenuItem.style.width = width;
				if ((i == menuItems.length - 1 && menuItems.length > 1 ) || (menuItems.length === 1 && !pinLeft))  {
					bb10MenuItem.style.marginRight = 0;
					bb10MenuItem.style.float = 'right';
				} else {
					bb10MenuItem.style.marginRight = margin;
				}
				bb10Menu.appendChild(bb10MenuItem);

				bb10MenuItem.ontouchstart = function() {
					this.style['border-top-color'] = bb.options.highlightColor;
				}
				bb10MenuItem.ontouchend = function() {
					this.style['border-top-color'] = 'transparent';
				}
			}
		} else {
			bb10Menu.style.display = 'none';
			bb.menuBar.menu = null;
		}

		// Set the size of the menu bar and assign the lstener
		bb10Menu.addEventListener('click', bb.menuBar.onMenuBarClicked, false);
		screen.parentNode.appendChild(bb10Menu);
		// Assign the menu
		bb.menuBar.menu	= bb10Menu;	
		bb.menuBar.menu.style['z-index'] = '-100';
		bb.menuBar.menu.style.display = 'none';
		bb.menuBar.menu.style.height = bb.menuBar.menu.height + 'px';

		bb.menuBar.menu.doOrientationChange = function() {
			var i, len,
				menuItems = bb.menuBar.menu.getElementsByClassName('bb-menu-bar-item'),
				margin = Math.floor((window.innerWidth - (bb.menuBar.itemWidth * menuItems.length)) / (menuItems.length-1)) + 'px';
			for(i = 0, len = menuItems.length; i < len; i++){
				if (i == menuItems.length - 1) {
					menuItems[i].style.marginRight = 0;
					menuItems[i].style.float = 'right';
				} else {
					menuItems[i].style.marginRight = margin;
				}
			}
		};
		
		bb.menuBar.menu.doOrientationChange = bb.menuBar.menu.doOrientationChange.bind(bb.menuBar);
		window.addEventListener('resize', bb.menuBar.menu.doOrientationChange,false); 
		bb.windowListeners.push({name: 'resize', eventHandler: bb.menuBar.menu.doOrientationChange});
	
		
		// Add the overlay for trapping clicks on items below
		if (!bb.screen.overlay) {
			bb.screen.overlay = document.createElement('div');
			bb.screen.overlay.setAttribute('class','bb-menu-bar-overlay');
		}
		screen.appendChild(bb.screen.overlay);
		bb.menuBar.menu.overlay = bb.screen.overlay;	
	},

	doEndTransition: function() {
		if (bb.menuBar.visible) {
			bb.menuBar.menu.style['z-index'] = '';
		} else {
			if(typeof bb.menuBar.menu.style !== "undefined"){ //bb.menuBar.menu.style is undefined when new screen is pushed from a menu item
				bb.menuBar.menu.style.display = 'none';
				bb.menuBar.menu.style.height = '0px';
			}
			bb.menuBar.screen.removeEventListener('webkitTransitionEnd',bb.menuBar.doEndTransition);
			bb.menuBar.screen.style['-webkit-transition'] = '';
			bb.menuBar.screen.style['-webkit-transform'] = '';
			bb.menuBar.screen.style['-webkit-backface-visibility'] = '';
		}
	},

	setDimensions: function() {
		bb.menuBar.menu.style.display = '';
		bb.menuBar.menu.style.height = bb.menuBar.height + 'px';
		// Set our screen's parent to have no overflow so the browser doesn't think it needs to scroll
		bb.menuBar.screen.parentNode.style.position = 'absolute';
		bb.menuBar.screen.parentNode.style.left = '0px';
		bb.menuBar.screen.parentNode.style.top = '0px';
		bb.menuBar.screen.parentNode.style.bottom = '0px';
		bb.menuBar.screen.parentNode.style.right = '0px';
		bb.menuBar.screen.parentNode.style.width = '100%';
		bb.menuBar.screen.parentNode.style['overflow'] = 'hidden';
		// Make our overlay visible
		bb.menuBar.menu.overlay.style.display = 'block';
		
		// Slide our screen
		bb.menuBar.screen.style['-webkit-transition'] = '0.2s ease-out';
		bb.menuBar.screen.style['-webkit-transform'] = 'translate3d(0px,' + bb.menuBar.height + 'px,0px)';
		bb.menuBar.screen.style['-webkit-backface-visibility'] = 'hidden';
	},

	showMenuBar: function(){
		if(!bb.menuBar.visible && !bb.screen.animating){
			bb.menuBar.visible = true;
			if(bb.device.isPlayBook){
				blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);
			}else if(bb.device.isBB10){
				blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
				blackberry.event.addEventListener("swipedown", bb.menuBar.hideMenuBar);
			}

			//Use the right transition
			if(bb.device.isBB10){
				bb.menuBar.screen.addEventListener('webkitTransitionEnd',bb.menuBar.doEndTransition);
				bb.menuBar.setDimensions();					
			}else if(bb.device.isPlayBook){
				bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
				bb.menuBar.menu.style['-webkit-transform'] = 'translate3d(0, ' + (bb.menuBar.height + 3) + 'px,0px)';
			}
			bb.menuBar.visible = true;
			bb.menuBar.menu.overlay.addEventListener('touchstart', bb.menuBar.overlayTouchHandler, false);
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.visible){
			bb.menuBar.visible = false;

			if(bb.device.isPlayBook){
				blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
			}else if(bb.device.isBB10){
					blackberry.event.removeEventListener("swipedown", bb.menuBar.hideMenuBar);
					blackberry.event.addEventListener("swipedown", bb.menuBar.showMenuBar);
			}
			//Use the right transition
			if(bb.device.isBB10){
				bb.menuBar.menu.style['z-index'] = '-100';
				bb.menuBar.screen.style['-webkit-transform'] = 'translate3d(0px,0px,0px)';
				bb.menuBar.menu.overlay.style.display = 'none';
			}else if(bb.device.isPlayBook){
				bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
				bb.menuBar.menu.style['-webkit-transform'] = 'translate3d(0, -' + (bb.menuBar.height + 3) + 'px,0px)';
			}
			bb.menuBar.menu.overlay.removeEventListener('touchstart', bb.menuBar.overlayTouchHandler, false);
		}
	},

	overlayTouchHandler: function(event){
		event.preventDefault();
		event.stopPropagation();
		bb.menuBar.hideMenuBar();
	},

	onMenuBarClicked: function () {
		bb.menuBar.hideMenuBar();
	},

	clearMenu: function(){
		if(window.blackberry){
			if(bb.menuBar.menu && (bb.device.isPlayBook || bb.device.isBB10)){
				if(bb.menuBar.visible){
					bb.menuBar.hideMenuBar();
				}
				if (bb.device.isPlayBook && blackberry.app.event) {
					blackberry.app.event.onSwipeDown('');
				}else if(bb.device.isBB10 && blackberry.app){
					blackberry.event.removeEventListener("swipedown", bb.menuBar.showMenuBar);
					blackberry.event.removeEventListener("swipedown", bb.menuBar.hideMenuBar);
				}
				bb.menuBar.menu.parentNode.removeChild(bb.menuBar.menu);
				bb.menuBar.menu = false;
				bb.menuBar.visible = false;
			}
		}
	}
};
