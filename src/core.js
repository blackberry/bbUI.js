bb = {
    screens: [],

    // Assign any listeners we need to make the bbUI framework function
    assignBackHandler: function(callback) {
        if (blackberry.system.event.onHardwareKey) {
            blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, callback);
        }
    },

    doLoad: function(element) {
        // Apply our styling
        var root = element || document.body;

        bb.screen.apply(root.querySelectorAll('[data-bb-type=screen]'));
        bb.textInput.apply(root.querySelectorAll('input[type=text]'));
        bb.dropdown.apply(root.querySelectorAll('select'));
        bb.roundPanel.apply(root.querySelectorAll('[data-bb-type=round-panel]'));
        bb.textArrowList.apply(root.querySelectorAll('[data-bb-type=text-arrow-list]'));
        bb.imageList.apply(root.querySelectorAll('[data-bb-type=image-list]'));
        bb.tallList.apply(root.querySelectorAll('[data-bb-type=tall-list]'));
        bb.inboxList.apply(root.querySelectorAll('[data-bb-type=inbox-list]'));
        bb.bbmBubble.apply(root.querySelectorAll('[data-bb-type=bbm-bubble]'));
        bb.pillButtons.apply(root.querySelectorAll('[data-bb-type=pill-buttons]'));
        bb.labelControlContainers.apply(root.querySelectorAll('[data-bb-type=label-control-container]'));
        bb.button.apply(root.querySelectorAll('[data-bb-type=button]'));

        // perform device specific formatting
        bb.screen.reAdjustHeight();
    },

    device: {
        isHiRes: window.innerHeight > 480 || window.innerWidth > 480,

        // Determine if this browser is BB5
        isBB5: function() {
            return navigator.appVersion.indexOf('5.0.0') >= 0;
        },

        // Determine if this browser is BB6
        isBB6: function() {
            return navigator.appVersion.indexOf('6.0.0') >= 0;
        },

        // Determine if this browser is BB7.. Ripple's Render is similar to that in BB7
        isBB7: function() {
            return (navigator.appVersion.indexOf('7.0.0') >= 0) || (navigator.appVersion.indexOf('7.1.0') >= 0) || isRipple();
        },

        isPlayBook: function() {
            return (navigator.appVersion.indexOf('PlayBook') >= 0) || ((window.innerWidth == 1024 && window.innerHeight == 600) || (window.innerWidth == 600 && window.innerHeight == 1024));
        },

        isRipple: function() {
            return (navigator.appVersion.indexOf('Ripple') >= 0);
        },

        // Determines if this device supports touch
        isTouch: function() {
            return true;
        }
    },

    loadScreen: function(url, id) {
        // Retrieve the screen contents
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET",url,false);
        xmlhttp.send();
        // generate our screen content
        var newScreen = xmlhttp.responseText,
            container = document.createElement('div');
        container.setAttribute('id', id);
        container.innerHTML = newScreen;

        // Add any Java Script files that need to be included
        var scriptIds = [],
            scripts = container.getElementsByTagName('script'),
            newScriptTags = [];
        container.scriptIds = scriptIds;
        for (var i = 0; i < scripts.length; i++) {
            var bbScript = scripts[i],
                scriptTag = document.createElement('script');
            scriptIds.push({'id' : bbScript.getAttribute('id'), 'onunload': bbScript.getAttribute('onunload')});
            scriptTag.setAttribute('type','text/javascript');
            scriptTag.setAttribute('src', bbScript.getAttribute('src'));
            scriptTag.setAttribute('id', bbScript.getAttribute('id'));
            newScriptTags.push(scriptTag);
            // Remove script tag from container because we are going to add it to <head>
            bbScript.parentNode.removeChild(bbScript);
        }

        // Add getElementById for the container so that it can be used in the onscreenready event
        container.getElementById = function(id, node) {
                var result = null;
                if (!node) {
                    node = this;
                }

                if ( node.getAttribute('id') == id )
                    return node;

                for ( var i = 0; i < node.childNodes.length; i++ ) {
                    var child = node.childNodes[i];
                    if ( child.nodeType == 1 ) {
                        result = this.getElementById( id, child );
                        if (result)
                            break;
                    }
                }
                return result;
            };

        // Special handling for inserting script tags
        bb.screen.scriptCounter = 0;
        bb.screen.totalScripts = newScriptTags.length;
        for (var i = 0; i < newScriptTags.length; i++) {
            var head = document.getElementsByTagName('head');
            if (head.length > 0 ) {
                head[0].appendChild(newScriptTags[i]);
                newScriptTags[i].onload = function() {
                    bb.screen.scriptCounter++;
                    if(bb.screen.scriptCounter == bb.screen.totalScripts) {
                        // When we have scripts we fire the onscreenready and then apply our changes in doLoad()
                        if (bb.onscreenready) {
                            bb.onscreenready(container, container.getAttribute('id'));
                        }
                        bb.doLoad(container);
                        // Load in the new content
                        document.body.appendChild(container);
                        window.scroll(0,0);
                        bb.screen.applyEffect(id, container);
                    }
                };
            }
        }

        // In case there are no scripts at all we simply doLoad() now
        if(bb.screen.totalScripts === 0) {
            if (bb.onscreenready) {
                bb.onscreenready(container, container.getAttribute('id'));
            }
            bb.doLoad(container);
            // Load in the new content
            document.body.appendChild(container);
            window.scroll(0,0);
            bb.screen.applyEffect(id, container);
        }
        return container;
    },


    // Add a new screen to the stack
    pushScreen : function (url, id) {

        // Remove our old screen
        bb.removeLoadedScripts();
        var numItems = bb.screens.length;
        if (numItems > 0) {
            var oldScreen = document.getElementById(bb.screens[numItems -1].id);
            document.body.removeChild(oldScreen);
        }

        // Add our screen to the stack
        var container = bb.loadScreen(url, id);
        bb.screens.push({'id' : id, 'url' : url, 'scripts' : container.scriptIds});
    },

    // Pop a screen from the stack
    popScreen: function() {

        var numItems = bb.screens.length;
        if (numItems > 1) {
            bb.removeLoadedScripts();
            var currentStackItem = bb.screens[numItems-1],
                current = document.getElementById(currentStackItem.id);
            document.body.removeChild(current);
            bb.screens.pop();

            // Retrieve our new screen
            var display = bb.screens[numItems-2],
                container = bb.loadScreen(display.url, display.id);

            window.scroll(0,0);
            bb.screen.applyEffect(display.id, container);

        } else {
            if (blackberry) {
                blackberry.app.exit();
            }
        }
    },

    removeLoadedScripts: function() {
        // pop the old item
        var numItems = bb.screens.length;
        if (numItems > 0) {
            var currentStackItem = bb.screens[numItems-1],
                current = document.getElementById(currentStackItem.id);

            // Remove any JavaScript files
            for (var i = 0; i < currentStackItem.scripts.length; i++) {
                var bbScript = currentStackItem.scripts[i],
                    scriptTag = document.getElementById(bbScript.id),
                    head = document.getElementsByTagName('head');
                // Call the unload function if any is defined
                if (bbScript.onunload) {
                    eval(bbScript.onunload);
                }
                if (head.length > 0 ) {
                    head[0].removeChild(scriptTag);
                }
            }
        }
    },

    //screen
    //roundPanel
    //textArrowList
    //textInput
    //button
    //dropdown
    //labelControlContainers
    //pillButtons
    //imageList
    //inboxList
    //bbBubble
};
