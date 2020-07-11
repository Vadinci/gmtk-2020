
let StartInputState = function (context, machine) {
	//Variables
	let dungeon = context.dungeon;
	let shifters = dungeon.shifters;

	//State functions
	let start = function () {
		//activate all buttons
		for (let ii = 0; ii < shifters.length; ii++) {
			let shifter = shifters[ii];

			if (shifter.type === 'horizontal') {
				shifter.btnA.activate(() => _activateLeft(shifter.index));
				shifter.btnB.activate(() => _activateRight(shifter.index));
			} else {
				shifter.btnA.activate(() => _activateUp(shifter.index));
				shifter.btnB.activate(() => _activateDown(shifter.index));
			}
		}
	};

	let update = function () {

	};

	let end = function () {

	};

	//Handlers
	let _deactivateAllExcept = function (type, index) {
		for (let ii = 0; ii < shifters.length; ii++) {
			let shifter = shifters[ii];

			if (shifter.type === type && shifter.index == index) continue;

			shifter.btnA.deactivate();
			shifter.btnB.deactivate();
		}
	};

	let _activateLeft = function (index) {
		dungeon.shiftRowLeft(index);
		_deactivateAllExcept('horizontal', index);

		//TODO update button functions
		//TODO prepare command queue to undo in input state

		machine.setState('input');
	};

	let _activateRight = function (index) {
		dungeon.shiftRowRight(index);
		_deactivateAllExcept('horizontal', index);

		//TODO update button functions
		//TODO prepare command queue to undo in input state

		machine.setState('input');
	};

	let _activateUp = function (index) {
		dungeon.shiftColUp(index);
		_deactivateAllExcept('vertical', index);

		//TODO update button functions
		//TODO prepare command queue to undo in input state

		machine.setState('input');
	};

	let _activateDown = function (index) {
		dungeon.shiftColDown(index);
		_deactivateAllExcept('vertical', index);

		//TODO update button functions
		//TODO prepare command queue to undo in input state

		machine.setState('input');
	};

	//State
	let state = {
		start,
		update,
		end
	};

	Object.defineProperty(state, 'key', {
		get: () => 'startInput'
	});

	return state;
};

Object.defineProperty(StartInputState, 'key', {
	get: () => 'startInput'
});

export default StartInputState;