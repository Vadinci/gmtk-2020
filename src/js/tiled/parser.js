import TiledMap from "./map";
import TiledObjectLayer from "./objectlayer";
import Vector2 from "@Marzipan/math/vector2";

let _parseObjectLayer = function (source) {
	let layer = new TiledObjectLayer();
	layer.name = source.name;
	layer.visible = source.visible;
	layer.position = new Vector2(source.x, source.y);

	for (let ii = 0; ii < source.objects.length; ii++) {
		let obj = source.objects[ii];

		let object = {};
		object.name = obj.name;
		object.position = new Vector2(obj.x, obj.y);
		object.rotation = obj.rotation;

		if (obj.polygon) {
			//TODO wrap in a polygon object?
			object.type = 'polygon';
			object.points = obj.polygon;
			for (let ii = 0; ii < object.points.length; ii++) {
				object.points[ii].x += object.position.x;
				object.points[ii].y += object.position.y;
			}
			object.position.set(0, 0);
		} else if (obj.point) {
			object.type = 'point';
		} else if (obj.ellipse) {
			object.type = 'ellipse';
			object.width = obj.width;
			object.height = obj.height;
		} else if (obj.width && obj.height) {
			object.type = 'rectangle';
			object.width = obj.width;
			object.height = obj.height;
		}

		layer.addObject(object);
	}

	return layer;
};

let _parseMap = function (source) {
	let map = new TiledMap();

	map.width = source.width;
	map.height = source.height;

	map.tileWidth = source.tilewidth;
	map.tileHeight = source.tileheight;

	for (let ii = 0; ii < source.layers.length; ii++) {
		let layerSource = source.layers[ii];
		if (layerSource.type === 'objectgroup') {
			let layer = _parseObjectLayer(layerSource);
			map.addObjectLayer(layer);
		}
	}

	return map;
};

let parse = function (source) {
	let map = _parseMap(source);

	return map;
};

let TiledParser = {
	parse
};

export default TiledParser;