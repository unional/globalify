# @unional/globalify

## Wat

Globalify will install from npm then browserify a module.

## Why would anyone want this

For easy usage in testing sites like jsperf.com, or jsbin etc etc..

## installation

```sh
npm -i @unional/globalify -g
```

## Usage

### cmdline

```sh
globalify gedi -o gedi-0.10.0.js
```

### API

```js
var globalify = require('globalify');

globalify({
        module: 'gedi',
        version: '0.10.0', // OPTIONAL, Will default to x.x.x
        globalVariable: 'gedi' or function(moduleName, version){ ... }, // OPTIONAL, Will default to the module name pascalCased.
        installDirectory: 'someDir' // OPTIONAL, Will default to globalify_modules
    },
    function(error){
        // Something went a bit shit.
    }
).pipe(myAwesomeWriteStream);
```

## Attribution

This package is originally created by Kory Nunn.
<https://github.com/KoryNunn/globalify>

I have converted it to use [`webpack`](https://github.com/webpack/webpack) and then rewrite it in TypeScript.
