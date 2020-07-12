import Marzipan from "@Marzipan/marzipan";
import Scene from "@Marzipan/core/scene";
import Vector2 from "@Marzipan/math/vector2";

import StateMachine from "./modules/statemachine";
import GameContext from "./gamecontext";

import { TILE_SIZE } from "consts";
import Transform from "@Marzipan/math/transform";
import Dungeon from "./modules/dungeon";
import Actor from "./entities/actor";

import StartInputState from "./states/startinput";
import InputState from "./states/input";
import HeroTurnState from "./states/heroturn";
import EnemyTurnState from "./states/enemyturn";
import GenerateState from "./states/generate";
import Log from "ui/log";


const INITIAL_STATE = 'generate';

let Game = function () {
	//seperate scence for background
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

	let scnLog = new Log({

	});

	//game scene
	let scnGame = new Scene({
		name: 'game',
		layer: 0
	});

	//game context (for state machine states)
	let gameContext = new GameContext();

	gameContext.gameScene = scnGame;

	//TODO move somewhere nice?
	let gridOffset = new Transform(TILE_SIZE * 1.5, TILE_SIZE * 1.5);

	let dungeon = new Dungeon({
		offsetTransform: gridOffset,
		width: 10,
		height: 10
	});

	gameContext.dungeon = dungeon;

	if (IS_DEV) {
		window.dungeon = dungeon;
	}

	//add tiles to scene
	for (let ii = 0; ii < dungeon.tiles.length; ii++) {
		scnGame.addEntity(dungeon.tiles[ii]);
	}

	//add shift buttons to scene
	for (let ii = 0; ii < dungeon.shifters.length; ii++) {
		let shifter = dungeon.shifters[ii];
		scnGame.addEntity(shifter.btnA);
		scnGame.addEntity(shifter.btnB);

		shifter.btnA.deactivate();
		shifter.btnB.deactivate();
	}

	//State machine
	let stateMachine = new StateMachine(gameContext);

	stateMachine.addState(StartInputState);
	stateMachine.addState(InputState);
	stateMachine.addState(HeroTurnState);
	stateMachine.addState(EnemyTurnState);

	stateMachine.addState(GenerateState);

	stateMachine.setState(INITIAL_STATE);


	//scene handlers. Just tacking these on scene events ;)
	scnGame.on('preUpdate', stateMachine.update);

	scnGame.on('start', data => {
		//when the game scene is added, we also want to add the background scene
		Marzipan.engine.addScene(scnBackground);
		Marzipan.engine.addScene(scnLog);
	});

	//clean up
	scnGame.on('die', data => {
		Marzipan.engine.removeScene(scnLog);
		Marzipan.engine.removeScene(scnBackground);

		stateMachine.setState('nothing');	//force stateMachine to an undefined state so current state gets properly exited
	});

	return scnGame;
};

export default Game;