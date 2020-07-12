import Dispatcher from "@Marzipan/core/dispatcher";

const DEFAULTS = {
	floor: 0,
	health: 3,
	gold: 0
};

let Session = {};

let reset = function () {
	for (let key in DEFAULTS) {
		Session[key] = DEFAULTS[key];
	}
};

Session.reset = reset;

Session.add = function(type, amount){
	Session[type] += amount;
	Session.emit('change', {
		type : type,
		value : Session[type]
	});
};

Session.set = function(type, amount){
	Session[type] = amount;
	Session.emit('change', {
		type : type,
		value : Session[type]
	});
};

reset();

Dispatcher.make(Session);

export default Session;