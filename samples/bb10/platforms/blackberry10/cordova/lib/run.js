#!/usr/bin/env node

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
    os = require("os"),
    utils = require("./utils"),
    options = require('commander'),
    runUtils = require("./run-utils"),
    async = require("async");

function install(deployTarget, done) {
    var buildCmd = utils.isWindows() ? "build" : "./build",
        buildArgs = options.keystorepass ? ["-k", options.keystorepass] : [],
        projectRootDir = path.normalize(path.join(__dirname, "..")),
        installTasks = [];

    if (options.build) {
        if (options.release) {
            buildArgs.push("--release");
        }
        installTasks.push(utils.exec.bind(this, buildCmd, buildArgs, {"cwd": projectRootDir}));
    }

    installTasks.push(runUtils.install.bind(this, options, deployTarget));

    async.series(installTasks, done);
}

options
    .usage('[--device] [--emulator] [--target=<id>] [--release] [--query] [-k | --keystorepass] [--devicepass] [--no-launch] [--no-uninstall] [--no-build]')
    .option('-k, --keystorepass <password>', 'the password of signing key; needed for creating debug token')
    .option('--device', 'run on connected device')
    .option('--emulator', 'run on BB10 simulator')
    .option('--devicepass <password>', 'device password')
    .option('--target <id>', 'specifies the target to run the application')
    .option('--release', 'build in release mode')
    .option('--query', 'query on the commandline when a password is needed')
    .option('--no-launch', 'do not launch the application on device')
    .option('--no-build', 'deploy the pre-built bar file and skip building')
    .on('--help', function() {
        console.log('  Examples:');
        console.log('');
        console.log("  Deploying to a predefined target");
        console.log('    $ run --target=Z10');
        console.log("  Deploying to a connected device");
        console.log('    $ run --device --devicepass devicePassword --keystorepass keystorePassword');
        console.log('');
    });

process.argv.forEach(function (argument, index, args) {
    if (argument.match(/^--target=/)) {
        args.splice(index, 1, "--target", argument.substr("--target=".length));
    }
});

options.parse(process.argv);

utils.waterfall(
    [
        runUtils.getValidatedTarget.bind(this, options),
        install
    ]
);
