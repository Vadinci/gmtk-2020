
let GameContext = function(){
	return {
		gameScene: null,

		dungeon : null,

		hero : null,
		enemies : [],

		currentMove : {
			direction : 'none',
			amount : 0
		}
	};
};

export default GameContext;