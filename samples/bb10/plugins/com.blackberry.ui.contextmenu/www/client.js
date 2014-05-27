/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var contextmenu = {},
    exec = cordova.require("cordova/exec"),
    _ID = "com.blackberry.ui.contextmenu",
    noop = function () {},
    events = ["contextmenuhidden"];

events.map(function (eventName) {
    var channel = cordova.addDocumentEventHandler(eventName),
        success = function (data) {
            channel.fire(data);
        },
        fail = function (error) {
            console.log("Error initializing " + eventName + " listener: ", error);
        };

    channel.onHasSubscribersChange = function () {
        if (this.numHandlers === 1) {
            exec(success, fail, _ID, "startEvent", {eventName: eventName});
        } else if (this.numHandlers === 0) {
            exec(noop, noop, _ID, "stopEvent", {eventName: eventName});
        }
    };
});

function defineReadOnlyContext(field) {
    Object.defineProperty(contextmenu, "CONTEXT_" + field, {"value": field, "writable": false});
}

function defineReadOnlyActions(name, value) {
    Object.defineProperty(contextmenu, "ACTION_" + name, {"value": value, "writable": false});
}

// Define the enabled property that an API developer can access
// to enable/disable the context menu UI
Object.defineProperty(contextmenu, "enabled", {
    get : function () {
        var enabled,
            success = function (data, response) {
                enabled = data;
            },
            fail = function (data, response) {
                throw data;
            };
        try {
            exec(success, fail, _ID, "enabled");
        } catch (error) {
            console.log(error);
        }
        return enabled;
    },
    set: function (value) {
        try {
            exec(function () {}, function () {}, _ID, "enabled", {"enabled": value});
        } catch (error) {
            console.error(error);
        }
    }
});

contextmenu.clearOverride = function (actionId) {

    if (typeof actionId === 'undefined') {
        return 'Clearing override on a menu item requires an actionId';
    }

    exec(function () {}, function () {}, _ID, 'clearOverride', { actionId: actionId});
};

contextmenu.overrideItem = function (action, callback) {

    if (typeof action.actionId === 'undefined') {
        return 'Overriding a menu item requires an actionId';
    }

    exec(function (elementId) {
        callback(elementId);
    }, function () {}, _ID, 'overrideItem', {action: action});
};


contextmenu.addItem = function (contexts, action, callback) {

    if (typeof contexts === 'undefined') {
        return 'Adding a custom menu item requires a context';
    }

    if (typeof action.actionId === 'undefined') {
        return 'Adding a custom menu item requires an actionId';
    }

    exec(function (elementId) {
        callback(elementId);
    }, function () {}, _ID, 'addItem', {contexts: contexts, action: action});
};

contextmenu.removeItem = function (contexts, actionId) {

    if (typeof contexts === 'undefined') {
        return 'Removing a custom menu item requires a context';
    }

    if (typeof actionId === 'undefined') {
        return 'Removing a custom menu item requires an actionId';
    }

    exec(function () {}, function () {}, _ID, 'removeItem', {contexts: contexts, actionId: actionId});
};

contextmenu.defineCustomContext = function (customContext, options) {
    exec(function () {}, function () {}, _ID, 'defineCustomContext', {context: customContext, options: options});
};

contextmenu.disablePlatformItem = function (context, actionId) {
    return exec(function () {}, function () {}, _ID, 'disablePlatformItem', {context: context, actionId: actionId});
};

contextmenu.enablePlatformItem = function (context, actionId) {
    return exec(function () {}, function () {}, _ID, 'enablePlatformItem', {context: context, actionId: actionId});
};

contextmenu.listDisabledPlatformItems = function () {
    return exec(function () {}, function () {}, _ID, 'listDisabledPlatformItems');
};

defineReadOnlyContext("ALL");
defineReadOnlyContext("LINK");
defineReadOnlyContext("IMAGE_LINK");
defineReadOnlyContext("IMAGE");
defineReadOnlyContext("INPUT");
defineReadOnlyContext("TEXT");

defineReadOnlyActions("CLEAR_FIELD", "ClearField");
defineReadOnlyActions("CANCEL", "Cancel");
defineReadOnlyActions("CUT", "Cut");
defineReadOnlyActions("COPY", "Copy");
defineReadOnlyActions("PASTE", "Paste");
defineReadOnlyActions("SELECT", "Select");
defineReadOnlyActions("COPY_LINK", "CopyLink");
defineReadOnlyActions("SAVE_LINK_AS", "SaveLinkAs");
defineReadOnlyActions("SAVE_IMAGE", "SaveImage");
defineReadOnlyActions("COPY_IMAGE_LINK", "CopyImageLink");
defineReadOnlyActions("VIEW_IMAGE", "ViewImage");
defineReadOnlyActions("INSPECT_ELEMENT", "InspectElement");
defineReadOnlyActions("MENU_SERVICE", "MenuService");

module.exports = contextmenu;
