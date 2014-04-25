cordova.define("com.blackberry.app.client", function(require, exports, module) { /*
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

var _self = {},
    exec = cordova.require("cordova/exec"),
    ID = "com.blackberry.app",
    readOnlyValues,
    noop = function () {},
    events = ["swipedown", "pause", "resume", "orientationchange", "keyboardopening", "keyboardopened",
              "keyboardclosing", "keyboardclosed", "keyboardposition", "windowstatechanged", "unhandledkeyinput"];

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
            exec(success, fail, ID, "startEvent", {eventName: eventName});
        } else if (this.numHandlers === 0) {
            exec(noop, noop, ID, "stopEvent", {eventName: eventName});
        }
    };
});

_self.minimize = function () {
    exec(noop, noop, ID, "minimize");
};

_self.exit = function () {
    exec(noop, noop, ID, "exit");
};

function getReadOnlyFields() {
    var success = function (data, response) {
            readOnlyValues = data;
        },
        fail = function (data, response) {
            throw data;
        };
    if (!readOnlyValues) {
        exec(success, fail, ID, "getReadOnlyFields", null);
    }
}

function defineReadOnlyField(field) {
    var value;
    getReadOnlyFields();
    value = readOnlyValues ? readOnlyValues[field] : null;
    Object.defineProperty(_self, field, {"value": value, "writable": false});
}

function getLocalizedText(data) {
    var locale = navigator.language.toLowerCase();

    if (data[locale]) {
        return data[locale];
    } else if (data[locale.split("-")[0]]) {
        //Default to language specific locale [i.e. fr]
        return data[locale.split("-")[0]];
    } else {
        return data["default"];
    }
}

Object.defineProperty(_self, "orientation", {
    get: function () {
        var orientation,
            success = function (data, response) {
                orientation = data;
            },
            fail = function (data, response) {
                throw data;
            };

        try {
            exec(success, fail, ID, "currentOrientation");
        } catch (e) {
            console.error(e);
        }
        return orientation;
    }
});

Object.defineProperty(_self, "windowState", {
    get: function () {
        var windowState,
            success = function (data, response) {
                windowState = data;
            },
            fail = function (data, response) {
                throw data;
            };

        try {
            exec(success, fail, ID, "windowState");
        } catch (e) {
            console.error(e);
        }
        return windowState;
    }
});

Object.defineProperty(_self, "name", {
    get: function () {
        getReadOnlyFields();
        return getLocalizedText(readOnlyValues["name"]);
    }
});

Object.defineProperty(_self, "description", {
    get: function () {
        getReadOnlyFields();
        return getLocalizedText(readOnlyValues["description"]);
    }
});

defineReadOnlyField("author");

defineReadOnlyField("authorEmail");

defineReadOnlyField("authorURL");

defineReadOnlyField("copyright");

defineReadOnlyField("id");

defineReadOnlyField("license");

defineReadOnlyField("licenseURL");

defineReadOnlyField("version");

function lockOrientation(orientation, receiveRotateEvents) {
    exec(function () {}, function () {}, ID, "lockOrientation", { orientation: orientation, receiveRotateEvents: receiveRotateEvents });
}

function unlockOrientation() {
    exec(function () {}, function () {}, ID, "unlockOrientation");
}

function rotate(orientation) {
    exec(function () {}, function () {}, ID, "rotate", {orientation: orientation});
}

// Orientation Properties
Object.defineProperty(_self, "lockOrientation", {"value": lockOrientation, "writable": false});
Object.defineProperty(_self, "unlockOrientation", {"value": unlockOrientation, "writable": false});
Object.defineProperty(_self, "rotate", {"value": rotate, "writable": false});

module.exports = _self;

});
