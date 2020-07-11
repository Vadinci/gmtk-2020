import Entity from "@Marzipan/core/entity";
import Marzipan from "@Marzipan/marzipan";
import Sprite from "@Marzipan/graphics/sprite";
import Vector2 from "@Marzipan/math/vector2";

import { TILE_SIZE } from "../../consts";

const BASE_PIC = 'main/tiles';

let Tile = function (settings) {
	let entity = new Entity({
		name: 'tile',
		z: settings.z || 0
	});

	let sprite = new Sprite({
		picture: Marzipan.assets.get('picture', BASE_PIC),
		origin: new Vector2(TILE_SIZE / 2, TILE_SIZE / 2),
		frameWidth: TILE_SIZE,
		frameHeight: TILE_SIZE
	});

	sprite.setFrame(Marzipan.random.int(0, 3));

	entity.addComponent(sprite);

	return entity;
};

export default Tile;