#!/usr/bin/env node

const ttc2ttf = require('../index');

if (process.argv[2] != null) {
	const fontPath = process.argv[2]
	const distPath = (process.argv[3] != null) ? process.argv[3] : './'
	ttc2ttf(fontPath, distPath)
} else {
	const help = "Command:\n" +
	" ttc2ttf <ttc path> [dist path]\n"
	console.log(help)
}