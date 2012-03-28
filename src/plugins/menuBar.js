bb.menuBar = {
	height: 100,
	activeClick: false,
	ignoreClick: false,
	menuOpen: false,
	menu: false,

	apply: function(menuBar){
		if (blackberry && blackberry.app.event && bb.device.isPlayBook()) {
			bb.menuBar.createSwipeMenu(menuBar);
			menuBar.parentNode.removeChild(menuBar);
			document.addEventListener("click", bb.menuBar.globalClickHandler, false);
			blackberry.app.event.onSwipeDown(bb.menuBar.showMenuBar);
		}else if(blackberry && blackberry.ui.menu){
			bb.menuBar.createBlackberryMenu(menuBar);
			menuBar.parentNode.removeChild(menuBar);
		}else{
			console.log('Unable to create Blackberry/onSwipeDown menu.');
		}
	},

	createBlackberryMenu: function(menuBar){
		var items, item, title;

		items = menuBar.getElementsByTagName('div');

		for (var j = 0; j < items.length; j++) {
			if(items[j].getAttribute('data-bb-type') === "menu-item"){
				title	= items[j].hasAttribute('data-bb-caption') ? items[j].getAttribute('data-bb-caption') : false;
				if(title){
					item	= new blackberry.ui.menu.MenuItem(false, j, title, items[j].onclick);
					blackberry.ui.menu.addMenuItem(item);
					if(items[j].hasAttribute('data-bb-selected') && items[j].getAttribute('data-bb-selected') === "true"){
						blackberry.ui.menu.setDefaultMenuItem(item);
					}
				}else{
					console.log("can't add menu item without data-bb-caption");
				}
			}else if(items[j].getAttribute('data-bb-type') === "menu-separator"){
				item = new blackberry.ui.menu.MenuItem(true, j);
				blackberry.ui.menu.addMenuItem(item);
			}else{
				console.log('invalid menu item type');
			}
		}
	},

	createSwipeMenu: function(menuBar){
		var pbMenu, items, pbMenuInner, top, style;

		pbMenu				= document.createElement("div");
		pbMenu.id			= 'pb-menu-bar';
		if(menuBar.hasAttribute('class')) {
			pbMenu.setAttribute('class', menuBar.getAttribute('class'));
		}
		style				= pbMenu.style;
		style.height		= bb.menuBar.height + 'px';
		style.top			= '-' + (bb.menuBar.height + 3) + 'px';
		pbMenu.style		= style;
		pbMenu.addEventListener("click", bb.menuBar.onMenuBarClicked, false);

		items				= menuBar.getElementsByTagName('div');
		if(items.length > 0){
			top						= parseInt(bb.menuBar.height / 9, 10);
			pbMenuInner				= document.createElement("ul");
			style					= pbMenuInner.style;
			style.top				= top +'px';
			pbMenuInner.style		= style;
			for (var j = 0; j < items.length; j++) {
				if(items[j].getAttribute('data-bb-type') === "menu-item"){
					var img, title, span, fontHeight, br, iconOnly;

					fontHeight			= parseInt(bb.menuBar.height /2.5, 10);

					var pbMenuItem		= document.createElement("li");
					if(items[j].hasAttribute('class')) {
						pbMenuItem.setAttribute('class', items[j].getAttribute('class'));
					}
					style				= pbMenuItem.style;
					style.padding		= parseInt(fontHeight/1.65, 10) + "px 12px";
					style.fontSize		= fontHeight + "px";
					pbMenuItem.style	= style;

					title				= items[j].hasAttribute('data-bb-caption') ? items[j].getAttribute('data-bb-caption') : '';
					iconPath			= items[j].hasAttribute('data-bb-img') ? items[j].getAttribute('data-bb-img') : '';
					iconOnly			= items[j].hasAttribute('data-bb-icon-only') ? items[j].getAttribute('data-bb-icon-only') : false;

					if(iconPath){
						style				= pbMenuItem.style;
						style.padding		= parseInt(fontHeight /4, 10) + "px 12px";
						pbMenuItem.style	= style;

						img					= new Image();
						img.src				= iconPath;
						style				= img.style;
						style.height		= parseInt(bb.menuBar.height * 0.6, 10) + "px";
						img.style			= style;
						pbMenuItem.appendChild(img);

						if(title && !iconOnly){
							br					= document.createElement("br");
							pbMenuItem.appendChild(br);
							style				= img.style;
							style.height		= parseInt(bb.menuBar.height * 0.45, 10) + "px";
							img.style			= style;
							style				= pbMenuItem.style;
							style.fontSize		= parseInt(fontHeight/2,10) +"px";
							pbMenuItem.style	= style;
						}
					}

					if(!iconOnly){
						span				= document.createElement("span");
						span.innerText		= title;
						pbMenuItem.appendChild(span);
					}

					pbMenuItem.onclick	= items[j].onclick;
					pbMenuInner.appendChild(pbMenuItem);
				}else if(items[j].getAttribute('data-bb-type') === "menu-separator"){
					pbMenu.appendChild(pbMenuInner);
					pbMenuInner	= document.createElement("ul")
					style					= pbMenuInner.style;
					style.top				= top +'px';
					pbMenuInner.style		= style;
				}else{
					console.log('invalid menu item type');
				}
			}
			pbMenu.appendChild(pbMenuInner);
		}
		document.body.appendChild(pbMenu);
		pbMenu.style['-webkit-transform']	= 'translate(0,0)';

		bb.menuBar.menu	= pbMenu;
	},

	showMenuBar: function(){
		if(!bb.menuBar.menuOpen){
			blackberry.app.event.onSwipeDown(bb.menuBar.hideMenuBar);
			bb.menuBar.menu.style['-webkit-transition'] = 'all 0.5s ease-in-out';
			bb.menuBar.menu.style['-webkit-transform'] = 'translate(0, ' + (bb.menuBar.height + 3) + 'px)';

			bb.menuBar.menuOpen = true;
		}
	},

	hideMenuBar: function(){
		if(bb.menuBar.menuOpen){
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
	},

	clearMenu: function(){
		if(blackberry){
			if(blackberry.app.event && bb.menuBar.menu && bb.device.isPlayBook()){
				blackberry.app.event.onSwipeDown('');
				document.removeEventListener("click", bb.menuBar.globalClickHandler, false);
				bb.menuBar.menu.parentNode.removeChild(bb.menuBar.menu);
				bb.menuBar.menu = false;
			}else if(blackberry.ui.menu){
				blackberry.ui.menu.clearMenuItems();
			}
		}
	}
};
