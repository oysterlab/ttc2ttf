#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = __importDefault(require("../"));
if (process.argv[2] != null) {
    var fontPath = process.argv[2];
    var distPath = (process.argv[3] != null) ? process.argv[3] : './';
    __1.default(fontPath, distPath);
}
else {
    var help = "Command:\n" +
        " ttc2ttf <ttc path> [dist path]\n";
    console.log(help);
}
