var _self = {},
    _ID = require("./manifest.json").namespace;

_self.initContext = function (value) {
    window.webworks.execAsync(_ID, "initContext", {value : value});
}

module.exports = _self;
