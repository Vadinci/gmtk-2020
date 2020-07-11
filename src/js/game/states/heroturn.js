
let HeroTurnState = function (context, machine) {
	//Variables

	//State functions
	let start = function () {
		let heroAI = context.hero.getComponent('ai');
		
		heroAI.pick()
			.then(() => heroAI.execute())
			.then(() => {
				machine.setState('enemyTurn');
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
		get: () => 'heroTurn'
	});

	return state;
};

Object.defineProperty(HeroTurnState, 'key', {
	get: () => 'heroTurn'
});

export default HeroTurnState;