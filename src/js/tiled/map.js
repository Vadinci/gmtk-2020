let TiledMap = function () {
	let _objectLayers = [];

	let addObjectLayer = function (layer) {
		_objectLayers.push(layer);
	};

	let getObjectLayers = function () {
		return [].concat(_objectLayers);
	};

	let getObjectLayer = function (name) {
		for (let ii = 0; ii < _objectLayers.length; ii++) {
			if (_objectLayers[ii].name === name) return _objectLayers[ii];
		}
	};

	let map = {
		width: 8,
		height: 8,
		tileWidth: 16,
		tileHeight: 16,

		addObjectLayer,
		getObjectLayers,
		getObjectLayer
	};

	return map;
};

export default TiledMap;