const moves = {
	[KEY.LEFT]: (tetromino) => ({ ...tetromino, x: tetromino.x - 1 }),
	[KEY.RIGHT]: (tetromino) => ({ ...tetromino, x: tetromino.x + 1 }),
	[KEY.DOWN]: (tetromino) => ({ ...tetromino, y: tetromino.y + 1 }),
	[KEY.UP]: (tetromino) => board.rotate(tetromino),
	[KEY.Z]: (tetromino) => board.reverseRotate(tetromino),
	[KEY.SPACE]: (tetromino) => ({ ...tetromino, y: tetromino.y + 1 }),
};

let time = { start: 0, elapsed: 0, level: 1000 };
let board = new Board(ctx);
let requestId = null;

function handleKeyPress(e) {
	e.preventDefault();

	if (moves[e.keyCode]) {
		let t = moves[e.keyCode](board.tetromino);

		if (e.keyCode === KEY.SPACE) {
			while (board.valid(t)) {
				board.tetromino.move(t);
				t = moves[e.keyCode](board.tetromino);
			}
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
	addEventListener();

	if (requestId) {
		cancelAnimationFrame(requestId);
	}

	time.start = performance.now();
	animate();
}

function draw() {
	const { width, height } = ctx.canvas;
	ctx.clearRect(0, 0, width, height);

	board.draw();
	board.tetromino.draw();
}

function animate(now = 0) {
	time.elapsed = now - time.start;

	if (time.elapsed > time.level) {
		time.start = now;

		if (!board.drop()) {
			gameOver();
			return;
		}
	}

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	draw();
	requestId = requestAnimationFrame(animate);
}

function gameOver() {
	cancelAnimationFrame(requestId)

	ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
}