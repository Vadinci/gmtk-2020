import Marzipan from "@Marzipan/marzipan";
import Wall from "game/entities/wall";
import Actor from "game/entities/actor";

//State in which the dungeon is generated
let GenerateState = function (context, machine) {
	//Variables
	let delay = 2;

	//State functions
	let start = function () {
		delay = 2;
	};

	let update = function () {
		delay--;
		if (delay <= 0) {
			_generate();
			machine.setState('startInput');
		}
	};

	let end = function () {

	};


	//Handlers
	let _generate = function () {
		let tiles = context.dungeon.tiles;
		//shuffle tiles;
		(() => {
			let tmp, jj;
			for (let ii = tiles.length - 1; ii >= 0; ii--) {
				tmp = tiles[ii];
				jj = Math.floor(Math.random() * (ii + 1));
				tiles[ii] = tiles[jj];
				tiles[jj] = tmp;
			}
		})();

		//place walls (purely random now)
		let wallCount = Marzipan.random.int(35, 50); //TODO tweak
		for (let ii = 0; ii < wallCount; ii++) {
			let tile = tiles.pop();
			let wall = new Wall();
			context.gameScene.addEntity(wall);
			wall.transform.parent = tile.transform;
			tile.setSolid(1);
		}

		//place hero
		let heroTile = tiles.pop();
		let hero = new Actor(Marzipan.assets.get('yaml', 'actors/hero'));
		context.hero = hero;
		heroTile.addActor(hero);
		context.gameScene.addEntity(hero);


		//place some goblins
		for (let ii = 0; ii < 4; ii++) {
			let tile = tiles.pop();
			let goblin = new Actor(Marzipan.assets.get('yaml', 'actors/goblin'));
			context.enemies.push(goblin);
			tile.addActor(goblin);
			context.gameScene.addEntity(goblin);
		}

		//place some treasure
		for (let ii = 0; ii < 2; ii++) {
			let tile = tiles.pop();
			let treasure = new Actor(Marzipan.assets.get('yaml', 'actors/treasure'));
			tile.addActor(treasure);
			context.gameScene.addEntity(treasure);
		}
	};


	//State
	let state = {
		start,
		update,
		end
	};

	Object.defineProperty(state, 'key', {
		get: () => 'generate'
	});

	return state;
};

Object.defineProperty(GenerateState, 'key', {
	get: () => 'generate'
});

export default GenerateState;