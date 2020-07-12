import Marzipan from "@Marzipan/marzipan";
import Tween from "@Tween/tween";
import { IN_OVERSHOOT, OUT_ELASTIC, IN_OUT_QUAD } from "@Tween/ease";
import Vector2 from "@Marzipan/math/vector2";
import { TILE_SIZE } from "consts";
import Session from "game/session";

let Pickup = function (settings) {
	let _actor;

	let _type = settings.type;
	let _value = settings.value;

	let _onInteract = function (data) {
		let other = data.other;

		let delta = new Vector2();
		delta.x = (_actor.tile.col - other.tile.col) * TILE_SIZE;
		delta.y = (_actor.tile.row - other.tile.row) * TILE_SIZE;

		data.addPromise(() => new Promise((resolve, reject) => {
			//TODO get value here?
			Marzipan.events.emit('logLine', `${other.coloredName} picks up ${_actor.coloredName}.`);

			Session.add(_type, _value);

			other.tile.removeActor(other);
			_actor.tile.addActor(other);

			let tween = new Tween({
				startValue: -1,
				endValue: 0,
				duration: 15,
				easeFunc: IN_OUT_QUAD,
				onUpdate: (v, t) => {
					other.position.set(delta.x * v, delta.y * v);
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

		_actor.emit('pickup', {
			addPromise : data.addPromise
		});
	};

	let _onSetValue = function(v){
		_value = v;
	};

	let added = function (data) {
		_actor = data.entity;

		_actor.on('handleInteract', _onInteract);
		_actor.on('setValue', _onSetValue);
	};

	let die = function () {
		_actor.off('handleInteract', _onInteract);
		_actor.off('setValue', _onSetValue);
	};

	let pickup = {
		name: 'pickup',
		added,
		die
	};

	Object.defineProperties(pickup, {
		
	});

	return pickup;
};

export default Pickup;