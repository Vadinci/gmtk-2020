import Transform from "@Marzipan/math/transform";
import Vector2 from "@Marzipan/math/vector2";
import ENSURE from "@Marzipan/utils/ensure";

let UICounter = function (settings) {
	let _picture = ENSURE(settings.picture);

	let _glyphMap = settings.glyphMap || {};
	let _spacing = settings.spacing || 2;
	let _alignmentX = settings.alignmentX === undefined ? 0.5 : settings.alignmentX;
	let _alignmentY = settings.alignmentY === undefined ? 0.5 : settings.alignmentY;

	let _origin = new Vector2(); //to calculate;

	let _value = settings.value ? settings.value.toString() : '';

	let _drawInstructions = [];

	let _transform = new Transform();

	let added = function (data) {
		_transform.setParent(data.entity.transform);
	};

	let update = function (data) { };

	let draw = function (data) {
		data.renderer.setTransform(_transform.globalMatrix);

		for (let ii = 0; ii < _drawInstructions.length; ii++) {
			data.renderer.drawPicturePart(
				_picture,
				_drawInstructions[ii * 6 + 2], _drawInstructions[ii * 6 + 3],
				_drawInstructions[ii * 6 + 4], _drawInstructions[ii * 6 + 5],
				_drawInstructions[ii * 6 + 0] - _origin.x, _drawInstructions[ii * 6 + 1] - _origin.y,
				_drawInstructions[ii * 6 + 4], _drawInstructions[ii * 6 + 5]
			);
		}
	};

	let setValue = function (value) {
		value = value.toString();
		if (value === _value) return;
		_value = value;

		_findDrawInstructions();
	};

	let _findDrawInstructions = function () {
		_drawInstructions = [];
		let xx = 0;
		let width = 0;
		for (let ii = 0; ii < _value.length; ii++) {
			let glyph = _value[ii];
			if (!_glyphMap[glyph]) continue;
			let mapping = _glyphMap[glyph];

			_drawInstructions.push(
				xx,
				mapping.height * -_alignmentY,
				mapping.x,
				mapping.y,
				mapping.width,
				mapping.height,
			);

			width = xx + mapping.width;
			xx += mapping.width + _spacing;
		}

		_origin.x = width * _alignmentX;
	};

	let counter = {
		added,
		update,
		draw,

		setValue
	};

	Object.defineProperties(counter, {
		transform: { get: () => _transform },

		position: { get: () => _transform.position },
		scale: { get: () => _transform.scale }
		// rotation: { get: () => _transform }, TODO
	});

	_findDrawInstructions();

	return counter;
};

export default UICounter;