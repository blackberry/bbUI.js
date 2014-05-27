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

var _self,
    os = require("os"),
    fs = require('fs'),
    path = require('path'),
    bb10_utils = require('./utils'),
    blackberryProperties = bb10_utils.getProperties();

_self = {
    getTargetList : function (type, pruneDisconnected, callback) {
        var targList = [],
            count = 0,
            targets = blackberryProperties.targets,
            addItem = function (t) {
                targets[t].name = t;
                targList.push(targets[t]);
            },
            complete = function () {
                if (count === Object.keys(targets).length) {
                    callback(targList);
                }
            },
            checkConnection = function (name) {
                _self.checkConnection(targets[name].ip, type, function (connected) {
                    count++;
                    if (connected) {
                        addItem(name);
                    }
                    complete();
                });
            },
            t;

        if (targets) {
            for (t in targets) {
                if (targets.hasOwnProperty(t) && targets[t].type === type) {
                    if (pruneDisconnected) {
                        checkConnection(t);
                    }
                    else {
                        addItem(t);
                        count++;
                    }
                } else {
                    count++;
                }
            }
        }
        complete();
    },

    getDeviceInfo: function (ip, password, callback) {
        var cmd = path.join(process.env.CORDOVA_BBTOOLS, 'blackberry-deploy'),
            args = [
                '-listDeviceInfo',
                ip
            ],
            options = {
                _customOptions: { silent: true }
            };

        if (password) {
            args.push('-password');
            args.push(password);
        }

        bb10_utils.exec(cmd, args, options, function (error, stdout, stderr) {
            var err = error,
                result = {},
                name = /modelname::(.*?)(\r?)\n/.exec(stdout),
                pin = /devicepin::0x(.*?)(\r?)\n/.exec(stdout);
            if (name && name.length > 0) {
                result.name = name[1];
            }
            if (pin && pin.length > 0) {
                result.pin = pin[1];
            }

            if (!result.name) {
                if (stdout.indexOf("Error:") !== -1) {
                    err = stdout.slice(stdout.indexOf("Error:") + 6);
                } else if (stdout === "" && stderr.indexOf("Error:") === 0) {
                    err = stderr.slice(7);
                } else {
                    err = "Unable to authenticate with BlackBerry 10 device/emulator at " + ip + ".";
                }
            }

            callback(err, result);
        });
    },

    findConnectedDevice: function (callback) {
        var defaultIp = '169.254.0.1',
            count = 0,
            i;
        _self.discoverUsb(function (result) {
            if (!result || result.length === 0) {
                result = [defaultIp];
            }
            for (i = 0; i < result.length; i++) {
                /* jshint ignore:start */
                _self.checkConnection(result[i], 'device', function (connection, ip) {
                    if (connection)  {
                        callback(ip);
                        return;
                    } else if (++count === result.length) {
                        callback();
                    }
                });
                /* jshint ignore:end */
            }
        });
    },

    discoverUsb: function (callback) {
        var IPV4_TYPE = "IPv4",
            IP_SPLIT_REGEXP = /(169\.254\.\d{1,3}\.)(\d{1,3})/,
            networkInterfaces = os.networkInterfaces(),
            result,
            matches = [],
            ni,
            i;

        for (ni in networkInterfaces) {
            if (networkInterfaces.hasOwnProperty(ni)) {
                for (i = 0; i < networkInterfaces[ni].length; i++) {
                    if (networkInterfaces[ni][i].family === IPV4_TYPE) {
                        result = IP_SPLIT_REGEXP.exec(networkInterfaces[ni][i].address);
                        if (result && result[1] && result[2]) {
                            matches.push(result[1] + (result[2] - 1));
                        }
                    }
                }

            }
        }
        callback(matches);
    },

    findConnectedSimulator: function (callback) {
        var pathVmDhcpLeases,
            pathUserProfile,
            pathAllUserProfile,
            vmDhcpLeasesFiles,
            DHCP_LEASES_REGEX = /VMware\\vmnetdhcp.leases$/,
            targets = blackberryProperties.targets,
            ipsToTest = [],
            dhcpIPs = [],
            t;

        // Firstly, check targets in the properties file
        if (targets) {
            for (t in targets) {
                if (targets.hasOwnProperty(t) && targets[t].type === "simulator" && targets[t].ip) {
                    ipsToTest.push(targets[t].ip);
                }
            }
        }

        // Secondly, check VMware dhcp.leases file
        if (bb10_utils.isWindows()) {
            pathUserProfile = process.env['USERPROFILE'];
            pathAllUserProfile = pathUserProfile.substr(0, pathUserProfile.lastIndexOf("\\") + 1) + "All Users";
            vmDhcpLeasesFiles = bb10_utils.readdirSyncRecursive(pathAllUserProfile).filter(function (file) {
                return DHCP_LEASES_REGEX.test(file);
            });
            pathVmDhcpLeases = vmDhcpLeasesFiles[0];
        } else if (bb10_utils.isOSX()) {
            pathVmDhcpLeases = "/private/var/db/vmware/vmnet-dhcpd-vmnet8.leases";
        } else {
            pathVmDhcpLeases = "/var/db/vmware/vmnet-dhcpd-vmnet8.leases";
        }

        fs.readFile(pathVmDhcpLeases, 'utf8', function (err, data) {
            if (!err) {
                // Find all lines that start with "lease xxx.xxx.xxx.xxx "
                dhcpIPs = data.match(/lease \d{1,3}.\d{1,3}.\d{1,3}.\d{1,3} /g);
                dhcpIPs = dhcpIPs.map(function (result) {
                    return result.substr(6, result.indexOf(' ', 7) - 6);
                });
            }

            ipsToTest = ipsToTest.concat(dhcpIPs);
            // Remove duplicated ip
            ipsToTest = ipsToTest.filter(function (item, index, arr) {
                return arr.indexOf(item) === index;
            });

            _self.checkConnectionRecursive(ipsToTest, 0, callback);
        });
    },

    checkConnectionRecursive: function (ips, index, callback) {
        var ip;

        if (!ips || index === ips.length) {
            callback();
            return;
        }

        console.log("Searching for connected BlackBerry 10 Simulator (" + (index + 1) + "/" + ips.length + ")...");
        ip = ips[index];
        _self.checkConnection(ip, "simulator", function (connection) {
            if (connection) {
                callback(ip);
            } else {
                _self.checkConnectionRecursive(ips, index + 1, callback);
            }
        });
    },

    checkConnection: function (ip, type, callback) {
        var script = path.join(process.env.CORDOVA_BBTOOLS, 'blackberry-deploy'),
            args = [
                '-test',
                ip
            ],
            options = {
                _customOptions: { silent: true }
            };

        bb10_utils.exec(script, args, options, function (error, stdout, stderr) {
            // error code 3 corresponds to a connected device, null or "Error: null" in stderr corresponds to connected simulator
            var isSimConnected = (type === "simulator" && (
                    error === null ||
                    stderr.length === 0 ||
                    stderr.indexOf('Error: null') >= 0 ||
                    stderr.indexOf('Error: Authentication failed') >= 0
                )),
                isDeviceConnected = (type === "device" && error && error.code === 3);

            callback(isSimConnected || isDeviceConnected, ip);
        });
    },

    listTargets : function (type, pruneDisconnected) {
        _self.getTargetList(type, pruneDisconnected, function (targets) {
            for (var t in targets) {
                if (targets.hasOwnProperty(t)) {
                    console.log(targets[t].name + ' ip: ' + targets[t].ip);
                }
            }
        });
    }

};

module.exports = _self;
