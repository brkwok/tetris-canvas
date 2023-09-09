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
				return (
					value === 0 ||
					(this.isInsideWalls(t.x + x, t.y + y) &&
						this.isNotOccupied(t.x + x, t.y + y))
				);
			});
		});
	}

	isNotOccupied(x, y) {
		return this.board[y] && this.board[y][x] === 0;
	}

	isInsideWalls(x, y) {
		return x >= 0 && x < COLS && y < ROWS;
	}

	freeze() {
		this.tetromino.shape.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value > 0) {
					this.board[y + this.tetromino.y][x + this.tetromino.x] = value;
				}
			});
		});
	}

	drop() {
		let tetromino = moves[KEY.DOWN](this.tetromino);

		if (this.valid(tetromino)) {
			this.tetromino.move(tetromino);
		} else {
			this.freeze();
			this.clearLines();
			if (this.tetromino.y === 0) {
				return false;
			}
			this.tetromino = new Tetromino(this.ctx);
		}

		return true;
	}

	draw() {
		this.board.forEach((row, y) => {
			row.forEach((val, x) => {
				if (val > 0) {
					this.ctx.fillStyle = COLORS[val - 1];
					this.ctx.fillRect(x, y, 1, 1);
				}
			});
		});
	}

	clearLines() {
		this.board.forEach((row, y) => {
			if (row.every((val) => val > 0)) {
				this.board.splice(y, 1);

				this.grid.unshift(Array(COLS).fill(0));
			}
		});
	}
}
