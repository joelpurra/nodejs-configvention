# nodejs-configvention

A node.js configuration convention with a minimal readonly interface.


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



## Usage

```javascript
var configuration = require("configvention");

var something = configuration.get("something");
```


## Installation

```bash
npm install configvention
```



## Alternatives

Some alternatives found glancing over npm modules [dependent](https://npmjs.org/browse/depended/nconf) on [nconf](https://npmjs.org/package/nconf).

> - [nconfs](https://npmjs.org/package/nconfs) node.js convention/library for multiple nconf settings.

> - [reconf](https://npmjs.org/package/reconf) Recursive configuration file management with defaults and overrides for nconf.




## License
Copyright (c) 2012, Joel Purra <http://joelpurra.se/>
All rights reserved.

When using nodejs-configvention, comply to at least one of the three available licenses: BSD, MIT, GPL.
Please see the LICENSE file for details.


