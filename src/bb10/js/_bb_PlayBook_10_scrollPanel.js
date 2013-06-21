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
			for (j = 0; j < tempHolder.length; j++) {
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
			} else {
				outerElement.scroller = null;
				outerElement.style['-webkit-overflow-scrolling'] = '-blackberry-touch';
				outerElement.addEventListener('scroll', function() {
						// Raise an internal event to let the rest of the framework know that content is scrolling
						evt = document.createEvent('Events');
						evt.initEvent('bbuiscrolling', true, true);
						document.dispatchEvent(evt);	

						/* This is a major hack to fix an issue in webkit where it doesn't always
						   understand when to re-paint the screen when scrolling a <div> with overflow
						   and using the inertial scrolling */
						if (this.timeout) {
							clearTimeout(this.timeout);
						} else {
							this.style['padding-right'] = '1px';
						}
						// Set our new timeout for resetting
						this.timeout = setTimeout(this.resetPadding,20);
						
						/* ************* END OF THE SCROLLING HACK *******************/
						
					},false);
					
				/* ********** PART OF THE SCROLLING HACK ************/
				outerElement.resetPadding = function() {
						this.style['padding-right'] = '0px';
						this.timeout = null;
					};
				outerElement.resetPadding = outerElement.resetPadding.bind(outerElement);
				/* ********** END OF THE SCROLLING HACK ************/
			}
			
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
						var offsetTop = 0,
							target = element;
						if (target.offsetParent) {
							do {
								offsetTop  += target.offsetTop;
							} while (target = target.offsetParent);
						}
						this.scrollTo(offsetTop,0);
					}
				};
			outerElement.scrollToElement = outerElement.scrollToElement.bind(outerElement);
			outerElement.setAttribute('class','bb-scroll-panel');
		}
	}	
};