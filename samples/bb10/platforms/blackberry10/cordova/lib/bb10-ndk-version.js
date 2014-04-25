#!/usr/bin/env node

// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

var bbtools = process.env.CORDOVA_BBTOOLS,
    reg = /host_\d+_\d+/g,
    results;

if (reg.test(bbtools)) {
    results = bbtools.match(reg);
    console.log(results[0].split('host_')[1].replace('_', '.'));
} else {
    return new Error('Unable to find the blackberry ndk on your path.');
}
