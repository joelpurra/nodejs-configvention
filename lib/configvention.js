/*!
* @license nodejs-configvention
* Copyright (c) 2012, 2016, 2021, 2023, Joel Purra <https://joelpurra.com/>
* Released under BSD, MIT and GPL, see LICENSES.
*
* A node.js configuration convention with a minimal readonly interface.
*/

import {
    statSync,
} from "node:fs";
import process from "node:process";

import debug from "debug";
import nconf from "nconf";

const exported = (function() {
    const priv = {},
        pub = {};

    priv.nconf = new nconf.Provider();
    priv.debug = debug("configvention");
    priv.debug.getAppPath = debug("configvention:getAppPath");
    priv.debug.initialize = debug("configvention:initialize");
    priv.debug.get = debug("configvention:get");

    priv.isNonEmptyString = function(value) {
        return typeof value === "string" && value.length > 0;
    };

    priv.hasFilename = function(mod) {
        // https://nodejs.org/api/modules.html#modules_module_filename
        //
        // The fully resolved filename to the module.
        return mod && mod.filename && priv.isNonEmptyString(mod.filename);
    };

    priv.getAppPath = function() {
        if (!(
                (process && process.mainModule && priv.hasFilename(process.mainModule))
                || (process && process.argv && priv.isNonEmptyString(process.argv[1]))
            )) {
            priv.debug.getAppPath("Could not find the entry nor current module. Not loading configuration from files.");

            return null;
        }

        let appPath = null;

        // Return the first available filename.
        if (process.mainModule && priv.hasFilename(process.mainModule)) {
            appPath = process.mainModule.filename;
        } else if (process && process.argv && priv.isNonEmptyString(process.argv[1])) {
            appPath = process.argv[1];
        }

        if (appPath) {
            priv.debug.getAppPath("Using app path: " + appPath);

            if (appPath.indexOf("node_modules/") !== -1) {
                priv.debug.getAppPath("App path seems to be pointing to inside `node_modules/`: " + appPath);
            }
        } else {
            priv.debug.getAppPath("Could not find the filename of the module. Not loading configuration from files.");
        }

        return appPath;
    };

    priv.initialize = function() {
        const appPath = priv.getAppPath();

        const nconfLoadingSteps = priv.nconf.argv().env();

        if (appPath) {
            const overridePath = appPath + ".config.json";
            const defaultsPath = appPath + ".defaults.config.json";

            try {
                statSync(overridePath).isFile();

                priv.debug.initialize("Configuration override file found: " + overridePath);

                nconfLoadingSteps = nconfLoadingSteps.file({
                    file: overridePath,
                });
            } catch(e) {
                priv.debug.initialize("Configuration override file not found: " + overridePath);
            }

            try {
                statSync(defaultsPath).isFile();

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
        const value = priv.nconf.get(name);

        priv.debug.get("" + name + '=' + value);

        return value;
    };

    priv.initialize();

    return pub;
}());

export default exported;
