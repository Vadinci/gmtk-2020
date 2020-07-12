import ConfirmHUD from "ui/confirmhud";
import Marzipan from "@Marzipan/marzipan";

let InputState = function (context, machine) {
	//Variables
	let _confirmHud;

	//State functions
	let start = function () {
		_confirmHud = new ConfirmHUD({
			onConfirm: _onConfirm
		});

		Marzipan.engine.addScene(_confirmHud);
	};

	let update = function () {

	};

	let end = function () {
		Marzipan.engine.removeScene(_confirmHud);

		//deactivate _all_ shifters
		for (let ii = 0; ii < context.dungeon.shifters.length; ii++) {
			let shifter = context.dungeon.shifters[ii];

			shifter.btnA.deactivate();
			shifter.btnB.deactivate();
		}
	};

	//Handlers
	let _onConfirm = function(){
		//TODO check move is valid

		Marzipan.events.emit('logLine', "The walls are shifting...");
		machine.setState('heroTurn');
	};

	//State
	let state = {
		start,
		update,
		end
	};

	Object.defineProperty(state, 'key', {
		get: () => 'input'
	});

	return state;
};

Object.defineProperty(InputState, 'key', {
	get: () => 'input'
});

export default InputState;