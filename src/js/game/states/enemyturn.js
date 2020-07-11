
let EnemyTurnState = function (context, machine) {
	//Variables

	//State functions
	let start = function () {
		let lastPromise;

		for (let ii = 0; ii < context.enemies.length; ii++) {
			let enemy = context.enemies[ii];
			let enemyAi = enemy.getComponent('ai');
			
			if (!lastPromise) {
				lastPromise = enemyAi.pick();
			} else {
				lastPromise = lastPromise.then(() => enemyAi.pick());
			}
			lastPromise = lastPromise.then(()=>enemyAi.execute());
		}

		if (!lastPromise){
			//there are no enemies
			machine.setState('startInput');
			return;
		}

		lastPromise.then(()=>{
			machine.setState('startInput');
		});
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
		get: () => 'enemyTurn'
	});

	return state;
};

Object.defineProperty(EnemyTurnState, 'key', {
	get: () => 'enemyTurn'
});

export default EnemyTurnState;