import Marzipan from "@Marzipan/marzipan";
import Tween from "@Tween/tween";
import { IN_OVERSHOOT } from "@Tween/ease";
import Vector2 from "@Marzipan/math/vector2";

let Attackable = function (settings) {
	let _actor;

	let _health = settings.health || 1;

	let _onInteract = function (data) {
		let other = data.other;

		//TODO damage?
		_health--;

		_actor.emit('hit', data);

		data.addPromise(() => new Promise((resolve, reject) => {
			Marzipan.events.emit('logLine', `${other.coloredName} attacks ${_actor.coloredName}!`);

			let delta = Vector2.sub(_actor.tile.position, other.tile.position);
			let base = other.position.clone();

			let tween = new Tween({
				startValue: 0.5,
				endValue: 0,
				duration: 12,
				easeFunc: IN_OVERSHOOT,
				onUpdate: (v, t) => {
					other.position.set(base.x + v * delta.x, base.y + v * delta.y);
				},
				onComplete: () => {
					console.log('tween complete!');
					other.removeComponent(tween);
					resolve();
				}
			});
			other.addComponent(tween);
		}));

		if (_health === 0) {
			data.addPromise(() => new Promise((resolve, reject) => {
				Marzipan.events.emit('logLine', `${_actor.coloredName} dies!`);

				_actor.active = false;
				_actor.visible = false;

				_actor.tile.removeActor(_actor);
				_actor.scene.removeEntity(_actor);

				resolve();
			}));

			_actor.emit('die', {
				addPromise: data.addPromise
			});
		}
	};

	let start = function (data) {
		_actor = data.entity;

		_actor.on('handleInteract', _onInteract);
	};

	let die = function () {
		_actor.off('handleInteract', _onInteract);
	};

	let attackable = {
		name: 'attackable',
		start,
		die,

		setHealth: h => { _health = h; }
	};

	Object.defineProperties(attackable, {
		health: { get: () => _health }
	});

	return attackable;
};

export default Attackable;