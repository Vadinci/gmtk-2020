import Marzipan from '@Marzipan/marzipan';
import Preloader from 'preloader';
import Game from 'game/game';

Marzipan.init({
	screen: {
		width: 720,
		height: 480
	}
});

Preloader.fromYaml('assets.yaml', ()=>{
	console.log('loaded assets!');
	let game = new Game();
	
	Marzipan.engine.addScene(game);
});