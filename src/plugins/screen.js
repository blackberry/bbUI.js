bb.screen = {  
    scriptCounter:  0,
    totalScripts: 0,
    
    apply: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            var outerElement = elements[i];
            if (bb.device.isHiRes()) {
                outerElement.setAttribute('class', 'bb-hires-screen');
            }
			
			//check to see if a menu/menuBar needs to be created
			var menuBar = outerElement.querySelectorAll('[data-bb-type=menu]');
			if (menuBar.length > 0) {
				menuBar = menuBar[0];
				bb.menuBar.apply(menuBar);
			}
            
            if (bb.device.isPlayBook()) {
                outerElement.style.height = window.innerHeight;
                outerElement.style.width = window.innerWidth;
                outerElement.style.overflow = 'auto';
                
                var titleBar = outerElement.querySelectorAll('[data-bb-type=title]');
                if (titleBar.length > 0) {
                    titleBar = titleBar[0]; }
				else {
					titleBar = null;
				}
				
				// Create our scrollable <div>
				var outerScrollArea = document.createElement('div'); 
				var outerScrollArea = document.createElement('div');
				outerElement.appendChild(outerScrollArea);
				// Turn off scrolling effects if they don't want them
				if (!outerElement.hasAttribute('data-bb-scroll-effect') || outerElement.getAttribute('data-bb-scroll-effect').toLowerCase() != 'off') {
					outerScrollArea.setAttribute('id','bbUIscrollWrapper'); 
				}
				// Inner Scroll Area
				var scrollArea = document.createElement('div');
				outerScrollArea.appendChild(scrollArea); 
				
				
				// Copy all nodes that are not the title bar
				var tempHolder = [],
					childNode = null, 
					j;
				for (j = 0; j < outerElement.childNodes.length - 1; j++) {
					childNode = outerElement.childNodes[j];
					if (childNode != titleBar) {
						tempHolder.push(childNode);
					}
				}
				// Add them into the scrollable area
				for (j = 0; j < tempHolder.length -1; j++) {
					scrollArea.appendChild(tempHolder[j]);
				}
                   
				if (titleBar) {
					outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:55px;left:0px;right:0px;');
					
                    titleBar.setAttribute('class', 'pb-title-bar');
                    titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
                    if (titleBar.hasAttribute('data-bb-back-caption')) {
                        var button = document.createElement('div'), 
                            buttonInner = document.createElement('div');
                        button.setAttribute('class', 'pb-title-bar-back');
                        button.onclick = bb.popScreen;
                        buttonInner.setAttribute('class','pb-title-bar-back-inner');
                        buttonInner.innerHTML = titleBar.getAttribute('data-bb-back-caption'); 
                        button.appendChild(buttonInner);
                        titleBar.appendChild(button);
                    }
                }
				else {
					outerScrollArea.setAttribute('style','overflow:auto;bottom:0px;position:absolute;top:0px;left:0px;right:0px;');
				}
            }
            else {
                // See if there is a title bar
                var titleBar = outerElement.querySelectorAll('[data-bb-type=title]');
                if (titleBar.length > 0) {
                    titleBar = titleBar[0];
                    if (titleBar.hasAttribute('data-bb-caption')) {
                        var outerStyle = outerElement.getAttribute('style');
                        if (bb.device.isHiRes()) {
                            titleBar.setAttribute('class', 'bb-hires-screen-title');
                            outerElement.setAttribute('style', outerStyle + ';padding-top:33px');
                        } else {
                            titleBar.setAttribute('class', 'bb-lowres-screen-title');
                            outerElement.setAttribute('style', outerStyle + ';padding-top:27px');
                        }
                        titleBar.innerHTML = titleBar.getAttribute('data-bb-caption');
                    }
                }
            }
        }
    },
    
    fadeIn: function (params) {
        // set default values
        var r = 0,
            duration = 1,
            iteration = 1,
            timing = 'ease-out';

        if (document.getElementById(params.id)) {
            var elem = document.getElementById(params.id),
                s = elem.style;

            if (params.random) {
                r = Math.random() * (params.random / 50) - params.random / 100;
            }

            if (params.duration) {
                duration = parseFloat(params.duration) + parseFloat(params.duration) * r;
                duration = Math.round(duration * 1000) / 1000;
            }

            if (params.iteration) {
                iteration = params.iteration;
            }

            if (params.timing) {
                timing = params.timing;
            }

            s['-webkit-animation-name']            = 'bbUI-fade-in';
            s['-webkit-animation-duration']        = duration + 's';
            s['-webkit-animation-timing-function'] = timing;
        }
        else {
            console.warn('Could not access ' + params.id);
        }
    },
    
    applyEffect: function(id, container) {
        // see if there is a display effect
        if (!bb.device.isBB5()) {
            var screen = container.querySelectorAll('[data-bb-type=screen]');
            if (screen.length > 0 ) {
                screen = screen[0];
                var effect = screen.getAttribute('data-bb-effect');
                if (effect && effect.toLowerCase() == 'fade') {
                    if (bb.device.isBB6()) {
                    // On BB6 Fade doesn't work well when input controls are on the screen
                    // so we disable the fade effect for the sake of performance
                    var inputControls = container.querySelectorAll('input');
                    if (inputControls.length === 0) {
                        bb.screen.fadeIn({'id': id, 'duration': 1.0});
                    }
                    } else {
                    bb.screen.fadeIn({'id': id, 'duration': 1.0});
                    }
                }
            }
        }
    },
    
    reAdjustHeight: function() {
        // perform device specific formatting
        if (bb.device.isBB5()) {
            document.body.style.height = screen.height - 27 + 'px';
        }
        else if (bb.device.isBB6()) {
            document.body.style.height = screen.height - 17 + 'px';
        }
        else if (bb.device.isBB7() && (navigator.appVersion.indexOf('Ripple') < 0)) {
            document.body.style.height = screen.height + 'px';
        }
    }
};