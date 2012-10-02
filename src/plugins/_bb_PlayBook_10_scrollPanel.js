_bb_PlayBook_10_scrollPanel = {
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
			for (j = 0; j < tempHolder.length -1; j++) {
				scrollArea.appendChild(tempHolder[j]);
			}
			
			if (bb.device.isPlayBook) {
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
									onScrollMove: function(e) {
										if (outerElement.onscroll) {
											outerElement.onscroll(e);
										}
									}
									});
			} else {
				outerElement.scroller = null;
				outerElement.style['-webkit-overflow-scrolling'] = '-blackberry-touch';
			}
			
			// Set refresh
			outerElement.refresh = function() {
					if (this.scroller) {
						this.scroller.refresh();
					}
				};
			outerElement.refresh = outerElement.refresh.bind(outerElement);
			setTimeout(outerElement.refresh,0);
			// Set ScrollTo
			outerElement.scrollTo = function(x, y) {
					if (this.scroller) {
						this.scroller.scrollTo(x, y);
					} else {
						this.scrollTop = x;
					}
				};
			outerElement.scrollTo = outerElement.scrollTo.bind(outerElement);
			// Set ScrollToElement
			outerElement.scrollToElement = function(element) {
					if (this.scroller) {
						this.scroller.scrollToElement(element);
					} else {
						if (!element) return;
						this.scrollTo(element.offsetTop,0);
					}
				};
			outerElement.scrollToElement = outerElement.scrollToElement.bind(outerElement);
			outerElement.setAttribute('class','bb-scroll-panel');
		}
	}
	
};
