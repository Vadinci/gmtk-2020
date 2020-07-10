import Entity from "@Marzipan/core/entity";
import Marzipan from "@Marzipan/marzipan";


let Stub = function (settings) {
	let entity = new Entity({
		name: 'stub',
		z: settings.z || 0
	});

	return entity;
};

export default Stub;