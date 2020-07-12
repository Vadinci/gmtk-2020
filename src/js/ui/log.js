//TODO word coloring

import Vector2 from "@Marzipan/math/vector2";
import Marzipan from "@Marzipan/marzipan";
import Scene from "@Marzipan/core/scene";
import Entity from "@Marzipan/core/entity";

const WIDTH = 240;
const HEIGHT = 360;
const GLYPH_WIDTH = 8;
const GLYPH_HEIGHT = 8;

const GLYPHS_PER_LINE = WIDTH / GLYPH_WIDTH - 1;
const LINES = (HEIGHT / (GLYPH_HEIGHT + 1)) - 1;	//TODO for some reason breakLine freaks out without this minus one???

const GLYPH_ORDER = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!?:-+%*.,/'#@$&()=_[]{}";

const GLYPH_PIC = 'ui/glyphs';

let Log = function () {
	let backBuffer = {};
	let logCanvas = {};

	backBuffer.canvas = document.createElement('canvas');
	backBuffer.canvas.width = WIDTH;
	backBuffer.canvas.height = HEIGHT;
	backBuffer.context = backBuffer.canvas.getContext('2d');

	logCanvas.canvas = document.createElement('canvas');
	logCanvas.canvas.width = WIDTH;
	logCanvas.canvas.height = HEIGHT;
	logCanvas.context = logCanvas.canvas.getContext('2d');

	let _glyphRow = 0;
	let _glyphCol = 0;

	let _glyphPic = Marzipan.assets.get('picture', GLYPH_PIC);

	let _color = '#fff';

	let log = new Scene({
		name: 'log',
		depth: 50
	});
	log.position.set(Marzipan.screen.width - WIDTH, 40);

	let bg = new Entity({
		name: 'logBG',
		z: -1
	});
	bg.addComponent({
		name: 'fill',
		tl: new Vector2(0, 0),
		br: new Vector2(WIDTH, HEIGHT),
		draw: function (data) {
			data.renderer.setTransform(data.entity.transform.globalMatrix);
			data.renderer.drawRect(this.tl, this.br, '#000000');
		}
	});
	log.addEntity(bg);

	let content = new Entity({
		name: 'logContent',
		z: 1
	});
	content.addComponent({
		name: 'contentRenderer',
		draw: function (data) {
			data.renderer.setTransform(data.entity.transform.globalMatrix);
			data.renderer.drawImage(logCanvas.canvas, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
		}
	});
	log.addEntity(content);

	let writeGlyph = function (glyph) {
		glyph = glyph[0];
		if (glyph === '') {
			if (++_glyphCol > GLYPHS_PER_LINE) breakLine();
			return;
		};

		let frameIdx = GLYPH_ORDER.indexOf(glyph);
		let sx = (frameIdx % (_glyphPic.width / GLYPH_WIDTH)) * GLYPH_WIDTH;
		let sy = Math.floor(frameIdx / (_glyphPic.width / GLYPH_WIDTH)) * GLYPH_HEIGHT;

		//draw the actual glyph
		logCanvas.context.drawImage(
			_glyphPic.image,
			sx, sy,
			GLYPH_WIDTH, GLYPH_HEIGHT,
			_glyphCol * GLYPH_WIDTH, _glyphRow * (GLYPH_HEIGHT + 1),
			GLYPH_WIDTH, GLYPH_HEIGHT
		);

		//composite colored rectangle on top
		logCanvas.context.globalCompositeOperation = 'source-atop';

		logCanvas.context.fillStyle = _color;
		logCanvas.context.fillRect(
			_glyphCol * GLYPH_WIDTH, _glyphRow * (GLYPH_HEIGHT + 1),
			GLYPH_WIDTH, GLYPH_HEIGHT
		);

		//reset composite mode
		logCanvas.context.globalCompositeOperation = 'source-over';

		if (++_glyphCol > GLYPHS_PER_LINE) breakLine();
	};

	let writeString = function (string) {
		let words = string.split(' ');

		for (let ii = 0; ii < words.length; ii++) {
			let word = words[ii];

			let length = word.length;
			if (word.indexOf('\\') !== -1) {
				let idx = 0;
				while (word.indexOf('\\', idx + 1) !== -1) {
					let modLength = word.indexOf('\\', idx + 1) - idx;
					length -= modLength;
					idx += modLength;
					idx = word.indexOf('\\', idx + 1);
					if (idx === -1) break;
				}
			};

			if (_glyphCol + length > GLYPHS_PER_LINE) {
				breakLine();
			}

			for (let jj = 0; jj < word.length; jj++) {
				let glyph = word[jj];
				if (glyph === '\\') {
					let next = word.indexOf('\\', jj + 1);
					let parsed = word.substring(jj + 1, next);
					//TODO so far we just set color
					setColor(parsed);
					jj = next;
				} else {
					writeGlyph(glyph);
				}
			}
			writeGlyph(' ');
		}

	};

	let writeLine = function (string) {
		writeString(string);
		if (_glyphCol !== 0) { //if glyphcol is 0, we just added a linebreak
			breakLine();
		}
	};

	let breakLine = function () {
		_glyphCol = 0;
		_glyphRow++;

		if (_glyphRow > LINES) {
			scrollUp(1);
		}
	};

	let scrollUp = function (amount) {
		backBuffer.context.clearRect(0, 0, WIDTH, HEIGHT);
		backBuffer.context.drawImage(logCanvas.canvas, 0, 0);
		logCanvas.context.clearRect(0, 0, WIDTH, HEIGHT);
		logCanvas.context.drawImage(backBuffer.canvas, 0, -amount * (GLYPH_HEIGHT + 1));

		_glyphRow -= amount;
	};

	let setColor = function (c) {
		_color = c;
	};

	log.writeGlyph = writeGlyph;
	log.writeString = writeString;
	log.breakLine = breakLine;
	log.writeLine = writeLine;
	log.scrollUp = scrollUp;
	log.setColor = setColor;

	log.on('start', () => {
		Marzipan.events.on('logLine', writeLine);
		Marzipan.events.on('logBreak', breakLine);
	});

	log.on('die', () => {
		Marzipan.events.off('logLine', writeLine);
		Marzipan.events.off('logBreak', breakLine);
	});

	return log;
};

export default Log;