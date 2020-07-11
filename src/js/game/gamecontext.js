
let GameContext = function(){
	return {
		gameScene: null,

		dungeon : null,

		currentMove : {
			direction : 'none',
			amount : 0
		}
	};
};

export default GameContext;