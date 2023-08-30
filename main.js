const moves = {
	[KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
	[KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
	[KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
	[KEY.UP]: (p) => board.rotate(p),
};

function handleKeyPress(e) {
	e.preventDefault();

	if (moves[e.keyCode]) {
		let p = moves[e.keyCode](board.tetromino);

		board.tetromino.move(p);

		draw();
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
