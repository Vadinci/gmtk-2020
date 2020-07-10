
let EmptyState = function (context, machine) {
	//Variables

	//State functions
	let start = function () {
		
	};

	let update = function () {
	
	};

	let end = function () {
	
	};

	//Handlers
	
	//State
	let state = {
		start,
		update,
		end
	};

	Object.defineProperty(state, 'key', {
		get: () => 'empty'
	});

	return state;
};

Object.defineProperty(EmptyState, 'key', {
	get: () => 'empty'
});

export default EmptyState;