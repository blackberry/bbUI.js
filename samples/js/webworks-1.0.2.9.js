/*
 *  Copyright 2012 Research In Motion Limited.
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

(function () { 
/*
 *  Copyright 2012 Research In Motion Limited.
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

var define,
    require;

(function () {
    var unpreparedModules = {},
        readyModules = {},
        ACCEPTABLE_EXTENSIONS = [".js", ".json"],
        DEFAULT_EXTENSION = ".js";

    function hasValidExtension(moduleName) {
        return ACCEPTABLE_EXTENSIONS.some(function (element, index, array) {
            return moduleName.match("\\" + element + "$");
        });
    }


    function normalizeName(originalName, baseName) {
        var nameParts,
            name = originalName.slice(0);
        //remove ^local:// (if it exists) and .js$
        //This will not work for local:// without a trailing js
        name = name.replace(/(?:^local:\/\/)/, "");
        if (name.charAt(0) === '.' && baseName) {
            //Split the baseName and remove the final part (the module name)
            nameParts = baseName.split('/');
            nameParts.pop();
            nameParts = nameParts.concat(name.split('/'));
            
            name = nameParts.reduce(function (previous, current,  index, array) {
                var returnValue,
                    slashIndex;

                //If previous is a dot, ignore it
                //If previous is ever just .. we're screwed anyway
                if (previous !== '.') {
                    returnValue = previous;
                }
                
                //If we have a .. then remove a chunk of previous
                if (current === "..") {
                    slashIndex = previous.lastIndexOf('/');
                    //If there's no slash we're either screwed or we remove the final token
                    if (slashIndex !== -1) {
                        returnValue = previous.slice(0, previous.lastIndexOf('/'));
                    } else {
                        returnValue = "";
                    }
                } else if (current !== '.') {
                    //Otherwise simply append anything not a .
                    //Only append a slash if we're not empty
                    if (returnValue.length) {
                        returnValue += "/";
                    }
                    returnValue += current;
                }

                return returnValue;
            });

        }
        
        //If there is no acceptable extension tack on a .js
        if (!hasValidExtension(name)) {
            name = name + DEFAULT_EXTENSION;
        }

        return name;
    }

    function buildModule(name, dependencies, factory) {
        var module = {exports: {}},
            localRequire = function (moduleName) {
                return require(moduleName, name);
            },
            args = [];
        localRequire.toUrl = function (moduleName, baseName) {
            return require.toUrl(moduleName, baseName || name);
        };
        dependencies.forEach(function (dependency) {
            if (dependency === 'require') {
                args.push(localRequire);
            } else if (dependency === 'exports') {
                args.push(module.exports);
            } else if (dependency === 'module') {
                args.push(module);
            } else {
                //This is because jshint cannot handle out of order functions
                /*global loadModule:false */
                args.push(loadModule(dependency));
                /*global loadModule:true */
            }
        });

        //No need to process dependencies, webworks only has require, exports, module
        factory.apply(this, args);

        //For full AMD we would need logic to also check the return value
        return module.exports;

    }

    function getDefineString(moduleName, body) {
        var evalString = 'define("' + moduleName + '", function (require, exports, module) {',
            isJson = /\.json$/.test(moduleName);

        evalString += isJson ? ' module.exports = ' : '';
        evalString += body.replace(/^\s+|\s+$/g, '');
        evalString += isJson ? ' ;' : '';
        evalString += '});';

        return evalString;
    }

    function loadModule(name, baseName) {
        var normalizedName = normalizeName(name, baseName),
            url,
            xhr,
            loadResult;
        //Always check undefined first, this allows the user to redefine modules
        //(Not used in WebWorks, although it is used in our unit tests)
        if (unpreparedModules[normalizedName]) {
            readyModules[normalizedName] = buildModule(normalizedName, unpreparedModules[normalizedName].dependencies, unpreparedModules[normalizedName].factory);
            delete unpreparedModules[normalizedName];
        }

        //If the module does not exist, load the module from external source
        //Webworks currently only loads APIs from across bridge
        if (!readyModules[normalizedName]) {
            //If the module to be loaded ends in .js then we will define it
            //Also if baseName exists than we have a local require situation
            if (hasValidExtension(name) || baseName) {
                xhr = new XMLHttpRequest();
                url = name;
                //If the module to be loaded starts with local:// go over the bridge
                //Else If the module to be loaded is a relative load it may not have .js extension which is needed
                if (/^local:\/\//.test(name)) {
                    url = "http://localhost:8472/extensions/load/" + normalizedName.replace(/(?:^ext\/)(.+)(?:\/client.js$)/, "$1");

                    xhr.open("GET", url, false);
                    xhr.send(null);
                    try {
                        loadResult = JSON.parse(xhr.responseText);

                        loadResult.dependencies.forEach(function (dep) {
                            /*jshint evil:true */
                            eval(getDefineString(dep.moduleName, dep.body));
                            /*jshint evil:false */
                        });

                        //Trimming responseText to remove EOF chars
                        /*jshint evil:true */
                        eval(getDefineString(normalizedName, loadResult.client));
                        /*jshint evil:false */
                    } catch (err1) {
                        err1.message += ' in ' + url;
                        throw err1;
                    }
                } else {
                    if (baseName) {
                        url = normalizedName;
                    }

                    xhr.open("GET", url, false);
                    xhr.send(null);
                    try {
                        //Trimming responseText to remove EOF chars
                        /*jshint evil:true */
                        eval(getDefineString(normalizedName, xhr.responseText));
                        /*jshint evil:false */
                    } catch (err) {
                        err.message += ' in ' + url;
                        throw err;
                    }
                }

                if (unpreparedModules[normalizedName]) {
                    readyModules[normalizedName] = buildModule(normalizedName, unpreparedModules[normalizedName].dependencies, unpreparedModules[normalizedName].factory);
                    delete unpreparedModules[normalizedName];
                }
            } else {
                throw "module " + name + " cannot be found";
            }

        }

        return readyModules[normalizedName];

    }

    //Use the AMD signature incase we ever want to change.
    //For now we will only be using (name, baseName)
    require = function (dependencies, callback) {
        if (typeof dependencies === "string") {
            //dependencies is the module name and callback is the relName
            //relName is not part of the AMDJS spec, but we use it from localRequire
            return loadModule(dependencies, callback);
        } else if (Array.isArray(dependencies) && typeof callback === 'function') {
            //Call it Asynchronously
            setTimeout(function () {
                buildModule(undefined, dependencies, callback);
            }, 0);
        }
    }; 

    require.toUrl = function (originalName, baseName) {
        return normalizeName(originalName, baseName);
    };

    //Use the AMD signature incase we ever want to change.
    //For now webworks will only be using (name, factory) signature.
    define = function (name, dependencies, factory) {
        if (typeof name === "string" && typeof dependencies === 'function') {
            factory = dependencies;
            dependencies = ['require', 'exports', 'module'];
        }

        //According to the AMDJS spec we should parse out the require statments 
        //from factory.toString and add those to the list of dependencies

        //Normalize the name. Remove local:// and .js
        name = normalizeName(name);
        unpreparedModules[name] = {
            dependencies: dependencies,
            factory: factory
        }; 
    };
}());

//Export for use in node for unit tests
if (typeof module === "object" && typeof require === "function") {
    module.exports = {
        require: require,
        define: define
    };
}

define('builder', function (require, exports, module) {
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
var utils = require(!!require.resolve ? "../utils" : "lib/utils");

function buildNamespace(currentNamespace, namespaceParts, featureProperties) {
    var featureId,
        nextPart;

    if (namespaceParts.length === 1) {
        //base case, feature properties go here
        featureId = namespaceParts[0];
        if (currentNamespace[featureId] === undefined) {
            currentNamespace[featureId] = {};
        }

        currentNamespace = utils.mixin(featureProperties, currentNamespace[featureId]);
        return currentNamespace;
    }
    else {
        nextPart = namespaceParts.shift();
        if (currentNamespace[nextPart] === undefined) {
            currentNamespace[nextPart] = {};
        }

        return buildNamespace(currentNamespace[nextPart], namespaceParts, featureProperties);
    }
}

function include(parent, featureIdList) {
    var featureId,
        featureProperties,
        localUrl,
        i;

    for (i = 0; i < featureIdList.length; i++) {
        featureId = featureIdList[i];

        localUrl = "local://ext/" + featureId + "/client.js";
        featureProperties = utils.loadModule(localUrl);

        buildNamespace(parent, featureId.split("."), featureProperties);
    }
}

var _self = {
    build: function (featureIdList) {
        return {
            into: function (target) {
                include(target, featureIdList);
            }
        };
    }
};

module.exports = _self;

});

define('window', function (require, exports, module) {
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

// HACK have to live with differentiating node from browser for now
module.exports = {
    "window": function () {
        return !!require.resolve ? null : window;
    }
};
});

define('event', function (require, exports, module) {
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

var _handlers = {};

function _add(featureId, name, cb, success, fail, once) {
    var handler;
    if (featureId && name && typeof cb === "function") {
        handler = {
            func: cb,
            once: !!once
        };
        //If this is the first time we are adding a cb
        if (!_handlers.hasOwnProperty(name)) {
            _handlers[name] = [handler];
            //Do not call exec for once because its not necessary
            if (!once) {
                window.webworks.exec(success, fail, featureId, "add", {"eventName": name});
            }
        } else if (!_handlers[name].some(function (element, index, array) {
            return element.func === cb;
        })) {
            //Only add unique callbacks
            _handlers[name].push(handler);
        }
    }
}

module.exports = {
    add: function (featureId, name, cb, success, fail) {
        _add(featureId, name, cb, success, fail, false);
    },

    once: function (featureId, name, cb, success, fail) {
        _add(featureId, name, cb, success, fail, true);
    },

    isOn: function (name) {
        return !!_handlers[name];
    },

    remove: function (featureId, name, cb, success, fail) {
        if (featureId && name && typeof cb === "function") {
            if (_handlers.hasOwnProperty(name)) {
                _handlers[name] = _handlers[name].filter(function (element, index, array) {
                    return element.func !== cb || element.once;
                });

                if (_handlers[name].length === 0) {
                    delete _handlers[name];
                    window.webworks.exec(success, fail, featureId, "remove", {"eventName": name});
                }
            }
        }
    },

    trigger: function (name, args) {
        var parsedArgs;
        if (_handlers.hasOwnProperty(name)) {
            if (args && args !== "undefined") {
                parsedArgs = JSON.parse(decodeURIComponent(args));
            }
            //Call the handlers
            _handlers[name].forEach(function (handler) {
                if (handler) {
                    //args should be an array of arguments
                    handler.func.apply(undefined, parsedArgs);
                }
            });
            //Remove the once listeners
            _handlers[name] = _handlers[name].filter(function (handler) {
                return !handler.once;
            });
            //Clean up the array if it is empty
            if (_handlers[name].length === 0) {
                delete _handlers[name];
                //No need to call remove since this would only be for callbacks
            }
        }
    }
};

});

define('lib/utils', function (require, exports, module) {
/*
 *  Copyright 2012 Research In Motion Limited.
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

var self,
    exception = require('./exception');

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

self = module.exports = {
    validateNumberOfArguments: function (lowerBound, upperBound, numberOfArguments, customExceptionType, customExceptionMessage, customExceptionObject) {

        customExceptionMessage = customExceptionMessage || "";

        if (arguments.length < 3 || arguments.length > 6) {
            exception.raise(exception.types.Argument, "Wrong number of arguments when calling: validateNumberOfArguments()");
        }

        if (isNaN(lowerBound) && isNaN(upperBound) && isNaN(numberOfArguments)) {
            exception.raise(exception.types.ArgumentType, "(validateNumberOfArguments) Arguments are not numbers");
        }

        lowerBound = parseInt(lowerBound, 10);
        upperBound = parseInt(upperBound, 10);
        numberOfArguments = parseInt(numberOfArguments, 10);

        if (numberOfArguments < lowerBound || numberOfArguments > upperBound) {
            exception.raise((customExceptionType || exception.types.ArgumentLength), (customExceptionMessage + "\n\nWrong number of arguments"), customExceptionObject);
        }

    },

    validateArgumentType: function (arg, argType, customExceptionType, customExceptionMessage, customExceptionObject) {
        var invalidArg = false,
            msg;

        switch (argType) {
        case "array":
            if (!arg instanceof Array) {
                invalidArg = true;
            }
            break;
        case "date":
            if (!arg instanceof Date) {
                invalidArg = true;
            }
            break;
        case "integer":
            if (typeof arg === "number") {
                if (arg !== Math.floor(arg)) {
                    invalidArg = true;
                }
            }
            else {
                invalidArg = true;
            }
            break;
        default:
            if (typeof arg !== argType) {
                invalidArg = true;
            }
            break;
        }

        if (invalidArg) {
            msg = customExceptionMessage +  ("\n\nInvalid Argument type. argument: " + arg + " ==> was expected to be of type: " + argType);
            exception.raise((customExceptionType || exception.types.ArgumentType), msg, customExceptionObject);
        }
    },

    validateMultipleArgumentTypes: function (argArray, argTypeArray, customExceptionType, customExceptionMessage, customExceptionObject) {
        for (var i = 0; i < argArray.length; i++) {
            this.validateArgumentType(argArray[i], argTypeArray[i], customExceptionType, customExceptionMessage, customExceptionObject);
        }
    },

    arrayContains: function (array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] === obj) {
                return true;
            }
        }
        return false;
    },

    some: function (obj, predicate, scope) {
        if (obj instanceof Array) {
            return obj.some(predicate, scope);
        }
        else {
            var values = self.map(obj, predicate, scope);

            return self.reduce(values, function (some, value) {
                return value ? value : some;
            }, false);
        }
    },

    count: function (obj) {
        return self.sum(obj, function (total) {
            return 1;
        });
    },

    sum: function (obj, selector, scope) {
        var values = self.map(obj, selector, scope);
        return self.reduce(values, function (total, value) {
            return total + value;
        });
    },

    max: function (obj, selector, scope) {
        var values = self.map(obj, selector, scope);
        return self.reduce(values, function (max, value) {
            return max < value ? value : max;
        }, Number.MIN_VALUE);
    },

    min: function (obj, selector, scope) {
        var values = self.map(obj, selector, scope);
        return self.reduce(values, function (min, value) {
            return min > value ? value : min;
        }, Number.MAX_VALUE);
    },

    forEach: function (obj, action, scope) {
        if (obj instanceof Array) {
            return obj.forEach(action, scope);
        }
        else {
            self.map(obj, action, scope);
        }
    },

    filter: function (obj, predicate, scope) {
        if (obj instanceof Array) {
            return obj.filter(predicate, scope);
        }
        else {
            var result = [];
            self.forEach(obj, function (value, index) {
                if (predicate.apply(scope, [value, index])) {
                    result.push(value);
                }

            }, scope);

            return result;
        }
    },

    reduce: function (obj, func, init, scope) {
        var i,
            initial = init === undefined ? 0 : init,
            result = initial;


        if (obj instanceof Array) {
            return obj.reduce(func, initial);
        }
        else if (obj instanceof NamedNodeMap) {
            for (i = 0; i < obj.length; i++) {
                result = func.apply(scope, [result, obj[i], i]);
            }
        }
        else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    result = func.apply(scope, [result, obj[i], i]);
                }
            }
        }

        return result;

    },

    map: function (obj, func, scope) {
        var i,
            returnVal = null,
            result = [];

        if (obj instanceof Array) {
            return obj.map(func, scope);
        }
        else if (obj instanceof NamedNodeMap) {
            for (i = 0; i < obj.length; i++) {
                returnVal = func.apply(scope, [obj[i], i]);
                result.push(returnVal);
            }
        }
        else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    returnVal = func.apply(scope, [obj[i], i]);
                    result.push(returnVal);
                }
            }
        }

        return result;
    },

    series: function (tasks, callback) {

        var execute = function () {
            var args = [],
                task;

            if (tasks.length) {
                task = tasks.shift();
                args = args.concat(task.args).concat(execute);
                task.func.apply(this, args);
            }
            else {
                callback.func.apply(this, callback.args);
            }
        };

        execute();
    },

    regexSanitize: function (regexString) {
        return regexString.replace("^", "\\^")
                    .replace("$", "\\$")
                    .replace("(", "\\(")
                    .replace(")", "\\)")
                    .replace("<", "\\<")
                    .replace("[", "\\[")
                    .replace("{", "\\{")
                    .replace(/\\/, "\\\\")
                    .replace("|", "\\|")
                    .replace(">", "\\>")
                    .replace(".", "\\.")
                    .replace("*", "\\*")
                    .replace("+", "\\+")
                    .replace("?", "\\?");
    },

    find: function (comparison, collection, startInx, endInx, callback) {
        var results = [],
            compare = function (s, pattern) {

                if (typeof(s) !== "string" || pattern === null) {
                    return s === pattern;
                }

                var regex = pattern.replace(/\./g, "\\.")
                                   .replace(/\^/g, "\\^")
                                   .replace(/\*/g, ".*")
                                   .replace(/\\\.\*/g, "\\*");

                regex = "^".concat(regex, "$");

                return !!s.match(new RegExp(regex, "i"));
            };

        self.forEach(collection, function (c) {
            var match,
                fail = false;

            self.forEach(comparison, function (value, key) {
                if (!fail && value !== undefined) {

                    if (compare(c[key], value)) {
                        match = c;
                    }
                    else {
                        fail = true;
                        match = null;
                    }
                }
            });

            if (match) {
                results.push(match);
            }
        });

        if (callback) {
            if (startInx === undefined) {
                startInx = 0;
            }
            if (endInx === undefined) {
                endInx = results.length;
            }
            if (startInx === endInx) {
                endInx = startInx + 1;
            }

            callback.apply(null, [results.slice(startInx, endInx)]);
        }
    },

    mixin: function (mixin, to) {
        Object.getOwnPropertyNames(mixin).forEach(function (prop) {
            if (Object.hasOwnProperty.call(mixin, prop)) {
                Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(mixin, prop));
            }
        });
        return to;
    },

    copy: function (obj) {
        var i,
            newObj = (obj === null ? false : global.toString.call(obj) === "[object Array]") ? [] : {};

        if (typeof obj === 'number' ||
            typeof obj === 'string' ||
            typeof obj === 'boolean' ||
            obj === null ||
            obj === undefined) {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj);
        }

        if (obj instanceof RegExp) {
            return new RegExp(obj);
        }

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (obj[i] && typeof obj[i] === "object") {
                    if (obj[i] instanceof Date) {
                        newObj[i] = obj[i];
                    }
                    else {
                        newObj[i] = self.copy(obj[i]);
                    }
                }
                else {
                    newObj[i] = obj[i];
                }
            }
        }

        return newObj;
    },

    startsWith : function (str, substr) {
        return str.indexOf(substr) === 0;
    },

    endsWith : function (str, substr) {
        return str.indexOf(substr, str.length - substr.length) !== -1;
    },

    parseUri : function (str) {
        var i, uri = {},
            key = [ "source", "scheme", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
            matcher = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(str);

        for (i = key.length - 1; i >= 0; i--) {
            uri[key[i]] = matcher[i] || "";
        }

        return uri;
    },

    // uri - output from parseUri
    isAbsoluteURI : function (uri) {
        if (uri && uri.source) {
            return uri.relative !== uri.source;
        }

        return false;
    },

    fileNameToImageMIME : function (fileName) {

        var extensionsToMIME = {},
            ext;

        extensionsToMIME.png = 'image/png';
        extensionsToMIME.jpg = 'image/jpeg';
        extensionsToMIME.jpe = 'image/jpeg';
        extensionsToMIME.jpeg = 'image/jpeg';
        extensionsToMIME.gif = 'image/gif';
        extensionsToMIME.bmp = 'image/bmp';
        extensionsToMIME.bm = 'image/bmp';
        extensionsToMIME.svg = 'image/svg+xml';
        extensionsToMIME.tif = 'image/tiff';
        extensionsToMIME.tiff = 'image/tiff';

        ext = fileName.split('.').pop();
        return extensionsToMIME[ext];
    },

    isLocalURI : function (uri) {
        return uri && uri.scheme && "local:///".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    isFileURI : function (uri) {
        return uri && uri.scheme && "file://".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    isHttpURI : function (uri) {
        return uri && uri.scheme && "http://".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    isHttpsURI : function (uri) {
        return uri && uri.scheme && "https://".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    // Checks if the specified uri starts with 'data:'
    isDataURI : function (uri) {
        return uri && uri.scheme && "data:".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    performExec : function (featureId, property, args) {
        var result;

        window.webworks.exec(function (data, response) {
            result = data;
        }, function (data, response) {
            throw data;
        }, featureId, property, args, true);

        return result;
    },

    inNode : function () {
        return !!require.resolve;
    },

    requireWebview : function () {
        return require("./webview");
    },
    convertDataToBinary : function (data, dataEncoding) {
        var rawData,
            uint8Array,
            i;

        if (data) {
            if (dataEncoding.toLowerCase() === "base64") {
                rawData = window.atob(data);
            }
            else {
                rawData = data;
            }

            uint8Array = new Uint8Array(new ArrayBuffer(rawData.length));

            for (i = 0; i < uint8Array.length; i++) {
                uint8Array[i] = rawData.charCodeAt(i);
            }

            return uint8Array.buffer;
        }
    },
    getBlobWithArrayBufferAsData : function (data, dataEncoding) {
        var rawData,
            blobBuilderObj = new window.WebKitBlobBuilder();
        rawData = this.convertDataToBinary(data, dataEncoding);
        blobBuilderObj.append(rawData);

        return blobBuilderObj.getBlob("arraybuffer");
    },
    loadModule: function (module) {
        return require(module);
    },
    loadExtensionModule: function (extBasename, path) {
        var ext = require("./manifest")[extBasename];

        if (ext) {
            return require("../ext/" + ext.namespace + "/" + path);
        } else {
            return null;
        }
    },
    hasPermission: function (config, permission) {
        if (config && config.permissions && config.permissions.length) {
            return config.permissions.indexOf(permission) >= 0;
        }

        return false;
    },
    guid: function () {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    getURIPrefix: function () {
        return "http://localhost:8472/";
    }
};

});

define('lib/exception', function (require, exports, module) {
/*
 *  Copyright 2012 Research In Motion Limited.
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

module.exports = {

    types: {
        Application: "Application",
        ArgumentLength: "ArgumentLength",
        ArgumentType: "ArgumentType",
        Argument: "Argument",
        NotificationType: "NotificationType",
        NotificationStateType: "NotificationStateType",
        DomObjectNotFound: "DomObjectNotFound",
        MethodNotImplemented: "MethodNotImplemented",
        InvalidState: "InvalidState",
        ApplicationState: "ApplicationState"
    },

    handle: function handle(exception, reThrow) {
        reThrow = reThrow || false;

        var eMsg = exception.message || "exception caught!",
        msg = eMsg + "\n\n" + (exception.stack || "*no stack provided*") + "\n\n";

        console.error(msg);

        if (reThrow) {
            throw exception;
        }
    },

    raise: function raise(exceptionType, message, customExceptionObject) {
        var obj = customExceptionObject || {
                type: "",
                message: "",

                toString: function () {
                    var result = this.name + ': "' + this.message + '"';

                    if (this.stack) {
                        result += "\n" + this.stack;
                    }
                    return result;
                }
            };

        message = message || "";

        obj.name = exceptionType;
        obj.type = exceptionType;
        // TODO: include the exception objects original message if exists
        obj.message = message;

        throw obj;
    }
};

});
define('lib/webworks-info', function (require, exports, module) {
module.exports = {
	hash: "0ce47be0f0e032b04d4c4ba14e243218",
	version: "1.0.2.9"
};
});
/*
* Copyright 2010-2012 Research In Motion Limited.
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
(function () {
    var _d = document.addEventListener,
        _webworksReady = false,
        _alreadyFired = false,
        _listenerRegistered = false;

    //Only fire the webworks event when both webworks is ready and a listener is registered
    function fireWebworksReadyEvent() {
        if (_listenerRegistered && _webworksReady && !_alreadyFired) {
            _alreadyFired = true;
            var evt = document.createEvent("Events");
            evt.initEvent("webworksready", true, true);
            document.dispatchEvent(evt);
        }
    }

    //Trapping when users add listeners to the webworks ready event
    //This way we can make sure not to fire the event before there is a listener
    document.addEventListener = function (event, callback, capture) {
        _d.call(document, event, callback, capture);
        if (event.toLowerCase() === "webworksready") {
            _listenerRegistered = true;
            fireWebworksReadyEvent();
        }
    };


    function createWebworksReady() {
        function RemoteFunctionCall(functionUri) {
            var params = {};

            function composeUri() {
                return require("lib/utils").getURIPrefix() + functionUri;
            }

            function createXhrRequest(uri, isAsync) {
                var request = new XMLHttpRequest();

                request.open("POST", uri, isAsync);
                request.setRequestHeader("Content-Type", "application/json");

                return request;
            }

            this.addParam = function (name, value) {
                params[name] = encodeURIComponent(JSON.stringify(value));
            };

            this.makeSyncCall = function (success, error) {
                var requestUri = composeUri(),
                    request = createXhrRequest(requestUri, false),
                    response,
                    errored,
                    cb,
                    data;

                request.send(JSON.stringify(params));

                response = JSON.parse(decodeURIComponent(request.responseText) || "null");
                errored = response.code < 0;
                cb = errored ? error : success;
                data = errored ? response.msg : response.data;

                if (cb) {
                    cb(data, response);
                }
                else if (errored) {
                    throw data;
                }

                return data;
            };

            this.makeAsyncCall = function (success, error) {
                var requestUri = composeUri(),
                    request = createXhrRequest(requestUri, true);

                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        var response = JSON.parse(decodeURIComponent(request.responseText) || "null"),
                        cb = response.code < 0 ? error : success,
                        data = response.code < 0 ? response.msg : response.data;

                        return cb && cb(data, response);
                    }
                };

                request.send(JSON.stringify(params));
            };
        }

        var builder,
            request,
            resp,
            execFunc,
            wwInfo = require('lib/webworks-info');

        //For users who wish to have a single source project across BB7 -> PB -> BB10 they will need to use webworks.js
        //To aid in this, we will fire the webworksready event on these platforms as well
        //If blackberry object already exists then we are in an older version of webworks
        if (window.blackberry) {
            _webworksReady = true;
            fireWebworksReadyEvent();
            return;
        }

        // Build out the blackberry namespace based on the APIs desired in the config.xml
        builder = require('builder');

        request = new XMLHttpRequest();
        request.open("GET", "http://localhost:8472/extensions/get/?hash=" + wwInfo.hash + "&version=" + wwInfo.version, true);

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                resp = JSON.parse(decodeURIComponent(request.responseText));

                if (request.status === 412) {
                    //Application Webworks.js does not match framework, display error to user.
                    alert(resp.msg);
                } else if (request.status === 200) {
                    builder.build(resp.data).into(window);
                    //At this point all of the APIs should be built into the window object
                    //Fire the webworks ready event
                    _webworksReady = true;
                    fireWebworksReadyEvent();
                }
            }
        };
        request.send(null);

        execFunc = function (success, fail, service, action, args, sync) {
            var uri = service + "/" + action,
                request = new RemoteFunctionCall(uri),
                name;

            for (name in args) {
                if (Object.hasOwnProperty.call(args, name)) {
                    request.addParam(name, args[name]);
                }
            }

            request[sync ? "makeSyncCall" : "makeAsyncCall"](success, fail);
        };

        window.webworks = {
            exec: execFunc,
            execSync: function (service, action, args) {
                var result;

                execFunc(function (data, response) {
                    result = data;
                }, function (data, response) {
                    throw data;
                }, service, action, args, true);

                return result;
            },
            execAsync: function (service, action, args) {
                var result;

                execFunc(function (data, response) {
                    result = data;
                }, function (data, response) {
                    throw data;
                }, service, action, args, false);

                return result;
            },
            successCallback: function (id, args) {
                //HACK: this will live later
                throw "not implemented";
            },
            errorCallback: function (id, args) {
                //HACK: this will live later
                throw "not implemented";
            },
            defineReadOnlyField: function (obj, field, value) {
                Object.defineProperty(obj, field, {
                    "value": value,
                    "writable": false
                });
            },
            event: require("event")
        };
    }
    //Only start building window.webworks once the DOMContent is loaded
    document.addEventListener('DOMContentLoaded', createWebworksReady, false);
    //If the DOM Content has already been loaded then create window.webworks immediately
    if (document.readyState === 'complete') {
        createWebworksReady();
    }
}());


}());