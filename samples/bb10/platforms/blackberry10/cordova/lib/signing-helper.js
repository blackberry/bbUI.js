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
var path = require('path'),
    fs = require("fs"),
    os = require('os'),
    childProcess = require("child_process"),
    util = require("util"),
    utils = require("./utils"),
    conf = require("./conf"),
    pkgrUtils = require("./packager-utils"),
    signingUtils = require("./signing-utils"),
    logger = require("./logger"),
    _self;

function execSigner(session, target, callback) {
    var script = path.join(process.env.CORDOVA_BBTOOLS, "blackberry-signer"),
        signer,
        params = session.getParams("blackberry-signer"),
        args = [];

    if (params) {
        Object.getOwnPropertyNames(params).forEach(function (p) {
            args.push(p);

            if (params[p]) {
                args.push(params[p]);
            }
        });
    }

    //Only specify default args if they aren't specified by the user
    if (args.indexOf("-keystore") === -1) {
        args.push("-keystore");
        args.push(session.keystore);
    }
    if (args.indexOf("-storepass") === -1) {
        args.push("-storepass");
        args.push(session.storepass);
    }

    //Validate arguments


    args.push(path.resolve(util.format(session.barPath, target)));

    utils.exec(script, args, {
        "env": process.env
    }, callback);
}

_self = {
    execSigner: execSigner,

    warn: function () {
        if (!signingUtils.getKeyStorePath()) {
            logger.warn(
                "Cannot sign applications. Author.p12 file cannot be found at default location: " +
                signingUtils.getDefaultPath("author.p12")
            );
        }

        if (!signingUtils.getKeyStorePathBBID()) {

            if (signingUtils.getCskPath() && signingUtils.getDbPath()) {
                logger.warn("Using legacy signing keys");
            } else {
                logger.warn(
                    "Cannot sign applications. bbidtoken.csk file cannot be found at default location: " +
                    signingUtils.getDefaultPath("bbidtoken.csk")
                );
            }
        }
    }
};

module.exports = _self;
