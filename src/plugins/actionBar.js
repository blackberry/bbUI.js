// Apply styling to an action bar
bb.actionBar = {

  color: '',

  apply: function(actionBar, screen) {

    actionBar.tabs = [];
    var actions = actionBar.querySelectorAll('[data-bb-type=action]'),
      action,
      caption,
      style,
      lastStyle,
      tabStyle,
      backBtn,
      actionContainer = actionBar,
      btnWidth,
      limit = actions.length,
      res,
      icon,
      color = bb.actionBar.color,
      j,
      firstTab = true;

    // Find our resolution
    if (bb.device.isPlayBook) {
      res = 'lowres';
    } else {
      res = 'hires';
    }

    actionBar.setAttribute('class','bb-bb10-action-bar-'+res+' bb-bb10-action-bar-' + bb.actionBar.color);

    // Create the back button if it has one and there are no tabs in the action bar
    if (actionBar.hasAttribute('data-bb-back-caption') && actionBar.querySelectorAll('[data-bb-style=tab]').length == 0) {
      backBtn = document.createElement('div');
      backBtn.innerHTML = actionBar.getAttribute('data-bb-back-caption');
      backBtn.setAttribute('class','bb-bb10-action-bar-back-button-'+res+' bb-bb10-action-bar-back-button-'+res+'-' + color);
      backBtn.onclick = bb.popScreen;
      // Set tab coloring
      backBtn.normal = 'bb-bb10-action-bar-tab-normal-'+color;
      backBtn.highlight = 'bb-bb10-action-bar-tab-selected-'+color;
      actionBar.backBtn = backBtn;
      // Create a table to hold the back button and our actions
      var table = document.createElement('table'),
        tr = document.createElement('tr'),
        td = document.createElement('td');
      actionBar.appendChild(table);
      table.appendChild(tr);
      table.setAttribute('class','bb-bb10-action-bar-table');
      // Create the container for the back button
      if (bb.device.isPlayBook) {
        td.style.width = '86px';
      } else {
        td.style.width = '178px';
      }
      tr.appendChild(td);
      td.appendChild(backBtn);
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
      limit++;
    }

    // If we have more than 5 items in the action bar we need to show the more menu button
    if (limit > 5) {
      actionBar.menu = bb.contextMenu.create(screen);
      actionBar.appendChild(actionBar.menu);
      // Create our action bar overflow button
      action = document.createElement('div');
      action.setAttribute('data-bb-type','action');
      action.setAttribute('data-bb-style','button');

      if (res == 'lowres') {
        action.setAttribute('data-bb-img','overflow');
      } else {
        action.setAttribute('data-bb-img','overflow');
      }

      action.onclick = actionBar.menu.show;
      if (backBtn) {
        actionContainer.insertBefore(action,actions[3]);
      } else {
        actionContainer.insertBefore(action,actions[4]);
      }
      // Refresh our list of actions
      actions = actionBar.querySelectorAll('[data-bb-type=action]');
    }

    // Find out what kind of tab style is desired
    if (actionBar.hasAttribute('data-bb-tab-style')) {
      if (actionBar.getAttribute('data-bb-tab-style').toLowerCase() == 'indent') {
        tabStyle = 'indent';
      } else {
        tabStyle = 'highlight';
      }
      actionBar.tabStyle = tabStyle;
    }

    // Calculate action widths
    if (backBtn) {
      if (actions.length < 5) {
      btnWidth = Math.floor(100/actions.length);
      } else {
        btnWidth = Math.floor(100/4);
      }
    } else {
      if (actions.length < 6) {
        btnWidth = Math.floor(100/actions.length);
      } else {
        btnWidth = Math.floor(100/5);
      }
    }

    // Grab all the actions that are defined
    for (j = 0; j < actions.length; j++) {
      action = actions[j];
      action.res = res;
      caption = action.innerHTML;

      if ((backBtn && j > 3) || j > 4) {
        actionBar.menu.add(action);
      } else {
        // apply our button styling
        if (action.hasAttribute('data-bb-style')) {
          // Set our button widths taking into account the last button float
          if ((backBtn && j > 2) || (j > 3) || (j == actions.length -1)) {
            action.style.width =  btnWidth - 1 + '%';
            action.style.float = 'right';
          } else {
            action.style.width =  btnWidth + '%';
          }
          style = action.getAttribute('data-bb-style').toLowerCase();
          if (style == 'button') {
            // See if the last action was a tab
            if (lastStyle == 'tab') {
              action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-button-'+color+' bb-bb10-action-bar-button-tab-left-'+res+'-'+color;
            } else {
              action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-button-'+color;
            }
            action.innerHTML = '';
            action.setAttribute('class',action.normal);
            // Add the icon
            icon = document.createElement('img');
            if (action.getAttribute('data-bb-img') == 'overflow') {
              // Set our transparent pixel
              icon.setAttribute('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'+
                          '/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wEFxQXKc14qEQAAAAZdEVYdENv'+
                          'bW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADUlEQVQI12NgYGBgAAAABQABXvMqOgAAAABJ'+
                          'RU5ErkJggg==');
              icon.setAttribute('class','bb-bb10-action-bar-icon-'+res+' bb-bb10-action-bar-overflow-button-'+res+'-'+color);
            } else {
              icon.setAttribute('src',action.getAttribute('data-bb-img'));
              icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
            }
            action.appendChild(icon);


            /*icon = document.createElement('img');
            icon.setAttribute('src',action.getAttribute('data-bb-img'));
            icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
            action.appendChild(icon);*/
            // Set our caption
            var display = document.createElement('div');
            display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
            display.innerHTML = caption;
            action.appendChild(display);
          }
          else if (style=='tab') {
            action.actionBar = actionBar;
            // Apply our highlight tab styling
            if (tabStyle == 'highlight') {
              actionBar.tabs.push(action);
              action.innerHTML = '';
              action.normal = 'bb-bb10-action-bar-action-'+res+' bb-bb10-action-bar-tab-'+color+' bb-bb10-action-bar-tab-normal-'+color;
              action.highlight = action.normal + ' bb-bb10-action-bar-tab-selected-'+color;
              action.setAttribute('class',action.normal);
              if (firstTab && actionBar.backBtn) {
                actionBar.backBtn.parentNode.setAttribute('class',actionBar.backBtn.normal);
              }
              if (action.hasAttribute('data-bb-selected') && (action.getAttribute('data-bb-selected').toLowerCase() == 'true')) {
                bb.actionBar.highlightAction(action);
                if (firstTab && actionBar.backBtn) {
                  actionBar.backBtn.parentNode.setAttribute('class',actionBar.backBtn.highlight);
                }
              }

              firstTab = false;
              // Add the icon
              icon = document.createElement('img');
              icon.setAttribute('src',action.getAttribute('data-bb-img'));
              icon.setAttribute('class','bb-bb10-action-bar-icon-'+res);
              action.appendChild(icon);
              // Set our caption
              var display = document.createElement('div');
              display.setAttribute('class','bb-bb10-action-bar-action-display-'+res);
              display.innerHTML = caption;
              action.appendChild(display);

              // Make the last tab have a smaller border
              if (j == actions.length-1) {
                action.style['border-right-width'] = '1px';
              }
            }
            // Add our click listener
            action.addEventListener('click',function (e) {
              var i,
                action,
                tabStyle = this.actionBar.tabStyle;
                tabs = this.actionBar.tabs,
                firstTab = false;

              for (i = 0; i < tabs.length; i++) {
                action = tabs[i];
                if (tabStyle == 'highlight') {
                  if (action == this) {
                    bb.actionBar.highlightAction(action);
                    firstTab = (i == 0);
                  } else {
                    bb.actionBar.unhighlightAction(action);
                  }
                }
                // Set our back button highlighting
                if (firstTab && actionBar.backBtn) {
                  actionBar.backBtn.parentNode.setAttribute('class',actionBar.backBtn.highlight);
                } else if (actionBar.backBtn){
                  actionBar.backBtn.parentNode.setAttribute('class',actionBar.backBtn.normal);
                }

              }

            },false);
          }
          lastStyle = style;
        }
      }
    }
    // Set the proper header height
  /*  if (actionBar.menu) {
      actionBar.menu.setHeaderHeight();
    }*/
  },

  // Apply the proper highlighting for the action
  highlightAction: function (action) {
    action.style['border-top-color'] = bb.options.bb10HighlightColor;
    action.setAttribute('class',action.highlight);
  },

  // Apply the proper styling for an action that is no longer highlighted
  unhighlightAction: function(action) {
    action.style['border-top-color'] = '';
    action.setAttribute('class',action.normal);
  }
};
