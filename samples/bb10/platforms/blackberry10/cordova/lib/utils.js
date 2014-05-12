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

/* globals Buffer */

var fs = require('fs'),
    exit = require('exit'),
    async = require('async'),
    path = require('path'),
    childProcess = require('child_process'),
    wrench = require('wrench'),
    localize = require("./localize"),
    os = require('os'),
    promptLib = require("prompt"),
    DEFAULT_BAR_NAME = "bb10app",
    PROPERTY_FILE_NAME = 'blackberry10.json',
    CORDOVA_DIR = '.cordova',
    ERROR_VALUE = 2,
    DEFAULT_PROPERTY_FILE = {
        targets: {
        }
    },
    _self;

function swapBytes(buffer) {
    var l = buffer.length,
        i,
        a;

    if (l % 2 === 0x01) {
        throw localize.translate("EXCEPTION_BUFFER_ERROR");
    }

    for (i = 0; i < l; i += 2) {
        a = buffer[i];
        buffer[i] = buffer[i + 1];
        buffer[i + 1] = a;
    }

    return buffer;
}

_self = {
    writeFile: function (fileLocation, fileName, fileData) {
        //If directory does not exist, create it.
        if (!fs.existsSync(fileLocation)) {
            wrench.mkdirSyncRecursive(fileLocation, "0755");
        }

        fs.writeFile(path.join(fileLocation, fileName), fileData, function (err) {
            if (err) throw err;
        });
    },

    copyFile: function (srcFile, destDir, baseDir) {
        var filename = path.basename(srcFile),
            fileBuffer = fs.readFileSync(srcFile),
            fileLocation;

        //if a base directory was provided, determine
        //folder structure from the relative path of the base folder
        if (baseDir && srcFile.indexOf(baseDir) === 0) {
            fileLocation = srcFile.replace(baseDir, destDir);
            wrench.mkdirSyncRecursive(path.dirname(fileLocation), "0755");
            fs.writeFileSync(fileLocation, fileBuffer);
        } else {
            if (!fs.existsSync(destDir)) {
                wrench.mkdirSyncRecursive(destDir, "0755");
            }

            fs.writeFileSync(path.join(destDir, filename), fileBuffer);
        }
    },

    listFiles: function (directory, filter) {
        var files = wrench.readdirSyncRecursive(directory),
            filteredFiles = [];

        files.forEach(function (file) {
            //On mac wrench.readdirSyncRecursive does not return absolute paths, so resolve one.
            file = path.resolve(directory, file);

            if (filter(file)) {
                filteredFiles.push(file);
            }
        });

        return filteredFiles;
    },

    readdirSyncRecursive: function (baseDir) {
        var files = [],
            curFiles = [],
            nextDirs,
            isDir = function (f) {
                return fs.statSync(f).isDirectory();
            },
            isFile = function (f) {
                return !isDir(f);
            },
            prependBaseDir = function (fname) {
                return path.join(baseDir, fname);
            };

        try {
            curFiles = fs.readdirSync(baseDir);

            if (curFiles && curFiles.length > 0) {
                curFiles = curFiles.map(prependBaseDir);
                nextDirs = curFiles.filter(isDir);
                curFiles = curFiles.filter(isFile);

                files = files.concat(curFiles);

                while (nextDirs.length) {
                    files = files.concat(_self.readdirSyncRecursive(nextDirs.shift()));
                }
            }
        } catch (e) {
        }

        return files;
    },

    isWindows: function () {
        return os.type().toLowerCase().indexOf("windows") >= 0;
    },

    isOSX: function () {
        return os.type().toLowerCase().indexOf("darwin") >= 0;
    },

    isArray: function (obj) {
        return obj.constructor.toString().indexOf("Array") !== -1;
    },

    isEmpty : function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    },

    toBoolean: function (myString, defaultVal) {
        // if defaultVal is not passed, default value is undefined
        return myString === "true" ? true : myString === "false" ? false : defaultVal;
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

    isLocalURI : function (uri) {
        return uri && uri.scheme && uri.scheme.toLowerCase() === "local";
    },

    // Convert node.js Buffer data (encoded) to String
    bufferToString : function (data) {
        var s = "";
        if (Buffer.isBuffer(data)) {
            if (data.length >= 2 && data[0] === 0xFF && data[1] === 0xFE) {
                s = data.toString("ucs2", 2);
            } else if (data.length >= 2 && data[0] === 0xFE && data[1] === 0xFF) {
                swapBytes(data);
                s = data.toString("ucs2", 2);
            } else if (data.length >= 3 && data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF) {
                s = data.toString("utf8", 3);
            } else {
                s = data.toString("ascii");
            }
        }

        return s;
    },

    // Wrap object property in an Array if the property is defined and it is not an Array
    wrapPropertyInArray : function (obj, property) {
        if (obj && obj[property] && !(obj[property] instanceof Array)) {
            obj[property] = [ obj[property] ];
        }
    },

    inQuotes : function (property) {
        //wrap in quotes if it's not already wrapped
        if (property.indexOf("\"") === -1) {
            return "\"" + property + "\"";
        } else {
            return property;
        }
    },

    exec : function (command, args, options, callback) {
        //Optional params handling [args, options]
        if (typeof args === "object" && !Array.isArray(args)) {
            callback = options;
            options = args;
            args = [];
        } else if (typeof args === "function") {
            callback = args;
            options = {};
            args = [];
        } else if (typeof options === "function") {
            callback = options;
            options = {};
        }

        //insert executable portion at beginning of arg array
        args.splice(0, 0, command);

        var pkgrUtils = require("./packager-utils"),
            customOptions = options._customOptions,
            proc,
            i;

        for (i = 0; i < args.length; i++) {
            if (args[i] && args[i].indexOf(" ") !== -1) {
                if (!_self.isWindows()) {
                    //remove any escaped spaces on non-Windows platforms and simply use quotes
                    args[i] = args[i].replace(/\\ /g, " ");
                }

                //put any args with spaces in quotes
                args[i] = _self.inQuotes(args[i]);
            }
        }

        //delete _customOptions from options object before sending to exec
        delete options._customOptions;
        //Use the process env by default
        options.env = options.env || process.env;

        proc = childProcess.exec(args.join(" "), options, callback);

        if (!customOptions || !customOptions.silent) {
            proc.stdout.on("data", pkgrUtils.handleProcessOutput);
            proc.stderr.on("data", pkgrUtils.handleProcessOutput);
        }
    },

    loadModule: function (path) {
        return require(path);
    },

    findHomePath : function () {
        return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
    },

    getCordovaDir: function () {
        var cordovaPath = path.join(_self.findHomePath(), CORDOVA_DIR);

        if (!fs.existsSync(cordovaPath)) {
            fs.mkdirSync(cordovaPath);
        }

        return cordovaPath;
    },

    getPropertiesFilePath: function () {
        var propertiesFile = path.join(_self.getCordovaDir(), PROPERTY_FILE_NAME);

        if (!fs.existsSync(propertiesFile)) {
            _self.writeToPropertiesFile(DEFAULT_PROPERTY_FILE);
        }

        return propertiesFile;
    },

    getPropertiesFileName: function () {
        return PROPERTY_FILE_NAME;
    },

    getProperties: function () {
        return require(_self.getPropertiesFilePath());
    },

    writeToPropertiesFile: function (data) {
        var contents = JSON.stringify(data, null, 4) + "\n",
            propertiesFile = path.join(_self.getCordovaDir(), PROPERTY_FILE_NAME);

        fs.writeFileSync(propertiesFile, contents, 'utf-8');
    },

    genBarName: function () {
        return DEFAULT_BAR_NAME;
    },

    clone: function (original) {
        var clone = {},
            prop;
        if (typeof original !== "object") {
            clone = original;
        } else if (Array.isArray(original)) {
            clone = original.slice();
        } else {
            /* jshint ignore:start */
            for (prop in original) {
                clone[prop] = original[prop];
            }
            /* jshint ignore:end */
        }

        return clone;
    },
    prompt: function (options, done) {
        var promptSchema = {
                properties: {
                    "property": options
                }
            };
        promptLib.start();
        promptLib.colors = false;
        promptLib.message = "";
        promptLib.delimiter = "";
        promptLib.get(promptSchema, function (err, results) {
            done(err, results.property);
        });
    },

    mixin: function (mixin, to) {
        Object.getOwnPropertyNames(mixin).forEach(function (prop) {
            if (Object.hasOwnProperty.call(mixin, prop)) {
                Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(mixin, prop));
            }
        });
        return to;
    },

    series: function (steps) {
        async.series(steps, this.exit_handler);
    },

    waterfall: function (steps) { 
        async.waterfall(steps, this.exit_handler);
    },

    exit_handler: function (err) {
        if (err) {
            if (typeof err === "string") {
                console.error(err);
            } else {
                console.error("An error has occurred");
            }
            exit(ERROR_VALUE);
        } else {
            exit(0);
        }
    }

};

module.exports = _self;
