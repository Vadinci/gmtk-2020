import Marzipan from "@Marzipan/marzipan";
import Scene from "@Marzipan/core/scene";
import Vector2 from "@Marzipan/math/vector2";

import StateMachine from "./modules/statemachine";
import GameContext from "./gamecontext";

import EmptyState from "./states/empty";
import Tile from "./entities/tile";
import { TILE_SIZE } from "consts";
import Transform from "@Marzipan/math/transform";
import Dungeon from "./modules/dungeon";


let Game = function () {
	//white background
	let scnBackground = new Scene({
		name: 'background',
		layer: -1
	});

	(() => { //scope tl and br
		let topLeft = new Vector2(0, 0);
		let botRight = new Vector2(Marzipan.screen.width, Marzipan.screen.height);
		scnBackground.on('preDraw', data => {
			data.renderer.setTransform(scnBackground.transform.globalMatrix);
			data.renderer.drawRect(topLeft, botRight, '#ff00ff');
		});
	})();

	let scnGame = new Scene({
		name: 'game',
		layer: 0
	});

	//game Context
	let gameContext = new GameContext();

	gameContext.gameScene = scnGame;

	let gridOffset = new Transform(TILE_SIZE * 1.5, TILE_SIZE * 1.5);

	let dungeon = new Dungeon({
		offsetTransform : gridOffset,
		width : 10,
		height : 10
	});
	
	if(IS_DEV){
		window.dungeon = dungeon;
	}

	for (let ii = 0; ii < dungeon.tiles.length; ii++){
		scnGame.addEntity(dungeon.tiles[ii]);
	}

	for (let ii = 0; ii < dungeon.shifters.length; ii++){
		scnGame.addEntity(dungeon.shifters[ii].btnA);
		scnGame.addEntity(dungeon.shifters[ii].btnB);
	}

	//State machine
	let stateMachine = new StateMachine(gameContext);

	stateMachine.addState(EmptyState);

	stateMachine.setState('empty');

	scnGame.on('preUpdate', stateMachine.update);


	scnGame.on('start', data => {
		Marzipan.engine.addScene(scnBackground);
	});

	scnGame.on('die', data => {
		Marzipan.engine.removeScene(scnBackground);

		stateMachine.setState('nothing');	//force stateMachine to an undefined state so current state gets properly exited
	});

	return scnGame;
};

export default Game;