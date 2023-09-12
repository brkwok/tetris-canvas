const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");
const canvasHold = document.getElementById("hold");
const ctxHold = canvasHold.getContext("2d");

let accountValues = {
	score: 0,
	level: 0,
	lines: 0,
};

function updateAccount(key, val) {
	let element = document.getElementById(key);

	if (element) {
		element.textContent = val;
	}
}

let hold = true;

let account = new Proxy(accountValues, {
	set: (target, key, value) => {
		target[key] = value;
		updateAccount(key, value);
		return true;
	},
});

let requestId = null,
	time = null;

const moves = {
	[KEY.LEFT]: (tetromino) => ({ ...tetromino, x: tetromino.x - 1 }),
	[KEY.RIGHT]: (tetromino) => ({ ...tetromino, x: tetromino.x + 1 }),
	[KEY.DOWN]: (tetromino) => ({ ...tetromino, y: tetromino.y + 1 }),
	[KEY.UP]: (tetromino) => board.rotate(tetromino),
	[KEY.Z]: (tetromino) => board.reverseRotate(tetromino),
	[KEY.SPACE]: (tetromino) => ({ ...tetromino, y: tetromino.y + 1 }),
	[KEY.SHIFT]: (tetromino) => ({...tetromino})
};

let board = new Board(ctx, ctxNext, ctxHold);

initNext();

function initNext() {
	ctxNext.canvas.width = 4 * BLOCK_SIZE;
	ctxNext.canvas.height = 4 * BLOCK_SIZE;
	ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
	ctxHold.canvas.width = 4 * BLOCK_SIZE;
	ctxHold.canvas.height = 4 * BLOCK_SIZE;
	ctxHold.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function handleKeyPress(e) {
	e.preventDefault();

	if (moves[e.keyCode] && !board.tetromino.hardDropped) {
		let t = moves[e.keyCode](board.tetromino);
		
		if (e.keyCode === KEY.SPACE) {
			while (board.valid(t)) {
				board.tetromino.move(t);
				t = moves[e.keyCode](board.tetromino);
			}
			board.tetromino.hardDrop();
		} else if (e.keyCode === KEY.SHIFT && hold) {
			hold = false;
			board.hold();
			draw();
			return
		}

		if (board.valid(t)) {
			board.tetromino.move(t);
			board.ghost.move(t);

			draw();
		}
	}
}

function resetGame() {
	account.score = 0;
	account.lines = 0;
	account.level = 0;
	board.reset();
	time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
}

function addEventListener() {
	document.removeEventListener("keydown", handleKeyPress);
	document.addEventListener("keydown", handleKeyPress);
}

function play() {
	addEventListener();

	if (document.querySelector("#play-btn").style.display == "") {
		resetGame();
	}

	if (requestId) {
		cancelAnimationFrame(requestId);
	}

	animate();
	document.querySelector("#play-btn").style.display = "none";
}

function draw() {
	const { width, height } = ctx.canvas;
	ctx.clearRect(0, 0, width, height);

	let ghost = moves[KEY.DOWN](board.ghost);

	while (board.valid(ghost)) {
		board.ghost.move(ghost);
		ghost = moves[KEY.DOWN](board.ghost);
	}
	board.drawBoard();
	board.ghost.draw();
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
	cancelAnimationFrame(requestId);

	ctx.fillStyle = "black";
	ctx.fillRect(1, 3, 8, 1.2);
	ctx.font = "1px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("GAME OVER", 1.8, 4);

	document.querySelector('#play-btn').style.display = '';
}
