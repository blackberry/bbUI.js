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
    exit = require("exit"),
    command = require("commander"),
    os = require("os"),
    utils = require("./utils"),
    signingHelper = require("./signing-helper"),
    bbProperties = utils.getProperties(),
    bbwpArgv = [
        process.argv[0],
        path.resolve(path.join(__dirname, process.argv[1])),
        path.resolve(path.join(__dirname, "..", "..", "www")),
        "-o",
        path.resolve(path.join(__dirname, "..", "..", "build"))
    ],
    async = require("async"),
    childProcess = require("child_process"),
    pkgrUtils = require("./packager-utils"),
    session = require("./session"),
    ERROR_VALUE = 2,
    commandStr;

function copyArgIfExists(arg) {
    if (command[arg]) {
        bbwpArgv.push("--" + arg);
        bbwpArgv.push(command[arg]);
    }
}

command
    .usage('[--debug | --release] [--query] [-k | --keystorepass] [-b <number> | --buildId <number>] [-p <json> | --params <json>] [-l <level> | --loglevel <level>] [--web-inspector] [--no-signing]')
    .option('--debug', 'build in debug mode.')
    .option('--release', 'build in release mode. This will sign the resulting bar.')
    .option('--query', 'query on the commandline when a password is needed')
    .option('-k, --keystorepass <password>', 'signing key password')
    .option('-b, --buildId <num>', 'specifies the build number for signing (typically incremented from previous signing).')
    .option('-p, --params <params JSON file>', 'specifies additional parameters to pass to downstream tools.')
    .option('-l, --loglevel <loglevel>', 'set the logging level (error, warn, verbose)')
    .option('--web-inspector', 'enables webinspector. Enabled by default in debug mode.).')
    .option('--no-signing', 'when building in release mode, this will skip signing');

try {
    command.parse(process.argv);

    if (command.debug && command.release) {
        console.error("Invalid build command: cannot specify both debug and release parameters.");
        console.log(command.helpInformation());
        exit(ERROR_VALUE);
    }

    signingHelper.warn();

    utils.series(
        [
            function clean(done) {
                var cmd = utils.isWindows() ? "clean" : "./clean",
                    args = [],
                    opts = { "cwd": path.normalize(__dirname + "/..") };

                utils.exec(cmd, args, opts, done);
            },
            function releaseBuild(allDone) {
                var childTasks = [],
                    keystorepass = session.getKeyStorePass(command),
                    err;

                if (command.release) {
                    copyArgIfExists("buildId");
                    if (command.signing) {
                        //Note: Packager refers to signing password as "password" not "keystorepass"
                        bbwpArgv.push("--password");
                        if (keystorepass) {
                            bbwpArgv.push(keystorepass);
                        } else if (command.query) {
                            childTasks.push(utils.prompt.bind(this, {description: "Please enter your keystore password: ", hidden: true}));
                            childTasks.push(function (password, done) {
                                bbwpArgv.push(password);
                                done();
                            });
                        } else {
                            err = "No signing password provided. Please enter a value for 'keystorepass' in " + pkgrUtils.homedir() + "/.cordova/blackberry10.json or use --keystorepass via command-line";
                        }
                    }
                }

                async.waterfall(childTasks, function (error) { allDone(error || err); });
            },
            function build(done) {
                //enable webinspector in debug mode or if --webinspector was provided
                if (!command.release || command.webInspector) {
                    bbwpArgv.push("-d");
                }

                copyArgIfExists("params");
                copyArgIfExists("loglevel");

                //Overwrite process.argv, before calling packager
                process.argv = bbwpArgv;

                //Delete cached commander object. It will conflict with the packagers commander
                delete require.cache[require.resolve("commander")];
                delete require.cache[require.resolve("commander/lib/commander")];

                require("./packager").start(done);
            }
        ]
    );
} catch (e) {
    console.error(os.EOL + e);
    exit(ERROR_VALUE);
}

