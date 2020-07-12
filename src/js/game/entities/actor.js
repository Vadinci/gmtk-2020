import Entity from "@Marzipan/core/entity";
import ENSURE from "@Marzipan/utils/ensure";
import Sprite from "@Marzipan/graphics/sprite";
import AI from "game/components/ai";
import SimpleMoveAnimator from "game/components/animators/simplemove";
import Attackable from "game/components/attackable";

//TODO this doesn't scale
let COMPONENT_MAP = {
	sprite: Sprite,
	ai: AI,
	'animators/simplemove': SimpleMoveAnimator,
	attackable : Attackable
};

let Actor = function (settings) {
	ENSURE(settings);

	let _tile = null;

	let actor = new Entity({
		name: settings.name || 'actor'
	});

	if (settings.tags) {
		actor.addTags(settings.tags);
	}

	if (settings.components) {
		for (let key in settings.components) {
			let Klass = COMPONENT_MAP[key];
			if (!Klass) continue;

			let comp = new Klass(settings.components[key] || {});
			actor.addComponent(comp);
		}
	}

	actor.handleMove = function (data) {
		let promises = [];

		actor.emit('handleMove', {
			addPromise: promise => { promises.push(promise); },
			from: data.from,
			to: data.to
		});

		let p = Promise.resolve();
		for (let ii = 0; ii < promises.length; ii++) {
			p = p.then(promises[ii]);
		}
		p.then(() => data.onComplete());
	};

	actor.handleInteract = function (data) {
		let promises = [];

		actor.emit('handleInteract', {
			addPromise: promise => { promises.push(promise); },
			other: data.other
		});

		let p = Promise.resolve();
		for (let ii = 0; ii < promises.length; ii++) {
			p = p.then(promises[ii]);
		}
		p.then(() => data.onComplete());
	};

	actor.setTile = function (t) {
		_tile = t;
	};

	Object.defineProperties(actor, {
		tile: { get: () => _tile }
	});

	return actor;
};

export default Actor;