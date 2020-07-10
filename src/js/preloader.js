//TODO centralize

import YamlLoader from "@Marzipan/io/loaders/yamlloader";
import Marzipan from "@Marzipan/marzipan";

let yamlLoader = new YamlLoader();

let fromYaml = function (path, onComplete, onLoad) {
	let toLoad = 0;
	let loaded = 0;

	let onFileLoaded = function (file) {
		loaded++;
		onLoad && onLoad(file, loaded, toLoad);
		if (loaded === toLoad) {
			//done
			onComplete && onComplete();
		}
	};

	yamlLoader.load(path)
		.then(data => {
			for (let key in data) {
				let basePath = key + '/';
				for (let name in data[key]) {
					let path = data[key][name];
				
					toLoad++;
					Marzipan.assets.load(basePath + path, name, onFileLoaded);
				}
			}
			if (toLoad === 0){
				//no assets were declared at all
				onComplete && onComplete();
			}
		});
};

let Preloader = {
	fromYaml
};

export default Preloader;