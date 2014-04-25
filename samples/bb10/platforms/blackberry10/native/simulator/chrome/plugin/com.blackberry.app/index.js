/*
 * Copyright 2010-2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _config = require("./../../lib/config"),
    _utils = require("./../../lib/utils"),
    _appEvents = require("./../../lib/events/applicationEvents"),
    _orientation,
    _listeners = {},
    _actionMap = {
        swipedown: {
            event: "swipedown",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        },
        orientationchange : {
            //special case, handled in add
            event: "rotate",
            trigger: function () {}
        },
        keyboardopening: {
            event: "keyboardOpening",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        },
        keyboardopened: {
            event: "keyboardOpened",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        },
        keyboardclosing: {
            event: "keyboardClosing",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        },
        keyboardclosed: {
            event: "keyboardClosed",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        },
        keyboardposition: {
            event: "keyboardPosition",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(JSON.parse(obj), true);
            }
        },
        windowstatechanged: {
            event: "stateChange",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(obj, true);
            }
        },
        unhandledkeyinput: {
            event: "UnhandledKeyInput",
            trigger: function (pluginResult, obj) {
                pluginResult.callbackOk(JSON.parse(obj), true);
            }
        },
    };

function angleToOrientation(angle) {
    var orientation;

    switch (angle) {
    case 0:
        orientation = 'portrait-primary';
        break;
    case 90:
        orientation = 'landscape-secondary';
        break;
    case 180:
        orientation = 'portrait-secondary';
        break;
    case -90:
    case 270:
        orientation = 'landscape-primary';
        break;
    default:
        orientation = "unknown";
        break;
    }

    return orientation;
}

function edgeToOrientation(edge) {
    switch (edge) {
    case "left_up":
        return "landscape-primary";
    case "top_up":
        return "portrait-primary";
    case "bottom_up":
        return "portrait-secondary";
    case "right_up":
        return "landscape-secondary";
    default:
        return "unknown";
    }
}

function translateToDeviceOrientation(orientation) {
    // Convert HTML5 orientation syntax into device syntax
    switch (orientation) {
    case 'portrait':
    case 'portrait-primary':
        return 'top_up';

    case 'landscape':
    case 'landscape-primary':
        return 'left_up';

    case 'portrait-secondary':
        return 'bottom_up';

    case 'landscape-secondary':
        return 'right_up';

    default:
        return 'unknown';
    }
}

function rotateTrigger(pluginResult, width, height, angle) {
    _orientation = angleToOrientation(angle);
    pluginResult.callbackOk(_orientation, true);
}

function rotateWhenLockedTrigger(pluginResult, edge) {
    _orientation = edgeToOrientation(edge);
    pluginResult.callbackOk(_orientation, true);
}

module.exports = {

    startEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            systemEvent = _actionMap[eventName].event,
            listener = _actionMap[eventName].trigger.bind(null, result);

        if (!_listeners[eventName]) {
            _listeners[eventName] = {};
        }

        if (_listeners[eventName][env.webview.id]) {
            if (eventName === "orientationchange") {
                _appEvents.removeEventListener("rotate", _listeners[eventName][env.webview.id][0]);
                _appEvents.removeEventListener("rotateWhenLocked", _listeners[eventName][env.webview.id][1]);
            } else if (eventName === "unhandledkeyinput") {
                env.webview.removeEventListener(systemEvent, _listeners[eventName][env.webview.id]);
            } else {
                _appEvents.removeEventListener(systemEvent, _listeners[eventName][env.webview.id]);
            }
        }

        if (eventName === "orientationchange") {
            listener = [rotateTrigger.bind(null, result), rotateWhenLockedTrigger.bind(null, result)];
            _appEvents.addEventListener("rotate", listener[0]);
            _appEvents.addEventListener("rotateWhenLocked", listener[1]);
        } else if (eventName === "unhandledkeyinput") {
            env.webview.addEventListener(systemEvent, listener);
        } else {
            _appEvents.addEventListener(systemEvent, listener);
        }

        _listeners[eventName][env.webview.id] = listener;
        result.noResult(true);
    },

    stopEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            listener = _listeners[eventName] ? _listeners[eventName][env.webview.id] : undefined,
            systemEvent = _actionMap[eventName].event;
        if (!listener) {
            result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        } else {
            if (eventName  === "orientationchange") {
                _appEvents.removeEventListener("rotate", listener[0]);
                _appEvents.removeEventListener("rotateWhenLocked", listener[1]);
            } else if (eventName === "unhandledkeyinput") {
                env.webview.removeEventListener(systemEvent, listener);
            } else {
                _appEvents.removeEventListener(systemEvent, listener);
            }
            delete _listeners[eventName][env.webview.id];
            result.noResult(false);
        }
    },

    getReadOnlyFields : function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            ro = {
                author: _config.author,
                authorEmail: _config.authorEmail,
                authorURL: _config.authorURL,
                copyright: _config.copyright,
                description: _config.description,
                id: _config.id,
                license: _config.license,
                licenseURL: _config.licenseURL,
                name: _config.name,
                version: _config.version
            };
        result.ok(ro, false);
    },

    lockOrientation : function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            orientation = JSON.parse(decodeURIComponent(args.orientation)),
            rotateTo = translateToDeviceOrientation(orientation),
            recieveRotateEvents = args.recieveRotateEvents === undefined  ? true : args.recieveRotateEvents;

        // Force rotate to the given orientation then lock it
        qnx.webplatform.getApplication().rotate(rotateTo);
        qnx.webplatform.getApplication().lockRotation(recieveRotateEvents);
        result.ok(true, false);
    },

    unlockOrientation : function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        qnx.webplatform.getApplication().unlockRotation();
        result.ok(null, false);
    },

    rotate : function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            orientation = translateToDeviceOrientation(JSON.parse(decodeURIComponent(args.orientation)), fail);
        qnx.webplatform.getApplication().rotate(orientation);
        result.ok(null, false);
    },

    currentOrientation : function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            orientation = _orientation || angleToOrientation(window.orientation);
        result.ok(orientation, false);
    },

    minimize: function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        qnx.webplatform.getApplication().minimizeWindow();
        result.ok(null, false);
    },

    exit: function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        window.qnx.webplatform.getApplication().exit();
        result.ok(null, false);
    },

    windowState : function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        result.ok(qnx.webplatform.getApplication().windowState, false);
    }
};
