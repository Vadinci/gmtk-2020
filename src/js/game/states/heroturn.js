
let HeroTurnState = function (context, machine) {
	//Variables
	let stateActive = false;

	//State functions
	let start = function () {
		stateActive = true;
		let heroAI = context.hero.getComponent('ai');
		
		heroAI.pick()
			.then(() => heroAI.execute())
			.then(() => {
				//something caused us to leave this state early
				if (!stateActive) return;
				machine.setState('enemyTurn');
			});
	};

	let update = function () {

	};

	let end = function () {
		stateActive = false;
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