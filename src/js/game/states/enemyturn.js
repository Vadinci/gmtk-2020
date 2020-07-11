
let EnemyTurnState = function (context, machine) {
	//Variables

	//State functions
	let start = function () {
		
	};

	let update = function () {
		machine.setState('startInput');
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
		get: () => 'enemyTurn'
	});

	return state;
};

Object.defineProperty(EnemyTurnState, 'key', {
	get: () => 'enemyTurn'
});

export default EnemyTurnState;