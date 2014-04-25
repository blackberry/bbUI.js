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

var path = require("path"),
    fs = require("fs"),
    wrench = require("wrench"),
    utils = require("./utils"),
    logger = require("./logger"),
    signingUtils = require("./signing-utils"),
    barConf = require("./bar-conf"),
    localize = require("./localize"),
    cmdParams;

function getParams(cmdline, toolName) {
    var properties = utils.getProperties(),
        params = properties[toolName],
        paramsPath;

    if (cmdline.params) {
        if (!cmdParams) {
            paramsPath = path.resolve(cmdline.params);

            if (fs.existsSync(paramsPath)) {
                try {
                    cmdParams = require(paramsPath);
                } catch (e) {
                    throw localize.translate("EXCEPTION_PARAMS_FILE_ERROR", paramsPath);
                }
            } else {
                throw localize.translate("EXCEPTION_PARAMS_FILE_NOT_FOUND", paramsPath);
            }
        }
    }

    if (cmdParams && cmdParams[toolName]) {
        if (params) {
            params = utils.mixin(cmdParams[toolName], params);
        } else {
            params = cmdParams[toolName];
        }
    }

    return params;
}


module.exports = {
    getKeyStorePass: function (cmdline) {
        var properties = utils.getProperties(),
            params = getParams(cmdline, "blackberry-signer") || {},
            keystorepass;

        //Check commandline first, then properties, then params
        //Packager expects value provided as password
        //Cordova scripts expects value provided as keystorepass
        //String checks are to get around issue where commander sometimes passed in a function
        if (cmdline.password && typeof cmdline.password === "string") {
            keystorepass = cmdline.password;
        } else if (cmdline.keystorepass && typeof cmdline.keystorepass === "string") {
            keystorepass = cmdline.keystorepass;
        } else if (properties.keystorepass) {
            keystorepass = properties.keystorepass;
        } else if (params["-storepass"]) {
            keystorepass = params["-storepass"];
        }

        return keystorepass;
    },
    initialize: function (cmdline) {
        var sourceDir,
            signingPassword = module.exports.getKeyStorePass(cmdline),
            outputDir = cmdline.output,
            archivePath = path.resolve(cmdline.args[0] ? cmdline.args[0] : "../../www"),
            archiveName = utils.genBarName(),
            appdesc,
            buildId = cmdline.buildId,
            signerParams = getParams(cmdline, "blackberry-signer") || {},
            keystore = signerParams["-keystore"],
            bbidtoken = signerParams["-bbidtoken"];

        //If -o option was not provided, default output location is the same as .zip
        outputDir = outputDir || path.dirname(archivePath);

        if (cmdline.appdesc && "string" === typeof cmdline.appdesc) {
            appdesc = path.resolve(cmdline.appdesc);
        }

        //If -s [dir] is provided
        if (cmdline.source && "string" === typeof cmdline.source) {
            sourceDir = cmdline.source + "/src";
        } else {
            sourceDir = outputDir + "/src";
        }

        if (!fs.existsSync(sourceDir)) {
            wrench.mkdirSyncRecursive(sourceDir, "0755");
        }

        logger.level(cmdline.loglevel || 'verbose');

        //If signer params exist, check whether the files are there
        //This is to be consistent with the default files
        if (keystore && !fs.existsSync(keystore)) {
            keystore = false;
        }
        if (bbidtoken && !fs.existsSync(bbidtoken)) {
            bbidtoken = false;
        }

        return {
            "conf": require("./conf"),
            "keepSource": !!cmdline.source,
            "sourceDir": path.resolve(sourceDir),
            "sourcePaths": {
                "ROOT": path.resolve(sourceDir),
                "CHROME": path.normalize(path.resolve(sourceDir) + barConf.CHROME),
                "LIB": path.normalize(path.resolve(sourceDir) + barConf.LIB),
                "EXT": path.normalize(path.resolve(sourceDir) + barConf.EXT),
                "UI": path.normalize(path.resolve(sourceDir) + barConf.UI),
                "PLUGINS": path.normalize(path.resolve(sourceDir) + barConf.PLUGINS),
                "JNEXT_PLUGINS": path.normalize(path.resolve(sourceDir) + barConf.JNEXT_PLUGINS)
            },
            "outputDir": path.resolve(outputDir),
            "archivePath": archivePath,
            "archiveName": archiveName,
            "barPath": outputDir + "/%s/" + archiveName + ".bar",
            "debug": !!cmdline.debug,
            "keystore": keystore || signingUtils.getKeyStorePath(),
            "keystoreCsk": signingUtils.getCskPath(),
            "keystoreDb": signingUtils.getDbPath(),
            "keystoreBBID": bbidtoken || signingUtils.getKeyStorePathBBID(),
            "storepass": signingPassword,
            "buildId": buildId,
            "appdesc" : appdesc,
            getParams: function (toolName) {
                return getParams(cmdline, toolName);
            },
            isSigningRequired: function (config) {
                return (keystore || signingUtils.getKeyStorePath()) && signingPassword;
            },
            "targets": ["simulator", "device"]
        };
    }
};
