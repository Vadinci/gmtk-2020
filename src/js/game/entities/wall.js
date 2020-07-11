import Entity from "@Marzipan/core/entity";
import Marzipan from "@Marzipan/marzipan";

import { TILE_SIZE } from "../../consts";
import Sprite from "@Marzipan/graphics/sprite";
import Vector2 from "@Marzipan/math/vector2";

const BASE_PIC = 'main/walls';

let Wall = function (settings) {
	let wall = new Entity({
		name: 'wall'
	});


	let sprite = new Sprite({
		picture: Marzipan.assets.get('picture', BASE_PIC),
		origin: new Vector2(TILE_SIZE / 2, TILE_SIZE / 2),
		frameWidth: TILE_SIZE,
		frameHeight: TILE_SIZE
	});
	sprite.setFrame(Marzipan.random.int(0, 3));
	wall.addComponent(sprite);

	return wall;
};

export default Wall;