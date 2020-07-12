import Marzipan from "@Marzipan/marzipan";
import Tween from "@Tween/tween";
import { IN_OVERSHOOT, OUT_ELASTIC } from "@Tween/ease";
import Vector2 from "@Marzipan/math/vector2";

let Openable = function (settings) {
	let _actor;

	let _onInteract = function (data) {
		let other = data.other;

		data.addPromise(() => new Promise((resolve, reject) => {
			Marzipan.events.emit('logLine', `${other.coloredName} opens ${_actor.coloredName}!`);

			let tween = new Tween({
				startValue: 1.2,
				endValue: 1,
				duration: 45,
				easeFunc: OUT_ELASTIC,
				onUpdate: (v, t) => {
					_actor.scale.x = v;
					_actor.scale.y = 1/v;
				},
				onComplete: () => {
					resolve();

					_actor.visible = false;
					_actor.active = false;

					_actor.tile.removeActor(_actor);
					_actor.scene.removeEntity(_actor);

					_actor.removeComponent(tween);
				}
			});
			_actor.addComponent(tween);
		}));

		_actor.emit('die', {
			addPromise : data.addPromise
		});
	};

	let start = function (data) {
		_actor = data.entity;

		_actor.on('handleInteract', _onInteract);
	};

	let die = function () {
		_actor.off('handleInteract', _onInteract);
	};

	let openable = {
		name: 'openable',
		start,
		die
	};

	Object.defineProperties(openable, {
		
	});

	return openable;
};

export default Openable;