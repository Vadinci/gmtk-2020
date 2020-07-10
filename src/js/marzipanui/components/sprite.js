import Sprite from "@Marzipan/graphics/sprite";

let UISprite = function(settings){
	Sprite.call(this, settings);
};

UISprite.prototype = Object.create(Sprite.prototype);

//TODO dimensions

export default UISprite;