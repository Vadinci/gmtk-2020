import Entity from "@Marzipan/core/entity";
import ENSURE from "@Marzipan/utils/ensure";
import Sprite from "@Marzipan/graphics/sprite";
import AI from "game/components/ai";

let COMPONENT_MAP = {
	sprite: Sprite,
	ai: AI
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


	actor.setTile = function(t){
		_tile = t;
	};

	Object.defineProperties(actor, {
		tile: { get: () => _tile }
	});

	return actor;
};

export default Actor;