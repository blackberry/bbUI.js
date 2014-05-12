/*
 * Copyright 2012 Research In Motion Limited.
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

var LIB_FOLDER = "../../lib/",
    contextmenu,
    _overlayWebView,
    _utils = require(LIB_FOLDER + 'utils'),
    _listeners = {},
    _actionMap = {
        contextmenuhidden: {
            event: "contextmenu.hidden",
            trigger: function (pluginResult) {
                pluginResult.callbackOk(undefined, true);
            }
        }
    };

function enabled(success, fail, args, env) {
    var result = new PluginResult(args, env),
        _enabled;
    if (typeof args.enabled !== 'undefined') {
        _enabled = JSON.parse(decodeURIComponent(args.enabled));
        if (typeof(_enabled) === 'boolean') {
            _overlayWebView.contextMenu.enabled = _enabled;
        }
        result.ok(true, false);
    } else {
        result.ok(_overlayWebView.contextMenu.enabled, false);
    }
}

function overrideItem(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.action = JSON.parse(decodeURIComponent(args.action));
    args.handler = function (actionId) {
        result.callbackOk(null, true);
    };
    if (_overlayWebView.contextMenu.overrideItem(args.action, args.handler)) {
        result.noResult(true);
    } else {
        result.error("Item could not be overriden", false);
    }
}

function clearOverride(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.actionId = JSON.parse(decodeURIComponent(args.actionId));
    result.ok(_overlayWebView.contextMenu.clearOverride(args.actionId), false);
}

function addItem(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.contexts = JSON.parse(decodeURIComponent(args.contexts));
    args.action = JSON.parse(decodeURIComponent(args.action));
    args.handler = function (actionId, elementId) {
        result.callbackOk(elementId, true);
    };
    _overlayWebView.contextMenu.addItem(function (data) {
        result.noResult(true);
    }, function (e) {
        result.error(e, false);
    }, args, env);
}

function removeItem(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.contexts = JSON.parse(decodeURIComponent(args.contexts));
    args.actionId = JSON.parse(decodeURIComponent(args.actionId));
    _overlayWebView.contextMenu.removeItem(function (data) {
        result.ok(data, false);
    }, function (e) {
        result.error(e, false);
    }, args, env);
}

function defineCustomContext(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.context = JSON.parse(decodeURIComponent(args.context));
    args.options = JSON.parse(decodeURIComponent(args.options));
    _overlayWebView.contextMenu.defineCustomContext(args.context, args.options);
    result.ok(null, false);
}

function disablePlatformItem(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.context = JSON.parse(decodeURIComponent(args.context));
    args.actionId = JSON.parse(decodeURIComponent(args.actionId));
    result.ok(_overlayWebView.contextMenu.disablePlatformItem(args.context, args.actionId), false);
}

function enablePlatformItem(success, fail, args, env) {
    var result = new PluginResult(args, env);
    args.context = JSON.parse(decodeURIComponent(args.context));
    args.actionId = JSON.parse(decodeURIComponent(args.actionId));
    result.ok(_overlayWebView.contextMenu.enablePlatformItem(args.context, args.actionId), false);
}

function listDisabledPlatformItems(success, fail, args, env) {
    var result = new PluginResult(args, env);
    result.ok(_overlayWebView.contextMenu.listDisabledPlatformItems(), false);
}

function startEvent(success, fail, args, env) {
    var result = new PluginResult(args, env),
        eventName = JSON.parse(decodeURIComponent(args.eventName)),
        context = _actionMap[eventName].context,
        systemEvent = _actionMap[eventName].event,
        listener = _actionMap[eventName].trigger.bind(null, result);

    if (!systemEvent) {
        return;
    }

    if (!_listeners[eventName]) {
        _listeners[eventName] = {};
    }

    if (_listeners[eventName][env.webview.id]) {
        //TODO: Change back to erroring out after reset is implemented
        //result.error("Underlying listener for " + eventName + " already running for webview " + env.webview.id);
        qnx.webplatform.core.events.un(systemEvent, _listeners[eventName][env.webview.id]);
    }

    qnx.webplatform.core.events.on(systemEvent, listener);
    _listeners[eventName][env.webview.id] = listener;

    result.noResult(true);
}

function stopEvent(success, fail, args, env) {
    var result = new PluginResult(args, env),
        eventName = JSON.parse(decodeURIComponent(args.eventName)),
        listener = _listeners[eventName][env.webview.id],
        context = _actionMap[eventName].context,
        systemEvent = _actionMap[eventName].event;

    if (!systemEvent) {
        return;
    }

    if (!listener) {
        result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
    } else {
        qnx.webplatform.core.events.un(systemEvent, listener);

        delete _listeners[eventName][env.webview.id];
        result.noResult(false);
    }
}

contextmenu = {
    enabled: enabled,
    addItem: addItem,
    removeItem: removeItem,
    overrideItem: overrideItem,
    clearOverride: clearOverride,
    disablePlatformItem: disablePlatformItem,
    enablePlatformItem: enablePlatformItem,
    listDisabledPlatformItems: listDisabledPlatformItems,
    defineCustomContext: defineCustomContext,
    startEvent: startEvent,
    stopEvent: stopEvent
};

qnx.webplatform.getController().addEventListener('ui.init', function () {
    _overlayWebView = require(LIB_FOLDER + 'overlayWebView');
});

module.exports = contextmenu;
