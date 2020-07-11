import Entity from "@Marzipan/core/entity";
import Marzipan from "@Marzipan/marzipan";
import Sprite from "@Marzipan/graphics/sprite";
import Vector2 from "@Marzipan/math/vector2";

import { TILE_SIZE } from "../../consts";

const BASE_PIC = 'main/tiles';

let Tile = function (settings) {
	//TODO bitmask for collision?

	let _solid = 0;
	let _actors = [];

	let _dungeon = settings.dungeon;
	let _col = settings.col;
	let _row = settings.row;

	let tile = new Entity({
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
	tile.addComponent(sprite);




	tile.addActor = function (a) {
		let idx = _actors.indexOf(a);
		if (idx !== -1) {
			console.warn('actor already present');
			return;
		}

		a.transform.parent = tile.transform;

		_actors.push(a);

		a.setTile(tile);
	};

	tile.removeActor = function (a) {
		let idx = _actors.indexOf(a);
		if (idx === -1) {
			console.warn('actor not present');
			return;
		}
		
		_actors.splice(idx, 1);
	}

	tile.setSolid = function (s) {
		_solid = s;
	};

	tile.setPosition = function (c, r) {
		_col = c === undefined ? _col : c;
		_row = r === undefined ? _row : r;
	};

	Object.defineProperties(tile, {
		solid: { get: () => _solid },
		actors: { get: () => [].concat(_actors) },
		dungeon: { get: () => _dungeon },

		col: { get: () => _col },
		row: { get: () => _row },
	});

	return tile;
};

export default Tile;