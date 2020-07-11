
let StartInputState = function (context, machine) {
	//Variables
	let dungeon = context.dungeon;
	let shifters = dungeon.shifters;

	let parsedShifters = (() => {
		let result = {};
		result['vertical'] = [];
		result['horizontal'] = [];

		for (let ii = 0; ii < shifters.length; ii++) {
			let shifter = shifters[ii];
			result[shifter.type][shifter.index] = shifter;
		}

		return result;
	})();

	//State functions
	let start = function () {
		//activate all buttons
		for (let ii = 0; ii < shifters.length; ii++) {
			let shifter = shifters[ii];

			if (shifter.type === 'horizontal') {
				shifter.btnA.activate(() => _activateHorizontal(shifter.index, dungeon.shiftRowLeft, -1));
				shifter.btnB.activate(() => _activateHorizontal(shifter.index, dungeon.shiftRowRight, 1));
			} else {
				shifter.btnA.activate(() => _activateVertical(shifter.index, dungeon.shiftColUp, -1));
				shifter.btnB.activate(() => _activateVertical(shifter.index, dungeon.shiftColDown, 1));
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

	let _activateHorizontal = function (index, firstMove, dir) {
		firstMove(index);
		_deactivateAllExcept('horizontal', index);

		context.currentMove.direction = 'horizontal';
		context.currentMove.amount = dir;

		parsedShifters['horizontal'][index].btnA.activate(() => { dungeon.shiftRowLeft(index); _addToMove(-1); });
		parsedShifters['horizontal'][index].btnB.activate(() => { dungeon.shiftRowRight(index); _addToMove(1); });

		machine.setState('input');
	};

	let _activateVertical = function (index, firstMove, dir) {
		firstMove(index);
		_deactivateAllExcept('vertical', index);

		context.currentMove.direction = 'vertical';
		context.currentMove.amount = dir;

		parsedShifters['vertical'][index].btnA.activate(() => { dungeon.shiftColUp(index); _addToMove(-1); });
		parsedShifters['vertical'][index].btnB.activate(() => { dungeon.shiftColDown(index); _addToMove(1); });

		machine.setState('input');
	};

	let _addToMove = function (d) {
		context.currentMove.amount += d;

		if (context.currentMove.direction === 'horizontal') {
			if (context.currentMove.amount >= dungeon.width) context.currentMove.amount -= dungeon.width;
			if (context.currentMove.amount <= -dungeon.width) context.currentMove.amount += dungeon.width;
		} else {
			if (context.currentMove.amount >= dungeon.height) context.currentMove.amount -= dungeon.height;
			if (context.currentMove.amount <= -dungeon.height) context.currentMove.amount += dungeon.height;
		}

		console.log(context.currentMove);
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