# [nodejs-configvention](https://joelpurra.com/projects/nodejs-configvention/)

A node.js *configuration convention* with a minimal readonly interface. Reads configuration values from the environment, arguments, override configuration file, defaults configuration file.

Available from [npm](https://www.npmjs.com/) as [`configvention`](https://www.npmjs.com/package/configvention).



## Usage

```javascript
import configuration from "configvention";

var something = configuration.get("something");
```



## Installation

```bash
npm install --save configvention@latest
```


## Convention

This is the order settings are *read* for the example node application `my-app.js`. `configuration.get("something")` will look for `something` in this order. When the the first `something` is found, the search is stopped and the value is returned.

1. In arguments parsed from the command line, like `node my-app.js --something 1234`.
1. In the environment variables, for `something`.
1. In the JSON object from the file `my-app.js.config.json`, where `my-app.js` is the filename of your node app.
1. In the JSON object from the file `my-app.js.defaults.config.json`, where `my-app.js` is the filename of your node app.

If `something` can't be found, then it returns `undefined`.

- `my-app.js.config.json` contains settings that apply to the current folder. This file should not be checked in to your version control system (git/hg/svn), but replaced by whoever is running the node app. It's different for, for example, developers on their own machines and production servers.
- `my-app.js.defaults.config.json` contains sane defaults and is checked in to version control system.

Neither `my-app.js.config.json` nor `my-app.js.defaults.config.json` are required, but you probably would like to have at least `my-app.js.defaults.config.json`.



## Debugging

To get some insight on files loaded, configuration values read etcetera, enable debugging from the command line.

```bash
DEBUG='configvention:*' node my-app.js
```



## Versions

For details, see [git commits](https://github.com/joelpurra/nodejs-configvention/commits), [git tags](https://github.com/joelpurra/nodejs-configvention/tags) and [published npm versions](https://www.npmjs.com/package/configvention?activeTab=versions).


- Configvention >= v3.0.0:
  - [ECMAScript Module](https://nodejs.org/dist/latest/docs/api/esm.html) (ESM) [package](https://nodejs.org/dist/latest/docs/api/packages.html).
  - For use with [Node.js v16 or later](https://github.com/nodejs/release).
- Configvention <= v2.0.0:
  - [CommonJS](https://nodejs.org/dist/latest/docs/api/modules.html) (CJS) legacy package.
  - For use with all (?) Node.js versions.

## Alternatives

Some alternatives found glancing over npm modules [dependent](https://npmjs.org/browse/depended/nconf) on [nconf](https://npmjs.org/package/nconf).

- [nconfs](https://npmjs.org/package/nconfs): node.js convention/library for multiple nconf settings.
- [reconf](https://npmjs.org/package/reconf): Recursive configuration file management with defaults and overrides for nconf.



---

Copyright (c) 2012, 2016, [Joel Purra](https://joelpurra.com/)
All rights reserved.

When using [nodejs-configvention](https://joelpurra.com/projects/nodejs-configvention/), comply to at least one of the three available licenses: MIT, BSD-2-Clause, GPL-3.0.
Please see the LICENSE file for details.
