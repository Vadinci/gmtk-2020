import Marzipan from "@Marzipan/marzipan";
import Tween from "@Tween/tween";
import { IN_OVERSHOOT, OUT_ELASTIC, IN_OUT_QUAD, LINEAR } from "@Tween/ease";
import Vector2 from "@Marzipan/math/vector2";
import { TILE_SIZE } from "consts";
import Game from "game/game";
import Session from "game/session";

let Exit = function (settings) {
	let _actor;

	let _onInteract = function (data) {
		let other = data.other;

		other.z = _actor.z + 1;

		let delta = new Vector2();
		delta.x = (_actor.tile.col - other.tile.col) * TILE_SIZE;
		delta.y = (_actor.tile.row - other.tile.row) * TILE_SIZE;

		data.addPromise(() => new Promise((resolve, reject) => {
			//TODO get value here?
			Marzipan.events.emit('logLine', `${other.coloredName} descends to the next floor...`);

			other.tile.removeActor(other);
			_actor.tile.addActor(other);

			let tweenA = new Tween({
				startValue: -1,
				endValue: 0,
				duration: 15,
				easeFunc: IN_OUT_QUAD,
				onUpdate: (v, t) => {
					other.position.set(delta.x * v, delta.y * v);
				},
				onComplete: () => {
					_actor.removeComponent(tweenA);
					_actor.addComponent(tweenB);
				}
			});

			let tweenB = new Tween({
				startValue: 1,
				endValue: 0,
				duration: 24,
				easeFunc: IN_OVERSHOOT,
				onUpdate: (v, t) => {
					other.scale.set(v, v);
				},
				onComplete: () => {
					_actor.removeComponent(tweenB);
					_actor.addComponent(tweenC);
				}
			});

			let tweenC = new Tween({
				startValue: 0,
				endValue: 1,
				duration: 90,
				easeFunc: LINEAR,
				onUpdate: (v, t) => {},
				onComplete: () => {
					resolve();

					Session.floor++;

					Marzipan.engine.removeScene(_actor.scene);
					Marzipan.engine.addScene(new Game({}));
				}
			});

			_actor.addComponent(tweenA);

			
		}));
	};

	let start = function (data) {
		_actor = data.entity;

		_actor.on('handleInteract', _onInteract);
	};

	let die = function () {
		_actor.off('handleInteract', _onInteract);
	};

	let exit = {
		name: 'exit',
		start,
		die
	};

	Object.defineProperties(exit, {
		
	});

	return exit;
};

export default Exit;