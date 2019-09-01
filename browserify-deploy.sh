#!/bin/bash

./node_modules/.bin/browserify load.js -o bundle.js -t [ babelify --presets [ @babel/preset-env @babel/preset-react ] --plugins [ @babel/plugin-proposal-class-properties ] ] -v
