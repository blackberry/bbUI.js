// BlackBerry 10 Context Menu
bb.contextMenu = {

  // Create an instance of the menu and pass it back to the caller
  create : function(screen) {
    var res,
      swipeThreshold;
    if (bb.device.isPlayBook) {
      res = 'lowres';
      swipeThreshold = 100;
    } else {
      res = 'hires';
      swipeThreshold = 300;
    }

    // Create the oveflow menu container
    var menu = document.createElement('div'),
      title = document.createElement('div'),
      description = document.createElement('div'),
      header;
    menu.setAttribute('class','bb-bb10-context-menu bb-bb10-context-menu-' + res + '-' + bb.actionBar.color);
    menu.actions = [];
    menu.res = res;
    // Add the overlay for trapping clicks on items below
    if (!bb.screen.overlay) {
      bb.screen.overlay = document.createElement('div');
      bb.screen.overlay.threshold = swipeThreshold;
      bb.screen.overlay.setAttribute('class','bb-bb10-context-menu-overlay');
      bb.screen.overlay.menu = menu;
      screen.appendChild(bb.screen.overlay);

      bb.screen.overlay.ontouchmove = function(event) {
                      // Only care about moves if peeking
                      if (!this.menu.peeking) return;
                      var touch = event.touches[0];
                      if (this.startPos && (this.startPos - touch.pageX > this.threshold)) {
                        this.menu.show();
                        this.closeMenu = false;
                      }
                    };
      bb.screen.overlay.ontouchend = function() {
                      if (this.closeMenu) {
                        this.menu.hide();
                      }
                    };
      bb.screen.overlay.ontouchstart = function(event) {
                        this.closeMenu = true;
                        if (!this.menu.peeking) return;

                        var touch = event.touches[0];
                        this.startPos = touch.pageX;
                        event.preventDefault();
                      };
    }
    menu.overlay = bb.screen.overlay;
    // Create the menu header
    header = document.createElement('div');
    header.setAttribute('class','bb-bb10-context-menu-item-'+res+' bb-bb10-context-menu-header-'+bb.actionBar.color);
    menu.header = header;
    menu.appendChild(header);

    // Create our title container
    title.setAttribute('class','bb-bb10-context-menu-header-title-'+res+' bb-bb10-context-menu-header-title-'+bb.actionBar.color);
    menu.topTitle = title;
    header.appendChild(title);

    // Create our description container
    description.setAttribute('class','bb-bb10-context-menu-header-description-'+res);
    menu.description = description;
    header.appendChild(description);

    // Set our first left position
    menu.style.left = bb.contextMenu.getLeft();

    // Display the menu
    menu.show = function(data){
            if (data) {
              if (data.title) {
                this.topTitle.innerHTML = data.title;
              }
              if (data.description) {
                this.description.innerHTML = data.description;
              }
              this.selected = data;
            }
            this.peeking = false;
            this.overlay.style.display = 'inline';
            this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
            this.style['-webkit-transform'] = 'translate(-' + bb.contextMenu.getWidth() + ', 0)';
            this.addEventListener("touchstart", this.touchHandler, false);
            // Remove the header click handling while peeking
            this.header.addEventListener("click", this.hide, false);
          };
    menu.show = menu.show.bind(menu);
    // Hide the menu
    menu.hide = function(){
            this.overlay.style.display = 'none';
            this.removeEventListener("touchstart", this.touchHandler, false);
            this.style['-webkit-transition'] = 'all 0.5s ease-in-out';
            this.style['-webkit-transform'] = 'translate(' + bb.contextMenu.getWidth() + ', 0px)';
            if (!this.peeking) {
              // Remove the header click handling
              this.header.removeEventListener("click", this.hide, false);
            }
            this.peeking = false;
          };
    menu.hide = menu.hide.bind(menu);
    // Peek the menu
    menu.peek = function(data){
            if (data) {
              if (data.title) {
                this.topTitle.innerHTML = data.title;
              }
              if (data.description) {
                this.description.innerHTML = data.description;
              }
              this.selected = data;
            }
            this.peeking = true;
            this.overlay.style.display = 'inline';
            this.style['-webkit-transition'] = 'all 0.3s ease-in-out';
            this.style['-webkit-transform'] = 'translate(-' + bb.contextMenu.getPeekWidth() + ', 0)';
            this.addEventListener("touchstart", this.touchHandler, false);
            // Remove the header click handling while peeking
            this.header.removeEventListener("click", this.hide, false);
          };
    menu.peek = menu.peek.bind(menu);

    // Trap the events
    menu.touchHandler = function(event) {
                if (this.peeking) {
                  if (event.target == this) {
                    event.preventDefault();
                    event.stopPropagation();
                  } else if (event.target.parentNode == this && event.target != this.header)  {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                } else {
                  if (event.target == this) {
                    this.hide();
                  }
                }
              };
    menu.touchHandler = menu.touchHandler.bind(menu);

    // Calculate the header bottom margin to center the items in the list
    menu.setHeaderHeight = function() {
                var windowHeight,
                  itemHeight,
                  margin;
                if (bb.device.isPlayBook) {
                  itemHeight = 53;
                  if (window.orientation == 0 || window.orientation == 180) {
                    windowHeight = 600;
                  } else if (window.orientation == -90 || window.orientation == 90) {
                    windowHeight = 1024;
                  }
                } else {
                  itemHeight = 111;
                  if (window.orientation == 0 || window.orientation == 180) {
                    windowHeight = 1280;
                  } else if (window.orientation == -90 || window.orientation == 90) {
                    windowHeight = 768;
                  }
                }
                margin = Math.floor(windowHeight/2) - Math.floor((this.actions.length * itemHeight)/2);
                this.header.style['margin-bottom'] = margin + 'px';
              };
    menu.setHeaderHeight = menu.setHeaderHeight.bind(menu);


    // Make sure we move when the orientation of the device changes
    menu.orientationChanged = function(event) {
                // Orientation is backwards between playbook and BB10 smartphones
                if (bb.device.isPlayBook) {
                  if (window.orientation == 0 || window.orientation == 180) {
                    this.style.left = '1027px';
                  } else if (window.orientation == -90 || window.orientation == 90) {
                    this.style.left = '603px';
                  }
                } else {
                  if (window.orientation == 0 || window.orientation == 180) {
                    this.style.left = '771px';
                  } else if (window.orientation == -90 || window.orientation == 90) {
                    this.style.left = '1283px';
                  }
                }
              };
    menu.orientationChanged = menu.orientationChanged.bind(menu);
    window.addEventListener('orientationchange', menu.orientationChanged,false);

    // Create our add item function
    menu.add = function(action) {
        var normal,
          highlight,
          caption = action.innerHTML;

        // set our styling
        normal = 'bb-bb10-context-menu-item-'+this.res+' bb-bb10-context-menu-item-'+this.res+'-' + bb.actionBar.color;
        highlight = normal + ' bb-bb10-context-menu-item-hover-'+this.res;
        this.appendChild(action);
        this.actions.push(action);
        action.normal = normal;
        action.highlight = highlight;
        // Set our inner information
        action.innerHTML = '';
        var inner = document.createElement('div'),
          img = document.createElement('img');
        img.setAttribute('src', action.getAttribute('data-bb-img'));
        img.setAttribute('class','bb-bb10-context-menu-item-image-'+this.res);
        action.appendChild(img);
        inner.setAttribute('class','bb-bb10-context-menu-item-inner-'+this.res);
        action.appendChild(inner);
        inner.innerHTML = caption;

        action.setAttribute('class',normal);
        action.ontouchstart = function () {
                    this.setAttribute('class',this.highlight);
                    this.setAttribute('style','border-left-color:'+ bb.options.bb10HighlightColor);
                  }
        action.ontouchend = function () {
                    this.setAttribute('class',this.normal);
                    this.setAttribute('style','');
                  }
        action.addEventListener("click", this.hide, false);
    };
    menu.add = menu.add.bind(menu);

    return menu;
  },

  // Calculate the proper width of the context menu
  getWidth : function() {
    if (bb.device.isPlayBook) {
      return '300px';
    } else {
      return '563px';
    }
  },

  // Calculate the proper width of the context menu when peeking
  getPeekWidth : function() {
    if (bb.device.isPlayBook) {
      return '55px';
    } else {
      return '121px';
    }
  },

  // Calculate the proper left of the context menu
  getLeft : function() {
    return window.innerWidth + 3 + 'px';
  }
};
