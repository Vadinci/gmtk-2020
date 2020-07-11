import Entity from "@Marzipan/core/entity";
import Marzipan from "@Marzipan/marzipan";
import Sprite from "@Marzipan/graphics/sprite";
import Vector2 from "@Marzipan/math/vector2";

const BASE_PIC = 'main/buttons';

const DIRECTIONS = {
	up: 0,
	down: 1,
	left: 2,
	right: 3
};

let ShiftButton = function (settings) {
	let _dir = settings.direction || 'up';

	let entity = new Entity({
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

	entity.addComponent(sprite);

	return entity;
};

export default ShiftButton;