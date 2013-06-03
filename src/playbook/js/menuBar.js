bb.menuBar = {
	height: 100,
	itemWidth: 143,
	visible: false,
	menu: false,
	screen: false,

	apply: function(menuBar,screen){
		bb.menuBar.createSwipeMenu(menuBar,screen);
		menuBar.parentNode.removeChild(menuBar);
		if (window.blackberry){
			if(blackberry.app.event) {
				blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
			}
		}
		
	},

	createSwipeMenu: function(menuBar, screen){
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
		
		// Add the overlay for trapping clicks on items below
		if (!bb.screen.overlay) {
			bb.screen.overlay = document.createElement('div');
			bb.screen.overlay.setAttribute('class','bb-bb10-menu-bar-overlay');
		}
		screen.appendChild(bb.screen.overlay);
		bb.menuBar.menu.overlay = bb.screen.overlay;	
	},

	showMenuBar: function(){
		if(!bb.menuBar.visible && !bb.screen.animating){
			bb.menuBar.visible = true;
			blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);

			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate3d(0, ' + (bb.menuBar.height + 3) + 'px,0px)';

			bb.menuBar.visible = true;
			bb.menuBar.menu.overlay.addEventListener('touchstart', bb.menuBar.overlayTouchHandler, false);
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.visible){
			bb.menuBar.visible = false;
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);

			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate3d(0, -' + (bb.menuBar.height + 3) + 'px,0px)';

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
			if(bb.menuBar.menu){
				if(bb.menuBar.visible){
					bb.menuBar.hideMenuBar();
				}

				blackberry.app.event.onSwipeDown('');
				bb.menuBar.menu.parentNode.removeChild(bb.menuBar.menu);
				bb.menuBar.menu = false;
				bb.menuBar.visible = false;
			}
		}
	}
};
