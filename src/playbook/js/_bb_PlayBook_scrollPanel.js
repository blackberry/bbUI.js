_bb_PlayBook_scrollPanel = {
	apply: function(elements) {
		var i,j,
			outerElement,
			childNode,
			scrollArea,
			tempHolder;
		
		for (i = 0; i < elements.length; i++) {
			outerElement = elements[i];
			tempHolder = [];			
			// Inner Scroll Area
			scrollArea = document.createElement('div');
			outerElement.appendChild(scrollArea); 
			
			// Copy all nodes in the screen that are not the action bar
			for (j = 0; j < outerElement.childNodes.length - 1; j++) {
				tempHolder.push(outerElement.childNodes[j]);
			}
			// Add them into the scrollable area
			for (j = 0; j < tempHolder.length; j++) {
				scrollArea.appendChild(tempHolder[j]);
			}

			outerElement.scroller = new iScroll(outerElement, {vScrollbar: true,hideScrollbar:true,fadeScrollbar:true,
								onBeforeScrollStart: function (e) {
									if (bb.scroller) {
										bb.scroller.disable();
									}
									e.preventDefault();
								}, 
								onBeforeScrollEnd: function(e) {
									if (bb.scroller) {
										bb.scroller.enable();
									}
								},
								onScrollEnd : function(e) {
									// Raise an internal event to let the rest of the framework know that content is scrolling
									evt = document.createEvent('Events');
									evt.initEvent('bbuiscrolling', true, true);
									document.dispatchEvent(evt);
								},
								onScrollMove: function(e) {
									if (outerElement.onscroll) {
										outerElement.onscroll(e);
									}
									// Raise an internal event to let the rest of the framework know that content is scrolling
									evt = document.createEvent('Events');
									evt.initEvent('bbuiscrolling', true, true);
									document.dispatchEvent(evt);
								}
								});
			
			
			// Add show function
			outerElement.show = function() {
				this.style.display = 'block';
				bb.refresh();
				};
			outerElement.show = outerElement.show.bind(outerElement);

			// Add hide function
			outerElement.hide = function() {
				this.style.display = 'none';
				bb.refresh();
				};
			outerElement.hide = outerElement.hide.bind(outerElement);
	
			// Add remove function
			outerElement.remove = function() {
				this.parentNode.removeChild(this);
				bb.refresh();
				};
			outerElement.remove = outerElement.remove.bind(outerElement);
			
			// Set refresh
			outerElement.refresh = function() {
					this.scroller.refresh();
				};
			outerElement.refresh = outerElement.refresh.bind(outerElement);
			setTimeout(outerElement.refresh,0);
			// Set ScrollTo
			outerElement.scrollTo = function(x, y) {
					this.scroller.scrollTo(x, y);
				};
			outerElement.scrollTo = outerElement.scrollTo.bind(outerElement);
			// Set ScrollToElement
			outerElement.scrollToElement = function(element) {
					this.scroller.scrollToElement(element);
				};
			outerElement.scrollToElement = outerElement.scrollToElement.bind(outerElement);
			outerElement.setAttribute('class','bb-scroll-panel');
		}
	}	
};