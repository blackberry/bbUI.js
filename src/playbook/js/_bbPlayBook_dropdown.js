_bbPlayBook_dropdown = { 
    // Style a list of items
	apply: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			bb.dropdown.style(elements[i]);
		}
	},
	// Style an individual item
	style: function(select) {
		var options = select.getElementsByTagName('option'),
			caption = '',
			inEvent = 'ontouchstart',
			outEvent = 'ontouchend',
			enabled = !select.hasAttribute('disabled');
	
		select.style.display = 'none';
		select.stretch = false;
		select.enabled = enabled;
		
		// Get our selected item
		if (options.length > 0) {
			caption = options[0].innerHTML;
		}
		for (var j = 0; j < options.length; j++) {
			if (options[j].hasAttribute('selected')) {
				caption = options[j].innerHTML;
				break;
			}
		}

		// Create our new dropdown button
		var dropdown = document.createElement('div');
		dropdown.innerHTML = '<div data-bb-type="caption"><span>' + caption + '</span></div>';
		select.dropdown = dropdown;

		var normal = 'pb-dropdown',
			highlight = 'pb-dropdown-highlight pb-dropdown';
	
		if (select.hasAttribute('data-bb-style')) {
			var style = select.getAttribute('data-bb-style');
			if (style == 'stretch') {
				select.stretch = true;
				normal = normal + ' dropdown-stretch';
				highlight = highlight + ' dropdown-stretch';
			}
		}
		dropdown.setAttribute('data-bb-type','dropdown');
		if (select.enabled) {
			dropdown.setAttribute('class',normal);
		} else {
			dropdown.setAttribute('class',normal + ' pb-dropdown-disabled');
		}
		dropdown.inEvent = "this.setAttribute('class','" + highlight +"')";
		dropdown.outEvent = "this.setAttribute('class','" + normal + "')"
		
		if (select.parentNode) {
			select.parentNode.insertBefore(dropdown, select);
		}
		dropdown.appendChild(select);

		// Set our click handler
		dropdown.doclick = function() {
				var select = this.getElementsByTagName('select')[0];

				// Create the overlay to trap clicks on the screen
				var overlay = document.createElement('div');
				overlay.setAttribute('id', 'ripple-dropdown-overlay');
				overlay.style['position'] = 'absolute';
				overlay.style['left'] = '0px';	
				overlay.style['top'] = document.body.scrollTop + 'px';
				overlay.style['width'] = '100%';
				overlay.style['height'] = '100%';
				overlay.style['z-index'] = '1000000';
				// Close the overlay if they click outside of the select box
				overlay.onclick = function () {
					if (this.parentNode !== null) {
						this.parentNode.removeChild(this);
					}
				};

				// Create our dialog
				var dialog = document.createElement('div');
				dialog.setAttribute('class', 'ripple-dropdown-dialog bb-hires-screen');
				overlay.appendChild(dialog);
				dialog.onclick = function() {
					this.parentNode.parentNode.removeChild(this.parentNode);
				};

				// Add our options
				for (var i = 0; i < select.options.length; i++) {
					var item = select.options[i],
						highlight = document.createElement('div');

					dialog.appendChild(highlight);
					var option = document.createElement('div');
					if (item.selected) {
						option.setAttribute('class', 'item selected');
						highlight.setAttribute('class','backgroundHighlight backgroundSelected');
					} else {
						option.setAttribute('class', 'item');
						highlight.setAttribute('class','backgroundHighlight');
					}

					option.innerHTML = '<span>' + item.text + '</span>';
					option.setAttribute('x-blackberry-focusable','true');
					option.setAttribute('data-bb-index', i);
					// Assign our dropdown for when the item is clicked
					option.dropdown = this;
					option.onclick = function() {
						var index = this.getAttribute('data-bb-index');
						// Retrieve our select
						var select = this.dropdown.getElementsByTagName('select')[0];
						if (select) {
							select.setSelectedItem(index);
						}
					};
					// Add to the DOM
					highlight.appendChild(option);
				}

				var height = (select.options.length * 45) + 20,
					maxHeight = window.innerHeight - 80;
				if (height > maxHeight) {
					height = maxHeight;
					dialog.style.height = maxHeight + 'px';
				}

				var top = (window.innerHeight/2) - (height/2);
				dialog.style.top = top + 'px';

				// Add the overlay to the DOM now that we are done
				document.body.appendChild(overlay);
			};
			
		// Enable the clicking of the control if it is enabled
		if (select.enabled) {
			dropdown.onclick = dropdown.doclick;
			dropdown.setAttribute(inEvent, dropdown.inEvent);
			dropdown.setAttribute(outEvent,dropdown.outEvent);
		}
		
		// Assign our setSelectedItem function
		select.setSelectedItem = function(index) {
			var select = this.dropdown.getElementsByTagName('select')[0];
			if (select && select.selectedIndex != index) {
				select.selectedIndex = index;
				// Change our button caption
				var caption = this.dropdown.querySelectorAll('[data-bb-type=caption]')[0];
				if (caption) {
					caption.innerHTML = '<span>' + select.options[index].text + '</span>';
				}
				// Raise the DOM event
				var evObj = document.createEvent('HTMLEvents');
				evObj.initEvent('change', false, true );
				select.dispatchEvent(evObj);
			}
		};
		
		// Assign our setSelectedText function
		select.setSelectedText = function(text) {
			for (var i = 0; i < this.options.length; i++) {
				if (this.options[i].text == text) {
					this.setSelectedItem(i);
					return;
				}
			}
		};
		select.setSelectedText = select.setSelectedText.bind(select);
		
		// Have this function so we can asynchronously fire the change event
		select.fireEvent = function() {
							// Raise the DOM event
							var evObj = document.createEvent('HTMLEvents');
							evObj.initEvent('change', false, true );
							this.dispatchEvent(evObj);
						};
		select.fireEvent = select.fireEvent.bind(select);
		
		// Assign our enable function
		select.enable = function(){ 
				if (this.enabled) return;
				this.dropdown.onclick = this.dropdown.doclick;
				this.dropdown.setAttribute(inEvent, dropdown.inEvent);
				this.dropdown.setAttribute(outEvent,dropdown.outEvent);
				this.dropdown.setAttribute('class',normal);
				this.removeAttribute('disabled');
				this.enabled = true;
			};
		select.enable = select.enable.bind(select);
		
		// Assign our disable function
		select.disable = function(){ 
				if (!select.enabled) return;
				//this.dropdown.internalHide();
				this.dropdown.onclick = null;
				this.dropdown.removeAttribute(inEvent);
				this.dropdown.removeAttribute(outEvent);
				this.dropdown.setAttribute('class',normal + ' pb-dropdown-disabled');
				this.enabled = false;
				this.setAttribute('disabled','disabled');
			};
		select.disable = select.disable.bind(select);
		
			
		// Assign our show function
		select.show = function(){ 
				this.dropdown.style.display = this.stretch ? 'block' : 'table-cell';
				bb.refresh();
			};
		select.show = select.show.bind(select);
		
		// Assign our hide function
		select.hide = function(){ 
				this.dropdown.style.display = 'none';
				bb.refresh();
			};
		select.hide = select.hide.bind(select);	
		
		// Assign our remove function
		select.remove = function(){ 
				this.dropdown.parentNode.removeChild(this.dropdown);
				bb.refresh();
			};
		select.remove = select.remove.bind(select);
		
		// Assign our refresh function
		select.refresh = function(){ 
				var options = this.getElementsByTagName('option'),
					captionElement,
					caption = '';
					
				if (options.length > 0) {
					caption = options[0].innerHTML;
				}
				for (var j = 0; j < options.length; j++) {
					if (options[j].hasAttribute('selected')) {
						caption = options[j].innerHTML;
						break;
					}
				}
				// Change our button caption
				 captionElement = this.dropdown.querySelectorAll('[data-bb-type=caption]')[0];
				if (captionElement) {
					captionElement.innerHTML = '<span>' + caption + '</span>';
				}
			};
		select.refresh = select.refresh.bind(select);
	  
		// Assign our setCaption function
		select.setCaption = function(value){ 
				if (console) {
					console.log('WARNING: setCaption is not supported on BlackBerry 5/6/7/PlayBook');
				}
			};
		select.setCaption = select.setCaption.bind(select);

		// Need to return the dropdown instead of the select for dynamic styling
		return dropdown;
    }
};
