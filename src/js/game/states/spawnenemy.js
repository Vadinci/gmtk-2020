import ConfirmHUD from "ui/confirmhud";
import Marzipan from "@Marzipan/marzipan";
import Game from "game/game";
import Session from "game/session";
import Actor from "game/entities/actor";

let SpawnEnemyState = function (context, machine) {
	//Variables
	let _confirmHud;

	//TODO
	let _maxInterval = 5;
	let _minInterval = 2;

	let _currentInterval = _maxInterval;
	let _counter = 0;

	let _enemyTypes = ['goblin'];

	//State functions
	let start = function () {
		_counter++;
		if (_counter >= _currentInterval) {
			_doSpawn();
			_currentInterval = Math.max(_minInterval, _currentInterval - 1);
			_counter = 0;
		}
		machine.setState('startInput');
	};

	let update = function () {

	};

	let end = function () {
		
	};

	//Handlers
	let _doSpawn = function () {
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

		let tile = null;
		while (tiles.length > 0 && !tile) {
			let attemptTile = tiles.pop();
			if (!attemptTile.solid && !attemptTile.actors.length) tile = attemptTile;
		}
		if (!tile) return;

		let actorType = Marzipan.random.pick(_enemyTypes);
		let actor = new Actor(Marzipan.assets.get('yaml', 'actors/' + actorType));

		tile.addActor(actor);
		context.gameScene.addEntity(actor);

		context.enemies.push(actor);

		Marzipan.events.emit('logLine', `a ${actor.coloredName} has appeared!`);
	};

	//State
	let state = {
		start,
		update,
		end
	};

	Object.defineProperty(state, 'key', {
		get: () => 'spawnEnemy'
	});

	return state;
};

Object.defineProperty(SpawnEnemyState, 'key', {
	get: () => 'spawnEnemy'
});

export default SpawnEnemyState;