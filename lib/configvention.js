/*!
* @license nodejs-configvention
* Copyright (c) 2012, 2016, Joel Purra <http://joelpurra.com/>
* Released under BSD, MIT and GPL, see LICENSES.
*
* A node.js configuration convention with a minimal readonly interface.
*/

/*jslint vars: true, white: true*/

var exported = (function() {
    var priv = {},
        pub = {};

    priv.nconf = require("nconf");

    priv.hasFilename = function(mod) {
        // https://nodejs.org/api/modules.html#modules_module_filename
        //
        // The fully resolved filename to the module.
        return mod && mod.filename && typeof mod.filename === 'string' && mod.filename.length > 0;
    };

    priv.getAppPath = function() {
        // NOTE: Find a module -- preferably the entry module, if available.
        //
        // https://nodejs.org/api/modules.html#modules_module_require_id
        //
        // Because module provides a filename property (normally equivalent to __filename), the entry point of the
        // current application can be obtained by checking require.main.filename.
        //
        // https://nodejs.org/api/process.html#process_process_mainmodule
        //
        // The process.mainModule property provides an alternative way of retrieving require.main. The difference is
        // that if the main module changes at runtime, require.main may still refer to the original main module in
        // modules that were required before the change occurred. Generally it's safe to assume that the two refer to
        // the same module. As with require.main, process.mainModule will be undefined if there is no entry script.
        //
        // NOTE: module is defined even if there is no entry script.
        if (!(require.main || process.mainModule)) {
            console && console.warn && console.warn("configvention: Could not find the entry nor current module. Not loading configuration from files.");

            return null;
        }

        // Return the first available filename.
        if (require && priv.hasFilename(require.main)) {
            return require.main.filename;
        }

        if (process.mainModule && priv.hasFilename(process.mainModule)) {
            return process.mainModule.filename;
        }

        console && console.warn && console.warn("configvention: Could not find the filename of the module. Not loading configuration from files.");

        return null;
    };

    priv.initialize = function() {
        var appPath = priv.getAppPath();

        var nconfLoadingSteps = priv.nconf.argv().env();

        if (appPath) {
            nconfLoadingSteps.file({
                file: appPath + ".config.json"
            }).file("defaults", {
                file: appPath + ".defaults.config.json"
            });
        }
    };

    pub.get = function(name) {
        return priv.nconf.get(name);
    };

    priv.initialize();

    return pub;
}());

module.exports = exported;
