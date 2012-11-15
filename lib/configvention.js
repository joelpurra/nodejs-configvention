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

    priv.getFilename = function(fullpath) {
        var path = require("path");

        return path.basename(fullpath);
    };

    priv.initialize = function() {
        var appFilename = priv.getFilename(require.main.filename);

        priv.nconf.argv().env().file({
            file: appFilename + ".config.json"
        }).file({
            file: appFilename + ".defaults.config.json"
        });
    };

    pub.get = function(name) {
        return priv.nconf.get(name);
    };

    priv.initialize();

    return pub;
}());

module.exports = exported;