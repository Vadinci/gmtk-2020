import Vector2 from "../../lib/links/marzipan/math/vector2";

let TiledObjectLayer = function () {
	let _objects = [];

	let addObject = function (obj) {
		_objects.push(obj);
	};

	let getObjects = function () {
		return [].concat(_objects);
	};

	let getObject = function (name) {
		for (let ii = 0; ii < _objects.length; ii++) {
			if (_objects[ii].name === name) return _objects[ii];
		}
	};

	let layer = {
		name: 'objectLayer',

		position: new Vector2(0, 0),
		rotation: 0,

		addObject,
		getObjects,
		getObject
	};

	return layer;
};

export default TiledObjectLayer;