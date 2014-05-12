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
var check = require('validator').check,
    sanitize = require('validator').sanitize,
    localize = require("./localize"),
    logger = require("./logger"),
    path = require("path"),
    fs = require("fs"),
    packagerUtils = require("./packager-utils"),
    signingUtils = require("./signing-utils"),
    CORDOVA_JS_REGEX = /(cordova-.+js)|cordova\.js/,
    _self;

//NOTE this class is unfinished and is a work in progress

_self = {
    //TODO create one global validate method that will validate
    //both the session and configObj?
    validateSession: function (session, widgetConfig) {
        //The string checks below is to get around a really weird issue in commander
        //where sometimes unspecified arguments come in as a function...
        var keysFound = session.keystore,
            keysDefault = session.keystore === signingUtils.getDefaultPath("author.p12"),
            cskFound = session.keystoreCsk,//barsigner.csk
            dbFound = session.keystoreDb,//barsigner.db
            bbidFound = session.keystoreBBID,
            keysPassword = session.storepass && typeof session.storepass === "string",
            commandLinebuildId = session.buildId && typeof session.buildId === "string",//--buildId
            buildId = widgetConfig.buildId && typeof widgetConfig.buildId === "string",//Finalized Build ID

            //Constants
            AUTHOR_P12 = "author.p12",
            BARSIGNER_CSK = "barsigner.csk",
            BARSIGNER_DB = "barsigner.db",
            BARSIGNER_BBID = "bbidtoken.csk",

            //Logging function
            signingFileWarn = function (file) {
                logger.warn(localize.translate("WARNING_MISSING_SIGNING_KEY_FILE", file));
            },
            signingFileError = function (file) {
                throw localize.translate("EXCEPTION_MISSING_SIGNING_KEY_FILE", file);
            };

        //If -g <password> or --buildId is set, but signing key files are missing, throw an error
        if (keysPassword || commandLinebuildId) {
            if (!keysFound) {
                signingFileError(AUTHOR_P12);
            } else if (keysDefault && !cskFound && !bbidFound) {
                //Only warn about BBID since the old tokens are deprecated
                signingFileError(BARSIGNER_BBID);
            } else if (keysDefault && cskFound && !dbFound) {
                signingFileError(BARSIGNER_DB);
            }

        //If a buildId exists in config, but no keys were found, throw a warning
        } else if (buildId) {
            if (!keysFound) {
                signingFileWarn(AUTHOR_P12);
            } else if (keysDefault && !cskFound && !bbidFound) {
                //Only warn about BBID since the old tokens are deprecated
                signingFileWarn(BARSIGNER_BBID);
            } else if (keysDefault && cskFound && !dbFound) {
                signingFileWarn(BARSIGNER_DB);
            }
        }

        if (commandLinebuildId && !keysPassword) {
            //if --buildId was provided with NO password, throw error
            throw localize.translate("EXCEPTION_MISSING_SIGNING_PASSWORD");
        }

        //if --appdesc was provided, but the file is not existing, throw an error
        if (session.appdesc && !fs.existsSync(session.appdesc)) {
            throw localize.translate("EXCEPTION_APPDESC_NOT_FOUND", session.appdesc);
        }
    },

    //Validation for configObj, iterates through whitelisted features in configObj to remove any non-existing APIs
    validateConfig: function (session, configObj) {
        var cordovaJsFiles;
        //if packageCordovaJs was set, test for existing cordova.js files
        if (configObj.packageCordovaJs) {
            cordovaJsFiles = packagerUtils.listFiles(session.sourceDir, function (file) {
                return CORDOVA_JS_REGEX.test(file);
            });
            if (cordovaJsFiles.length > 0) {
                logger.warn(localize.translate("WARN_CORDOVA_JS_PACKAGED"));
            }
        }

    }
};

module.exports = _self;
