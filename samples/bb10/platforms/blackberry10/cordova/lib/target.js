#!/usr/bin/env node
/*
 *  Copyright 2013 Research In Motion Limited.
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
    exit = require('exit'),
    fs = require('fs'),
    utils = require('./utils'),
    commander = require('commander'),
    properties = utils.getProperties(),
    ERROR_VALUE = 2,
    NOTIMPLEMENTED_VALUE = 1,
    command,
    targetName,
    ip,
    type,
    password,
    pin,
    pinRegex = new RegExp("[0-9A-Fa-f]{8}");

function isValidType(type) {
    var result = true;

    if (typeof type !== 'string') {
        console.log("target type is required");
        console.log(commander.helpInformation());
        exit(ERROR_VALUE);
    }
    else if (!(type === 'device' || type === 'simulator')) {
        result = false;
    }
    return result;
}

function isValidPin(pin) {
    var result = true;
    if (typeof pin !== 'undefined' && !pinRegex.test(pin)) {
        result = false;
    }
    return result;
}

commander
    .usage('[command] [params]')
    .option('-p, --password <password>', 'Specifies password for this target')
    .option('--pin <devicepin>', 'Specifies PIN for this device')
    .option('-t, --type <device | simulator>', 'Specifies the target type');

commander
    .on('--help', function () {
        console.log('   Synopsis:');
        console.log('   $ target');
        console.log('   $ target add <name> <host> [-t | --type <device | simulator>] [-p | --password <password>] [--pin <devicepin>]');
        console.log('   $ target remove <name>');
        console.log(' ');
    });

commander
    .command('add')
    .description("Add specified target")
    .action(function () {
        if (commander.args.length === 1) {
            console.log("Target details not specified");
            console.log(commander.helpInformation());
            exit(ERROR_VALUE);
        }
        targetName = commander.args[0];
        ip = commander.args[1];
        type = commander.type ? commander.type : "device";
        if (commander.password && typeof commander.password === 'string') {
            password = commander.password;
        }
        if (commander.pin && typeof commander.pin === 'string') {
            pin = commander.pin;
        }
        if (!isValidType(type)) {
            console.log("Invalid target type: " + type);
            console.log(commander.helpInformation());
            exit(ERROR_VALUE);
        }
        if (typeof ip !== 'string') {
            console.log("host is required");
            console.log(commander.helpInformation());
            exit(ERROR_VALUE);
        }
        if (!isValidPin(pin)) {
            console.log("Invalid PIN: " + pin);
            console.log(commander.helpInformation());
            exit(ERROR_VALUE);
        }
        if (properties.targets.hasOwnProperty(targetName)) {
            console.log("Overwriting target: " + targetName);
        }
        properties.targets[targetName] = {"ip": ip, "type": type, "password": password, "pin": pin};
    });

commander
    .command('remove')
    .description("Remove specified target")
    .action(function () {
        if (commander.args.length === 1) {
            console.log('No target specified');
            console.log(commander.helpInformation());
            exit(ERROR_VALUE);
        }
        targetName = commander.args[0];
        if (!properties.targets.hasOwnProperty(targetName)) {
            console.log("Target: '" + targetName + "' not found");
            console.log(commander.helpInformation());
            exit(ERROR_VALUE);
        }
        delete properties.targets[targetName];
    });

commander
    .command('*')
    .action(function () {
        console.log('Unrecognized command');
        console.log(commander.helpInformation());
        exit(NOTIMPLEMENTED_VALUE);
    });


try {
    commander.parse(process.argv);

    if (commander.args.length === 0) {
        Object.keys(properties.targets).forEach(function (target) {
                console.log(target);
            }
        );
        exit();
    }

    utils.writeToPropertiesFile(properties);
} catch (e) {
    console.log(e);
    exit();
}
