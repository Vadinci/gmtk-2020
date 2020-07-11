//TODO deal with auto-centering non 10x10 dungeons

import Tile from "game/entities/tile";
import { TILE_SIZE } from "consts";
import ShiftButton from "game/entities/shiftbutton";

let Dungeon = function (settings) {
	let _tOffset = settings.offsetTransform;

	let _width = settings.width;
	let _height = settings.height;

	let _tiles = [];
	let _actors = [];
	let _shifters = [];
	let _grid = [];

	let _createTiles = function () {
		for (let ic = 0; ic < _width; ic++) {
			_grid[ic] = [];
			for (let ir = 0; ir < _height; ir++) {
				let tile = new Tile({

				});

				tile.position.set(ic * TILE_SIZE, ir * TILE_SIZE);
				tile.transform.parent = _tOffset;

				_tiles.push(tile);

				_grid[ic][ir] = tile;
			}
		}
	};

	let _createShifters = function () {
		//vertical shifters
		for (let ii = 0; ii < _width; ii++) {
			let shifter = {
				type: 'vertical',
			};

			shifter.btnA = new ShiftButton({
				direction: 'up'
			});
			shifter.btnA.transform.parent = _tOffset;
			shifter.btnA.position.set(ii * TILE_SIZE, -(TILE_SIZE - 8));

			shifter.btnB = new ShiftButton({
				direction: 'down'
			});
			shifter.btnB.transform.parent = _tOffset;
			shifter.btnB.position.set(ii * TILE_SIZE, TILE_SIZE * _height - 8);

			_shifters.push(shifter);
		}

		//horizontal shifters
		for (let ii = 0; ii < _height; ii++) {
			let shifter = {
				type: 'horizontal',
			};

			shifter.btnA = new ShiftButton({
				direction: 'left'
			});
			shifter.btnA.transform.parent = _tOffset;
			shifter.btnA.position.set(-(TILE_SIZE - 8), ii * TILE_SIZE);

			shifter.btnB = new ShiftButton({
				direction: 'right'
			});
			shifter.btnB.transform.parent = _tOffset;
			shifter.btnB.position.set(TILE_SIZE * _width - 8, ii * TILE_SIZE);

			_shifters.push(shifter);
		}
	};

	let shiftRowLeft = function (row) {
		let stored = _grid[0][row];

		for (let ii = 1; ii < _width; ii++) {
			_grid[ii - 1][row] = _grid[ii][row];
			_grid[ii][row].position.x = (ii - 1) * TILE_SIZE;
		}

		_grid[_width - 1][row] = stored;
		stored.position.x = (_width - 1) * TILE_SIZE;
	};

	let shiftRowRight = function (row) {
		let stored = _grid[_width - 1][row];

		for (let ii = _width - 2; ii >= 0; ii--) {
			_grid[ii + 1][row] = _grid[ii][row];
			_grid[ii][row].position.x = (ii + 1) * TILE_SIZE;
		}

		_grid[0][row] = stored;
		stored.position.x = 0;
	};

	let shiftColUp = function (col) {
		let stored = _grid[col][0];

		for (let ii = 1; ii < _height; ii++) {
			_grid[col][ii - 1] = _grid[col][ii];
			_grid[col][ii].position.y = (ii - 1) * TILE_SIZE;
		}

		_grid[col][_height - 1] = stored;
		stored.position.y = (_height - 1) * TILE_SIZE;
	};

	let shiftColDown = function (col) {
		let stored = _grid[col][_height - 1];

		for (let ii = _height - 2; ii >= 0; ii--) {
			_grid[col][ii + 1] = _grid[col][ii];
			_grid[col][ii].position.y = (ii + 1) * TILE_SIZE;
		}

		_grid[col][0] = stored;
		stored.position.y = 0;
	};

	_createTiles();
	_createShifters();

	let dungeon = {
		shiftRowLeft,
		shiftRowRight,
		shiftColUp,
		shiftColDown
	};

	Object.defineProperties(dungeon, {
		width: { get: () => _width },
		height: { get: () => _height },
		tiles: { get: () => [].concat(_tiles) },
		shifters: { get: () => [].concat(_shifters) }
	});

	return dungeon;
};

export default Dungeon;