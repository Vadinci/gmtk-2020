import Scene from "@Marzipan/core/scene";
import Entity from "@Marzipan/core/entity";
import Vector2 from "@Marzipan/math/vector2";
import Clickable from "game/components/clickable";
import Rectangle from "@Marzipan/math/rectangle";
import Sprite from "@Marzipan/graphics/sprite";
import Marzipan from "@Marzipan/marzipan";

let ConfirmHUD = function(settings){
	let scene = new Scene({
		name : 'confirmHud',
		depth : 100
	});
	scene.position.set(Marzipan.screen.width - 240, Marzipan.screen.height - 80);

	let btnConfirm = new Entity({
		name : 'btnConfirm'
	});
	btnConfirm.addComponent(new Sprite({
		pictureName : 'ui/button_confirm',
		origin : new Vector2(20,20)
	}));
	btnConfirm.addComponent(new Clickable({
		area : new Rectangle(-20, -20, 40, 40),
		callback : () => {
			settings.onConfirm && settings.onConfirm();
		}
	}));
	btnConfirm.position.set(120, 40);

	scene.addEntity(btnConfirm);

	return scene;
};

export default ConfirmHUD;