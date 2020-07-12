import ConfirmHUD from "ui/confirmhud";
import Marzipan from "@Marzipan/marzipan";
import Game from "game/game";
import Session from "game/session";

let DeathState = function (context, machine) {
	//Variables
	let _confirmHud;

	//State functions
	let start = function () {
		_confirmHud = new ConfirmHUD({
			onConfirm: _onConfirm
		});

		Marzipan.engine.addScene(_confirmHud);

		Marzipan.events.emit('logLine', '\\#aaa\\a valiant effort...\\#fff\\');
		Marzipan.events.emit('logLine', ' ');
	};

	let update = function () {

	};

	let end = function () {
		Marzipan.engine.removeScene(_confirmHud);
	};

	//Handlers
	let _onConfirm = function(){
		Session.reset();
		
		Marzipan.engine.removeScene(context.gameScene);
		Marzipan.engine.addScene(new Game({}));
	};

	//State
	let state = {
		start,
		update,
		end
	};

	Object.defineProperty(state, 'key', {
		get: () => 'death'
	});

	return state;
};

Object.defineProperty(DeathState, 'key', {
	get: () => 'death'
});

export default DeathState;