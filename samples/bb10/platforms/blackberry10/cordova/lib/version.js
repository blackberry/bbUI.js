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

var fs = require("fs"),
    readline = require("readline"),
    util = require("util"),
    path = require('path'),
    projectPath = path.resolve(__dirname, '../..'),
    filename = path.join(projectPath, 'www/cordova.js');

if (fs.existsSync(filename)) {
    var rl = readline.createInterface({
        input: fs.createReadStream(filename),
        terminal: false
    });

    rl.on("line", function (line) {
        var splitSpace,
            splitDash;
        if (/^\/\/\s\d/.test(line)) {
            rl.close();
            splitSpace = line.split(" ");
            if (splitSpace.length > 1) {
                splitDash = splitSpace[1].split("-");
                if (splitDash.length > 0) {
                    console.log(splitDash[0]);
                }
            }
        }
    });
} else {
    console.log(util.format("The file \"%s\" does not exist.", filename));
}
