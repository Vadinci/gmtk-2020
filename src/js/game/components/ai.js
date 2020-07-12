import Marzipan from "@Marzipan/marzipan";

let AI = function (settings) {
	/**
	 * TODO
	 * pick() (promise)
	 * find all reachable tiles
	 * rate every tile (rate list based on tags)
	 * 
	 * execute(promise)
	 * go to picked tile
	 * if picked tile was an actor, go to one tile _before_ that tile and interact() with the actor
	 * 
	 * 
	 */

	let _actor;

	let _interactWith = settings.interactWith || {};

	let _pickedAction = {};

	let pick = function () {
		if (!_actor) return;

		let currentTile = _actor.tile;
		let dungeon = currentTile.dungeon;

		let possibleTiles = [];

		let moveUntilStop = function (dx, dy) {
			let pos = { c: currentTile.col, r: currentTile.row };
			while (true) {
				pos.c += dx;
				pos.r += dy;

				let tile = dungeon.getTileAt(pos.c, pos.r);
				if (!tile) break;

				if (tile.solid) break;
				possibleTiles.push(tile);

				if (tile.actors.length !== 0) {
					let other = tile.actors[0];
					let canInteract = false;
					for (let key in _interactWith) {
						if (other.hasTag(key)) {
							canInteract = true;
							break;
						}
					}
					if (!canInteract) {
						possibleTiles.pop();
					}
					break
				}
			}
		};

		moveUntilStop(-1, 0);
		moveUntilStop(1, 0);
		moveUntilStop(0, -1);
		moveUntilStop(0, 1);

		let possibleActions = [];

		possibleTiles.forEach((t) => {
			let action = {};
			action.tile = t;
			action.type = t.actors.length ? 'interact' : 'move';
			action.score = Marzipan.random.float(-0.8, 0.8);

			let bonusScore = 0;

			if (t.actors.length) {
				let other = t.actors[0];
				for (let key in _interactWith) {
					if (other.hasTag(key))
						bonusScore = Math.max(bonusScore, _interactWith[key]);
				}
			}

			action.score += bonusScore;

			possibleActions.push(action);
		});

		possibleActions.sort((a, b) => a.score - b.score);

		console.log(possibleActions);
		_pickedAction = possibleActions.pop();	//action with the highest score

		return new Promise((resolve, reject) => {
			//TODO animators and whatnot
			resolve();
		});
	};

	let execute = function () {
		let action = _pickedAction;
		let oldTile = _actor.tile;

		if (!action) {
			Marzipan.events.emit('logLine', `${_actor.name} loafs around.`);

			return new Promise((resolve, reject) => {
				//TODO animators and whatnot
				resolve();
			});
		}

		if (action.type === 'move') {
			let newTile = action.tile;

			_actor.tile.removeActor(_actor);
			action.tile.addActor(_actor);

			Marzipan.events.emit('logLine', `${_actor.name} wanders aimlessly.`);

			return new Promise((resolve, reject) => {
				_actor.handleMove({
					onComplete: resolve,
					from: oldTile,
					to: newTile
				});
			});
		} else {
			//find destination tile and move to it, then interact
			let other = action.tile.actors[0];

			let dc = _actor.tile.col - action.tile.col;
			if (dc !== 0) dc /= Math.abs(dc);

			let dr = _actor.tile.row - action.tile.row;
			if (dr !== 0) dr /= Math.abs(dr);

			let targetTile = _actor.tile.dungeon.getTileAt(action.tile.col + dc, action.tile.row + dr);

			_actor.tile.removeActor(_actor);
			targetTile.addActor(_actor);

			//TODO interact

			return new Promise((resolve, reject) => {
				_actor.handleMove({
					onComplete: () => {
						other.handleInteract({
							onComplete: resolve,
							other: _actor
						});
					},
					from: oldTile,
					to: targetTile
				});
			});
		}
	};

	let start = function (data) {
		_actor = data.entity;
	};

	let die = function () {

	};


	let ai = {
		pick,
		execute,

		start,
		die
	};

	Object.defineProperties(ai, {
		name: { get: () => 'ai' }
	});

	return ai;
};

export default AI;