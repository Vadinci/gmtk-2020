//a UIScene is a like a scene, but also handles input and passes it to all it's children

import Dispatcher from "@Marzipan/core/dispatcher";
import Transform from "@Marzipan/math/transform";

//elements in a a UIScene don't have seperate orders. Everything is updated 0->x and rendered 0->x.
//events (like a click, keyboard event) are passed from the leafs (the components) all the way to the root in an x->0 order.
//This way, the elements that are rendered on top get to deal with events first

let UIScene = function (settings) {
	let _elements = [];

	let _addList = [];
	let _removeList = [];

	let _name = settings.name || 'scene';
	let _layer = settings.layer || 0; 

	let _transform = new Transform();

	let start = function (gameData) {
		scene.emit('start');

		_handleAddList(gameData);
		_handleRemoveList(gameData);
		_sortElements();

		for (let ii = 0; ii < _elements.length; ii++) {
			gameData.element = _elements[ii];
			_elements[ii].start(gameData);
		}
	};

	let update = function (gameData) {
		scene.emit('preUpdate', gameData);

		for (let ii = 0; ii < _elements.length; ii++) {
			gameData.element = _elements[ii];
			_elements[ii].update(gameData);
		}

		_handleAddList(gameData);
		_handleRemoveList(gameData);

		_sortElements()

		scene.emit('postUpdate', gameData);
	};

	let draw = function (gameData) {
		scene.emit('preDraw', gameData);

		for (let ii = 0; ii < _elements.length; ii++) {
			gameData.element = _elements[ii];
			_elements[ii].draw(gameData);
		}

		scene.emit('postDraw', gameData);
	};


	let drawDebug = function (gameData) {
		scene.emit('preDrawDebug', gameData);

		for (let ii = 0; ii < _elements.length; ii++) {
			gameData.element = _elements[ii];
			_elements[ii].drawDebug(gameData);
		}

		scene.emit('postDrawDebug', gameData);
	};

	let die = function (gameData) {
		scene.emit('die');


		_handleAddList(gameData);
		_handleRemoveList(gameData);
		_sortElements();

		for (let ii = 0; ii < _elements.length; ii++) {
			gameData.element = _elements[ii];
			_elements[ii].die(gameData);
		}
	};


	let addElement = function (entity) {
		if (_addList.indexOf(entity) !== -1) {
			return;
		}
		_addList.push(entity);
	};

	let removeElement = function (entity) {
		if (_removeList.indexOf(entity) !== -1) {
			return;
		}
		_removeList.push(entity);
	};

	let _handleAddList = function (gameData) {
		for (let ii = 0; ii < _addList.length; ii++) {
			_elements.push(_addList[ii]);
			gameData.element = _addList[ii];
			_addList[ii].scene = scene;
			_addList[ii].start(gameData);

			_addList[ii].transform.setParent(_transform);
		}
		_addList = [];
	};

	let _handleRemoveList = function (gameData) {
		for (let ii = 0; ii < _removeList.length; ii++) {
			gameData.element = _removeList[ii];
			_removeList[ii].die(gameData);
			_removeList[ii].scene = undefined;

			_elements.splice(_elements.indexOf(_removeList[ii]), 1);
		}
		_removeList = [];
	};

	let _sortElements = function () {
		//sort update order
		//TODO in place sorting
		_elements.sort(function (a, b) {
			return a.z - b.z;
		});
	};


	let getByName = function (name) {
		let result = [];
		for (let ii = 0; ii < _elements.length; ii++) {
			if (_elements[ii].name === name) result.push(_elements[ii]);
		}
		return result;
	};

	let getByTags = function (tags) {
		tags = [].concat(tags); //force to array;

		let result = [];
		for (let ii = 0; ii < _elements.length; ii++) {
			if (_elements[ii].hasTags(tags)) result.push(_elements[ii]);
		}
		return result;
	};

	let scene = {
		start,
		update,
		draw,
		drawDebug,
		die,

		addElement,
		removeElement,

		getByName,
		getByTags,

		setName: name => _name = name
	};
	Object.defineProperties(scene,
		{
			name: {
				get: () => _name
			},
			layer: {
				get: () => _layer
			},
			transform: {
				get: () => _transform
			}
		}
	);
	Dispatcher.make(scene);
	return scene;
};

export default UIScene;