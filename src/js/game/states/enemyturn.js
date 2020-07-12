
let EnemyTurnState = function (context, machine) {
	//Variables
	let _stateActive = false;
	//State functions
	let start = function () {
		let lastPromise;
		_stateActive = true;

		for (let ii = context.enemies.length - 1; ii >= 0; ii--) {
			let enemy = context.enemies[ii];
			let enemyAi = enemy.getComponent('ai');

			if (!enemy.active) {
				//this enemy is gone
				context.enemies.splice(ii, 1);
				continue;
			}

			if (!lastPromise) {
				lastPromise = enemyAi.pick();
			} else {
				lastPromise = lastPromise.then(() => enemyAi.pick());
			}
			lastPromise = lastPromise.then(() => enemyAi.execute());

			lastPromise = lastPromise.then(() => {
				if (!enemy.active) {
					context.enemies.splice(ii, 1);
				}
			});
		}

		if (!lastPromise) {
			//there are no enemies
			machine.setState('startInput');
			return;
		}

		lastPromise.then(() => {
			if(!_stateActive) return;	//something caused us to exit this state already
			machine.setState('spawnEnemy');
		});
	};

	let update = function () {
	};

	let end = function () {
		_stateActive = false;
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