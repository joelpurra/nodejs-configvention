/*!
* @license nodejs-configvention
* Copyright (c) 2012, 2016, Joel Purra <https://joelpurra.com/>
* Released under BSD, MIT and GPL, see LICENSES.
*
* A node.js configuration convention with a minimal readonly interface.
*/

/*jslint vars: true, white: true*/

var exported = (function() {
    var priv = {},
        pub = {};

    priv.nconf = require("nconf");
    priv.fs = require("fs");
    priv.debug = require("debug")("configvention");
    priv.debug.getAppPath = require("debug")("configvention:getAppPath");
    priv.debug.initialize = require("debug")("configvention:initialize");
    priv.debug.get = require("debug")("configvention:get");

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
            priv.debug.getAppPath("Could not find the entry nor current module. Not loading configuration from files.");

            return null;
        }

        var appPath = null;

        // Return the first available filename.
        if (require && priv.hasFilename(require.main)) {
            appPath = require.main.filename;
        }

        if (process.mainModule && priv.hasFilename(process.mainModule)) {
            appPath = process.mainModule.filename;
        }

        if (appPath) {
            priv.debug.getAppPath("Using app path: " + appPath);

            if (appPath.indexOf('node_modules/') !== -1) {
                priv.debug.getAppPath("App path seems to be pointing to inside `node_modules/`: " + appPath);
            }
        } else {
            priv.debug.getAppPath("Could not find the filename of the module. Not loading configuration from files.");
        }

        return appPath;
    };

    priv.initialize = function() {
        var appPath = priv.getAppPath();

        var nconfLoadingSteps = priv.nconf.argv().env();

        if (appPath) {
            var overridePath = appPath + ".config.json";
            var defaultsPath = appPath + ".defaults.config.json";

            try {
                priv.fs.statSync(overridePath).isFile();

                priv.debug.initialize("Configuration override file found: " + overridePath);

                nconfLoadingSteps = nconfLoadingSteps.file({
                    file: overridePath,
                });
            } catch(e) {
                priv.debug.initialize("Configuration override file not found: " + overridePath);
            }

            try {
                priv.fs.statSync(defaultsPath).isFile();

                priv.debug.initialize("Configuration defaults file found: " + defaultsPath);

                nconfLoadingSteps = nconfLoadingSteps.file("defaults", {
                    file: defaultsPath,
                });
            } catch(e) {
                priv.debug.initialize("Configuration defaults file not found: " + defaultsPath);
            }
        }
    };

    pub.get = function(name) {
        var value = priv.nconf.get(name);

        priv.debug.get("" + name + '=' + value);

        return value;
    };

    priv.initialize();

    return pub;
}());

module.exports = exported;
