import Marzipan from "@Marzipan/marzipan";
import Tween from "@Tween/tween";
import { IN_OVERSHOOT, OUT_ELASTIC } from "@Tween/ease";
import Vector2 from "@Marzipan/math/vector2";
import Actor from "game/entities/actor";

let Loot = function (settings) {
	let _actor;
	let _options = settings.options;

	let _onDeath = function (data) {
		let option = null;
		if (_options.length === 1) {
			option = _options[0];
		} else {
			let totalWeight = _options.reduce((a, c) => a + c.weight, 0);
			let roll = Math.floor(Math.random()*totalWeight);
			for (let ii = 0; ii < _options.length; ii++){
				if (roll < _options[ii].weight){
					option = _options[ii];
					break;
				} else {
					roll -= _options[ii].weight
				}
			}
		}

		if (option.type === 'nothing') return;

		let pickedType = option.type;
		let pickedValue = Marzipan.random.int(option.value.min, option.value.max);

		//store these values before actor gets removed
		let scene = _actor.scene;
		let tile = _actor.tile;

		data.addPromise(() => new Promise((resolve, reject) => {
			let lootActor = new Actor(Marzipan.assets.get('yaml', 'actors/' + pickedType));

			Marzipan.events.emit('logLine', `${_actor.coloredName} drops ${lootActor.coloredName}`);

			tile.addActor(lootActor);
			scene.addEntity(lootActor);

			lootActor.emit('setValue', pickedValue);

			resolve();
		}));
	};

	let start = function (data) {
		_actor = data.entity;

		_actor.on('die', _onDeath);
	};

	let die = function () {
		_actor.off('die', _onDeath);
	};

	let loot = {
		name: 'loot',
		start,
		die
	};

	Object.defineProperties(loot, {

	});

	return loot;
};

export default Loot;