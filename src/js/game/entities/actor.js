import Entity from "@Marzipan/core/entity";
import ENSURE from "@Marzipan/utils/ensure";
import Sprite from "@Marzipan/graphics/sprite";

let COMPONENT_MAP = {
	sprite : Sprite
};

let Actor = function(settings){
	ENSURE(settings);

	let actor = new Entity({
		name : settings.name || 'actor'
	});

	if (settings.tags){
		actor.addTags(settings.tags);
	}

	if (settings.components){
		for (let key in settings.components){
			let Klass = COMPONENT_MAP[key];
			if (!Klass) continue;

			let comp = new Klass(settings.components[key]);
			actor.addComponent(comp);
		}
	}

	return actor;
};

export default Actor;