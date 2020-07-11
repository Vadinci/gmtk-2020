import Marzipan from "@Marzipan/marzipan";
import Rectangle from "@Marzipan/math/rectangle";
import ENSURE from "@Marzipan/utils/ensure";
import Vector2 from "@Marzipan/math/vector2";

let Clickable = function (settings) {
	ENSURE(settings);

	let _area = settings.area || new Rectangle(0, 0, 10, 10);
	let _callback = settings.callback;

	let _parent = null;

	let _cachedClickPos = new Vector2();

	let _onClick = function (data) {
		//TODO proper transformation
		_cachedClickPos.copy(data.position);
		if (_parent) {
			let mat = _parent.transform.globalMatrix;

			_cachedClickPos.x -= mat[2];
			_cachedClickPos.y -= mat[5];
		}

		if (!_area.contains(_cachedClickPos)) return;

		_callback && _callback(_cachedClickPos);
	};

	let start = function (data) {
		Marzipan.input.touch.on('start', _onClick);
		_parent = data.entity;
	};

	let die = function () {
		Marzipan.input.touch.off('start', _onClick);
	};

	return {
		start,
		die
	};
};

export default Clickable;