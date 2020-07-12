import Tween from '@Tween/tween';
import { IN_OUT_QUAD } from '@Tween/ease';
import { TILE_SIZE } from 'consts';
import Vector2 from '@Marzipan/math/vector2';

let SimpleMoveAnimator = function (settings) {
	let _actor;

	let _onMove = function (data) {
		let delta = new Vector2();
		delta.x = (data.to.col - data.from.col) * TILE_SIZE;
		delta.y = (data.to.row - data.from.row) * TILE_SIZE;

		let dist = delta.magnitude();

		let animPromise = () => new Promise((resolve, reject) => {
			let tween = new Tween({
				startValue: -1,
				endValue: 0,
				duration: 10 + Math.round(dist/5),
				easeFunc: IN_OUT_QUAD,
				onUpdate: (v, t) => {
					_actor.position.set(delta.x * v, delta.y * v);
				},
				onComplete: () => {
					_actor.removeComponent(tween);
					resolve();
				}
			});
			_actor.addComponent(tween);
		});

		data.addPromise(animPromise);
	};

	let start = function (data) {
		_actor = data.entity;

		_actor.on('handleMove', _onMove);
	};

	let die = function () {
		_actor.off('handleMove', _onMove);
	};

	return {
		name: 'simpleMoveAnimator',
		start,
		die
	};
};

export default SimpleMoveAnimator;