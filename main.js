const moves = {
	[KEY.LEFT]: (tetromino) => ({ ...tetromino, x: tetromino.x - 1 }),
	[KEY.RIGHT]: (tetromino) => ({ ...tetromino, x: tetromino.x + 1 }),
	[KEY.DOWN]: (tetromino) => ({ ...tetromino, y: tetromino.y + 1 }),
	[KEY.UP]: (tetromino) => board.rotate(tetromino),
	[KEY.Z]: (tetromino) => board.reverseRotate(tetromino),
	[KEY.SPACE]: (tetromino) => ({ ...tetromino, y:tetromino.y + 1})
};

function handleKeyPress(e) {
	e.preventDefault();

	if (moves[e.keyCode]) {
		let t = moves[e.keyCode](board.tetromino);

		if (e.keyCode === KEY.SPACE) {
			while (board.valid(t)) {
				
				board.tetromino.move(t);
				t = moves[e.keyCode](board.tetromino);
			}
			draw();
			return;
		}

		if (board.valid(t)) {
			board.tetromino.move(t);
			draw();
		}

	}
}

function addEventListener() {
	document.removeEventListener("keydown", handleKeyPress);
	document.addEventListener("keydown", handleKeyPress);
}

function play() {
	board = new Board(ctx);
	draw();
	addEventListener();
}

function draw() {
	const { width, height } = ctx.canvas;
	ctx.clearRect(0, 0, width, height);

	board.tetromino.draw();
}
