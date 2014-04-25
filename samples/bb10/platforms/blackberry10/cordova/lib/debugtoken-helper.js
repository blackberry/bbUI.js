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

var childProcess = require("child_process"),
    fs = require("fs"),
    path = require("path"),
    conf = require("./conf"),
    localize = require("./localize"),
    logger = require("./logger"),
    pkgrUtils = require("./packager-utils"),
    utils = require("./utils"),
    workingDir = path.normalize(__dirname + "/.."),
    debugTokenDir = path.normalize(path.join(utils.getCordovaDir(), "blackberry10debugtoken.bar")),
    properties,
    targets,
    self = {};

function isDebugTokenValid(pin, data) {
    var manifests,
        i,
        l,
        expiry = null,
        devices = [],
        line,
        now = new Date();

    if (!data) {
        return false;
    }

    manifests = data.toString().replace(/[\r]/g, '').split('\n');

    for (i = 0, l = manifests.length; i < l; i++) {
        if (manifests[i].indexOf("Debug-Token-Expiry-Date: ") >= 0) {
            // Parse the expiry date
            line = manifests[i].substring("Debug-Token-Expiry-Date: ".length);
            expiry = new Date(line.substring(0, line.indexOf("T")) + " " + line.substring(line.indexOf("T") + 1, line.length - 1) + " UTC");
        } else if (manifests[i].indexOf("Debug-Token-Device-Id: ") >= 0) {
            line = manifests[i].substring("Debug-Token-Device-Id: ".length);
            devices = line.split(",");
        }
    }

    if (expiry && expiry > now) {
        for (i = 0, l = devices.length; i < l; i++) {
            if (parseInt(devices[i]) === parseInt(pin, 16)) {
                return true; // The debug token is valid if not expired and device pin is included
            }
        }
    }

    return false;
}

function generateCreateTokenOptions(pins, password) {
    var options = [],
        i;

    options.push("-storepass");
    options.push(password);

    for (i = 0; i < pins.length; i++) {
        options.push("-devicepin");
        options.push(pins[i]);
    }

    options.push(debugTokenDir);

    return options;
}

function generateDeployTokenOptions(targetIp, targetPassword) {
    var options = [];

    options.push("-installDebugToken");
    options.push(debugTokenDir);

    options.push("-device");
    options.push(targetIp);

    if (targetPassword) {
        options.push("-password");
        options.push(targetPassword);
    }

    return options;
}

function execNativeScript(script, options, callback) {
    var fullPath = path.join(process.env.CORDOVA_BBTOOLS, script);

    utils.exec(fullPath, options, {
        "cwd" : workingDir,
        "env" : process.env
    }, callback);
}

self.createToken = function (projectProperties, target, keystorepass, callback) {
    var pins = [],
        key;

    // Store the global variable "properties"
    properties = projectProperties;

    // Gather PINs information from properties
    if (target === "all") {
        for (key in properties.targets) {
            if (properties.targets.hasOwnProperty(key) && properties.targets[key].pin) {
                pins.push(properties.targets[key].pin);
            }
        }
    } else {
        if (!target) {
            target = properties.defaultTarget;
        }

        if (properties.targets.hasOwnProperty(target) && properties.targets[target].pin) {
            pins.push(properties.targets[target].pin);
        }
    }

    if (pins.length === 0) {
        logger.warn(localize.translate("WARN_NO_DEVICE_PIN_FOUND"));
        if (callback && typeof callback === "function") {
            callback(-1);
        }
    } else if (!keystorepass) {
        logger.warn(localize.translate("WARN_NO_SIGNING_PASSWORD_PROVIDED", pkgrUtils.homedir()));
        if (callback && typeof callback === "function") {
            callback(-1);
        }
    } else {
        logger.info(localize.translate("PROGRESS_GENERATING_DEBUG_TOKEN"));
        // Call "blackberry-debugtokenrequest" to generate debug token
        execNativeScript("blackberry-debugtokenrequest",
            generateCreateTokenOptions(pins, keystorepass),
            callback
        );
    }
};

self.deployToken = function (target, targetIp, targetPassword, callback) {
    logger.info(localize.translate("PROGRESS_DEPLOYING_DEBUG_TOKEN", target));
    execNativeScript("blackberry-deploy",
        generateDeployTokenOptions(targetIp, targetPassword),
        callback
    );
};

self.checkDebugToken = function (pin, callback) {
    var script = path.normalize(path.join(process.env.CORDOVA_BBTOOLS, "blackberry-nativepackager")),
        args = [
            "-listManifest",
            path.normalize(debugTokenDir)
        ];

    if (!callback || typeof callback !== "function") {
        return;
    }

    if (!fs.existsSync(debugTokenDir)) {
        callback(false);
        return;
    }

    utils.exec(script, args, {
        "cwd": workingDir,
        "env": process.env,
        _customOptions: { silent: true}
    }, function (error, stdout, stderr) {
        callback(isDebugTokenValid(pin, stdout));
    });
};

module.exports = self;
