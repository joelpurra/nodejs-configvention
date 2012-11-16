/*!
 * @license nodejs-configvention
 * Copyright (c) 2012, Joel Purra <http://joelpurra.se/>
 * Released under BSD, MIT and GPL, see LICENSES.
 *
 * A node.js configuration convention with a minimal readonly interface.
 */

/*jslint vars: true, white: true*/

var exported = (function() {
    var priv = {},
        pub = {};

    priv.nconf = require("nconf");

    priv.initialize = function() {
        var appPath = require.main.filename;

        priv.nconf.argv().env().file({
            file: appPath + ".config.json"
        }).file("defaults", {
            file: appPath + ".defaults.config.json"
        });
    };

    pub.get = function(name) {
        return priv.nconf.get(name);
    };

    priv.initialize();

    return pub;
}());

module.exports = exported;