class Board {
	constructor(ctx) {
		this.ctx = ctx;
		this.board = this._initBoard();
		this.tetromino = new Tetromino(ctx);
	}

	_initBoard() {
		return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
	}

	rotate(tetromino) {
		const t = JSON.parse(JSON.stringify(tetromino));

		for (let y = 0; y < t.shape.length; y++) {
			for (let x = 0; x < y; x++) {
				[t.shape[x][y], t.shape[y][x]] = [t.shape[y][x], tetromino.shape[x][y]];
			}
		}

		t.shape.forEach((row) => row.reverse());

		return t;
	}

	reverseRotate(tetromino) {
		const t = JSON.parse(JSON.stringify(tetromino));

		t.shape.forEach((row) => row.reverse());

		for (let y = 0; y < t.shape.length; y++) {
			for (let x = 0; x < y; x++) {
				[t.shape[x][y], t.shape[y][x]] = [t.shape[y][x], t.shape[x][y]];
			}
		}

		return t;
	}

	valid(t) {
		return t.shape.every((row, y) => {
			return row.every((value, x) => {
				return value === 0 || this.isInsideWalls(t.x + x, t.y + y);
			});
		});
	}

	isInsideWalls(x, y) {
		return x >= 0 && x < COLS && y < ROWS;
	}
}
