import Entity from "@Marzipan/core/entity";
import Marzipan from "@Marzipan/marzipan";
import Sprite from "@Marzipan/graphics/sprite";
import Vector2 from "@Marzipan/math/vector2";
import Clickable from "game/components/clickable";
import Rectangle from "@Marzipan/math/rectangle";

const BASE_PIC = 'main/buttons';

const NOTHING = () => { };

const DIRECTIONS = {
	up: 0,
	down: 1,
	left: 2,
	right: 3
};

let ShiftButton = function (settings) {
	let _dir = settings.direction || 'up';

	let _callback = NOTHING;

	let button = new Entity({
		name: 'shiftButton',
		z: settings.z || 0
	});

	let sprite = new Sprite({
		picture: Marzipan.assets.get('picture', BASE_PIC),
		frameWidth: 32,
		frameHeight: 32,
		origin: new Vector2(16, 16)
	});
	sprite.setFrame(DIRECTIONS[_dir]);
	button.addComponent(sprite);

	let clickable = new Clickable({
		area: new Rectangle(-16, -16, 32, 32),
		callback: () => {
			_callback();
		}
	});
	button.addComponent(clickable);

	button.activate = function (cb) {
		_callback = cb || NOTHING;
		button.visible = true;
	};

	button.deactivate = function () {
		_callback = NOTHING;
		button.visible = false;
	};


	return button;
};

export default ShiftButton;