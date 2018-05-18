//@ts-check

/*
	This file is used for generate `manifest.json`
*/

const fs = require('fs');
const path = require('path');

const packageJSON = path.join(__dirname, '..', 'package.json');
const iconDir = path.join(__dirname, '..', 'extension', 'icons');
const targetFile = path.join(__dirname, '..', 'extension', 'manifest.json');

const pkg = loadPackageJSON();

fs.writeFileSync(targetFile, JSON.stringify({
	manifest_version: 2,
	name: pkg.chromeExtensionName,
	version: pkg.version,

	description: pkg.description,

	content_scripts: [{
		matches: [
			'*://github.com/',
			'*://github.com/dashboard/*',
			'*://github.com/?q=*', // self dashboard with querystring
			'*://github.com/orgs/*', // organziation dashboard page
		],
		run_at: 'document_start',
		all_frames: false,
		js: ["dist/scripts/index.js"],
		css: ['dist/stylesheets/index.css'],
	}],

	icons: loadIcons(),
	permissions: [
		'*://github.com/*'
	]
}, null, '\t'));

function loadIcons() {
	const iconExtName = '.png';

	const iconNames = fs.readdirSync(iconDir).filter(fname => fname.endsWith(iconExtName));
	const dirName = path.basename(iconDir);

	const icons = {};
	for (let icon of iconNames)
		icons[path.basename(icon, iconExtName)] = path.join(dirName, icon);;
	return icons;
}

function loadPackageJSON() {
	try {
		return JSON.parse(fs.readFileSync(packageJSON, 'utf8'));
	} catch (exception) {
		console.error(`Fatal: could not load package.json`);
		throw exception;
	}
}
