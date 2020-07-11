//TODO categories

const Path = require('path');
const FS = require('fs');
const YAML = require('js-yaml');

const BASE_FOLDER = './src/assets';

const SUPPORTED_TYPES = [
	'png',
	'mp3',
	'yaml'
];

let collectedAssets = {};

let parseFolder = function (folderPath, prefix) {
	let files = FS.readdirSync(Path.join(BASE_FOLDER, folderPath));
	files.forEach((file, idx) => {
		filePath = Path.join(BASE_FOLDER, folderPath, file);
		let stats = FS.statSync(filePath);

		if (stats.isDirectory()) {
			parseFolder(Path.join(folderPath, file), prefix + '/' + folderPath);
		} else {
			let extension = file.split('.').pop();
			if (SUPPORTED_TYPES.indexOf(extension) === -1) return;

			let name = folderPath + '/' + file.split('.')[0];
			console.log(`\t${extension.toUpperCase()}\t${name}`);

			collectedAssets[name] = {
				path : folderPath + '/' + file,
				extension : extension
			};
		}
	});
};

//TODO sort by extension?
//TODO add comments?
let writeToYaml = function(data, path){
	let parsedData = {assets : {}};

	for (let key in data){
		parsedData.assets[key] = data[key].path;
	}

	let yaml = YAML.dump(parsedData);

	FS.writeFileSync(path, yaml);
};

//start parsing from the root folder
parseFolder('', '');
//write the collected assets to assets.yaml
writeToYaml(collectedAssets, './src/assets.yaml');