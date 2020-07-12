import Scene from "@Marzipan/core/scene";
import Entity from "@Marzipan/core/entity";
import Vector2 from "@Marzipan/math/vector2";
import Clickable from "game/components/clickable";
import Rectangle from "@Marzipan/math/rectangle";
import Sprite from "@Marzipan/graphics/sprite";
import Marzipan from "@Marzipan/marzipan";
import UICounter from "marzipanui/components/counter";
import Session from "game/session";

let SessionHUD = function (settings) {
	let scene = new Scene({
		name: 'sessionHud',
		depth: 100
	});
	scene.position.set(Marzipan.screen.width - 240, 0);

	let healthCounter = new UICounter({
		picture: Marzipan.assets.get('picture', 'ui/counter'),
		alignmentX: 0,
		alignmentY: 0,
		glyphMap: {
			'1': new Rectangle(0, 0, 15, 15),
			'2': new Rectangle(15, 0, 15, 15),
			'3': new Rectangle(30, 0, 15, 15),
			'4': new Rectangle(45, 0, 15, 15),
			'5': new Rectangle(60, 0, 15, 15),
			'6': new Rectangle(75, 0, 15, 15),

			'7': new Rectangle(0, 15, 15, 15),
			'8': new Rectangle(15, 15, 15, 15),
			'9': new Rectangle(30, 15, 15, 15),
			'0': new Rectangle(45, 15, 15, 15),
			'x': new Rectangle(60, 15, 15, 15),
			'.': new Rectangle(75, 15, 15, 15),
		}
	});
	healthCounter.setValue('x' + Session.health);

	healthCounter.position.set(14, -6);

	let healthIcon = new Sprite({
		picture: Marzipan.assets.get('picture', 'ui/icon_lives'),
		origin: new Vector2(16, 16)
	});

	let health = new Entity({
		name: 'health'
	});
	health.position.set(20, 20);
	health.addComponent(healthCounter);
	health.addComponent(healthIcon);

	scene.addEntity(health);

	let goldCounter = new UICounter({
		picture: Marzipan.assets.get('picture', 'ui/counter'),
		alignmentX: 0,
		alignmentY: 0,
		glyphMap: {
			'1': new Rectangle(0, 0, 15, 15),
			'2': new Rectangle(15, 0, 15, 15),
			'3': new Rectangle(30, 0, 15, 15),
			'4': new Rectangle(45, 0, 15, 15),
			'5': new Rectangle(60, 0, 15, 15),
			'6': new Rectangle(75, 0, 15, 15),

			'7': new Rectangle(0, 15, 15, 15),
			'8': new Rectangle(15, 15, 15, 15),
			'9': new Rectangle(30, 15, 15, 15),
			'0': new Rectangle(45, 15, 15, 15),
			'x': new Rectangle(60, 15, 15, 15),
			'.': new Rectangle(75, 15, 15, 15),
		}
	});
	goldCounter.setValue('x' + Session.gold);

	goldCounter.position.set(14, -6);

	let goldIcon = new Sprite({
		picture: Marzipan.assets.get('picture', 'ui/icon_gold'),
		origin: new Vector2(16, 16)
	});

	let gold = new Entity({
		name: 'gold'
	});
	gold.position.set(100, 20);
	gold.addComponent(goldCounter);
	gold.addComponent(goldIcon);

	scene.addEntity(gold);


	let _onChange = function (data) {
		let { type, value } = data;
		if (type === 'health') {
			scene.setHealth(value);
		}
		if (type === 'gold') {
			scene.setGold(value);
		}
	};

	scene.on('start', () => {
		Session.on('change', _onChange);
	});

	scene.on('die', () => {
		Session.off('change', _onChange);
	});

	scene.setHealth = function (h) {
		healthCounter.setValue('x' + h);
	};

	scene.setGold = function (g) {
		goldCounter.setValue('x' + g);
	};

	return scene;
};

export default SessionHUD;