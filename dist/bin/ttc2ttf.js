#!/usr/bin/env node
"use strict";
var ttc2ttf = require('../index');
if (process.argv[2] != null) {
    var fontPath = process.argv[2];
    var distPath = (process.argv[3] != null) ? process.argv[3] : './';
    ttc2ttf(fontPath, distPath);
}
else {
    var help = "Command:\n" +
        " ttc2ttf <ttc path> [dist path]\n";
    console.log(help);
}
